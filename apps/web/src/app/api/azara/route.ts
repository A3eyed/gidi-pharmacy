import sql from '@/app/api/utils/sql';
import { getUser } from '@/app/api/utils/requireUser';
import { currencyForCountry } from '@/utils/locale/countries';
import { composeAnswer, inventoryCommand, learnedToEntry, type StockItem } from '@/app/api/utils/knowledge/answer';
import { KNOWLEDGE_STATS } from '@/app/api/utils/knowledge';

/**
 * Azara — GiDi's clinical assistant.
 *
 * Answers are composed entirely from the knowledge base that ships with the
 * app (see /api/utils/knowledge). There is no external AI provider and no API
 * key: the assistant works offline, costs nothing per question, always cites
 * where its content came from, and cannot invent a dose.
 *
 * Every question is logged with the confidence it achieved so gaps surface in
 * the knowledge panel, and notes the team adds are retrieved alongside the
 * shipped content — that is the self-improvement loop.
 */
export async function POST(request: Request) {
  const user = await getUser(request);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const incoming: Array<{ role: string; content: string }> = body.messages ?? [];
  const pharmacyId = Number(body.pharmacyId);
  const hasPharmacy = Boolean(pharmacyId) && !Number.isNaN(pharmacyId);

  if (!Array.isArray(incoming) || incoming.length === 0) {
    return Response.json({ error: 'A message is required' }, { status: 400 });
  }

  const lastUser = [...incoming].reverse().find((m) => m?.role === 'user' && m.content?.trim());
  if (!lastUser) {
    return Response.json({ error: 'A message is required' }, { status: 400 });
  }
  const question = lastUser.content.trim().slice(0, 1000);

  // Carry a little conversational context: if the new message is a short
  // follow-up ("what about children?"), prepend the previous question so the
  // retriever still knows which medicine we are talking about.
  const previousUser = incoming
    .filter((m) => m?.role === 'user' && m.content?.trim())
    .slice(-2, -1)[0];
  const searchText =
    question.split(/\s+/).length <= 4 && previousUser
      ? `${previousUser.content.slice(0, 200)} ${question}`
      : question;

  const prefRows = await sql`
    SELECT country_code, currency_code FROM user_preferences
    WHERE user_id = ${user.id} LIMIT 1
  `;
  const currency =
    prefRows[0]?.currency_code ?? currencyForCountry(prefRows[0]?.country_code ?? null);

  // Membership-aware stock and notes so staff get the same context as the admin.
  let stock: StockItem[] = [];
  let learned: ReturnType<typeof learnedToEntry>[] = [];

  if (hasPharmacy) {
    const [stockRows, noteRows] = await sql.transaction([
      sql`
        SELECT m.name, m.category, m.stock_quantity, m.unit_price, m.reorder_level, m.expiry_date
        FROM medications m
        JOIN pharmacies p ON p.id = m.pharmacy_id
        LEFT JOIN pharmacy_members pm
          ON pm.pharmacy_id = p.id AND pm.user_id = ${user.id}
        WHERE m.pharmacy_id = ${pharmacyId}
          AND (p.owner_id = ${user.id} OR pm.user_id IS NOT NULL)
        ORDER BY m.name ASC
        LIMIT 500
      `,
      sql`
        SELECT id, question, answer, keywords
        FROM azara_notes
        WHERE pharmacy_id = ${pharmacyId} OR pharmacy_id IS NULL
        ORDER BY created_at DESC
        LIMIT 200
      `,
    ]);

    stock = stockRows.map((row) => ({
      name: String(row.name),
      category: row.category ? String(row.category) : null,
      quantity: Number(row.stock_quantity ?? 0),
      price: Number(row.unit_price ?? 0),
      reorderLevel: Number(row.reorder_level ?? 10),
      expiryDate: row.expiry_date ? String(row.expiry_date).slice(0, 10) : null,
    }));

    learned = noteRows.map((row) =>
      learnedToEntry({
        id: Number(row.id),
        question: String(row.question),
        answer: String(row.answer),
        keywords: row.keywords ? String(row.keywords) : null,
      })
    );
  }

  const remember = question.match(/^(?:remember|learn|note that)\s*[:\-]\s*(.+)$/i);
  if (remember && hasPharmacy) {
    const raw = remember[1].trim();
    const parts = raw.split(/\s+\|\s+/);
    const noteQuestion = (parts[0] ?? raw).slice(0, 300);
    const noteAnswer = (parts[1] ?? raw).slice(0, 2000);
    try {
      await sql`
        INSERT INTO azara_notes (pharmacy_id, user_id, question, answer, keywords)
        VALUES (${pharmacyId}, ${user.id}, ${noteQuestion}, ${noteAnswer}, ${noteQuestion})
      `;
    } catch (error) {
      console.error('Could not store Azara note', error);
      return Response.json({ error: 'Could not save that note' }, { status: 500 });
    }
    return Response.json({
      reply: `Saved. I will use this next time someone asks about “${noteQuestion}”.\n\n${noteAnswer}`,
      sources: [{ id: 'learned', title: 'Pharmacy note' }],
      confidence: 'high',
      suggestions: ['List products', noteQuestion],
      queryId: null,
      model: 'gidi-knowledge-base',
      knowledgeSize: KNOWLEDGE_STATS.entries,
      action: 'remember',
    });
  }

  const setStock = question.match(/^(?:set|update|change)\s+(?:the\s+)?stock(?:\s+of)?\s+(.+?)\s+to\s+(\d+)\s*$/i);
  const addProduct = question.match(/^add(?:\s+(?:product|medication|medicine))?\s+(.+?)(?:\s+stock\s+(\d+))?(?:\s+price\s+([\d.]+))?\s*$/i);
  if (hasPharmacy && (setStock || (addProduct && /^add\b/i.test(question)))) {
    try {
      if (setStock) {
        const name = setStock[1].trim();
        const quantity = Number(setStock[2]);
        const updated = await sql`
          UPDATE medications
          SET stock_quantity = ${quantity}
          WHERE pharmacy_id = ${pharmacyId}
            AND LOWER(name) = LOWER(${name})
          RETURNING name, stock_quantity, unit_price
        `;
        const row = updated[0];
        return Response.json({
          reply: row
            ? `Updated ${row.name}. Stock is now ${row.stock_quantity}.`
            : `I could not find “${name}” in this pharmacy. Add it first, or check the spelling.`,
          sources: [{ id: 'inventory', title: 'GiDi inventory' }],
          confidence: 'high',
          suggestions: ['List products', 'Low stock'],
          queryId: null,
          model: 'gidi-knowledge-base',
          action: 'set-stock',
        });
      }
      if (addProduct) {
        const name = addProduct[1].replace(/\s+stock\s+\d+.*$/i, '').trim();
        const quantity = Number(addProduct[2] ?? 0);
        const price = Number(addProduct[3] ?? 0);
        const created = await sql`
          INSERT INTO medications (pharmacy_id, name, unit_price, stock_quantity, reorder_level)
          VALUES (${pharmacyId}, ${name}, ${price}, ${quantity}, 10)
          RETURNING name, stock_quantity, unit_price
        `;
        const row = created[0];
        return Response.json({
          reply: `Added ${row.name} with ${row.stock_quantity} in stock at ${currency} ${Number(row.unit_price).toFixed(2)}.`,
          sources: [{ id: 'inventory', title: 'GiDi inventory' }],
          confidence: 'high',
          suggestions: ['List products', `Set stock of ${row.name} to 20`],
          queryId: null,
          model: 'gidi-knowledge-base',
          action: 'add-product',
        });
      }
    } catch (error) {
      console.error('Azara inventory action failed', error);
      return Response.json({
        reply: 'I could not change the inventory just now. Try again from the Inventory tab.',
        sources: [],
        confidence: 'low',
        suggestions: ['List products'],
        queryId: null,
      });
    }
  }

  const answer = inventoryCommand(question, stock, currency) ?? composeAnswer({ question: searchText, learned, stock, currency });

  // Log the interaction so low-confidence questions become visible gaps.
  let queryId: number | null = null;
  try {
    const logged = await sql`
      INSERT INTO azara_queries
        (pharmacy_id, user_id, question, intent, confidence, top_score, matched_ids, answered)
      VALUES (
        ${hasPharmacy ? pharmacyId : null},
        ${user.id},
        ${question},
        ${answer.intent},
        ${answer.confidence},
        ${answer.topScore},
        ${answer.matchedIds.join(',')},
        ${answer.confidence !== 'low'}
      )
      RETURNING id
    `;
    queryId = Number(logged[0]?.id);
  } catch (error) {
    // Logging must never break the answer.
    console.error('Could not log Azara query', error);
  }

  return Response.json({
    reply: answer.reply,
    sources: answer.sources,
    confidence: answer.confidence,
    suggestions: answer.suggestions,
    queryId,
    model: 'gidi-knowledge-base',
    knowledgeSize: KNOWLEDGE_STATS.entries,
  });
}
