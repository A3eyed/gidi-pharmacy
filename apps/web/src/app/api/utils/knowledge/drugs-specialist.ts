import type { KnowledgeEntry } from './types';

/**
 * Anticoagulants, analgesic opioids, mental-health medicines, contraception,
 * HIV/TB therapy, obstetric emergency drugs and symptomatic OTC products.
 */
export const SPECIALIST_DRUGS: KnowledgeEntry[] = [
  {
    id: 'drug-warfarin',
    title: 'Warfarin',
    category: 'drug',
    aliases: ['coumadin', 'warfarin sodium', 'inr tablet'],
    tags: ['anticoagulant', 'inr', 'blood thinner', 'dvt', 'atrial fibrillation'],
    summary:
      'Vitamin K antagonist requiring INR monitoring. Used for atrial fibrillation, venous thromboembolism and mechanical heart valves.',
    sections: [
      {
        heading: 'Dosing and monitoring',
        points: [
          'Typical maintenance 3–9 mg once daily, always taken at the same time (commonly 6 pm).',
          'Target INR 2.0–3.0 for AF and venous thromboembolism; 2.5–3.5 for mechanical mitral valves.',
          'Check INR frequently at initiation, then up to every 12 weeks once stable.',
        ],
      },
      {
        heading: 'High-risk interactions',
        points: [
          'INR increased by: metronidazole, co-trimoxazole, fluconazole, ciprofloxacin, macrolides, amiodarone, NSAIDs, high-dose paracetamol, cranberry juice, alcohol binges.',
          'INR decreased by: rifampicin, carbamazepine, phenytoin, St John\u2019s wort, large increases in green leafy vegetables.',
          'Any new medicine — including herbal products — needs an INR check within a week.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'Keep vitamin K intake steady rather than avoiding greens altogether.',
          'Carry an anticoagulant alert card and show it before any dental or surgical procedure.',
          'Report bleeding gums, nosebleeds that will not stop, blood in urine or stool, or an unusually heavy period.',
          'Never double up a missed dose; record it and tell the anticoagulation clinic.',
        ],
      },
      {
        heading: 'Contraindications',
        points: [
          'Pregnancy (teratogenic — use low-molecular-weight heparin instead), active bleeding, severe hypertension, recent haemorrhagic stroke.',
        ],
      },
    ],
    redFlags: [
      'Head injury on warfarin, black stools, coughing or vomiting blood, sudden severe headache.',
    ],
    source: 'BNF / anticoagulation service protocols',
  },
  {
    id: 'drug-antiplatelet-doac',
    title: 'Clopidogrel and direct oral anticoagulants',
    category: 'drug',
    aliases: ['clopidogrel', 'plavix', 'rivaroxaban', 'apixaban', 'doac', 'xarelto', 'eliquis'],
    tags: ['antiplatelet', 'anticoagulant', 'stroke prevention', 'stent'],
    summary:
      'Clopidogrel prevents arterial thrombosis after stroke, MI or stenting. DOACs are fixed-dose alternatives to warfarin that need no INR monitoring.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Clopidogrel 75 mg once daily, with a 300–600 mg loading dose in acute coronary syndrome.',
          'Rivaroxaban 20 mg once daily with food for AF (15 mg if creatinine clearance 15–49).',
          'Apixaban 5 mg twice daily, reduced to 2.5 mg twice daily if two of: age ≥80, weight ≤60 kg, creatinine ≥133 micromol/L.',
        ],
      },
      {
        heading: 'Key safety points',
        points: [
          'Do not stop dual antiplatelet therapy after a recent stent without cardiology advice — stent thrombosis is often fatal.',
          'Omeprazole and esomeprazole reduce clopidogrel activation; use pantoprazole.',
          'DOACs are contraindicated in mechanical heart valves and severe renal impairment; check renal function at least annually.',
          'Rivaroxaban must be taken with food for reliable absorption.',
        ],
      },
    ],
    source: 'BNF / ESC guidance',
  },
  {
    id: 'drug-tramadol-opioids',
    title: 'Tramadol, codeine and morphine',
    category: 'drug',
    aliases: ['tramadol', 'codeine', 'morphine', 'opioid', 'pethidine', 'oramorph'],
    tags: ['analgesic', 'opioid', 'pain', 'controlled drug', 'palliative'],
    summary:
      'Opioid analgesics for moderate to severe pain. Controlled medicines with real dependence, respiratory depression and diversion risk — dispensing discipline matters.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Tramadol 50–100 mg every 4–6 hours, maximum 400 mg/day (300 mg in the elderly).',
          'Codeine 30–60 mg every 4–6 hours, maximum 240 mg/day; usually combined with paracetamol.',
          'Oral morphine: start 5–10 mg every 4 hours in opioid-naive adults, with a breakthrough dose of one sixth of the 24-hour total.',
          'Always co-prescribe a stimulant laxative — opioid constipation does not resolve with tolerance.',
        ],
      },
      {
        heading: 'Cautions',
        points: [
          'Respiratory depression risk rises sharply with benzodiazepines, alcohol, gabapentinoids or sedating antihistamines.',
          'Tramadol lowers the seizure threshold and can cause serotonin syndrome with SSRIs, SNRIs, tricyclics or linezolid.',
          'Codeine is contraindicated in children under 12 and in breastfeeding mothers (ultra-rapid metabolisers).',
          'Renal impairment prolongs morphine metabolites — reduce dose and lengthen the interval.',
        ],
      },
      {
        heading: 'Dispensing and control',
        points: [
          'Record controlled drug supplies in the controlled drugs register on the day of the transaction, with running balance.',
          'Store in a locked cabinet fixed to the structure, with key control limited to the pharmacist.',
          'Watch for early requests, multiple prescribers, altered quantities and cash-only pressure — these are diversion signals.',
        ],
      },
      {
        heading: 'Overdose recognition',
        points: [
          'Pinpoint pupils, respiratory rate under 8, unrousable drowsiness.',
          'Give naloxone 400 micrograms IM or IV and repeat as needed; its action is shorter than most opioids so the patient must be observed.',
        ],
      },
    ],
    redFlags: [
      'Any opioid user found drowsy with slow, shallow breathing — treat as overdose and call for emergency help.',
    ],
    source: 'BNF / WHO analgesic ladder',
  },
  {
    id: 'drug-contraception',
    title: 'Contraception and emergency contraception',
    category: 'drug',
    aliases: [
      'levonorgestrel',
      'postinor',
      'plan b',
      'combined pill',
      'coc',
      'pop',
      'depo provera',
      'ulipristal',
      'ella',
    ],
    tags: ['family planning', 'contraception', 'emergency pill', 'reproductive health'],
    summary:
      'Hormonal contraceptive options and the emergency contraception consultation, which is one of the most common pharmacy interactions.',
    sections: [
      {
        heading: 'Emergency contraception',
        points: [
          'Levonorgestrel 1.5 mg as a single dose, as soon as possible and within 72 hours — efficacy falls with every hour of delay.',
          'Ulipristal acetate 30 mg is effective up to 120 hours and is more effective than levonorgestrel around ovulation.',
          'A copper IUD within 120 hours is the most effective option of all.',
          'Double the levonorgestrel dose to 3 mg if BMI is over 26 or weight over 70 kg, or use ulipristal.',
          'If vomiting occurs within 3 hours, repeat the dose.',
        ],
      },
      {
        heading: 'Combined oral contraceptive',
        points: [
          'One tablet daily for 21 days followed by a 7-day break, or continuous use with a shortened break.',
          'Missing one pill: take it as soon as remembered and continue. Missing two or more in week 1 or 3 requires additional precautions for 7 days and possibly emergency contraception.',
          'Absolute contraindications: migraine with aura, history of VTE, uncontrolled hypertension, smoking over age 35, breastfeeding under 6 weeks postpartum, known thrombophilia, breast cancer.',
        ],
      },
      {
        heading: 'Progestogen-only options',
        points: [
          'POP: taken at the same time every day; the traditional window is 3 hours, desogestrel allows 12.',
          'Depot medroxyprogesterone acetate 150 mg IM every 12 weeks — delays return of fertility and can reduce bone density with long use.',
          'Implants and IUDs are the most effective reversible methods.',
        ],
      },
      {
        heading: 'Interactions',
        points: [
          'Enzyme inducers (rifampicin, carbamazepine, phenytoin, St John\u2019s wort, some ARVs) reduce contraceptive efficacy — an additional or alternative method is needed.',
          'Emergency levonorgestrel is also weakened by enzyme inducers; double the dose or use a copper IUD.',
        ],
      },
      {
        heading: 'Consultation points',
        points: [
          'Always offer a pregnancy test where the last menstrual period is uncertain, discuss ongoing contraception, and offer STI screening.',
          'Keep the consultation private and non-judgemental, and check safeguarding concerns in young or vulnerable clients.',
        ],
      },
    ],
    source: 'FSRH / WHO Medical Eligibility Criteria',
  },
  {
    id: 'drug-arv',
    title: 'Antiretroviral therapy (HIV)',
    category: 'drug',
    aliases: [
      'arv',
      'art',
      'tld',
      'dolutegravir',
      'tenofovir',
      'lamivudine',
      'efavirenz',
      'hiv medicine',
    ],
    tags: ['hiv', 'antiretroviral', 'adherence', 'infectious disease'],
    summary:
      'Modern first-line therapy is a single daily fixed-dose tablet of tenofovir, lamivudine and dolutegravir (TLD). Adherence above 95% is the determinant of success.',
    sections: [
      {
        heading: 'Regimens',
        points: [
          'First line (adults and adolescents): TDF 300 mg + 3TC 300 mg + DTG 50 mg, one tablet once daily.',
          'Dolutegravir may be taken with or without food and has a high barrier to resistance.',
          'Co-trimoxazole prophylaxis is added when CD4 is low or per national protocol.',
        ],
      },
      {
        heading: 'Counselling and adherence',
        points: [
          'Take at the same time every day; set an alarm and link it to a daily routine.',
          'Undetectable equals untransmittable — sustained viral suppression prevents sexual transmission.',
          'Never stop abruptly or share tablets; a treatment interruption risks resistance.',
          'Expect a modest weight gain with dolutegravir and monitor it.',
        ],
      },
      {
        heading: 'Interactions',
        points: [
          'Dolutegravir must be separated from polyvalent cations — take it 2 hours before, or 6 hours after, antacids, calcium, iron or magnesium; or take together with a meal.',
          'Rifampicin requires dolutegravir 50 mg twice daily.',
          'Metformin levels rise with dolutegravir — cap the metformin dose.',
        ],
      },
      {
        heading: 'Confidentiality',
        points: [
          'Dispense in a private area, label discreetly if requested, and never disclose status to family members without consent.',
        ],
      },
    ],
    source: 'WHO consolidated HIV guidelines',
  },
  {
    id: 'drug-tb',
    title: 'Anti-tuberculosis therapy (RHZE)',
    category: 'drug',
    aliases: ['rifampicin', 'isoniazid', 'pyrazinamide', 'ethambutol', 'tb drugs', 'rhze', 'dots'],
    tags: ['tuberculosis', 'tb', 'infectious disease', 'dots'],
    summary:
      'Standard drug-sensitive TB treatment is 2 months of rifampicin, isoniazid, pyrazinamide and ethambutol, followed by 4 months of rifampicin and isoniazid.',
    sections: [
      {
        heading: 'Regimen',
        points: [
          'Intensive phase: 2 months of RHZE, dosed by weight band using fixed-dose combinations.',
          'Continuation phase: 4 months of RH.',
          'Pyridoxine (vitamin B6) 25 mg daily is added to prevent isoniazid peripheral neuropathy.',
          'Directly observed therapy improves completion and prevents resistance.',
        ],
      },
      {
        heading: 'Key toxicities',
        points: [
          'Hepatotoxicity from isoniazid, rifampicin and pyrazinamide — stop and test LFTs if jaundice, persistent vomiting or right upper quadrant pain appear.',
          'Ethambutol: optic neuritis — check colour vision and warn about any visual change.',
          'Isoniazid: peripheral neuropathy, prevented by pyridoxine.',
          'Rifampicin: orange-red discoloration of urine, tears and sweat — harmless but must be explained, and it stains soft contact lenses.',
        ],
      },
      {
        heading: 'Interactions',
        points: [
          'Rifampicin is a powerful enzyme inducer: it reduces the effect of hormonal contraception, warfarin, ARVs, corticosteroids, azoles and many others.',
        ],
      },
    ],
    redFlags: [
      'Jaundice, persistent vomiting, or visual change during TB therapy — stop and refer the same day.',
    ],
    source: 'WHO TB treatment guidelines',
  },
  {
    id: 'drug-mental-health',
    title: 'Antidepressants and anxiolytics',
    category: 'drug',
    aliases: [
      'fluoxetine',
      'sertraline',
      'amitriptyline',
      'diazepam',
      'ssri',
      'antidepressant',
      'valium',
    ],
    tags: ['mental health', 'depression', 'anxiety', 'insomnia', 'psychiatry'],
    summary:
      'SSRIs are first-line for depression and anxiety disorders; tricyclics are used at low dose for neuropathic pain; benzodiazepines are for short-term crisis use only.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Fluoxetine 20 mg once daily in the morning; sertraline 50 mg daily, titrated to 100–200 mg.',
          'Amitriptyline 10–25 mg at night for neuropathic pain, titrated slowly; antidepressant doses are much higher and specialist-led.',
          'Diazepam 2–5 mg for acute anxiety, for no more than 2–4 weeks including the taper.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'SSRIs take 2–4 weeks to show benefit and 6–8 weeks for full effect; nausea and restlessness in the first fortnight usually settle.',
          'Continue for at least 6 months after recovery to prevent relapse.',
          'Do not stop suddenly — taper to avoid discontinuation symptoms (dizziness, electric-shock sensations, irritability).',
          'Monitor young adults closely in the first weeks for increased agitation or suicidal thoughts.',
        ],
      },
      {
        heading: 'Interactions and cautions',
        points: [
          'Serotonin syndrome: SSRI plus tramadol, linezolid, triptans, St John\u2019s wort or another serotonergic agent — agitation, tremor, hyperthermia, clonus.',
          'SSRIs plus NSAIDs or anticoagulants increase GI bleeding risk.',
          'Amitriptyline: anticholinergic effects, QT prolongation and dangerous in overdose.',
          'Benzodiazepines: dependence, falls in the elderly, and fatal respiratory depression with opioids.',
        ],
      },
    ],
    redFlags: [
      'Active suicidal ideation with a plan — arrange immediate mental health assessment, do not simply dispense.',
    ],
    source: 'BNF / WHO mhGAP',
  },
  {
    id: 'drug-antiemetics',
    title: 'Antiemetics (metoclopramide, promethazine, ondansetron)',
    category: 'drug',
    aliases: [
      'metoclopramide',
      'plasil',
      'promethazine',
      'ondansetron',
      'zofran',
      'antiemetic',
      'vomiting medicine',
    ],
    tags: ['nausea', 'vomiting', 'pregnancy', 'motion sickness'],
    summary:
      'Choice of antiemetic depends on cause: prokinetic for gastric stasis, antihistamine for motion sickness and pregnancy, 5HT3 antagonist for chemotherapy and severe vomiting.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Metoclopramide 10 mg up to three times daily, maximum 5 days.',
          'Promethazine 25 mg at night, effective in motion sickness and morning sickness.',
          'Ondansetron 4–8 mg every 8 hours.',
          'Pregnancy: pyridoxine, doxylamine or promethazine first; ondansetron only after specialist assessment.',
        ],
      },
      {
        heading: 'Cautions',
        points: [
          'Metoclopramide causes extrapyramidal reactions, especially in young women and children — avoid under 20 years except in specific indications, and limit to 5 days.',
          'Ondansetron prolongs QT and causes constipation.',
          'Treat the cause: persistent vomiting needs assessment, not just suppression.',
        ],
      },
    ],
    redFlags: [
      'Vomiting with severe abdominal pain, blood, green bile, head injury, or signs of dehydration — refer.',
    ],
    source: 'BNF',
  },
  {
    id: 'drug-cough-cold',
    title: 'Cough and cold preparations',
    category: 'drug',
    aliases: [
      'cough syrup',
      'dextromethorphan',
      'guaifenesin',
      'bromhexine',
      'linctus',
      'decongestant',
      'pseudoephedrine',
    ],
    tags: ['cough', 'cold', 'otc', 'symptomatic relief', 'catarrh'],
    summary:
      'Symptomatic OTC products with modest evidence. Correct selection and firm safety limits matter more than the specific brand.',
    sections: [
      {
        heading: 'Choosing a product',
        points: [
          'Dry, tickly cough: a suppressant such as dextromethorphan, or simple linctus.',
          'Productive cough: an expectorant such as guaifenesin, plus fluids and steam.',
          'Nasal congestion: a short course of a topical decongestant (maximum 5–7 days to avoid rebound congestion) or saline irrigation.',
          'Honey and warm fluids are effective and safe in children over 1 year.',
        ],
      },
      {
        heading: 'Safety limits',
        points: [
          'Do not give OTC cough and cold medicines to children under 6 years; use them with caution from 6–12.',
          'Never combine two products containing paracetamol.',
          'Oral decongestants raise blood pressure — avoid in hypertension, ischaemic heart disease, hyperthyroidism, and with MAOIs.',
          'Codeine-containing linctus has significant abuse potential; monitor repeat purchasers.',
        ],
      },
      {
        heading: 'When to refer',
        points: [
          'Cough lasting more than 3 weeks, blood in the sputum, drenching night sweats, unintentional weight loss — screen for tuberculosis.',
          'Breathlessness, chest pain, high fever or a new wheeze.',
        ],
      },
    ],
    redFlags: [
      'Chronic cough over 2–3 weeks with night sweats or weight loss — refer for TB screening.',
    ],
    source: 'BNF / national OTC guidance',
  },
  {
    id: 'drug-obstetric-emergency',
    title: 'Obstetric emergency medicines (oxytocin, misoprostol, magnesium sulfate)',
    category: 'drug',
    aliases: [
      'oxytocin',
      'misoprostol',
      'magnesium sulphate',
      'magnesium sulfate',
      'pph',
      'eclampsia',
    ],
    tags: ['maternal health', 'obstetric', 'emergency', 'postpartum haemorrhage', 'pre-eclampsia'],
    summary:
      'The three medicines that prevent most maternal deaths from haemorrhage and eclampsia. Storage and dose accuracy are critical.',
    sections: [
      {
        heading: 'Postpartum haemorrhage',
        points: [
          'Oxytocin 10 IU IM is the standard prophylactic uterotonic in the third stage of labour.',
          'Treatment: oxytocin 10 IU IM/IV plus uterine massage; add misoprostol 800 micrograms sublingual where oxytocin is unavailable.',
          'Tranexamic acid 1 g IV within 3 hours of onset reduces mortality.',
          'Oxytocin must be kept at 2–8 °C; heat-degraded oxytocin is a known cause of treatment failure.',
        ],
      },
      {
        heading: 'Severe pre-eclampsia and eclampsia',
        points: [
          'Magnesium sulfate loading dose 4 g IV over 20 minutes plus 10 g IM (5 g in each buttock), then 5 g IM every 4 hours for 24 hours.',
          'Monitor for toxicity before each dose: patellar reflexes present, respiratory rate above 16, urine output above 30 mL/hour.',
          'Antidote: calcium gluconate 1 g IV slowly.',
          'Control blood pressure with labetalol, nifedipine or hydralazine; definitive treatment is delivery.',
        ],
      },
    ],
    redFlags: [
      'Convulsion in pregnancy or within 6 weeks postpartum — treat as eclampsia and transfer urgently.',
    ],
    source: 'WHO recommendations on PPH and pre-eclampsia',
  },
  {
    id: 'drug-vaccines',
    title: 'Vaccines and the cold chain',
    category: 'drug',
    aliases: ['vaccine', 'immunisation', 'epi', 'cold chain', 'bcg', 'measles vaccine', 'tetanus'],
    tags: ['immunisation', 'prevention', 'public health', 'cold chain', 'child health'],
    summary:
      'Routine immunisation schedules and the cold-chain discipline that keeps vaccines potent.',
    sections: [
      {
        heading: 'Typical EPI schedule',
        points: [
          'Birth: BCG and OPV-0 (and hepatitis B birth dose where used).',
          '6, 10 and 14 weeks: pentavalent (DTP-HepB-Hib), OPV, pneumococcal, rotavirus (6 and 10 weeks).',
          '9 months: measles-rubella 1 and yellow fever.',
          '18 months: measles-rubella 2 and a meningococcal dose where indicated.',
          'Tetanus-diphtheria doses in pregnancy per national schedule.',
        ],
      },
      {
        heading: 'Cold chain rules',
        points: [
          'Store most vaccines at 2–8 °C; OPV may be frozen, but never freeze DTP-containing, hepatitis B, pentavalent or tetanus vaccines.',
          'Record fridge temperature twice daily and keep the log.',
          'Read the vaccine vial monitor before use and discard if the inner square is as dark as or darker than the outer ring.',
          'Keep vaccines in the middle of the fridge, never in the door, and use water bottles to stabilise temperature.',
          'Follow the multi-dose vial policy and discard reconstituted BCG and measles vaccine within 6 hours.',
        ],
      },
      {
        heading: 'Anaphylaxis readiness',
        points: [
          'Every immunisation session must have adrenaline 1:1000, syringes and an observation area available.',
          'Observe recipients for 15 minutes after vaccination.',
        ],
      },
    ],
    source: 'WHO EPI / national immunisation programme',
  },
];
