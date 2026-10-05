import sql from '@/app/api/utils/sql';
import { getOwnedPharmacy } from '@/app/api/utils/requireUser';

/** Escape a single CSV cell (handles commas, quotes and newlines). */
function csvCell(value: unknown) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(headers: string[], rows: unknown[][]) {
  const lines = [headers.map(csvCell).join(',')];
  for (const row of rows) {
    lines.push(row.map(csvCell).join(','));
  }
  return lines.join('\r\n');
}

/**
 * Statements: sales, inventory and a period summary.
 * Returns JSON for on-screen/print views, or CSV for download.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const pharmacyId = Number(url.searchParams.get('pharmacyId'));
  const type = url.searchParams.get('type') ?? 'sales';
  const format = url.searchParams.get('format') ?? 'json';

  const { user, pharmacy } = await getOwnedPharmacy(request, pharmacyId);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (!pharmacy) {
    return Response.json({ error: 'Pharmacy not found' }, { status: 404 });
  }

  const today = new Date();
  const defaultFrom = new Date(today);
  defaultFrom.setDate(defaultFrom.getDate() - 29);
  const toStr = url.searchParams.get('to') || today.toISOString().slice(0, 10);
  const fromStr = url.searchParams.get('from') || defaultFrom.toISOString().slice(0, 10);

  const meta = {
    pharmacy: { name: pharmacy.name, address: pharmacy.address, phone: pharmacy.phone },
    range: { from: fromStr, to: toStr },
    generatedAt: new Date().toISOString(),
  };

  if (type === 'inventory') {
    const rows = await sql`
      SELECT name, generic_name, category, sku, stock_quantity, reorder_level,
             unit_price, cost_price,
             (stock_quantity * unit_price) AS stock_value,
             TO_CHAR(expiry_date, 'YYYY-MM-DD') AS expiry_date
      FROM medications
      WHERE pharmacy_id = ${pharmacyId}
      ORDER BY name ASC
    `;

    if (format === 'csv') {
      const csv = toCsv(
        [
          'Medication',
          'Generic name',
          'Category',
          'SKU',
          'Stock',
          'Reorder level',
          'Unit price (GHS)',
          'Cost price (GHS)',
          'Stock value (GHS)',
          'Expiry date',
        ],
        rows.map((r) => [
          r.name,
          r.generic_name,
          r.category,
          r.sku,
          r.stock_quantity,
          r.reorder_level,
          Number(r.unit_price).toFixed(2),
          Number(r.cost_price).toFixed(2),
          Number(r.stock_value).toFixed(2),
          r.expiry_date,
        ])
      );
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="gidi-inventory-${toStr}.csv"`,
        },
      });
    }

    const totalValue = rows.reduce((sum, r) => sum + Number(r.stock_value ?? 0), 0);
    return Response.json({
      meta,
      type,
      rows,
      totals: { stockValue: totalValue, items: rows.length },
    });
  }

  if (type === 'summary') {
    const [totals, byCategory, byMed] = await sql.transaction([
      sql`
        SELECT COALESCE(SUM(si.subtotal), 0) AS revenue,
               COALESCE(SUM(si.quantity), 0)::int AS units,
               COALESCE(SUM(si.subtotal - (COALESCE(m.cost_price, 0) * si.quantity)), 0) AS gross_profit,
               COUNT(DISTINCT s.id)::int AS sale_count
        FROM sales s
        JOIN sale_items si ON si.sale_id = s.id
        LEFT JOIN medications m ON m.id = si.medication_id
        WHERE s.pharmacy_id = ${pharmacyId}
          AND s.created_at >= ${fromStr}::date
          AND s.created_at < ${toStr}::date + INTERVAL '1 day'
      `,
      sql`
        SELECT COALESCE(m.category, 'Uncategorized') AS category,
               SUM(si.quantity)::int AS units,
               SUM(si.subtotal) AS revenue
        FROM sale_items si
        JOIN sales s ON s.id = si.sale_id
        LEFT JOIN medications m ON m.id = si.medication_id
        WHERE s.pharmacy_id = ${pharmacyId}
          AND s.created_at >= ${fromStr}::date
          AND s.created_at < ${toStr}::date + INTERVAL '1 day'
        GROUP BY COALESCE(m.category, 'Uncategorized')
        ORDER BY revenue DESC
      `,
      sql`
        SELECT si.medication_name AS name,
               SUM(si.quantity)::int AS units,
               SUM(si.subtotal) AS revenue
        FROM sale_items si
        JOIN sales s ON s.id = si.sale_id
        WHERE s.pharmacy_id = ${pharmacyId}
          AND s.created_at >= ${fromStr}::date
          AND s.created_at < ${toStr}::date + INTERVAL '1 day'
        GROUP BY si.medication_name
        ORDER BY revenue DESC
      `,
    ]);

    if (format === 'csv') {
      const t = totals[0] ?? {};
      const lines: unknown[][] = [
        ['Period', `${fromStr} to ${toStr}`],
        ['Total revenue (GHS)', Number(t.revenue ?? 0).toFixed(2)],
        ['Gross profit (GHS)', Number(t.gross_profit ?? 0).toFixed(2)],
        ['Units sold', t.units ?? 0],
        ['Transactions', t.sale_count ?? 0],
        [],
        ['Revenue by category'],
        ['Category', 'Units', 'Revenue (GHS)'],
        ...byCategory.map((r) => [r.category, r.units, Number(r.revenue).toFixed(2)]),
        [],
        ['Revenue by medication'],
        ['Medication', 'Units', 'Revenue (GHS)'],
        ...byMed.map((r) => [r.name, r.units, Number(r.revenue).toFixed(2)]),
      ];
      const csv = toCsv([`${pharmacy.name} — statement summary`], lines);
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="gidi-summary-${fromStr}-to-${toStr}.csv"`,
        },
      });
    }

    return Response.json({
      meta,
      type,
      totals: totals[0] ?? {},
      byCategory,
      byMedication: byMed,
    });
  }

  // Default: itemised sales statement
  const rows = await sql`
    SELECT s.id AS sale_id,
           s.created_at,
           s.total_amount,
           si.medication_name,
           si.quantity,
           si.unit_price,
           si.subtotal
    FROM sales s
    JOIN sale_items si ON si.sale_id = s.id
    WHERE s.pharmacy_id = ${pharmacyId}
      AND s.created_at >= ${fromStr}::date
      AND s.created_at < ${toStr}::date + INTERVAL '1 day'
    ORDER BY s.created_at DESC, si.id ASC
  `;

  if (format === 'csv') {
    const csv = toCsv(
      ['Receipt #', 'Date', 'Medication', 'Quantity', 'Unit price (GHS)', 'Line total (GHS)'],
      rows.map((r) => [
        r.sale_id,
        new Date(r.created_at).toISOString().replace('T', ' ').slice(0, 16),
        r.medication_name,
        r.quantity,
        Number(r.unit_price).toFixed(2),
        Number(r.subtotal).toFixed(2),
      ])
    );
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="gidi-sales-${fromStr}-to-${toStr}.csv"`,
      },
    });
  }

  const revenue = rows.reduce((sum, r) => sum + Number(r.subtotal ?? 0), 0);
  const units = rows.reduce((sum, r) => sum + Number(r.quantity ?? 0), 0);
  const receipts = new Set(rows.map((r) => r.sale_id)).size;

  return Response.json({
    meta,
    type: 'sales',
    rows,
    totals: { revenue, units, receipts },
  });
}
