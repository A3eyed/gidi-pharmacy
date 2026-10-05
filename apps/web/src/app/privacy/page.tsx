'use client';

import Link from 'next/link';
import { Pill } from 'lucide-react';

/**
 * Public privacy policy.
 *
 * Intentionally NOT wrapped in AppShell so it is reachable without signing in —
 * App Store Connect requires a publicly accessible privacy policy URL, and
 * reviewers must be able to open it without credentials.
 */
export default function PrivacyPolicyPage() {
  const sectionClass = 'mt-8';
  const h2Class = 'text-lg font-semibold tracking-tight text-black';
  const pClass = 'mt-2 text-sm leading-relaxed text-[#404040]';
  const liClass = 'flex gap-2.5 text-sm leading-relaxed text-[#404040]';
  const dotClass = 'mt-[9px] h-1 w-1 shrink-0 rounded-full bg-black';

  return (
    <div className="min-h-screen bg-white font-inter">
      <header className="border-b border-[#E5E5E5]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
              <Pill size={16} className="text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-black">GiDi</span>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-[#E5E5E5] px-3 py-1 text-xs font-medium text-black transition-colors hover:bg-[#FAFAFA]"
          >
            Back to app
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-20 pt-10">
        <h1 className="text-3xl font-semibold tracking-tight text-black">Privacy Policy</h1>
        <p className="mt-2 text-sm text-[#737373]">Last updated: 19 September 2026</p>

        <p className="mt-6 text-sm leading-relaxed text-[#404040]">
          GiDi is a pharmacy management application for inventory, sales and analytics. This policy
          explains what we collect, why we collect it, how it is stored, and the choices you have.
          We have written it in plain language on purpose.
        </p>

        <section className={sectionClass}>
          <h2 className={h2Class}>The short version</h2>
          <ul className="mt-3 flex flex-col gap-2">
            <li className={liClass}>
              <span className={dotClass} />
              <span>
                We do <strong className="font-semibold text-black">not</strong> show advertisements
                in GiDi, and we do not use your data for advertising, marketing or behavioural
                profiling.
              </span>
            </li>
            <li className={liClass}>
              <span className={dotClass} />
              <span>
                We do <strong className="font-semibold text-black">not</strong> sell, rent or trade
                your data to anyone.
              </span>
            </li>
            <li className={liClass}>
              <span className={dotClass} />
              <span>
                GiDi is a business tool. It is not designed to hold patient names or patient medical
                records, and you should not enter them.
              </span>
            </li>
            <li className={liClass}>
              <span className={dotClass} />
              <span>
                You can permanently delete your account and all of your data from inside the app at
                any time.
              </span>
            </li>
          </ul>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>What we collect</h2>
          <p className={pClass}>
            <strong className="font-semibold text-black">Account information.</strong> Your email
            address, your display name and an encrypted password hash. We never store your password
            in readable form.
          </p>
          <p className={pClass}>
            <strong className="font-semibold text-black">Business information you enter.</strong>{' '}
            Pharmacy names, addresses and phone numbers; your medication catalogue (names, generic
            names, categories, SKUs, prices, stock levels, reorder levels and expiry dates); and the
            sales you record, including line items, quantities and totals.
          </p>
          <p className={pClass}>
            <strong className="font-semibold text-black">Questions you ask Azara.</strong> The
            messages you send to the in-app assistant, plus a summary of your current stock list
            that is attached so the answer can reference what you actually carry.
          </p>
          <p className={pClass}>
            <strong className="font-semibold text-black">Technical information.</strong> Standard
            session data needed to keep you signed in, and error reports if something crashes.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>What we do not collect</h2>
          <ul className="mt-3 flex flex-col gap-2">
            <li className={liClass}>
              <span className={dotClass} />
              <span>Patient names, patient contact details or patient medical records.</span>
            </li>
            <li className={liClass}>
              <span className={dotClass} />
              <span>Payment card numbers or bank details.</span>
            </li>
            <li className={liClass}>
              <span className={dotClass} />
              <span>
                Precise device location, contacts, photos, microphone or camera data. GiDi does not
                request these permissions.
              </span>
            </li>
            <li className={liClass}>
              <span className={dotClass} />
              <span>Advertising identifiers or cross-app tracking data.</span>
            </li>
          </ul>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>How we use your information</h2>
          <p className={pClass}>
            We use it only to operate the features you are using: signing you in, storing and
            displaying your inventory and sales, calculating your analytics and statements, and
            producing Azara answers and restock briefings.
          </p>
          <p className={pClass}>
            We explicitly do not use your information — including anything you ask Azara — for
            advertising, marketing, resale, or to build a profile of you. Because GiDi operates in a
            health context, this restriction is absolute.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Azara and third parties</h2>
          <p className={pClass}>
            <strong className="font-semibold text-black">
              Azara does not use an external AI service.
            </strong>{' '}
            Answers are looked up in a reference library that is built into GiDi and stored on our
            own server, together with any notes your pharmacy adds. Your questions are not sent to
            Google, OpenAI, or any other model provider, and no AI API key is involved.
          </p>
          <p className={pClass}>
            Restock briefings are calculated on our server from your own sales history and stock
            levels. The only external call is your pharmacy&apos;s city being sent to a weather
            service to retrieve current conditions, which is used as a demand signal. No medication
            or sales data is included in that request.
          </p>
          <p className={pClass}>
            Azara is a reference lookup tool for qualified pharmacy and healthcare professionals.
            Entries can be incomplete or out of date. It does not diagnose patients, does not
            prescribe, and is not a substitute for the professional judgement of a qualified
            pharmacist or physician.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Where your data is stored</h2>
          <p className={pClass}>
            Your data is held in an encrypted, access-controlled PostgreSQL database. Traffic
            between the app and our servers is encrypted in transit using HTTPS. On mobile, your
            session token is kept in the device&apos;s secure keystore (iOS Keychain / Android
            Keystore).
          </p>
          <p className={pClass}>
            Every request is scoped to your account: the server checks ownership before returning
            any pharmacy, medication, sale or report, so one account can never read another
            account&apos;s data.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>How long we keep it</h2>
          <p className={pClass}>
            We keep your data for as long as your account is open, because your sales history is
            what powers your analytics. When you delete your account, your data is removed
            immediately as described below.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Deleting your account and data</h2>
          <p className={pClass}>
            You can delete your account at any time from{' '}
            <strong className="font-semibold text-black">Settings → Delete account</strong> in the
            app, on both web and mobile. No email request is needed.
          </p>
          <p className={pClass}>
            Deleting your account permanently removes your login details, all of your pharmacies,
            your entire medication catalogue, and all sales and sale line items belonging to those
            pharmacies. This action is immediate and cannot be undone, so export any statements you
            want to keep first — the Reports page lets you download them as CSV or PDF.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Your rights</h2>
          <p className={pClass}>
            You can access and correct your data directly in the app, export your records from the
            Reports page, and delete everything from Settings. If you would like a copy of your data
            in another format, or have a question about this policy, contact us using the details
            below.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Children</h2>
          <p className={pClass}>
            GiDi is a professional tool intended for pharmacy owners and staff. It is not directed
            at children and we do not knowingly collect information from anyone under 16.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Changes to this policy</h2>
          <p className={pClass}>
            If we make a material change, we will update the date at the top of this page. Continued
            use of GiDi after a change means you accept the updated policy.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Contact</h2>
          <p className={pClass}>
            Questions about privacy or your data can be sent to Abdallah Fuseini, the builder of GiDi, at the support email listed on the GiDi App Store listing.
          </p>
        </section>
      </main>
    </div>
  );
}
