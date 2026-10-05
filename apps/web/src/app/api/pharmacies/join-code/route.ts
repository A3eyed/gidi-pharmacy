import { randomBytes } from 'node:crypto';
import sql from '@/app/api/utils/sql';
import { getAdminPharmacy } from '@/app/api/utils/requireUser';

/**
 * Generates a hard-to-guess join code like GIDI-7K2M9QX4.
 * 8 characters from a 32-symbol unambiguous alphabet = 32^8 ≈ 1.1 trillion
 * combinations, generated with crypto-grade randomness.
 */
function generateCode() {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no 0/O, 1/I/L
  const bytes = randomBytes(8);
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += alphabet[bytes[i] % alphabet.length];
  }
  return `GIDI-${code}`;
}

// Admin only: view the current join code status
export async function GET(request: Request) {
  const url = new URL(request.url);
  const pharmacyId = Number(url.searchParams.get('pharmacyId'));
  const { user, pharmacy } = await getAdminPharmacy(request, pharmacyId);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (!pharmacy) {
    return Response.json(
      { error: 'Only the pharmacy admin can manage join codes' },
      { status: 403 }
    );
  }
  return Response.json({
    joinCode: pharmacy.join_code_active ? pharmacy.join_code : null,
    active: !!pharmacy.join_code_active,
    createdAt: pharmacy.join_code_created_at,
  });
}

// Admin only: generate/regenerate (action: "generate") or revoke (action: "revoke")
export async function POST(request: Request) {
  const body = await request.json();
  const pharmacyId = Number(body.pharmacyId);
  const action = body.action === 'revoke' ? 'revoke' : 'generate';

  const { user, pharmacy } = await getAdminPharmacy(request, pharmacyId);
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (!pharmacy) {
    return Response.json(
      { error: 'Only the pharmacy admin can manage join codes' },
      { status: 403 }
    );
  }

  if (action === 'revoke') {
    await sql`
      UPDATE pharmacies
      SET join_code = NULL, join_code_active = FALSE, join_code_created_at = NULL
      WHERE id = ${pharmacyId}
    `;
    return Response.json({ joinCode: null, active: false, createdAt: null });
  }

  // Generate (or regenerate — replacing any previous code so it stops working).
  // Retry on the vanishingly small chance of a uniqueness collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    try {
      const rows = await sql`
        UPDATE pharmacies
        SET join_code = ${code}, join_code_active = TRUE, join_code_created_at = NOW()
        WHERE id = ${pharmacyId}
        RETURNING join_code, join_code_active, join_code_created_at
      `;
      return Response.json({
        joinCode: rows[0].join_code,
        active: rows[0].join_code_active,
        createdAt: rows[0].join_code_created_at,
      });
    } catch (error) {
      // Unique index collision — try another code
      if (attempt === 4) {
        console.error('Join code generation failed repeatedly', error);
        return Response.json(
          { error: 'Could not generate a code. Please try again.' },
          { status: 500 }
        );
      }
    }
  }
  return Response.json({ error: 'Could not generate a code. Please try again.' }, { status: 500 });
}
