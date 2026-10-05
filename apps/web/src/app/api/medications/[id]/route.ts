import sql from '@/app/api/utils/sql';
import { getUser } from '@/app/api/utils/requireUser';

async function getOwnedMedication(request: Request, id: number) {
  const user = await getUser(request);
  if (!user) {
    return { user: null, medication: null };
  }
  const rows = await sql`
    SELECT m.* FROM medications m
    JOIN pharmacies p ON p.id = m.pharmacy_id
    WHERE m.id = ${id} AND p.owner_id = ${user.id}
    LIMIT 1
  `;
  return { user, medication: rows[0] ?? null };
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, medication } = await getOwnedMedication(request, Number(id));
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (!medication) {
    return Response.json({ error: 'Medication not found' }, { status: 404 });
  }
  return Response.json({ medication });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, medication } = await getOwnedMedication(request, Number(id));
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (!medication) {
    return Response.json({ error: 'Medication not found' }, { status: 404 });
  }

  const body = await request.json();

  const setClauses: string[] = [];
  const values: unknown[] = [];

  const fieldMap: Array<[string, string, (v: unknown) => unknown]> = [
    ['name', 'name', (v) => String(v).trim()],
    ['genericName', 'generic_name', (v) => (v === '' ? null : v)],
    ['category', 'category', (v) => (v === '' ? null : v)],
    ['sku', 'sku', (v) => (v === '' ? null : v)],
    ['unitPrice', 'unit_price', (v) => Number(v)],
    ['costPrice', 'cost_price', (v) => Number(v)],
    ['stockQuantity', 'stock_quantity', (v) => Number(v)],
    ['reorderLevel', 'reorder_level', (v) => Number(v)],
    ['expiryDate', 'expiry_date', (v) => (v ? v : null)],
  ];

  for (const [key, column, transform] of fieldMap) {
    if (body[key] !== undefined) {
      values.push(transform(body[key]));
      setClauses.push(`${column} = $${values.length}`);
    }
  }

  if (setClauses.length === 0) {
    return Response.json({ error: 'No fields to update' }, { status: 400 });
  }

  setClauses.push(`updated_at = NOW()`);
  values.push(Number(id));
  const query = `UPDATE medications SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING *`;
  const rows = await sql(query, values);
  return Response.json({ medication: rows[0] });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, medication } = await getOwnedMedication(request, Number(id));
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (!medication) {
    return Response.json({ error: 'Medication not found' }, { status: 404 });
  }
  await sql`DELETE FROM medications WHERE id = ${Number(id)}`;
  return Response.json({ success: true });
}
