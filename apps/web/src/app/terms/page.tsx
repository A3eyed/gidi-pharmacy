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
        <p className="mt-2 text-sm text-[#737373]">Last updated: 6 October 2026</p>
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
