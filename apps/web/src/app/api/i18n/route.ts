import { COUNTRIES } from '@/utils/locale/countries';
import { LANGUAGES, getBundle } from '@/utils/locale/translations';

/**
 * Serves translation bundles and reference data to the mobile app so the
 * dictionary lives in exactly one place. Public on purpose — it contains no
 * user data and the mobile sign-in screen needs it before authentication.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const language = url.searchParams.get('lang')?.trim() || 'en';

  return Response.json(
    {
      language,
      bundle: getBundle(language),
      languages: LANGUAGES,
      countries: COUNTRIES,
    },
    {
      headers: {
        // Static reference data — safe to cache hard on the client.
        'Cache-Control': 'public, max-age=3600',
      },
    }
  );
}
