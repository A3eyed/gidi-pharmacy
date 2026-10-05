import sql from '@/app/api/utils/sql';
import { getUser } from '@/app/api/utils/requireUser';

const INVALID_MESSAGE =
  'Invalid or expired pharmacy code. Please check the code with your pharmacy administrator.';

/**
 * Join an existing pharmacy with an invitation code.
 *
 * Security properties:
 * - The pharmacy is found ONLY by an exact match on an ACTIVE join code — a
 *   pharmacy ID sent by the client is never trusted or accepted.
 * - New members are always created as 'staff'. The role is hardcoded
 *   server-side; nothing in the request body can influence it.
 * - Existing members (including the admin) keep their current role — using a
 *   code never changes an existing role.
 */
export async function POST(request: Request) {
  const user = await getUser(request);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const code = (body.code ?? '').trim().toUpperCase();

  if (!code) {
    return Response.json({ error: 'Please enter an invitation code.' }, { status: 400 });
  }

  const pharmacies = await sql`
    SELECT id, name, address, phone, created_at
    FROM pharmacies
    WHERE join_code = ${code} AND join_code_active = TRUE
    LIMIT 1
  `;
  const pharmacy = pharmacies[0];
  if (!pharmacy) {
    return Response.json({ error: INVALID_MESSAGE }, { status: 404 });
  }

  // Already a member? Keep their existing role — never downgrade or upgrade.
  const existing = await sql`
    SELECT member_role FROM pharmacy_members
    WHERE pharmacy_id = ${pharmacy.id} AND user_id = ${user.id}
    LIMIT 1
  `;
  if (existing.length > 0) {
    return Response.json({
      pharmacy: { ...pharmacy, member_role: existing[0].member_role },
      alreadyMember: true,
    });
  }

  // New members are ALWAYS staff.
  await sql`
    INSERT INTO pharmacy_members (pharmacy_id, user_id, member_role)
    VALUES (${pharmacy.id}, ${user.id}, 'staff')
    ON CONFLICT (pharmacy_id, user_id) DO NOTHING
  `;

  return Response.json({
    pharmacy: { ...pharmacy, member_role: 'staff' },
    alreadyMember: false,
  });
}
