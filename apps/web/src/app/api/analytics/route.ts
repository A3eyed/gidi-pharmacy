import sql from '@/app/api/utils/sql';
import { getOwnedPharmacy } from '@/app/api/utils/requireUser';

// Dashboard + analytics data for a pharmacy
export async function GET(request: Request) {
  const url = new URL(request.url);
  const pharmacyId = Number(url.searchParams.get('pharmacyId'));

  const { user, pharmacy } = await getOwnedPharmacy(request, pharmacyId);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (!pharmacy) {
    return Response.json({ error: 'Pharmacy not found' }, { status: 404 });
  }

  const [
    inventoryStats,
    todayStats,
    monthStats,
    topMeds,
    trend,
    lowStock,
    expiringSoon,
    categoryBreakdown,
  ] = await sql.transaction([
    sql`
      SELECT
        COUNT(*)::int AS total_medications,
        COALESCE(SUM(stock_quantity * unit_price), 0) AS inventory_value,
        COUNT(*) FILTER (WHERE stock_quantity > 0 AND stock_quantity <= reorder_level)::int AS low_stock_count,
        COUNT(*) FILTER (WHERE stock_quantity = 0)::int AS out_of_stock_count,
        COUNT(*) FILTER (WHERE expiry_date IS NOT NULL AND expiry_date <= CURRENT_DATE + INTERVAL '90 days')::int AS expiring_count
      FROM medications WHERE pharmacy_id = ${pharmacyId}
    `,
    sql`
      SELECT COALESCE(SUM(total_amount), 0) AS revenue, COUNT(*)::int AS sale_count
      FROM sales
      WHERE pharmacy_id = ${pharmacyId} AND created_at >= CURRENT_DATE
    `,
    sql`
      SELECT COALESCE(SUM(total_amount), 0) AS revenue, COUNT(*)::int AS sale_count
      FROM sales
      WHERE pharmacy_id = ${pharmacyId} AND created_at >= NOW() - INTERVAL '30 days'
    `,
    sql`
      SELECT si.medication_name AS name,
             SUM(si.quantity)::int AS units_sold,
             SUM(si.subtotal) AS revenue
      FROM sale_items si
      JOIN sales s ON s.id = si.sale_id
      WHERE s.pharmacy_id = ${pharmacyId} AND s.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY si.medication_name
      ORDER BY revenue DESC
      LIMIT 8
    `,
    sql`
      SELECT TO_CHAR(d.day, 'YYYY-MM-DD') AS day,
             COALESCE(SUM(s.total_amount), 0) AS revenue
      FROM generate_series(CURRENT_DATE - INTERVAL '13 days', CURRENT_DATE, '1 day') AS d(day)
      LEFT JOIN sales s
        ON s.pharmacy_id = ${pharmacyId}
        AND s.created_at >= d.day
        AND s.created_at < d.day + INTERVAL '1 day'
      GROUP BY d.day
      ORDER BY d.day ASC
    `,
    sql`
      SELECT id, name, stock_quantity, reorder_level
      FROM medications
      WHERE pharmacy_id = ${pharmacyId} AND stock_quantity <= reorder_level
      ORDER BY stock_quantity ASC
      LIMIT 10
    `,
    sql`
      SELECT id, name, stock_quantity, TO_CHAR(expiry_date, 'YYYY-MM-DD') AS expiry_date
      FROM medications
      WHERE pharmacy_id = ${pharmacyId}
        AND expiry_date IS NOT NULL
        AND expiry_date <= CURRENT_DATE + INTERVAL '90 days'
      ORDER BY expiry_date ASC
      LIMIT 10
    `,
    sql`
      SELECT COALESCE(category, 'Uncategorized') AS category, COUNT(*)::int AS med_count
      FROM medications
      WHERE pharmacy_id = ${pharmacyId}
      GROUP BY COALESCE(category, 'Uncategorized')
      ORDER BY med_count DESC
      LIMIT 6
    `,
  ]);

  return Response.json({
    inventory: inventoryStats[0],
    today: todayStats[0],
    month: monthStats[0],
    topMedications: topMeds,
    trend,
    lowStock,
    expiringSoon,
    categories: categoryBreakdown,
  });
}
