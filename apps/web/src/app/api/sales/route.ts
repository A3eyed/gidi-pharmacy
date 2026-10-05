import sql from '@/app/api/utils/sql';
import { getOwnedPharmacy } from '@/app/api/utils/requireUser';

// List recent sales (with line items) for a pharmacy
export async function GET(request: Request) {
  const url = new URL(request.url);
  const pharmacyId = Number(url.searchParams.get('pharmacyId'));
  const limit = Math.min(Number(url.searchParams.get('limit') ?? 25), 100);

  const { user, pharmacy } = await getOwnedPharmacy(request, pharmacyId);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (!pharmacy) {
    return Response.json({ error: 'Pharmacy not found' }, { status: 404 });
  }

  const sales = await sql`
    SELECT id, total_amount, created_at
    FROM sales
    WHERE pharmacy_id = ${pharmacyId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;

  if (sales.length === 0) {
    return Response.json({ sales: [] });
  }

  const saleIds = sales.map((s) => s.id);
  const items = await sql(
    `SELECT id, sale_id, medication_id, medication_name, quantity, unit_price, subtotal
     FROM sale_items WHERE sale_id = ANY($1)`,
    [saleIds]
  );

  const withItems = sales.map((s) => ({
    ...s,
    items: items.filter((i) => i.sale_id === s.id),
  }));

  return Response.json({ sales: withItems });
}

// Record a new sale: validates stock, creates sale + items, decrements inventory
export async function POST(request: Request) {
  const body = await request.json();
  const pharmacyId = Number(body.pharmacyId);
  const requestedItems: Array<{ medicationId: number; quantity: number }> = body.items ?? [];

  const { user, pharmacy } = await getOwnedPharmacy(request, pharmacyId);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (!pharmacy) {
    return Response.json({ error: 'Pharmacy not found' }, { status: 404 });
  }
  if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
    return Response.json({ error: 'At least one item is required' }, { status: 400 });
  }
  for (const item of requestedItems) {
    if (!item.medicationId || !Number.isInteger(item.quantity) || item.quantity <= 0) {
      return Response.json(
        { error: 'Each item needs a medication and a positive quantity' },
        { status: 400 }
      );
    }
  }

  // Load medications and validate stock
  const medIds = requestedItems.map((i) => Number(i.medicationId));
  const meds = await sql(
    `SELECT id, name, unit_price, stock_quantity FROM medications WHERE pharmacy_id = $1 AND id = ANY($2)`,
    [pharmacyId, medIds]
  );

  const lineItems: Array<{
    medicationId: number;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }> = [];

  for (const item of requestedItems) {
    const med = meds.find((m) => m.id === Number(item.medicationId));
    if (!med) {
      return Response.json({ error: 'Medication not found in this pharmacy' }, { status: 404 });
    }
    if (med.stock_quantity < item.quantity) {
      return Response.json(
        { error: `Not enough stock for ${med.name} (only ${med.stock_quantity} left)` },
        { status: 400 }
      );
    }
    const unitPrice = Number(med.unit_price);
    lineItems.push({
      medicationId: med.id,
      name: med.name,
      quantity: item.quantity,
      unitPrice,
      subtotal: unitPrice * item.quantity,
    });
  }

  const total = lineItems.reduce((sum, li) => sum + li.subtotal, 0);

  // Create the sale first to get its id
  const saleRows = await sql`
    INSERT INTO sales (pharmacy_id, user_id, total_amount)
    VALUES (${pharmacyId}, ${user.id}, ${total})
    RETURNING id, total_amount, created_at
  `;
  const sale = saleRows[0];

  // Insert line items + decrement stock atomically
  const queries = [];
  for (const li of lineItems) {
    queries.push(
      sql`INSERT INTO sale_items (sale_id, medication_id, medication_name, quantity, unit_price, subtotal)
          VALUES (${sale.id}, ${li.medicationId}, ${li.name}, ${li.quantity}, ${li.unitPrice}, ${li.subtotal})`
    );
    queries.push(
      sql`UPDATE medications SET stock_quantity = stock_quantity - ${li.quantity}, updated_at = NOW()
          WHERE id = ${li.medicationId}`
    );
  }
  await sql.transaction(queries);

  return Response.json({ sale: { ...sale, items: lineItems } }, { status: 201 });
}
