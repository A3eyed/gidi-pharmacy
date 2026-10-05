import sql from '@/app/api/utils/sql';
import { getAdminPharmacy, getMemberPharmacy } from '@/app/api/utils/requireUser';

// List members of a pharmacy. Any member can view the team;
// management actions remain admin-only.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const pharmacyId = Number(url.searchParams.get('pharmacyId'));
  const { user, pharmacy } = await getMemberPharmacy(request, pharmacyId);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (!pharmacy) {
    return Response.json({ error: 'Pharmacy not found' }, { status: 404 });
  }
  const members = await sql`
    SELECT pm.id, pm.user_id, pm.member_role, pm.joined_at,
           u.name, u.email
    FROM pharmacy_members pm
    JOIN "user" u ON u.id = pm.user_id
    WHERE pm.pharmacy_id = ${pharmacyId}
    ORDER BY (pm.member_role = 'admin') DESC, pm.joined_at ASC
  `;
  return Response.json({ members });
}

// Admin only: remove a staff member. The admin/owner can never be removed.
export async function DELETE(request: Request) {
  const body = await request.json();
  const pharmacyId = Number(body.pharmacyId);
  const memberId = Number(body.memberId);

  const { user, pharmacy } = await getAdminPharmacy(request, pharmacyId);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (!pharmacy) {
    return Response.json({ error: 'Only the pharmacy admin can manage staff' }, { status: 403 });
  }
  if (!memberId || Number.isNaN(memberId)) {
    return Response.json({ error: 'A member is required' }, { status: 400 });
  }

  // Only staff rows in THIS pharmacy can be removed; admins are untouchable.
  const removed = await sql`
    DELETE FROM pharmacy_members
    WHERE id = ${memberId}
      AND pharmacy_id = ${pharmacyId}
      AND member_role = 'staff'
    RETURNING id
  `;
  if (removed.length === 0) {
    return Response.json({ error: 'This member could not be removed' }, { status: 400 });
  }
  return Response.json({ success: true });
}
