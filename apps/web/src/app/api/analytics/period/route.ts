import sql from '@/app/api/utils/sql';
import { getOwnedPharmacy } from '@/app/api/utils/requireUser';

/**
 * Deep period analytics.
 *
 * Answers "what sold in this window, how does it compare to the window before,
 * and what patterns explain it" — by day, by weekday, by hour, by category and
 * by medication, including gross profit and movers/decliners.
 */
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

  // Resolve the window (inclusive dates, defaults to the last 30 days)
  const today = new Date();
  const defaultFrom = new Date(today);
  defaultFrom.setDate(defaultFrom.getDate() - 29);

  const toStr = url.searchParams.get('to') || today.toISOString().slice(0, 10);
  const fromStr = url.searchParams.get('from') || defaultFrom.toISOString().slice(0, 10);

  const fromDate = new Date(`${fromStr}T00:00:00Z`);
  const toDate = new Date(`${toStr}T00:00:00Z`);
  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    return Response.json({ error: 'Invalid date range' }, { status: 400 });
  }
  if (fromDate > toDate) {
    return Response.json({ error: 'Start date must be before end date' }, { status: 400 });
  }

  // Length of window in days (inclusive)
  const dayMs = 24 * 60 * 60 * 1000;
  const lengthDays = Math.round((toDate.getTime() - fromDate.getTime()) / dayMs) + 1;

  // Immediately preceding window of the same length, for comparison
  const prevTo = new Date(fromDate.getTime() - dayMs);
  const prevFrom = new Date(prevTo.getTime() - (lengthDays - 1) * dayMs);
  const prevFromStr = prevFrom.toISOString().slice(0, 10);
  const prevToStr = prevTo.toISOString().slice(0, 10);

  const [
    summary,
    prevSummary,
    daily,
    topMeds,
    prevMeds,
    categoryPerf,
    weekday,
    hourly,
    slowMovers,
  ] = await sql.transaction([
    // Revenue, sale count, units and gross profit for the window
    sql`
      SELECT
        COALESCE(SUM(si.subtotal), 0) AS revenue,
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
      SELECT
        COALESCE(SUM(si.subtotal), 0) AS revenue,
        COALESCE(SUM(si.quantity), 0)::int AS units,
        COALESCE(SUM(si.subtotal - (COALESCE(m.cost_price, 0) * si.quantity)), 0) AS gross_profit,
        COUNT(DISTINCT s.id)::int AS sale_count
      FROM sales s
      JOIN sale_items si ON si.sale_id = s.id
      LEFT JOIN medications m ON m.id = si.medication_id
      WHERE s.pharmacy_id = ${pharmacyId}
        AND s.created_at >= ${prevFromStr}::date
        AND s.created_at < ${prevToStr}::date + INTERVAL '1 day'
    `,
    // Daily revenue across the window (zero-filled)
    sql`
      SELECT TO_CHAR(d.day, 'YYYY-MM-DD') AS day,
             COALESCE(SUM(s.total_amount), 0) AS revenue,
             COUNT(s.id)::int AS sale_count
      FROM generate_series(${fromStr}::date, ${toStr}::date, '1 day') AS d(day)
      LEFT JOIN sales s
        ON s.pharmacy_id = ${pharmacyId}
        AND s.created_at >= d.day
        AND s.created_at < d.day + INTERVAL '1 day'
      GROUP BY d.day
      ORDER BY d.day ASC
    `,
    // Best sellers in the window
    sql`
      SELECT si.medication_name AS name,
             MAX(COALESCE(m.category, 'Uncategorized')) AS category,
             SUM(si.quantity)::int AS units_sold,
             SUM(si.subtotal) AS revenue,
             SUM(si.subtotal - (COALESCE(m.cost_price, 0) * si.quantity)) AS gross_profit
      FROM sale_items si
      JOIN sales s ON s.id = si.sale_id
      LEFT JOIN medications m ON m.id = si.medication_id
      WHERE s.pharmacy_id = ${pharmacyId}
        AND s.created_at >= ${fromStr}::date
        AND s.created_at < ${toStr}::date + INTERVAL '1 day'
      GROUP BY si.medication_name
      ORDER BY revenue DESC
      LIMIT 20
    `,
    // Same medications in the previous window, so we can compute movement
    sql`
      SELECT si.medication_name AS name,
             SUM(si.quantity)::int AS units_sold,
             SUM(si.subtotal) AS revenue
      FROM sale_items si
      JOIN sales s ON s.id = si.sale_id
      WHERE s.pharmacy_id = ${pharmacyId}
        AND s.created_at >= ${prevFromStr}::date
        AND s.created_at < ${prevToStr}::date + INTERVAL '1 day'
      GROUP BY si.medication_name
    `,
    // Revenue by category
    sql`
      SELECT COALESCE(m.category, 'Uncategorized') AS category,
             SUM(si.quantity)::int AS units_sold,
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
    // Which weekdays are busiest
    sql`
      SELECT EXTRACT(DOW FROM s.created_at)::int AS dow,
             COALESCE(SUM(s.total_amount), 0) AS revenue,
             COUNT(*)::int AS sale_count
      FROM sales s
      WHERE s.pharmacy_id = ${pharmacyId}
        AND s.created_at >= ${fromStr}::date
        AND s.created_at < ${toStr}::date + INTERVAL '1 day'
      GROUP BY EXTRACT(DOW FROM s.created_at)
      ORDER BY dow ASC
    `,
    // Which hours are busiest
    sql`
      SELECT EXTRACT(HOUR FROM s.created_at)::int AS hour,
             COALESCE(SUM(s.total_amount), 0) AS revenue,
             COUNT(*)::int AS sale_count
      FROM sales s
      WHERE s.pharmacy_id = ${pharmacyId}
        AND s.created_at >= ${fromStr}::date
        AND s.created_at < ${toStr}::date + INTERVAL '1 day'
      GROUP BY EXTRACT(HOUR FROM s.created_at)
      ORDER BY hour ASC
    `,
    // Stock sitting still: in inventory but nothing sold in the window
    sql`
      SELECT m.id, m.name, m.stock_quantity, m.unit_price,
             (m.stock_quantity * m.unit_price) AS tied_up_value
      FROM medications m
      WHERE m.pharmacy_id = ${pharmacyId}
        AND m.stock_quantity > 0
        AND NOT EXISTS (
          SELECT 1 FROM sale_items si
          JOIN sales s ON s.id = si.sale_id
          WHERE si.medication_id = m.id
            AND s.pharmacy_id = ${pharmacyId}
            AND s.created_at >= ${fromStr}::date
            AND s.created_at < ${toStr}::date + INTERVAL '1 day'
        )
      ORDER BY tied_up_value DESC
      LIMIT 10
    `,
  ]);

  // Merge current vs previous per medication to surface risers and fallers
  const prevByName = new Map<string, { units: number; revenue: number }>();
  for (const row of prevMeds) {
    prevByName.set(row.name, {
      units: Number(row.units_sold),
      revenue: Number(row.revenue),
    });
  }

  const medsWithMovement = topMeds.map((m) => {
    const prev = prevByName.get(m.name);
    const prevRevenue = prev?.revenue ?? 0;
    const revenue = Number(m.revenue);
    const changePct =
      prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : revenue > 0 ? null : 0;
    return {
      ...m,
      revenue: revenue,
      gross_profit: Number(m.gross_profit ?? 0),
      prev_revenue: prevRevenue,
      prev_units: prev?.units ?? 0,
      change_pct: changePct,
    };
  });

  const current = summary[0] ?? {};
  const previous = prevSummary[0] ?? {};

  const revenueNow = Number(current.revenue ?? 0);
  const revenuePrev = Number(previous.revenue ?? 0);
  const revenueChangePct =
    revenuePrev > 0 ? ((revenueNow - revenuePrev) / revenuePrev) * 100 : null;

  return Response.json({
    range: { from: fromStr, to: toStr, days: lengthDays },
    previousRange: { from: prevFromStr, to: prevToStr },
    summary: {
      revenue: revenueNow,
      units: Number(current.units ?? 0),
      grossProfit: Number(current.gross_profit ?? 0),
      saleCount: Number(current.sale_count ?? 0),
      averageSale:
        Number(current.sale_count ?? 0) > 0 ? revenueNow / Number(current.sale_count) : 0,
    },
    previousSummary: {
      revenue: revenuePrev,
      units: Number(previous.units ?? 0),
      grossProfit: Number(previous.gross_profit ?? 0),
      saleCount: Number(previous.sale_count ?? 0),
    },
    revenueChangePct,
    daily,
    medications: medsWithMovement,
    categories: categoryPerf,
    weekday,
    hourly,
    slowMovers,
  });
}
