import type { InteractionEntry } from './types';

/**
 * Pairwise drug interaction table.
 *
 * `a` and `b` are lower-case generic names. The engine matches both names
 * anywhere in the question, so "can I give metronidazole with warfarin" and
 * "warfarin + flagyl" both resolve to the same record.
 */
export const INTERACTIONS: InteractionEntry[] = [
  {
    a: 'warfarin',
    b: 'metronidazole',
    severity: 'serious',
    effect: 'Metronidazole inhibits warfarin metabolism and can raise the INR sharply within days.',
    action:
      'Avoid if possible. If unavoidable, reduce the warfarin dose, check INR within 3–5 days and again after the course.',
  },
  {
    a: 'warfarin',
    b: 'co-trimoxazole',
    severity: 'serious',
    effect: 'Marked INR rise with a real bleeding risk.',
    action: 'Choose a different antibiotic where possible; otherwise monitor INR closely.',
  },
  {
    a: 'warfarin',
    b: 'fluconazole',
    severity: 'serious',
    effect: 'CYP2C9 inhibition raises warfarin levels and INR.',
    action: 'Use topical antifungal therapy where adequate, or reduce warfarin and monitor.',
  },
  {
    a: 'warfarin',
    b: 'ibuprofen',
    severity: 'serious',
    effect: 'Additive bleeding risk plus gastric irritation, with no INR change to warn you.',
    action:
      'Use paracetamol instead. If an NSAID is essential, add gastroprotection and monitor for bleeding.',
  },
  {
    a: 'warfarin',
    b: 'rifampicin',
    severity: 'serious',
    effect: 'Powerful enzyme induction lowers the INR and risks thrombosis.',
    action:
      'Anticipate a substantial warfarin dose increase with frequent INR monitoring, and again when rifampicin stops.',
  },
  {
    a: 'clopidogrel',
    b: 'omeprazole',
    severity: 'moderate',
    effect:
      'Omeprazole inhibits CYP2C19 and reduces conversion of clopidogrel to its active metabolite.',
    action: 'Use pantoprazole instead when gastroprotection is needed.',
  },
  {
    a: 'metronidazole',
    b: 'alcohol',
    severity: 'avoid',
    effect: 'Disulfiram-like reaction — flushing, vomiting, headache and tachycardia.',
    action:
      'No alcohol during treatment and for 48 hours afterwards, including alcohol-containing tonics and syrups.',
  },
  {
    a: 'ciprofloxacin',
    b: 'calcium',
    severity: 'moderate',
    effect: 'Divalent cations chelate the quinolone and can abolish absorption.',
    action:
      'Separate by at least 2 hours before or 6 hours after milk, antacids, iron, zinc or calcium.',
  },
  {
    a: 'ciprofloxacin',
    b: 'theophylline',
    severity: 'serious',
    effect: 'Theophylline levels rise, risking arrhythmia and seizures.',
    action: 'Avoid the combination or monitor theophylline levels and reduce the dose.',
  },
  {
    a: 'doxycycline',
    b: 'iron',
    severity: 'moderate',
    effect: 'Chelation markedly reduces doxycycline absorption.',
    action: 'Separate doses by at least 2 hours.',
  },
  {
    a: 'lisinopril',
    b: 'ibuprofen',
    severity: 'serious',
    effect:
      'NSAID blunts the antihypertensive effect and, with a diuretic, precipitates acute kidney injury (the triple whammy).',
    action:
      'Prefer paracetamol. If an NSAID is unavoidable, keep the course short and check renal function.',
  },
  {
    a: 'lisinopril',
    b: 'spironolactone',
    severity: 'serious',
    effect: 'Additive hyperkalaemia, which can be fatal.',
    action:
      'Only combine with a clear indication (heart failure), and monitor potassium and renal function closely.',
  },
  {
    a: 'lisinopril',
    b: 'co-trimoxazole',
    severity: 'serious',
    effect:
      'Trimethoprim acts like a potassium-sparing diuretic; hyperkalaemia and sudden death have been reported in older patients.',
    action: 'Choose a different antibiotic in older patients on ACE inhibitors or ARBs.',
  },
  {
    a: 'simvastatin',
    b: 'amlodipine',
    severity: 'moderate',
    effect: 'Amlodipine raises simvastatin exposure and myopathy risk.',
    action: 'Limit simvastatin to 20 mg daily, or switch to atorvastatin or rosuvastatin.',
  },
  {
    a: 'simvastatin',
    b: 'clarithromycin',
    severity: 'avoid',
    effect: 'Strong CYP3A4 inhibition can cause rhabdomyolysis.',
    action: 'Suspend the statin for the duration of the macrolide course, or use azithromycin.',
  },
  {
    a: 'metformin',
    b: 'contrast media',
    severity: 'serious',
    effect:
      'Contrast-induced renal impairment can precipitate metformin accumulation and lactic acidosis.',
    action:
      'Withhold metformin at the time of the scan and for 48 hours afterwards, restarting once renal function is confirmed stable.',
  },
  {
    a: 'metformin',
    b: 'dolutegravir',
    severity: 'moderate',
    effect: 'Dolutegravir raises metformin plasma levels.',
    action: 'Cap metformin at 1 g daily and monitor for GI side effects and glycaemic control.',
  },
  {
    a: 'tramadol',
    b: 'fluoxetine',
    severity: 'serious',
    effect: 'Serotonin syndrome risk, plus a lowered seizure threshold.',
    action:
      'Avoid the combination; if unavoidable, use the lowest dose and watch for agitation, tremor, clonus and fever.',
  },
  {
    a: 'tramadol',
    b: 'diazepam',
    severity: 'serious',
    effect: 'Additive respiratory depression and sedation.',
    action:
      'Avoid co-prescribing; if essential, use minimum doses and counsel the household on overdose signs.',
  },
  {
    a: 'aspirin',
    b: 'ibuprofen',
    severity: 'moderate',
    effect:
      'Ibuprofen can block the antiplatelet action of low-dose aspirin, and bleeding risk is additive.',
    action: 'Take aspirin at least 2 hours before ibuprofen, or use paracetamol instead.',
  },
  {
    a: 'rifampicin',
    b: 'combined oral contraceptive',
    severity: 'avoid',
    effect: 'Enzyme induction causes contraceptive failure.',
    action: 'Use a non-hormonal or depot method during rifampicin and for 4 weeks after it stops.',
  },
  {
    a: 'carbamazepine',
    b: 'combined oral contraceptive',
    severity: 'serious',
    effect: 'Reduced contraceptive efficacy through enzyme induction.',
    action:
      'Recommend an alternative method — copper IUD, depot injection or implant with caution.',
  },
  {
    a: 'dolutegravir',
    b: 'calcium',
    severity: 'moderate',
    effect:
      'Polyvalent cations chelate dolutegravir and reduce its absorption, risking viral rebound.',
    action:
      'Take dolutegravir 2 hours before or 6 hours after antacids, calcium, iron or magnesium — or take it together with a meal.',
  },
  {
    a: 'azithromycin',
    b: 'artemether-lumefantrine',
    severity: 'moderate',
    effect: 'Additive QT prolongation.',
    action:
      'Avoid combining where possible; check electrolytes and avoid other QT-prolonging drugs.',
  },
  {
    a: 'prednisolone',
    b: 'ibuprofen',
    severity: 'serious',
    effect: 'Substantially increased risk of peptic ulceration and GI bleeding.',
    action: 'Avoid the combination or add a proton pump inhibitor and keep the course short.',
  },
  {
    a: 'omeprazole',
    b: 'iron',
    severity: 'moderate',
    effect: 'Reduced gastric acid impairs iron absorption, blunting the response to iron therapy.',
    action:
      'Take iron with vitamin C, consider alternate-day dosing, and review the ongoing need for the PPI.',
  },
  {
    a: 'fluoxetine',
    b: 'ibuprofen',
    severity: 'moderate',
    effect:
      'SSRIs impair platelet function; combined with an NSAID the GI bleeding risk rises several-fold.',
    action: 'Prefer paracetamol, or add gastroprotection if an NSAID is needed.',
  },
  {
    a: 'digoxin',
    b: 'furosemide',
    severity: 'serious',
    effect: 'Diuretic-induced hypokalaemia potentiates digoxin toxicity.',
    action:
      'Monitor potassium and digoxin levels; supplement potassium or add a potassium-sparing agent.',
  },
  {
    a: 'isoniazid',
    b: 'phenytoin',
    severity: 'moderate',
    effect:
      'Isoniazid inhibits phenytoin metabolism, causing toxicity (ataxia, nystagmus, confusion).',
    action: 'Monitor phenytoin levels and reduce the dose as needed.',
  },
  {
    a: 'levonorgestrel',
    b: 'rifampicin',
    severity: 'serious',
    effect: 'Enzyme induction reduces emergency contraceptive efficacy.',
    action: 'Double the levonorgestrel dose to 3 mg, or fit a copper IUD.',
  },
];
