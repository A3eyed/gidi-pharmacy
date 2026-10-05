import type { KnowledgeEntry } from './types';

/**
 * Emergency procedures, nursing standards and hospital workflows — the
 * bedside knowledge a nurse, prescriber or clinical pharmacist relies on.
 */
export const CLINICAL_PRACTICE: KnowledgeEntry[] = [
  {
    id: 'em-anaphylaxis',
    title: 'Anaphylaxis',
    category: 'emergency',
    aliases: ['allergic reaction severe', 'adrenaline', 'epinephrine', 'epipen'],
    tags: ['emergency', 'allergy', 'adrenaline', 'resuscitation'],
    summary:
      'Life-threatening systemic hypersensitivity. Adrenaline given early into the thigh is the only treatment that changes the outcome.',
    sections: [
      {
        heading: 'Recognition',
        points: [
          'Sudden onset, usually within minutes of exposure, with Airway, Breathing or Circulation compromise.',
          'Airway: swelling of tongue, lips or throat, hoarseness, stridor.',
          'Breathing: wheeze, severe breathlessness, cyanosis.',
          'Circulation: hypotension, tachycardia, pallor, collapse.',
          'Skin changes (urticaria, flushing) occur in most but not all cases and are not required for the diagnosis.',
        ],
      },
      {
        heading: 'Immediate treatment',
        points: [
          'Remove the trigger, call for help and lie the patient flat with the legs raised (sitting up only if breathing is difficult; never stand them up).',
          'Adrenaline 1:1000 intramuscularly into the anterolateral thigh — adults and children over 12: 500 micrograms (0.5 mL); 6–12 years: 300 micrograms; under 6: 150 micrograms.',
          'Repeat every 5 minutes if there is no improvement.',
          'High-flow oxygen and a rapid IV fluid bolus (crystalloid 500–1000 mL in adults, 10 mL/kg in children).',
          'Antihistamines and steroids are second-line and must never delay adrenaline.',
        ],
      },
      {
        heading: 'After the event',
        points: [
          'Observe for 6–12 hours because of the risk of a biphasic reaction.',
          'Prescribe two adrenaline auto-injectors, teach the technique, and refer to allergy services.',
          'Document the trigger clearly in the record and on any allergy alert.',
        ],
      },
    ],
    redFlags: [
      'Any airway swelling or hypotension after an exposure — give adrenaline immediately, do not wait.',
    ],
    source: 'Resuscitation Council / WHO',
  },
  {
    id: 'em-sepsis',
    title: 'Sepsis recognition and the first hour',
    category: 'emergency',
    aliases: ['septic shock', 'sepsis six', 'qsofa', 'blood infection'],
    tags: ['emergency', 'infection', 'critical care', 'antibiotics'],
    summary:
      'Life-threatening organ dysfunction from a dysregulated response to infection. Mortality rises with every hour antibiotics are delayed.',
    sections: [
      {
        heading: 'Recognition',
        points: [
          'qSOFA: respiratory rate ≥22, altered mentation, systolic BP ≤100 mmHg. Two or more suggests high risk.',
          'Other warning signs: temperature above 38 or below 36 °C, heart rate over 90, mottled skin, reduced urine output, non-blanching rash.',
          'Children and older adults may deteriorate without fever.',
        ],
      },
      {
        heading: 'The Sepsis Six — within one hour',
        points: [
          'Give high-flow oxygen.',
          'Take blood cultures (and other relevant cultures) before antibiotics if that does not cause delay.',
          'Give IV broad-spectrum antibiotics per local protocol.',
          'Give IV fluids — 30 mL/kg crystalloid for hypotension or lactate above 4.',
          'Measure serum lactate.',
          'Measure hourly urine output.',
        ],
      },
      {
        heading: 'Ongoing care',
        points: [
          'Reassess after each fluid bolus; vasopressors if hypotension persists.',
          'Find and control the source — abscess drainage, device removal, surgery.',
          'De-escalate antibiotics once cultures return.',
        ],
      },
    ],
    redFlags: [
      'Any infection with confusion, low blood pressure, fast breathing or reduced urine output.',
    ],
    source: 'Surviving Sepsis Campaign',
  },
  {
    id: 'em-bls',
    title: 'Basic life support and CPR',
    category: 'emergency',
    aliases: ['cpr', 'bls', 'cardiac arrest', 'resuscitation', 'aed'],
    tags: ['emergency', 'resuscitation', 'cardiac arrest'],
    summary:
      'High-quality chest compressions with minimal interruption, plus early defibrillation, are what restore circulation.',
    sections: [
      {
        heading: 'Adult sequence',
        points: [
          'Check danger, response, and breathing for no more than 10 seconds — agonal gasps are not normal breathing.',
          'Call for help and an AED.',
          'Compressions at the centre of the chest, depth 5–6 cm, rate 100–120 per minute, allowing full recoil.',
          '30 compressions to 2 rescue breaths; compression-only CPR if unwilling or unable to give breaths.',
          'Attach the AED as soon as it arrives and follow its prompts; resume compressions immediately after any shock.',
          'Change the compressor every 2 minutes to prevent fatigue.',
        ],
      },
      {
        heading: 'Paediatric differences',
        points: [
          'Give 5 initial rescue breaths before starting compressions.',
          'Ratio 15:2 for healthcare responders.',
          'Compress to one third of chest depth: two fingers or two thumbs in infants, one or two hands in children.',
        ],
      },
      {
        heading: 'Choking',
        points: [
          'Effective cough: encourage coughing. Ineffective and conscious: 5 back blows then 5 abdominal thrusts, alternating.',
          'Infants: 5 back blows then 5 chest thrusts; never abdominal thrusts.',
          'If the person becomes unresponsive, start CPR.',
        ],
      },
    ],
    source: 'Resuscitation Council / AHA guidelines',
  },
  {
    id: 'nurse-vitals',
    title: 'Vital signs and early warning scores',
    category: 'nursing',
    aliases: ['observations', 'obs', 'news2', 'temperature', 'pulse', 'respiratory rate'],
    tags: ['nursing', 'monitoring', 'deterioration', 'assessment'],
    summary: 'Normal ranges and the deterioration thresholds that should trigger escalation.',
    sections: [
      {
        heading: 'Adult normal ranges',
        points: [
          'Temperature 36.1–37.2 °C.',
          'Pulse 60–100 beats per minute.',
          'Respiratory rate 12–20 per minute — the single most sensitive early sign of deterioration and the one most often not counted.',
          'Blood pressure around 120/80; systolic below 90 is concerning.',
          'Oxygen saturation 95–100% (88–92% target in chronic CO2 retention).',
          'Blood glucose 4–7 mmol/L fasting.',
        ],
      },
      {
        heading: 'Paediatric ranges',
        points: [
          'Infant under 1 year: pulse 110–160, respiratory rate 30–40.',
          '1–5 years: pulse 95–140, respiratory rate 25–30.',
          '5–12 years: pulse 80–120, respiratory rate 20–25.',
          'Hypotension in a child is a late and ominous sign.',
        ],
      },
      {
        heading: 'Escalation',
        points: [
          'Use a structured early warning score at every set of observations and escalate according to the score, not on impression alone.',
          'Any single extreme parameter warrants immediate senior review regardless of total score.',
          'Trends matter more than single values — rising respiratory rate and falling urine output precede collapse.',
        ],
      },
    ],
    source: 'NEWS2 / paediatric early warning systems',
  },
  {
    id: 'nurse-medication-admin',
    title: 'Safe medication administration',
    category: 'nursing',
    aliases: ['rights of medication', 'five rights', 'drug administration', 'medication error'],
    tags: ['nursing', 'safety', 'administration', 'error prevention'],
    summary:
      'The verification discipline that prevents medication error, plus the high-alert medicines that demand independent double checking.',
    sections: [
      {
        heading: 'The rights of administration',
        points: [
          'Right patient — two identifiers, never the bed number.',
          'Right drug — check the label against the chart three times.',
          'Right dose — recalculate weight-based doses independently.',
          'Right route, right time, right documentation.',
          'Plus: right reason, right response, and the patient\u2019s right to refuse.',
        ],
      },
      {
        heading: 'High-alert medicines',
        points: [
          'Insulin, heparin and other anticoagulants, concentrated electrolytes (especially potassium chloride), opioids, chemotherapy, and neuromuscular blockers.',
          'Require an independent second check by a second qualified professional.',
          'Never store concentrated potassium chloride on open wards; it must always be diluted.',
          'Write "units" in full for insulin — never "U".',
        ],
      },
      {
        heading: 'If an error occurs',
        points: [
          'Assess and stabilise the patient first, then inform the prescriber and the person in charge.',
          'Document factually, complete an incident report, and be open with the patient.',
          'Treat the report as system learning, not individual blame.',
        ],
      },
    ],
    source: 'WHO Medication Without Harm / ISMP',
  },
  {
    id: 'nurse-ipc',
    title: 'Infection prevention and control',
    category: 'nursing',
    aliases: ['hand hygiene', 'ipc', 'ppe', 'isolation', 'sterilisation', 'infection control'],
    tags: ['nursing', 'hygiene', 'safety', 'hospital'],
    summary:
      'Standard precautions applied to every patient, every time, plus transmission-based precautions where indicated.',
    sections: [
      {
        heading: 'Five moments for hand hygiene',
        points: [
          'Before touching a patient.',
          'Before a clean or aseptic procedure.',
          'After body fluid exposure risk.',
          'After touching a patient.',
          'After touching patient surroundings.',
          'Alcohol rub for 20–30 seconds, or soap and water for 40–60 seconds when hands are visibly soiled or after C. difficile contact.',
        ],
      },
      {
        heading: 'PPE sequence',
        points: [
          'Donning: hand hygiene, gown, mask or respirator, eye protection, gloves.',
          'Doffing: gloves, hand hygiene, eye protection, gown, mask, hand hygiene — the order prevents self-contamination.',
        ],
      },
      {
        heading: 'Transmission-based precautions',
        points: [
          'Contact (C. difficile, MRSA, scabies): gloves and gown, dedicated equipment.',
          'Droplet (influenza, pertussis, meningococcus): surgical mask within 1–2 metres.',
          'Airborne (TB, measles, varicella): N95/FFP2 respirator and a negative-pressure or well-ventilated room.',
        ],
      },
      {
        heading: 'Sharps and decontamination',
        points: [
          'Never recap needles; dispose at the point of use in a puncture-proof container filled no more than three quarters.',
          'Needlestick injury: encourage bleeding, wash with soap and water, report immediately, and assess for HIV/hepatitis post-exposure prophylaxis within hours.',
          'Clean before disinfecting; sterilise all critical items that enter sterile tissue.',
        ],
      },
    ],
    source: 'WHO IPC core components',
  },
  {
    id: 'nurse-iv-fluids',
    title: 'IV fluids and rehydration',
    category: 'nursing',
    aliases: ['normal saline', 'ringers lactate', 'dextrose', 'fluid therapy', 'drip'],
    tags: ['nursing', 'fluids', 'resuscitation', 'dehydration'],
    summary:
      'Choosing the right fluid, in the right volume, for resuscitation, replacement and maintenance.',
    sections: [
      {
        heading: 'Common fluids',
        points: [
          '0.9% sodium chloride: resuscitation and replacement; large volumes cause hyperchloraemic acidosis.',
          'Ringer\u2019s lactate / Hartmann\u2019s: balanced crystalloid, preferred for most resuscitation and in trauma or burns.',
          '5% dextrose: free water, for maintenance or hypoglycaemia — never for resuscitation.',
          'Dextrose-saline: maintenance in children with added potassium as prescribed.',
        ],
      },
      {
        heading: 'Volumes',
        points: [
          'Adult resuscitation: 500 mL crystalloid over 15 minutes, reassess, repeat as needed.',
          'Paediatric resuscitation: 10–20 mL/kg boluses with reassessment after each.',
          'Maintenance (Holliday–Segar): 100 mL/kg/day for the first 10 kg, 50 mL/kg for the next 10 kg, 20 mL/kg thereafter.',
          'Severe dehydration in a child (WHO Plan C): 100 mL/kg Ringer\u2019s lactate — under 12 months, 30 mL/kg over 1 hour then 70 mL/kg over 5 hours; over 12 months, 30 mL/kg over 30 minutes then 70 mL/kg over 2.5 hours.',
        ],
      },
      {
        heading: 'Monitoring',
        points: [
          'Urine output (aim above 0.5 mL/kg/hour in adults, 1 mL/kg/hour in children), pulse, blood pressure, capillary refill, mucous membranes and mental state.',
          'Watch for overload: raised jugular venous pressure, new crackles, breathlessness, peripheral oedema — particularly in heart failure, renal failure, malnutrition and the elderly.',
        ],
      },
    ],
    source: 'WHO / NICE IV fluid therapy',
  },
  {
    id: 'nurse-wound-care',
    title: 'Wound care and pressure injury prevention',
    category: 'nursing',
    aliases: ['dressing', 'ulcer', 'bedsore', 'pressure sore', 'wound'],
    tags: ['nursing', 'wound', 'skin', 'prevention'],
    summary:
      'Wound assessment, dressing selection and the prevention bundle that stops pressure injuries developing.',
    sections: [
      {
        heading: 'Wound assessment',
        points: [
          'Record size, depth, tissue type (granulating, sloughy, necrotic), exudate, odour, surrounding skin and pain.',
          'Signs of infection: increasing pain, spreading erythema, heat, purulent exudate, malodour, delayed healing, fever.',
          'Swab only if infection is clinically suspected — colonisation is normal and swabbing everything drives unnecessary antibiotics.',
        ],
      },
      {
        heading: 'Dressing principles',
        points: [
          'Clean with normal saline or clean potable water; avoid routine antiseptics on granulating tissue.',
          'Keep the wound bed moist and the surrounding skin dry.',
          'Dry wound: hydrogel. Exuding wound: foam or alginate. Sloughy wound: debride. Infected wound: antimicrobial dressing plus systemic therapy if spreading.',
          'Use aseptic non-touch technique throughout.',
        ],
      },
      {
        heading: 'Pressure injury prevention (SSKIN)',
        points: [
          'Surface — pressure-redistributing mattress and cushion.',
          'Skin inspection at least daily, especially sacrum, heels, hips and any device site.',
          'Keep moving — reposition at least every 2–4 hours, and encourage self-repositioning.',
          'Incontinence and moisture management with a barrier product.',
          'Nutrition and hydration — protein and calorie intake are essential for healing.',
          'Assess risk formally on admission using a validated tool such as Braden or Waterlow.',
        ],
      },
    ],
    source: 'NPIAP / EPUAP pressure ulcer guidance',
  },
  {
    id: 'nurse-handover',
    title: 'Clinical handover and documentation',
    category: 'nursing',
    aliases: ['sbar', 'handover', 'shift report', 'documentation', 'escalation'],
    tags: ['nursing', 'communication', 'safety', 'workflow'],
    summary:
      'Structured communication prevents the information loss that causes most avoidable harm at transitions of care.',
    sections: [
      {
        heading: 'SBAR',
        points: [
          'Situation — who you are, who the patient is, and the immediate problem in one sentence.',
          'Background — relevant history, admission reason, current treatment, allergies.',
          'Assessment — your observations, vital signs, early warning score and what you think is happening.',
          'Recommendation — what you want, by when, and be explicit ("please review within 15 minutes").',
        ],
      },
      {
        heading: 'Documentation standards',
        points: [
          'Record contemporaneously, factually and legibly, with date, time, signature and designation.',
          'Never document in advance, never erase; strike through errors with a single line and initial.',
          'Document what was given, what was withheld and why, what was communicated, and the patient\u2019s response.',
        ],
      },
    ],
    source: 'WHO patient safety / NMC record-keeping standards',
  },
  {
    id: 'hosp-triage',
    title: 'Triage and emergency department flow',
    category: 'nursing',
    aliases: ['triage', 'emergency department', 'a&e', 'casualty', 'priority'],
    tags: ['hospital', 'workflow', 'emergency', 'prioritisation'],
    summary:
      'Sorting patients by clinical urgency rather than arrival order, using a consistent category system.',
    sections: [
      {
        heading: 'Categories',
        points: [
          'Red / immediate: airway compromise, respiratory or cardiac arrest, shock, active seizure, severe haemorrhage — seen at once.',
          'Orange / very urgent: chest pain, severe breathlessness, altered consciousness, severe pain — within 10 minutes.',
          'Yellow / urgent: moderate illness with stable vitals — within an hour.',
          'Green / standard and blue / non-urgent: minor conditions, safe to wait or redirect to primary care.',
        ],
      },
      {
        heading: 'Practical rules',
        points: [
          'Triage takes 2–5 minutes: complaint, vital signs, pain score, glucose in any altered mental state.',
          'Re-triage anyone whose wait exceeds the category target or whose condition changes.',
          'Children, pregnant women and the elderly deteriorate faster — set a lower threshold.',
        ],
      },
    ],
    source: 'WHO emergency care systems / Manchester Triage',
  },
  {
    id: 'hosp-maternal-care',
    title: 'Labour, delivery and immediate newborn care',
    category: 'nursing',
    aliases: ['labour', 'delivery', 'partograph', 'newborn', 'neonatal resuscitation', 'midwifery'],
    tags: ['maternal health', 'obstetric', 'newborn', 'hospital'],
    summary:
      'Monitoring labour with a partograph, active management of the third stage, and the first minutes of newborn life.',
    sections: [
      {
        heading: 'Monitoring labour',
        points: [
          'Partograph from the active phase: cervical dilatation, descent, contractions, fetal heart rate, maternal vitals and liquor.',
          'Fetal heart rate every 30 minutes in the first stage, every 5 minutes in the second — normal 110–160 bpm.',
          'Crossing the action line calls for review and a management decision.',
        ],
      },
      {
        heading: 'Active management of the third stage',
        points: [
          'Oxytocin 10 IU IM within one minute of birth.',
          'Controlled cord traction with counter-traction on the uterus.',
          'Uterine massage after delivery of the placenta, and check that the placenta and membranes are complete.',
          'Estimate blood loss; over 500 mL vaginally is postpartum haemorrhage.',
        ],
      },
      {
        heading: 'Immediate newborn care — the golden minute',
        points: [
          'Dry thoroughly, assess breathing, keep warm with skin-to-skin contact, delay cord clamping 1–3 minutes if the baby is well.',
          'If not breathing: clear the airway only if needed, position the head neutrally and start bag-and-mask ventilation within 60 seconds of birth at 30–50 breaths per minute.',
          'Initiate breastfeeding within the first hour.',
          'Give vitamin K, eye prophylaxis and the birth-dose vaccines per protocol.',
        ],
      },
    ],
    redFlags: [
      'Heavy bleeding, convulsion, fever with offensive discharge, severe headache with visual change, or absent fetal movement — obstetric emergencies.',
    ],
    source: 'WHO labour care guide / Helping Babies Breathe',
  },
  {
    id: 'hosp-palliative',
    title: 'Pain assessment and palliative care',
    category: 'nursing',
    aliases: ['palliative', 'end of life', 'pain score', 'analgesic ladder', 'morphine'],
    tags: ['pain', 'palliative', 'nursing', 'symptom control'],
    summary:
      'Systematic pain assessment and the WHO analgesic ladder, plus symptom control at the end of life.',
    sections: [
      {
        heading: 'Assessment',
        points: [
          'Use a 0–10 numeric scale, a faces scale for children, or a behavioural tool (PAINAD, FLACC) when the patient cannot self-report.',
          'SOCRATES: Site, Onset, Character, Radiation, Associations, Time course, Exacerbating and relieving factors, Severity.',
          'Reassess after every intervention — the patient\u2019s report is the standard.',
        ],
      },
      {
        heading: 'WHO analgesic ladder',
        points: [
          'Step 1: non-opioid (paracetamol, NSAID) with or without an adjuvant.',
          'Step 2: weak opioid (codeine, tramadol) added to the non-opioid.',
          'Step 3: strong opioid (morphine) — there is no maximum dose, only the dose that controls pain with acceptable side effects.',
          'Adjuvants: amitriptyline or gabapentin for neuropathic pain, steroids for pressure symptoms, bisphosphonates for bone pain.',
          'Give analgesia by the clock, by mouth where possible, and by the ladder, with breakthrough doses available.',
        ],
      },
      {
        heading: 'End-of-life symptom control',
        points: [
          'Always co-prescribe a laxative with an opioid.',
          'Anticipatory medicines: an opioid for pain or breathlessness, an antiemetic, an anxiolytic, and an antisecretory for respiratory secretions.',
          'Mouth care, positioning, calm environment and family support matter as much as the drugs.',
          'Discuss and document goals of care and resuscitation decisions early and clearly.',
        ],
      },
    ],
    source: 'WHO cancer pain relief / palliative care guidance',
  },
  {
    id: 'hosp-admission-discharge',
    title: 'Admission, ward round and discharge workflow',
    category: 'nursing',
    aliases: ['discharge planning', 'ward round', 'admission', 'medicines reconciliation'],
    tags: ['hospital', 'workflow', 'pharmacy', 'transition of care'],
    summary:
      'The patient journey through a ward, and the pharmacy touchpoints that prevent medication harm at each transition.',
    sections: [
      {
        heading: 'Admission',
        points: [
          'Medicines reconciliation within 24 hours: an accurate list from at least two sources (patient, carer, repeat slip, previous notes).',
          'Record allergies with the reaction, not just the drug name.',
          'Assess risk: falls, pressure injury, venous thromboembolism, nutrition, and infection status.',
        ],
      },
      {
        heading: 'Ward round and daily review',
        points: [
          'Review every drug daily: is it still indicated, is the dose right for current renal function, can IV be switched to oral, is there a stop date?',
          'Antimicrobial review at 48–72 hours — continue, de-escalate, switch to oral, or stop.',
          'Check for omitted doses; missed critical medicines (Parkinson\u2019s, insulin, antiepileptics, anticoagulants) cause real harm.',
        ],
      },
      {
        heading: 'Discharge',
        points: [
          'Discharge summary with the full medicines list, changes made and the reason for each change.',
          'Counsel the patient and carer on new medicines, and supply enough to bridge to the next supply.',
          'Communicate to the community pharmacy and primary care team.',
          'Confirm follow-up appointments and safety-net instructions before the patient leaves.',
        ],
      },
    ],
    source: 'WHO Medication Safety in Transitions of Care',
  },
  {
    id: 'em-poisoning',
    title: 'Poisoning and overdose management',
    category: 'emergency',
    aliases: [
      'overdose',
      'poisoning',
      'paracetamol overdose',
      'organophosphate',
      'naloxone',
      'activated charcoal',
    ],
    tags: ['emergency', 'toxicology', 'antidote'],
    summary:
      'General approach to the poisoned patient, plus the specific antidotes that must be immediately available.',
    sections: [
      {
        heading: 'General approach',
        points: [
          'Airway, breathing, circulation first; check glucose in every altered conscious level.',
          'Identify the agent, the amount, the time and the intent; keep containers and tablets.',
          'Activated charcoal 50 g (children 1 g/kg) may help within 1 hour of ingestion if the airway is protected — not for corrosives, hydrocarbons, iron, lithium or alcohols.',
          'Never induce vomiting.',
        ],
      },
      {
        heading: 'Key antidotes',
        points: [
          'Paracetamol — N-acetylcysteine, most effective within 8 hours; treat on the nomogram or empirically if the timing is unknown.',
          'Opioids — naloxone 400 micrograms IM/IV, repeated; watch for re-sedation.',
          'Organophosphate or carbamate pesticide — atropine titrated to dry secretions, plus pralidoxime; remove contaminated clothing and wash the skin while wearing gloves.',
          'Benzodiazepines — flumazenil, used cautiously because it can precipitate seizures.',
          'Iron — desferrioxamine. Methanol or ethylene glycol — ethanol or fomepizole. Snakebite — appropriate polyvalent antivenom.',
        ],
      },
      {
        heading: 'Aftercare',
        points: [
          'Every deliberate self-harm presentation needs a mental health assessment before discharge.',
          'Counsel the family on safe storage of medicines and pesticides.',
        ],
      },
    ],
    redFlags: [
      'Reduced consciousness, seizures, arrhythmia, or pinpoint pupils with slow breathing — resuscitate and give the antidote immediately.',
    ],
    source: 'WHO clinical toxicology guidance',
  },
  {
    id: 'em-burns-trauma',
    title: 'Burns and trauma first response',
    category: 'emergency',
    aliases: ['burn', 'trauma', 'bleeding', 'fracture', 'road accident'],
    tags: ['emergency', 'injury', 'first aid', 'fluid resuscitation'],
    summary:
      'Immediate management of burns and major trauma, including fluid calculation and transfer decisions.',
    sections: [
      {
        heading: 'Burns',
        points: [
          'Stop the burning process and cool with running water at 15–25 °C for 20 minutes, within 3 hours of injury. Never use ice, toothpaste, oil or herbal preparations.',
          'Cover with clean cling film or a clean dry sheet; keep the patient warm.',
          'Estimate the burn area with the rule of nines, or the palm (including fingers) as about 1%.',
          'Parkland formula: 4 mL × body weight (kg) × %TBSA of Ringer\u2019s lactate in 24 hours, half in the first 8 hours from the time of the burn.',
          'Refer: burns over 10% in adults or 5% in children, and all burns to the face, hands, feet, genitals, perineum or over joints, plus circumferential, chemical, electrical and inhalational injury.',
        ],
      },
      {
        heading: 'Trauma primary survey',
        points: [
          'Catastrophic haemorrhage control first — direct pressure, then a tourniquet if limb bleeding is not controlled.',
          'Airway with cervical spine protection, Breathing, Circulation, Disability (AVPU or GCS, pupils, glucose), Exposure with warmth.',
          'Tranexamic acid 1 g IV within 3 hours of significant traumatic haemorrhage.',
          'Immobilise suspected fractures, check distal pulses and sensation before and after splinting.',
        ],
      },
    ],
    redFlags: [
      'Airway burns (soot in nostrils, hoarseness, singed nasal hairs) — intubate early before swelling closes the airway.',
    ],
    source: 'WHO emergency trauma care / ATLS principles',
  },
];
