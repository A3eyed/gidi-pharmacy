import sql from '@/app/api/utils/sql';
import { getUser } from '@/app/api/utils/requireUser';
import { KNOWLEDGE_BASE, KNOWLEDGE_STATS, searchKnowledge } from '@/app/api/utils/knowledge';

/**
 * Knowledge panel API.
 *
 * GET  — browse or search the built-in knowledge base, see the notes this
 *        pharmacy has added, and see the questions Azara could not answer well
 *        (the improvement backlog).
 * POST — teach Azara something new.
 * DELETE — remove a note this pharmacy added.
 */
export async function GET(request: Request) {
  const user = await getUser(request);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const url = new URL(request.url);
  const pharmacyId = Number(url.searchParams.get('pharmacyId'));
  const search = url.searchParams.get('search')?.trim() ?? '';
  const category = url.searchParams.get('category') ?? '';
  const hasPharmacy = Boolean(pharmacyId) && !Number.isNaN(pharmacyId);

  let topics = KNOWLEDGE_BASE;
  if (search) {
    topics = searchKnowledge(search, [], 25).map((item) => item.entry);
  } else if (category) {
    topics = KNOWLEDGE_BASE.filter((entry) => entry.category === category);
  }

  const notes = hasPharmacy
    ? await sql`
        SELECT n.id, n.question, n.answer, n.keywords, n.created_at, u.name AS author
        FROM azara_notes n
        LEFT JOIN "user" u ON u.id = n.user_id
        WHERE n.pharmacy_id = ${pharmacyId}
        ORDER BY n.created_at DESC
        LIMIT 100
      `
    : [];

  const gaps = hasPharmacy
    ? await sql`
        SELECT question, MAX(created_at) AS last_asked, COUNT(*)::int AS times_asked
        FROM azara_queries
        WHERE pharmacy_id = ${pharmacyId} AND answered = false
        GROUP BY question
        ORDER BY times_asked DESC, last_asked DESC
        LIMIT 25
      `
    : [];

  const usage = hasPharmacy
    ? await sql`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE confidence = 'high')::int AS high,
          COUNT(*) FILTER (WHERE confidence = 'low')::int AS low
        FROM azara_queries
        WHERE pharmacy_id = ${pharmacyId}
      `
    : [];

  return Response.json({
    stats: {
      ...KNOWLEDGE_STATS,
      notes: notes.length,
      asked: usage[0]?.total ?? 0,
      answeredConfidently: usage[0]?.high ?? 0,
      unanswered: usage[0]?.low ?? 0,
    },
    topics: topics.slice(0, 120).map((entry) => ({
      id: entry.id,
      title: entry.title,
      category: entry.category,
      summary: entry.summary,
      source: entry.source ?? null,
    })),
    notes,
    gaps,
  });
}

export async function POST(request: Request) {
  const user = await getUser(request);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const pharmacyId = Number(body.pharmacyId);
  const question = typeof body.question === 'string' ? body.question.trim() : '';
  const answer = typeof body.answer === 'string' ? body.answer.trim() : '';
  const keywords = typeof body.keywords === 'string' ? body.keywords.trim() : '';

  if (!pharmacyId || Number.isNaN(pharmacyId)) {
    return Response.json({ error: 'A pharmacy is required' }, { status: 400 });
  }
  if (question.length < 3 || answer.length < 3) {
    return Response.json({ error: 'A topic and an answer are required' }, { status: 400 });
  }

  // Only members of the pharmacy may teach it.
  const allowed = await sql`
    SELECT p.id FROM pharmacies p
    LEFT JOIN pharmacy_members pm ON pm.pharmacy_id = p.id AND pm.user_id = ${user.id}
    WHERE p.id = ${pharmacyId} AND (p.owner_id = ${user.id} OR pm.user_id IS NOT NULL)
    LIMIT 1
  `;
  if (allowed.length === 0) {
    return Response.json({ error: 'Pharmacy not found' }, { status: 404 });
  }

  const rows = await sql`
    INSERT INTO azara_notes (pharmacy_id, user_id, question, answer, keywords)
    VALUES (
      ${pharmacyId},
      ${user.id},
      ${question.slice(0, 300)},
      ${answer.slice(0, 4000)},
      ${keywords ? keywords.slice(0, 300) : null}
    )
    RETURNING id, question, answer, keywords, created_at
  `;

  return Response.json({ note: rows[0] });
}

export async function DELETE(request: Request) {
  const user = await getUser(request);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = Number(url.searchParams.get('id'));
  if (!id || Number.isNaN(id)) {
    return Response.json({ error: 'A note id is required' }, { status: 400 });
  }

  await sql`
    DELETE FROM azara_notes
    WHERE id = ${id}
      AND pharmacy_id IN (
        SELECT p.id FROM pharmacies p
        LEFT JOIN pharmacy_members pm ON pm.pharmacy_id = p.id AND pm.user_id = ${user.id}
        WHERE p.owner_id = ${user.id} OR pm.user_id IS NOT NULL
      )
  `;

  return Response.json({ success: true });
}
