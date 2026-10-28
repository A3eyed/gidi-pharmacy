'use client';

import Link from 'next/link';
import { Pill } from 'lucide-react';

export default function TermsPage() {
  const sectionClass = 'mt-8';
  const h2Class = 'text-lg font-semibold tracking-tight text-black';
  const pClass = 'mt-2 text-sm leading-relaxed text-[#404040]';

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
        <h1 className="text-3xl font-semibold tracking-tight text-black">Terms and conditions</h1>
        <p className="mt-2 text-sm text-[#737373]">Last updated: 28 October 2026</p>
        <p className="mt-6 text-sm leading-relaxed text-[#404040]">
          These terms cover use of GiDi, the pharmacy management app and website built by Abdallah
          Fuseini. By creating an account or continuing past the sample screens, you agree to them.
        </p>

        <section className={sectionClass}>
          <h2 className={h2Class}>What GiDi is</h2>
          <p className={pClass}>
            GiDi is a tool for a pharmacy to keep a medication catalogue, record sales, see stock
            and expiry warnings, and look up general reference answers through Azara. It is a
            business record, not a patient record system and not a medical device.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Age requirement</h2>
          <p className={pClass}>
            GiDi is for pharmacy owners and staff who are at least 16 years old. By creating an
            account you confirm you meet that age. We do not knowingly collect personal information
            from anyone under 16.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Your account</h2>
          <p className={pClass}>
            You must give a real email address and keep your password private. You are responsible
            for activity under your account, including staff you invite. You can close the account
            from Settings. Closing it deletes the login, pharmacies, catalogue and sales tied to
            that account.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>What you may enter</h2>
          <p className={pClass}>
            Enter pharmacy and stock information you are allowed to store. Do not enter patient
            names, patient contact details, clinical notes, or payment card numbers. GiDi is not
            built to hold those, and doing so is outside these terms.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Azara</h2>
          <p className={pClass}>
            Azara returns general reference text from a library in the app and notes your pharmacy
            adds. It does not diagnose, prescribe, or replace a pharmacist or physician. Check
            answers against an authoritative source such as the BNF, WHO guidance, or your national
            formulary before you act on them. Restock notes are stocking estimates, not purchasing
            advice.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Your records</h2>
          <p className={pClass}>
            You keep ownership of the pharmacy data you enter. GiDi stores it so the app can show
            it back to your account. We do not sell it and we do not use it for advertising. Export
            reports you need before you delete an account, because deletion is immediate.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Paid features and renewals</h2>
          <p className={pClass}>
            If you buy a subscription through the App Store or Google Play, payment is charged to
            your store account at confirmation. Subscriptions renew automatically unless you turn
            auto-renew off at least 24 hours before the end of the current period. Manage or cancel
            in your device's subscription settings. Any price change is shown in the store
            before you confirm. Refunds follow Apple's or Google's rules.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Availability</h2>
          <p className={pClass}>
            GiDi is provided as available. A phone without a connection may show saved stock, and
            a server interruption can delay a sale or a sync. Keep your own copies of records you
            are required to retain by law.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Acceptable use</h2>
          <p className={pClass}>
            Do not try to access another pharmacy’s data, break the sign-in system, or use GiDi to
            store or distribute anything unlawful. We may suspend an account that does that.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Liability</h2>
          <p className={pClass}>
            GiDi is a record-keeping aid. You are responsible for dispensing decisions, stock
            counts, pricing, and compliance with pharmacy law where you operate. To the extent the
            law allows, Abdallah Fuseini is not liable for lost profit, a dispensing error, or a
            record you failed to export before deletion.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Copyright and DMCA</h2>
          <p className={pClass}>
            GiDi and its branding, interface, and documentation are owned by Abdallah Fuseini. If
            you believe material on GiDi infringes your copyright, send a notice under the Digital
            Millennium Copyright Act (17 U.S.C. § 512) to the designated agent below. The notice
            should include: (1) your contact details; (2) a description of the copyrighted work; (3)
            the URL or location of the material you claim is infringing; (4) a statement that you
            have a good-faith belief the use is not authorised; (5) a statement under penalty of
            perjury that the information is accurate and that you are the owner or authorised to
            act; and (6) your physical or electronic signature.
          </p>
          <p className={pClass}>
            <strong className="font-semibold text-black">DMCA designated agent</strong>
            <br />
            Abdallah Fuseini
            <br />
            GiDi / Pharmacy Manager
            <br />
            Email: the support address published on the GiDi App Store listing
            <br />
            Subject line: DMCA Notice — GiDi
          </p>
          <p className={pClass}>
            On a valid notice we will review and may remove or disable access to the material and
            notify the user who posted it. Counter-notices may be submitted under the same contact
            details.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={h2Class}>Contact</h2>
          <p className={pClass}>
            Questions about these terms can be sent to Abdallah Fuseini through the support address
            on the GiDi App Store listing. The privacy policy is at{' '}
            <Link href="/privacy" className="font-medium text-black underline">
              /privacy
            </Link>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
