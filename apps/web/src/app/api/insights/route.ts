import sql from '@/app/api/utils/sql';
import { getOwnedPharmacy } from '@/app/api/utils/requireUser';
import { getSeasonInfo, monthName } from '@/app/api/utils/season';
import { currencyForCountry } from '@/utils/locale/countries';

/**
 * Restock insights.
 *
 * This used to depend on an external language model, which meant it stopped
 * working whenever the provider or key was unavailable. It is now a
 * deterministic run-rate engine: the same data always produces the same
 * briefing, it costs nothing, and it never invents a medicine.
 */

const WEATHER_URL = `${process.env.NEXT_PUBLIC_CREATE_BASE_URL}/integrations/weather-by-city/weather`;

type Urgency = 'high' | 'medium' | 'low';

type Recommendation = {
  medication: string;
  action: 'Reorder' | 'Increase order' | 'Monitor' | 'Reduce order';
  suggestedQuantity: number | null;
  urgency: Urgency;
  reason: string;
};

/** Current weather is a useful demand signal, but never required. */
async function fetchWeather(city: string) {
  try {
    const response = await fetch(`${WEATHER_URL}/${encodeURIComponent(city)}`, {
      headers: { Authorization: `Bearer ${process.env.ANYTHING_PROJECT_TOKEN}` },
    });
    if (!response.ok) {
      console.error(`Weather lookup failed: [${response.status}] ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    if (!data?.current) return null;
    return {
      city: data.location?.name ?? city,
      country: data.location?.country ?? '',
      tempC: data.current.temp_c,
      feelsLikeC: data.current.feelslike_c,
      condition: data.current.condition?.text ?? 'Unknown',
      humidity: data.current.humidity,
      precipMm: data.current.precip_mm,
      uv: data.current.uv,
      windKph: data.current.wind_kph,
    };
  } catch (error) {
    console.error('Weather lookup threw', error);
    return null;
  }
}

/** Target stock cover, in days, used when sizing a reorder. */
const TARGET_COVER_DAYS = 60;

function roundQuantity(value: number) {
  if (value <= 0) return null;
  if (value < 20) return Math.ceil(value / 5) * 5;
  if (value < 200) return Math.ceil(value / 10) * 10;
  return Math.ceil(value / 50) * 50;
}

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

  const prefRows = await sql`
    SELECT country_code, currency_code
    FROM user_preferences WHERE user_id = ${user.id} LIMIT 1
  `;
  const currency =
    prefRows[0]?.currency_code ?? currencyForCountry(prefRows[0]?.country_code ?? null);

  const cityParam = url.searchParams.get('city')?.trim();
  const addressCity = (pharmacy.address ?? '').split(',').pop()?.trim();
  const city = cityParam || addressCity || 'Accra';

  const season = getSeasonInfo();

  const [recentSales, priorSales, lowStock, expiring, stockList] = await sql.transaction([
    sql`
      SELECT si.medication_name AS name,
             MAX(COALESCE(m.category, 'Uncategorized')) AS category,
             SUM(si.quantity)::int AS units_sold,
             SUM(si.subtotal) AS revenue
      FROM sale_items si
      JOIN sales s ON s.id = si.sale_id
      LEFT JOIN medications m ON m.id = si.medication_id
      WHERE s.pharmacy_id = ${pharmacyId} AND s.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY si.medication_name
      ORDER BY units_sold DESC
      LIMIT 40
    `,
    sql`
      SELECT si.medication_name AS name, SUM(si.quantity)::int AS units_sold
      FROM sale_items si
      JOIN sales s ON s.id = si.sale_id
      WHERE s.pharmacy_id = ${pharmacyId}
        AND s.created_at >= NOW() - INTERVAL '60 days'
        AND s.created_at < NOW() - INTERVAL '30 days'
      GROUP BY si.medication_name
    `,
    sql`
      SELECT name, stock_quantity, reorder_level, category
      FROM medications
      WHERE pharmacy_id = ${pharmacyId} AND stock_quantity <= reorder_level
      ORDER BY stock_quantity ASC
      LIMIT 25
    `,
    sql`
      SELECT name, stock_quantity, TO_CHAR(expiry_date, 'YYYY-MM-DD') AS expiry_date
      FROM medications
      WHERE pharmacy_id = ${pharmacyId}
        AND expiry_date IS NOT NULL
        AND expiry_date <= CURRENT_DATE + INTERVAL '90 days'
      ORDER BY expiry_date ASC
      LIMIT 15
    `,
    sql`
      SELECT name, category, stock_quantity, reorder_level
      FROM medications
      WHERE pharmacy_id = ${pharmacyId}
      ORDER BY name ASC
      LIMIT 500
    `,
  ]);

  const weather = await fetchWeather(city);

  const stockByName = new Map<string, { stock: number; reorder: number; category: string }>();
  for (const row of stockList) {
    stockByName.set(String(row.name).toLowerCase(), {
      stock: Number(row.stock_quantity ?? 0),
      reorder: Number(row.reorder_level ?? 0),
      category: String(row.category ?? 'Uncategorized'),
    });
  }

  const priorByName = new Map<string, number>();
  for (const row of priorSales) priorByName.set(String(row.name), Number(row.units_sold));

  const sellers = recentSales.map((row) => {
    const name = String(row.name);
    const now = Number(row.units_sold);
    const prior = priorByName.get(name) ?? 0;
    const match = stockByName.get(name.toLowerCase());
    const dailyRate = now / 30;
    const stock = match?.stock ?? 0;
    const daysCover = dailyRate > 0 ? stock / dailyRate : Number.POSITIVE_INFINITY;
    const change = prior === 0 ? (now > 0 ? 1 : 0) : (now - prior) / prior;
    return {
      name,
      category: String(row.category ?? 'Uncategorized'),
      unitsLast30: now,
      unitsPrior30: prior,
      revenue: Number(row.revenue ?? 0),
      stock,
      reorder: match?.reorder ?? 0,
      dailyRate,
      daysCover,
      change,
      trend:
        prior === 0
          ? now > 0
            ? 'new'
            : 'flat'
          : change > 0.15
            ? 'rising'
            : change < -0.15
              ? 'falling'
              : 'flat',
    };
  });

  /* -------------------------------------------------------------- *
   * Build recommendations from run-rate, cover and momentum
   * -------------------------------------------------------------- */
  const recommendations: Recommendation[] = [];

  for (const seller of sellers) {
    if (seller.unitsLast30 <= 0) continue;

    const target = seller.dailyRate * TARGET_COVER_DAYS;
    const shortfall = roundQuantity(target - seller.stock);

    if (seller.daysCover <= 14) {
      recommendations.push({
        medication: seller.name,
        action: 'Reorder',
        suggestedQuantity: shortfall,
        urgency: 'high',
        reason: `Selling ${seller.unitsLast30} units in the last 30 days with only ${seller.stock} left — about ${Math.max(0, Math.round(seller.daysCover))} days of cover.`,
      });
    } else if (seller.trend === 'rising' && seller.daysCover <= 45) {
      recommendations.push({
        medication: seller.name,
        action: 'Increase order',
        suggestedQuantity: shortfall,
        urgency: 'medium',
        reason: `Demand up ${Math.round(seller.change * 100)}% versus the previous month (${seller.unitsPrior30} → ${seller.unitsLast30} units) with ${Math.round(seller.daysCover)} days of cover.`,
      });
    } else if (seller.trend === 'falling' && seller.daysCover > 120) {
      recommendations.push({
        medication: seller.name,
        action: 'Reduce order',
        suggestedQuantity: null,
        urgency: 'low',
        reason: `Sales down ${Math.abs(Math.round(seller.change * 100))}% and you hold over ${Math.round(seller.daysCover)} days of cover — cash is tied up here.`,
      });
    }
  }

  // Low-stock lines that have not sold recently still need a decision.
  const covered = new Set(recommendations.map((r) => r.medication.toLowerCase()));
  for (const row of lowStock) {
    const name = String(row.name);
    if (covered.has(name.toLowerCase())) continue;
    recommendations.push({
      medication: name,
      action: Number(row.stock_quantity) === 0 ? 'Reorder' : 'Monitor',
      suggestedQuantity: roundQuantity(Number(row.reorder_level ?? 0) * 2),
      urgency: Number(row.stock_quantity) === 0 ? 'high' : 'low',
      reason:
        Number(row.stock_quantity) === 0
          ? 'Completely out of stock — every request for this line is a lost sale.'
          : `At or below the reorder level (${row.stock_quantity} left, reorder at ${row.reorder_level}).`,
    });
    covered.add(name.toLowerCase());
  }

  const urgencyRank: Record<Urgency, number> = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => urgencyRank[a.urgency] - urgencyRank[b.urgency]);
  const topRecommendations = recommendations.slice(0, 8);

  /* -------------------------------------------------------------- *
   * Watchouts, opportunities and narrative
   * -------------------------------------------------------------- */
  const watchouts: string[] = [];
  for (const row of expiring.slice(0, 5)) {
    watchouts.push(
      `${row.name}: ${row.stock_quantity} units expire on ${row.expiry_date}. Move it to the front of the shelf, promote it, or ask your supplier about a return.`
    );
  }
  const deadStock = sellers.filter((s) => s.unitsLast30 === 0 && s.stock > 0);
  if (deadStock.length > 0) {
    watchouts.push(
      `${deadStock.length} line${deadStock.length === 1 ? '' : 's'} sold nothing in the last 30 days while holding stock — review before reordering.`
    );
  }
  if (watchouts.length === 0) {
    watchouts.push('No expiry or overstock risks detected in the next 90 days.');
  }

  const stockedCategories = new Set(
    stockList.map((row) => String(row.category ?? '').toLowerCase()).filter(Boolean)
  );
  const opportunities: string[] = [];
  for (const category of season.likelyCategories ?? []) {
    if (!stockedCategories.has(String(category).toLowerCase())) {
      opportunities.push(
        `${category} is typically in demand during ${season.label} but you do not currently carry this category — worth trialling a small order.`
      );
    }
  }
  const risingNew = sellers.filter((s) => s.trend === 'new' && s.unitsLast30 >= 5);
  for (const item of risingNew.slice(0, 3)) {
    opportunities.push(
      `${item.name} is newly moving (${item.unitsLast30} units this month) — keep a steady line rather than ad-hoc purchases.`
    );
  }
  if (opportunities.length === 0) {
    opportunities.push('Your category mix already covers the products this season usually drives.');
  }

  const urgentCount = topRecommendations.filter((r) => r.urgency === 'high').length;
  const headline =
    topRecommendations.length === 0
      ? 'Stock levels look comfortable — nothing needs reordering today.'
      : `${urgentCount} line${urgentCount === 1 ? '' : 's'} need${urgentCount === 1 ? 's' : ''} urgent reordering and ${topRecommendations.length - urgentCount} more are worth reviewing this week.`;

  const weatherLine = weather
    ? ` Right now it is ${Math.round(weather.tempC)}°C and ${String(weather.condition).toLowerCase()} in ${weather.city}${weather.precipMm > 0 ? ', with rain about' : ''}.`
    : '';

  const seasonalOutlook = `${monthName()} falls in the ${season.label} (${season.months}). ${season.demandNotes}${weatherLine} Expect demand to lean towards ${(season.likelyCategories ?? []).slice(0, 3).join(', ') || 'your usual top sellers'} over the coming weeks.`;

  return Response.json({
    generatedAt: new Date().toISOString(),
    model: 'gidi-restock-engine',
    season,
    weather,
    currency,
    headline,
    seasonalOutlook,
    recommendations: topRecommendations,
    watchouts,
    opportunities,
    evidence: {
      risingSellers: sellers.filter((s) => s.trend === 'rising').slice(0, 8),
      lowStockCount: lowStock.length,
      expiringCount: expiring.length,
    },
  });
}
