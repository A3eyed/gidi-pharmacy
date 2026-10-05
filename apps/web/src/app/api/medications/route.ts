import sql from '@/app/api/utils/sql';
import { getOwnedPharmacy } from '@/app/api/utils/requireUser';

// List medications for a pharmacy, with optional search + filters
export async function GET(request: Request) {
  const url = new URL(request.url);
  const pharmacyId = Number(url.searchParams.get('pharmacyId'));
  const search = url.searchParams.get('search')?.trim() ?? '';
  const filter = url.searchParams.get('filter') ?? ''; // '', 'low', 'expiring', 'out'

  const { user, pharmacy } = await getOwnedPharmacy(request, pharmacyId);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (!pharmacy) {
    return Response.json({ error: 'Pharmacy not found' }, { status: 404 });
  }

  let query = `
    SELECT * FROM medications
    WHERE pharmacy_id = $1
  `;
  const values: unknown[] = [pharmacyId];

  if (search) {
    values.push(`%${search}%`);
    const idx = values.length;
    query += ` AND (LOWER(name) LIKE LOWER($${idx}) OR LOWER(COALESCE(generic_name, '')) LIKE LOWER($${idx}) OR LOWER(COALESCE(category, '')) LIKE LOWER($${idx}) OR LOWER(COALESCE(sku, '')) LIKE LOWER($${idx}))`;
  }
  if (filter === 'low') {
    query += ` AND stock_quantity > 0 AND stock_quantity <= reorder_level`;
  }
  if (filter === 'out') {
    query += ` AND stock_quantity = 0`;
  }
  if (filter === 'expiring') {
    query += ` AND expiry_date IS NOT NULL AND expiry_date <= CURRENT_DATE + INTERVAL '90 days'`;
  }
  query += ` ORDER BY name ASC`;

  const medications = await sql(query, values);
  return Response.json({ medications });
}

// Add a medication to a pharmacy's inventory
export async function POST(request: Request) {
  const body = await request.json();
  const pharmacyId = Number(body.pharmacyId);

  const { user, pharmacy } = await getOwnedPharmacy(request, pharmacyId);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (!pharmacy) {
    return Response.json({ error: 'Pharmacy not found' }, { status: 404 });
  }

  const name = (body.name ?? '').trim();
  if (!name) {
    return Response.json({ error: 'Medication name is required' }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO medications (
      pharmacy_id, name, generic_name, category, sku,
      unit_price, cost_price, stock_quantity, reorder_level, expiry_date
    ) VALUES (
      ${pharmacyId}, ${name}, ${body.genericName ?? null}, ${body.category ?? null}, ${body.sku ?? null},
      ${Number(body.unitPrice ?? 0)}, ${Number(body.costPrice ?? 0)},
      ${Number(body.stockQuantity ?? 0)}, ${Number(body.reorderLevel ?? 10)},
      ${body.expiryDate || null}
    )
    RETURNING *
  `;
  return Response.json({ medication: rows[0] }, { status: 201 });
}
