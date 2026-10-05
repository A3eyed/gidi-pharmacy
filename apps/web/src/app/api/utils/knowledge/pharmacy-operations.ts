import type { KnowledgeEntry } from './types';

/**
 * Pharmacy practice and management — dispensing, counselling, stewardship,
 * inventory and the GiDi workflows themselves, so Azara can answer operational
 * questions as confidently as clinical ones.
 */
export const PHARMACY_OPERATIONS: KnowledgeEntry[] = [
  {
    id: 'ops-dispensing-process',
    title: 'The dispensing process and prescription validation',
    category: 'practice',
    aliases: ['dispensing', 'prescription check', 'legal validity', 'dispense'],
    tags: ['pharmacy', 'dispensing', 'safety', 'workflow', 'legal'],
    summary: 'A disciplined dispensing sequence catches errors before they reach the patient.',
    sections: [
      {
        heading: 'Validate the prescription',
        points: [
          'Legally required: patient name and address, age for children, date, medicine with strength and form, dose and directions, quantity or duration, prescriber name, signature and registration number.',
          'Controlled drugs require the quantity in both words and figures and additional prescriber details.',
          'A prescription is normally valid for 6 months (shorter for controlled drugs) — check your national rule.',
        ],
      },
      {
        heading: 'Clinical check',
        points: [
          'Is the drug appropriate for the indication, age, weight and pregnancy status?',
          'Is the dose and frequency correct, and correct for renal or hepatic function?',
          'Any allergy, duplication, or clinically significant interaction with existing therapy?',
          'Any missing essential co-therapy (laxative with an opioid, pyridoxine with isoniazid, gastroprotection with a chronic NSAID)?',
        ],
      },
      {
        heading: 'Accuracy check and labelling',
        points: [
          'Select by generic name and confirm the strength twice; beware look-alike sound-alike pairs.',
          'Label with patient name, medicine, strength, clear directions in plain language, quantity, date and pharmacy details.',
          'Add auxiliary labels: take with food, complete the course, may cause drowsiness, avoid alcohol, shake well.',
          'A second person, or a deliberate self-check against the prescription, before handing over.',
        ],
      },
      {
        heading: 'Hand over with counselling',
        points: [
          'Confirm the patient\u2019s identity and that they know what the medicine is for.',
          'Explain how and when to take it, for how long, what to expect, and what to do about a missed dose.',
          'Ask the patient to repeat the key instruction back (teach-back) — this catches most misunderstandings.',
        ],
      },
    ],
    source: 'FIP / national pharmacy practice standards',
  },
  {
    id: 'ops-counselling',
    title: 'Patient counselling and responding to symptoms',
    category: 'practice',
    aliases: ['wwham', 'counselling', 'otc consultation', 'teach back', 'symptom'],
    tags: ['pharmacy', 'communication', 'otc', 'triage', 'counselling'],
    summary:
      'A structured symptom consultation identifies who can be treated over the counter and who must be referred.',
    sections: [
      {
        heading: 'Gathering information — WWHAM',
        points: [
          'Who is the patient?',
          'What are the symptoms, and how long have they lasted?',
          'How long have the symptoms been present, and are they getting worse?',
          'Action already taken — what has been tried?',
          'Medication currently being taken, including herbal products and other people\u2019s medicines.',
          'Add: allergies, pregnancy or breastfeeding, and long-term conditions.',
        ],
      },
      {
        heading: 'Counselling essentials for any medicine',
        points: [
          'What it is and what it does.',
          'How much, how often, how long, and with or without food.',
          'The most likely side effects and which ones require stopping.',
          'What to do if a dose is missed.',
          'How to store it and when to come back.',
        ],
      },
      {
        heading: 'Always refer when',
        points: [
          'Symptoms are severe, persistent beyond the expected course, or recurrent.',
          'The patient is very young, very old, pregnant, breastfeeding or immunocompromised.',
          'There are red-flag features, or failure of previous appropriate treatment.',
        ],
      },
    ],
    source: 'Community pharmacy practice standards',
  },
  {
    id: 'ops-inventory',
    title: 'Inventory management and stock control',
    category: 'practice',
    aliases: ['stock control', 'reorder level', 'abc analysis', 'fefo', 'stock take', 'inventory'],
    tags: ['pharmacy', 'business', 'inventory', 'management', 'stock'],
    summary: 'Good stock control balances availability against tied-up capital and expiry waste.',
    sections: [
      {
        heading: 'Core calculations',
        points: [
          'Average monthly consumption = total units issued over a period ÷ number of months.',
          'Reorder level = (average daily usage × lead time in days) + safety stock.',
          'Safety stock is typically 25–50% of lead-time demand, higher for unreliable supply.',
          'Months of stock on hand = current stock ÷ average monthly consumption. Aim for 1.5–3 months for fast movers.',
          'Inventory turnover = cost of goods sold ÷ average inventory value. A healthy pharmacy turns stock 6–12 times a year.',
        ],
      },
      {
        heading: 'ABC and VEN analysis',
        points: [
          'A items: roughly 20% of lines that generate about 80% of value — count them monthly and never let them stock out.',
          'B items: moderate value, review quarterly. C items: low value, review twice a year.',
          'VEN: Vital, Essential, Non-essential. Vital items must never run out, whatever their value.',
          'Combine the two: an A-Vital item deserves the tightest control.',
        ],
      },
      {
        heading: 'Expiry control — FEFO',
        points: [
          'First Expired, First Out beats first-in-first-out for medicines.',
          'Place shorter-dated stock at the front and mark it visibly.',
          'Review a report of items expiring within 3 and 6 months every month; negotiate returns, transfer to a busier branch, or promote.',
          'Quarantine expired stock immediately in a clearly marked area and dispose of it through an approved route with documentation.',
        ],
      },
      {
        heading: 'Preventing loss',
        points: [
          'Cycle count continuously rather than relying on one annual stock take.',
          'Investigate every discrepancy above a set threshold; recurring shrinkage on high-value lines usually has a cause.',
          'Reconcile deliveries against the invoice and the order before putting stock away.',
        ],
      },
    ],
    source: 'WHO / MSH Managing Drug Supply',
  },
  {
    id: 'ops-storage',
    title: 'Medicine storage conditions',
    category: 'practice',
    aliases: ['storage', 'cold chain', 'temperature', 'humidity', 'light sensitive'],
    tags: ['pharmacy', 'quality', 'storage', 'cold chain'],
    summary:
      'Storage failures silently destroy potency. Temperature, humidity, light and security all need active control.',
    sections: [
      {
        heading: 'Temperature definitions',
        points: [
          'Cold chain / refrigerated: 2–8 °C — vaccines, insulin, oxytocin, some eye drops, certain antibiotic suspensions after reconstitution.',
          'Cool: 8–15 °C. Room temperature: 15–25 °C. "Do not store above 30 °C" is common in hot climates — take it literally.',
          'Freezing destroys vaccines containing adjuvants, insulin and many biologicals.',
        ],
      },
      {
        heading: 'Practical controls',
        points: [
          'A calibrated thermometer in the fridge and in the dispensary; log temperatures twice daily and keep the log for audit.',
          'Keep relative humidity below 60% where possible; effervescent tablets, dispersible tablets and capsules are particularly hygroscopic.',
          'Store away from direct sunlight; keep light-sensitive products in their original carton.',
          'Never store medicines directly on the floor; use pallets or shelving, and keep a gap from walls for airflow.',
          'Have a written power-failure plan: keep fridges closed, use temperature-monitoring devices, and document any excursion.',
        ],
      },
      {
        heading: 'Special categories',
        points: [
          'Controlled drugs: locked cabinet, fixed to the building, restricted key access, register maintained daily.',
          'Cytotoxics: segregated storage with spill kit available.',
          'Flammables: separate, ventilated, away from ignition sources.',
        ],
      },
    ],
    source: 'WHO good storage and distribution practices',
  },
  {
    id: 'ops-stewardship',
    title: 'Antimicrobial stewardship',
    category: 'guideline',
    aliases: ['amr', 'antibiotic resistance', 'aware', 'stewardship', 'antibiotic use'],
    tags: ['antibiotic', 'resistance', 'guideline', 'public health', 'pharmacy'],
    summary:
      'Practical actions in a pharmacy that slow antimicrobial resistance without denying patients necessary treatment.',
    sections: [
      {
        heading: 'WHO AWaRe classification',
        points: [
          'Access — first-choice agents with narrow spectrum and low resistance potential (amoxicillin, co-trimoxazole, doxycycline, metronidazole, nitrofurantoin). At least 70% of antibiotic use should come from this group.',
          'Watch — higher resistance potential, use for specific indications (azithromycin, ciprofloxacin, ceftriaxone, co-amoxiclav).',
          'Reserve — last resort, hospital and specialist use only (colistin, linezolid, carbapenems of last line).',
        ],
      },
      {
        heading: 'The five stewardship questions before any antibiotic',
        points: [
          'Is this infection likely to be bacterial at all?',
          'Is this the narrowest effective agent for the likely organism and local resistance pattern?',
          'Is the dose high enough and the route appropriate?',
          'Is the duration as short as the evidence allows — most community infections need 3–7 days?',
          'Is there a review or stop date?',
        ],
      },
      {
        heading: 'Pharmacy-specific actions',
        points: [
          'Do not supply antibiotics without a prescription where the law requires one — this is the single biggest driver of community resistance.',
          'Never sell part courses or loose tablets "to try".',
          'Counsel every patient to complete the course exactly as prescribed and never to save leftovers or share them.',
          'Promote vaccination, hand hygiene and safe water as infection prevention.',
          'Audit your own dispensing: what proportion of your antibiotic sales are Access group?',
        ],
      },
    ],
    source: 'WHO AWaRe / Global Action Plan on AMR',
  },
  {
    id: 'ops-pharmacovigilance',
    title: 'Adverse drug reactions and pharmacovigilance',
    category: 'practice',
    aliases: ['adr', 'side effect reporting', 'yellow card', 'pharmacovigilance', 'adverse event'],
    tags: ['safety', 'reporting', 'pharmacy', 'quality'],
    summary:
      'Recognising, managing and reporting adverse drug reactions, and spotting substandard or falsified medicines.',
    sections: [
      {
        heading: 'Classifying reactions',
        points: [
          'Type A (augmented): dose-related, predictable from the pharmacology, common — manage by dose reduction.',
          'Type B (bizarre): not dose-related, unpredictable, often immunological, rarer but more serious — stop the drug.',
          'Also consider chronic, delayed, and end-of-use (withdrawal) reactions.',
        ],
      },
      {
        heading: 'Assessing causality',
        points: [
          'Timing — did the reaction begin after starting the drug and in a plausible window?',
          'Dechallenge — did it improve when the drug was stopped?',
          'Rechallenge — did it recur on restarting (rarely appropriate to test deliberately)?',
          'Alternative explanations — disease progression, another drug, or an intercurrent illness.',
        ],
      },
      {
        heading: 'What and how to report',
        points: [
          'Report all suspected serious reactions, all reactions to newly marketed medicines, and anything unexpected — certainty is not required.',
          'Include: patient details (age, sex, weight), the suspected medicine with batch number, dose and dates, the reaction and its outcome, other medicines, and reporter details.',
          'Report through the national pharmacovigilance centre; reporting is a professional duty, not an accusation.',
        ],
      },
      {
        heading: 'Substandard and falsified medicines',
        points: [
          'Warning signs: unusual packaging or spelling, missing batch number or expiry, tablets of odd colour, smell or friability, unusually low price, unfamiliar supplier.',
          'Quarantine the stock immediately, do not return it to the shelf, and notify the regulator.',
          'Buy only from licensed wholesalers and keep full purchase documentation.',
        ],
      },
    ],
    source: 'WHO pharmacovigilance / Uppsala Monitoring Centre',
  },
  {
    id: 'ops-controlled-drugs',
    title: 'Controlled drugs governance',
    category: 'practice',
    aliases: ['controlled drug register', 'cd register', 'narcotics', 'schedule drugs'],
    tags: ['legal', 'controlled drugs', 'pharmacy', 'governance'],
    summary: 'Legal and practical requirements for handling controlled medicines safely.',
    sections: [
      {
        heading: 'Records and storage',
        points: [
          'Maintain a bound or validated electronic register with a separate page or section per drug and strength, entered on the day of the transaction.',
          'Record date, supplier or patient, quantity received or supplied, running balance and the signature of the responsible person.',
          'Never alter an entry — strike through, initial and date any correction.',
          'Balance checks at agreed intervals (commonly weekly), signed by two people where possible.',
          'Store in a fixed locked cabinet with restricted key access.',
        ],
      },
      {
        heading: 'Recognising misuse and diversion',
        points: [
          'Early or frequent requests, lost prescriptions, multiple prescribers, altered quantities, refusal of generic substitution, insistence on a specific brand and cash payment.',
          'Escalate concerns to the superintendent pharmacist and the prescriber rather than confronting the patient alone.',
          'Balance vigilance with compassion — patients in genuine pain and those with dependence both need care, not judgement.',
        ],
      },
      {
        heading: 'Destruction',
        points: [
          'Expired or returned controlled drugs must be denatured and destroyed in the presence of an authorised witness, with the destruction recorded.',
        ],
      },
    ],
    source: 'National controlled drugs regulations / pharmacy inspectorate guidance',
  },
  {
    id: 'ops-business',
    title: 'Pharmacy business performance and pricing',
    category: 'practice',
    aliases: ['margin', 'markup', 'profit', 'pricing', 'kpi', 'business'],
    tags: ['business', 'finance', 'management', 'pricing', 'pharmacy'],
    summary:
      'The financial measures that tell you whether a pharmacy is healthy, and how to price rationally.',
    sections: [
      {
        heading: 'Margin versus markup',
        points: [
          'Markup % = (selling price − cost) ÷ cost × 100.',
          'Gross margin % = (selling price − cost) ÷ selling price × 100.',
          'A 50% markup is only a 33% margin — confusing the two is the commonest pricing mistake.',
          'To achieve a target margin: selling price = cost ÷ (1 − target margin).',
        ],
      },
      {
        heading: 'Key indicators to watch monthly',
        points: [
          'Gross margin percentage overall and by category.',
          'Inventory turnover and months of stock on hand.',
          'Expiry write-off as a percentage of purchases — aim below 1%.',
          'Stock-out rate on your A-Vital lines.',
          'Average basket value and transactions per day.',
          'Debtor days if you extend credit.',
        ],
      },
      {
        heading: 'Improving performance',
        points: [
          'Rationalise slow-moving lines to release cash; they are the quiet killer of pharmacy liquidity.',
          'Negotiate supplier terms on your top 20 purchase lines — a 2% improvement there beats squeezing everything else.',
          'Grow services (blood pressure checks, blood glucose testing, family planning, adherence support) which carry better margin than boxes.',
          'Track the profit contribution of each category rather than revenue alone.',
        ],
      },
    ],
    source: 'Community pharmacy management practice',
  },
  {
    id: 'ops-ethics',
    title: 'Professional ethics, confidentiality and record keeping',
    category: 'practice',
    aliases: ['ethics', 'confidentiality', 'data protection', 'consent', 'professional conduct'],
    tags: ['legal', 'ethics', 'privacy', 'pharmacy', 'governance'],
    summary:
      'The duties that sit underneath every transaction: confidentiality, consent, competence and honesty.',
    sections: [
      {
        heading: 'Confidentiality',
        points: [
          'Patient information is disclosed only with consent, or where the law requires it, or where there is a serious risk of harm.',
          'Conduct sensitive conversations in a private area — HIV, contraception, mental health and substance use especially.',
          'Keep screens turned away from the counter and never leave records visible.',
          'Do not discuss patients on social media or messaging groups, even anonymously.',
        ],
      },
      {
        heading: 'Consent and capacity',
        points: [
          'Consent must be informed, voluntary and given by someone with capacity.',
          'A competent adult may refuse treatment even when that refusal seems unwise.',
          'For children, follow the local age of consent and assess understanding individually.',
        ],
      },
      {
        heading: 'Records and data protection',
        points: [
          'Keep patient medication records accurate, current and secure, with access limited to those who need it.',
          'Retain records for the period required by national law.',
          'Have a written policy for data breaches and report them promptly.',
        ],
      },
      {
        heading: 'Professional conduct',
        points: [
          'Practise within your competence and refer when you are beyond it.',
          'Be candid when something goes wrong — apologise, explain and put it right.',
          'Maintain continuing professional development and keep your registration current.',
        ],
      },
    ],
    source: 'FIP / national pharmacy council codes of conduct',
  },
  {
    id: 'ops-waste',
    title: 'Pharmaceutical waste and sharps disposal',
    category: 'practice',
    aliases: ['waste disposal', 'sharps', 'expired medicines disposal', 'incineration'],
    tags: ['safety', 'environment', 'pharmacy', 'disposal'],
    summary:
      'Safe segregation and disposal of expired, returned and hazardous pharmaceutical waste.',
    sections: [
      {
        heading: 'Segregation',
        points: [
          'Non-hazardous pharmaceutical waste, cytotoxic waste, controlled drugs, sharps and infectious waste each need separate, clearly labelled containers.',
          'Sharps go into rigid puncture-proof containers, sealed at three quarters full.',
        ],
      },
      {
        heading: 'Disposal rules',
        points: [
          'Never flush medicines down the sink or toilet, and never put them in general refuse where they can be scavenged and resold.',
          'Use an authorised waste contractor and keep consignment documentation.',
          'High-temperature incineration is the preferred route for most pharmaceutical waste; encapsulation or inertisation are accepted alternatives.',
          'Controlled drugs must be denatured before disposal, witnessed and recorded.',
        ],
      },
      {
        heading: 'Take-back',
        points: [
          'Encourage patients to return unused medicines rather than keeping or sharing them, and log returns before destruction.',
        ],
      },
    ],
    source: 'WHO safe management of health-care waste',
  },
  {
    id: 'ops-gidi-app',
    title: 'Using GiDi — inventory, sales, analytics and reports',
    category: 'practice',
    aliases: ['gidi', 'app help', 'how to use', 'add medication', 'record sale', 'join code'],
    tags: ['app', 'workflow', 'help', 'gidi', 'software'],
    summary: 'How the GiDi pharmacy management app itself works, on both web and mobile.',
    sections: [
      {
        heading: 'Inventory',
        points: [
          'Add a medicine with its name, generic name, category, unit price, cost price, stock quantity, reorder level and expiry date.',
          'The reorder level drives the low-stock warnings on the dashboard, so set it to roughly your lead-time demand plus a safety buffer.',
          'Expiry dates power the expiring-soon list — record them accurately to make FEFO work.',
        ],
      },
      {
        heading: 'Sales',
        points: [
          'Record a sale by adding line items; stock quantities are reduced automatically.',
          'Each sale stores the medication name, quantity, unit price and line subtotal, so historical receipts remain accurate even if a price later changes.',
        ],
      },
      {
        heading: 'Analytics and reports',
        points: [
          'The dashboard summarises stock value, low stock, expiring items and recent sales.',
          'Analytics shows revenue and units over your chosen period and highlights top-performing medicines.',
          'Reports produce printable sales, inventory and summary statements, and can be downloaded as CSV.',
        ],
      },
      {
        heading: 'Team and access',
        points: [
          'The pharmacy owner is the admin. Generate a join code from Settings and share it with staff so they can join the same pharmacy.',
          'Staff see the same inventory and can record sales; admin controls the join code and staff list.',
          'Appearance, language, country and currency are set per user in Settings and follow the account across web and mobile.',
        ],
      },
      {
        heading: 'Azara',
        points: [
          'Azara answers from a built-in pharmacy reference library that ships with the app, so it works without any external AI service.',
          'It is a reference lookup tool for qualified professionals — it does not diagnose patients, does not prescribe, and does not replace the supervising pharmacist.',
          'It is aware of your current stock, so it can tell you whether you have a suitable item on the shelf.',
          'Rate an answer to help it improve, and add your own notes to the reference library from the Azara knowledge panel.',
        ],
      },
    ],
    source: 'GiDi product documentation',
  },
];
