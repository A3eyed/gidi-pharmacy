import sql from '@/app/api/utils/sql';
import { getUser } from '@/app/api/utils/requireUser';

/**
 * Returns a summary of everything stored against the signed-in account.
 * Used by the settings screen so users can see exactly what will be removed
 * before they confirm deletion (App Store Guideline 5.1.1(v)).
 */
export async function GET(request: Request) {
  const user = await getUser(request);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const [counts] = await sql`
    SELECT
      (SELECT COUNT(*)::int FROM pharmacies WHERE owner_id = ${user.id}) AS pharmacy_count,
      (SELECT COUNT(*)::int FROM medications m
        JOIN pharmacies p ON p.id = m.pharmacy_id
        WHERE p.owner_id = ${user.id}) AS medication_count,
      (SELECT COUNT(*)::int FROM sales s
        JOIN pharmacies p ON p.id = s.pharmacy_id
        WHERE p.owner_id = ${user.id}) AS sale_count
  `;

  return Response.json({
    user: { id: user.id, email: user.email, name: user.name },
    data: counts,
  });
}

/**
 * Permanently deletes the signed-in user's account and all associated data.
 *
 * Deleting the `user` row cascades to:
 *   - session + account rows (auth records)
 *   - pharmacies owned by the user
 *   - medications, sales and sale_items belonging to those pharmacies
 *
 * This is irreversible and is required to be available in-app by
 * App Store Guideline 5.1.1(v).
 */
export async function DELETE(request: Request) {
  const user = await getUser(request);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Require the user to type their email as confirmation
  let confirmEmail = '';
  try {
    const body = await request.json();
    confirmEmail = (body?.confirmEmail ?? '').trim().toLowerCase();
  } catch {
    confirmEmail = '';
  }

  if (!confirmEmail || confirmEmail !== (user.email ?? '').trim().toLowerCase()) {
    return Response.json(
      { error: 'Please type your account email exactly to confirm deletion.' },
      { status: 400 }
    );
  }

  await sql`DELETE FROM "user" WHERE id = ${user.id}`;

  return Response.json({ success: true });
}
