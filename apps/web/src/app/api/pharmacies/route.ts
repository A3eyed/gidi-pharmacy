import sql from '@/app/api/utils/sql';
import { getUser } from '@/app/api/utils/requireUser';

// List all pharmacies the signed-in user belongs to (as admin or staff)
export async function GET(request: Request) {
  const user = await getUser(request);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const pharmacies = await sql`
    SELECT p.id, p.name, p.address, p.phone, p.created_at,
      CASE WHEN p.owner_id = ${user.id} THEN 'admin' ELSE pm.member_role END AS member_role
    FROM pharmacies p
    LEFT JOIN pharmacy_members pm
      ON pm.pharmacy_id = p.id AND pm.user_id = ${user.id}
    WHERE p.owner_id = ${user.id} OR pm.user_id IS NOT NULL
    ORDER BY p.created_at ASC
  `;
  return Response.json({ pharmacies });
}

// Create a new pharmacy — the creator automatically becomes its Admin
export async function POST(request: Request) {
  const user = await getUser(request);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const body = await request.json();
  const name = (body.name ?? '').trim();
  if (!name) {
    return Response.json({ error: 'Pharmacy name is required' }, { status: 400 });
  }
  const rows = await sql`
    INSERT INTO pharmacies (owner_id, name, address, phone)
    VALUES (${user.id}, ${name}, ${body.address ?? null}, ${body.phone ?? null})
    RETURNING id, name, address, phone, created_at
  `;
  const pharmacy = rows[0];

  // Record the creator as the admin member (role is set server-side only)
  await sql`
    INSERT INTO pharmacy_members (pharmacy_id, user_id, member_role)
    VALUES (${pharmacy.id}, ${user.id}, 'admin')
    ON CONFLICT (pharmacy_id, user_id) DO UPDATE SET member_role = 'admin'
  `;

  return Response.json({ pharmacy: { ...pharmacy, member_role: 'admin' } }, { status: 201 });
}
