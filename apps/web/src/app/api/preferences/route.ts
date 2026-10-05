import sql from '@/app/api/utils/sql';
import { getUser } from '@/app/api/utils/requireUser';
import { currencyForCountry, getCountry } from '@/utils/locale/countries';

const THEMES = new Set(['light', 'dark', 'system']);

// Read the signed-in user's appearance + localization preferences
export async function GET(request: Request) {
  const user = await getUser(request);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const rows = await sql`
    SELECT theme, country_code, language_code, currency_code
    FROM user_preferences
    WHERE user_id = ${user.id}
    LIMIT 1
  `;
  const prefs = rows[0] ?? null;
  return Response.json({
    preferences: prefs
      ? {
          theme: prefs.theme,
          country: prefs.country_code,
          language: prefs.language_code,
          currency: prefs.currency_code,
        }
      : null,
  });
}

/**
 * Save preferences. Currency is always derived server-side from the selected
 * country so the two can never drift apart.
 */
export async function PUT(request: Request) {
  const user = await getUser(request);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const theme = THEMES.has(body.theme) ? body.theme : 'system';
  const language =
    typeof body.language === 'string' && body.language.trim()
      ? body.language.trim().slice(0, 12)
      : 'en';

  const countryInput = typeof body.country === 'string' ? body.country.toUpperCase() : null;
  const country = getCountry(countryInput);
  const countryCode = country?.code ?? null;
  const currency = countryCode ? currencyForCountry(countryCode) : null;

  const rows = await sql`
    INSERT INTO user_preferences (user_id, theme, country_code, language_code, currency_code, updated_at)
    VALUES (${user.id}, ${theme}, ${countryCode}, ${language}, ${currency}, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      theme = EXCLUDED.theme,
      country_code = EXCLUDED.country_code,
      language_code = EXCLUDED.language_code,
      currency_code = EXCLUDED.currency_code,
      updated_at = NOW()
    RETURNING theme, country_code, language_code, currency_code
  `;

  const saved = rows[0];
  return Response.json({
    preferences: {
      theme: saved.theme,
      country: saved.country_code,
      language: saved.language_code,
      currency: saved.currency_code,
    },
  });
}
