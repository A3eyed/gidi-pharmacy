import { auth } from '@/lib/auth';
import sql from '@/app/api/utils/sql';

export type MemberRole = 'admin' | 'staff';

/**
 * Returns the authenticated user for this request, or null.
 * Works for both web (cookie) and mobile (Bearer token) callers.
 */
export async function getUser(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ?? null;
}

/**
 * Membership-aware pharmacy access.
 *
 * Returns { user, pharmacy, role } where `pharmacy` is non-null only when the
 * authenticated user is a member (admin or staff) of that pharmacy. The role
 * comes exclusively from the pharmacy_members table — never from the client —
 * so a staff user cannot elevate themselves by tampering with requests.
 *
 * Legacy safety: pharmacy owners are treated as admins even if their
 * membership row is somehow missing (owner_id remains the source of truth
 * for ownership).
 */
export async function getMemberPharmacy(request: Request, pharmacyId: number) {
  const user = await getUser(request);
  if (!user) {
    return { user: null, pharmacy: null, role: null as MemberRole | null };
  }
  if (!pharmacyId || Number.isNaN(pharmacyId)) {
    return { user, pharmacy: null, role: null as MemberRole | null };
  }
  const rows = await sql`
    SELECT p.*,
      CASE
        WHEN p.owner_id = ${user.id} THEN 'admin'
        ELSE pm.member_role
      END AS resolved_role
    FROM pharmacies p
    LEFT JOIN pharmacy_members pm
      ON pm.pharmacy_id = p.id AND pm.user_id = ${user.id}
    WHERE p.id = ${pharmacyId}
      AND (p.owner_id = ${user.id} OR pm.user_id IS NOT NULL)
    LIMIT 1
  `;
  const pharmacy = rows[0] ?? null;
  const role = (pharmacy?.resolved_role ?? null) as MemberRole | null;
  return { user, pharmacy, role };
}

/**
 * Admin-only pharmacy access. Pharmacy is non-null only when the user is the
 * admin of that pharmacy.
 */
export async function getAdminPharmacy(request: Request, pharmacyId: number) {
  const { user, pharmacy, role } = await getMemberPharmacy(request, pharmacyId);
  if (!pharmacy || role !== 'admin') {
    return { user, pharmacy: null, role };
  }
  return { user, pharmacy, role };
}

/**
 * Back-compat alias used by existing routes. Membership-aware: any member
 * (admin or staff) of the pharmacy can access shared pharmacy data
 * (inventory, sales, analytics, reports, insights).
 */
export async function getOwnedPharmacy(request: Request, pharmacyId: number) {
  const { user, pharmacy } = await getMemberPharmacy(request, pharmacyId);
  return { user, pharmacy };
}
