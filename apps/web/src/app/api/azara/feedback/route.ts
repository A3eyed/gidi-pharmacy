import sql from '@/app/api/utils/sql';
import { getUser } from '@/app/api/utils/requireUser';

/**
 * Records whether an Azara answer was useful. A "not helpful" rating with a
 * correction is promoted straight into the pharmacy's knowledge notes, so the
 * next person asking the same question gets the corrected answer.
 */
export async function POST(request: Request) {
  const user = await getUser(request);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const queryId = Number(body.queryId);
  const helpful = Boolean(body.helpful);
  const correction = typeof body.correction === 'string' ? body.correction.trim() : '';

  if (!queryId || Number.isNaN(queryId)) {
    return Response.json({ error: 'A queryId is required' }, { status: 400 });
  }

  await sql`
    INSERT INTO azara_feedback (query_id, user_id, helpful, correction)
    VALUES (${queryId}, ${user.id}, ${helpful}, ${correction || null})
  `;

  // A correction is knowledge — store it against the same pharmacy.
  if (!helpful && correction.length > 10) {
    const rows = await sql`
      SELECT pharmacy_id, question FROM azara_queries WHERE id = ${queryId} LIMIT 1
    `;
    const original = rows[0];
    if (original) {
      await sql`
        INSERT INTO azara_notes (pharmacy_id, user_id, question, answer, keywords)
        VALUES (
          ${original.pharmacy_id},
          ${user.id},
          ${String(original.question).slice(0, 300)},
          ${correction.slice(0, 4000)},
          ${null}
        )
      `;
    }
  }

  return Response.json({ success: true });
}
