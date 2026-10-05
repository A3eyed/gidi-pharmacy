import type { KnowledgeEntry } from './types';

/**
 * Chronic disease medicines — diabetes, hypertension, lipids, acid suppression,
 * asthma/COPD and allergy. These are the repeat-dispensing backbone of most
 * pharmacies, so counselling and adherence content is deliberately detailed.
 */
export const CHRONIC_CARE_DRUGS: KnowledgeEntry[] = [
  {
    id: 'drug-metformin',
    title: 'Metformin',
    category: 'drug',
    aliases: ['glucophage', 'metformine', 'metformin hcl'],
    tags: ['diabetes', 'antidiabetic', 'biguanide', 'type 2 diabetes', 'blood sugar'],
    summary:
      'First-line oral agent for type 2 diabetes. Lowers hepatic glucose output and improves insulin sensitivity without causing hypoglycaemia on its own.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Start 500 mg once daily with the evening meal.',
          'Increase by 500 mg every 1–2 weeks as tolerated, to 1 g twice daily (maximum 2 g/day standard release, occasionally 2.55 g).',
          'Modified-release once daily is an option when GI upset limits the standard tablet.',
        ],
      },
      {
        heading: 'Cautions and contraindications',
        points: [
          'eGFR below 30 mL/min/1.73m² — contraindicated. Review dose below 45.',
          'Acute illness with dehydration, sepsis, severe vomiting or diarrhoea — hold the dose (sick day rule).',
          'Hold before and for 48 hours after iodinated contrast imaging.',
          'Significant hepatic impairment, decompensated heart failure, alcohol excess.',
        ],
      },
      {
        heading: 'Side effects',
        points: [
          'Nausea, diarrhoea, metallic taste and abdominal discomfort — usually settle in 1–2 weeks and are much reduced by taking with food and titrating slowly.',
          'Vitamin B12 deficiency on long-term therapy — check periodically.',
          'Lactic acidosis is rare but life-threatening; risk rises with renal impairment and dehydration.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'Always take with or immediately after food.',
          'It does not cause hypos by itself, but it can when combined with a sulfonylurea or insulin.',
          'Stop and seek care if you cannot keep fluids down, or you develop deep rapid breathing, muscle aches and extreme tiredness.',
        ],
      },
    ],
    redFlags: [
      'Hyperventilation, vomiting, severe weakness and abdominal pain in a metformin user — assess for lactic acidosis urgently.',
    ],
    source: 'BNF / WHO Essential Medicines / IDF guidance',
  },
  {
    id: 'drug-sulfonylureas',
    title: 'Glibenclamide, glimepiride and gliclazide (sulfonylureas)',
    category: 'drug',
    aliases: ['daonil', 'glibenclamide', 'gliclazide', 'glimepiride', 'diamicron', 'amaryl'],
    tags: ['diabetes', 'antidiabetic', 'sulfonylurea', 'hypoglycaemia'],
    summary:
      'Stimulate insulin secretion from the pancreas. Effective and cheap, but the main class that causes hypoglycaemia.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Gliclazide 40–80 mg daily with breakfast, up to 160 mg twice daily (or MR 30–120 mg once daily).',
          'Glimepiride 1 mg daily, titrated to a maximum of 4–6 mg daily.',
          'Glibenclamide 2.5–5 mg daily — avoid in the elderly and in renal impairment because of prolonged hypoglycaemia.',
        ],
      },
      {
        heading: 'Hypoglycaemia counselling',
        points: [
          'Never skip a meal after taking the dose.',
          'Carry fast-acting glucose: 15 g of sugar, glucose tablets or a sugary drink, repeated after 15 minutes if still symptomatic.',
          'Warning signs: sweating, shaking, palpitations, hunger, confusion, irritability.',
          'Beta blockers can mask these warning signs.',
        ],
      },
      {
        heading: 'Cautions',
        points: [
          'Renal or hepatic impairment, elderly, irregular meals, alcohol use, fasting for religious or medical reasons.',
          'Weight gain is common.',
        ],
      },
    ],
    redFlags: [
      'Any unresponsive or drowsy diabetic patient — treat as hypoglycaemia until proven otherwise.',
    ],
    source: 'BNF',
  },
  {
    id: 'drug-insulin',
    title: 'Insulin (human and analogue)',
    category: 'drug',
    aliases: ['actrapid', 'mixtard', 'insulatard', 'lantus', 'glargine', 'novomix', 'humulin'],
    tags: ['diabetes', 'insulin', 'injection', 'cold chain', 'type 1 diabetes'],
    summary:
      'Essential in type 1 diabetes and used in type 2 when oral agents no longer achieve control. Correct storage and injection technique matter as much as the dose.',
    sections: [
      {
        heading: 'Types and action',
        points: [
          'Rapid-acting analogue (aspart, lispro): onset 10–20 min, peak 1–3 h, duration 3–5 h — given with meals.',
          'Short-acting soluble/regular (Actrapid): onset 30 min, peak 2–4 h, duration 6–8 h — give 30 minutes before food.',
          'Intermediate NPH (Insulatard): onset 1–2 h, peak 4–8 h, duration 12–16 h.',
          'Long-acting analogue (glargine, detemir): flat profile over 20–24 h.',
          'Premixed (30/70): covers basal and prandial needs twice daily.',
        ],
      },
      {
        heading: 'Storage and cold chain',
        points: [
          'Unopened vials and pens: 2–8 °C in a refrigerator, never in the freezer and never against the cooling plate.',
          'In use: room temperature below 25–30 °C for up to 28 days, then discard.',
          'If there is no reliable power, a clay pot cooler or a wide-mouth flask with cool water is an accepted field method — the insulin must not touch ice.',
          'Discard insulin that has been frozen, is cloudy when it should be clear, or has clumps or frosting on the vial wall.',
        ],
      },
      {
        heading: 'Injection technique',
        points: [
          'Rotate sites within a region (abdomen, thigh, upper arm, buttock) to prevent lipohypertrophy; injecting into a lump makes absorption erratic.',
          'Use a new needle each time; 4 mm needles at 90° suit almost all adults.',
          'Resuspend cloudy insulin by rolling the pen 10 times and tipping it 10 times — do not shake.',
          'Prime 2 units before each injection and count to 10 before withdrawing the needle.',
        ],
      },
      {
        heading: 'Hypoglycaemia management',
        points: [
          'Conscious: 15 g fast carbohydrate, recheck in 15 minutes, then a long-acting snack.',
          'Unconscious: nothing by mouth. IM glucagon or IV dextrose, then urgent referral.',
        ],
      },
    ],
    redFlags: [
      'Vomiting with high blood glucose and ketones — possible diabetic ketoacidosis, refer immediately.',
    ],
    source: 'BNF / IDF / WHO',
  },
  {
    id: 'drug-amlodipine',
    title: 'Amlodipine',
    category: 'drug',
    aliases: ['norvasc', 'amlodipin', 'amlo'],
    tags: ['hypertension', 'blood pressure', 'calcium channel blocker', 'angina'],
    summary:
      'Long-acting dihydropyridine calcium channel blocker; a first-line antihypertensive, particularly effective in patients of African ancestry.',
    sections: [
      {
        heading: 'Dosing',
        points: ['5 mg once daily, increased to 10 mg once daily after 2–4 weeks if needed.'],
      },
      {
        heading: 'Side effects',
        points: [
          'Ankle and lower-leg oedema — dose related, and the commonest reason for stopping. It is not fluid overload and does not respond well to diuretics; reducing the dose or adding an ACE inhibitor/ARB helps.',
          'Flushing, headache, palpitations, dizziness.',
          'Gum hypertrophy with long-term use.',
        ],
      },
      {
        heading: 'Cautions and interactions',
        points: [
          'Severe aortic stenosis, cardiogenic shock, unstable angina.',
          'Simvastatin should be limited to 20 mg daily when combined with amlodipine.',
          'Grapefruit juice raises levels.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'Take at the same time each day, with or without food.',
          'Blood pressure treatment is usually lifelong — do not stop because you "feel fine".',
          'Report significant ankle swelling rather than stopping the tablet yourself.',
        ],
      },
    ],
    source: 'BNF / WHO HEARTS technical package',
  },
  {
    id: 'drug-acei-arb',
    title: 'ACE inhibitors and ARBs (lisinopril, enalapril, losartan, telmisartan)',
    category: 'drug',
    aliases: [
      'lisinopril',
      'enalapril',
      'losartan',
      'telmisartan',
      'ramipril',
      'ace inhibitor',
      'arb',
    ],
    tags: ['hypertension', 'heart failure', 'kidney', 'proteinuria', 'blood pressure'],
    summary:
      'Block the renin–angiotensin system. First line in hypertension with diabetes, chronic kidney disease, proteinuria or heart failure.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Lisinopril 5–10 mg once daily, titrated to 20–40 mg.',
          'Enalapril 5 mg once daily, titrated to 20 mg (may be split twice daily).',
          'Losartan 50 mg once daily, up to 100 mg.',
          'Start at the low end in the elderly, in volume depletion, or alongside a diuretic.',
        ],
      },
      {
        heading: 'Monitoring',
        points: [
          'Check renal function and potassium before starting and 1–2 weeks after every dose increase.',
          'A creatinine rise up to 30% or potassium up to 5.5 mmol/L is usually acceptable; beyond that, review.',
        ],
      },
      {
        heading: 'Cautions and contraindications',
        points: [
          'Absolutely contraindicated in pregnancy — switch to methyldopa, labetalol or nifedipine before conception where possible.',
          'Bilateral renal artery stenosis, previous angioedema, hyperkalaemia.',
          'Do not combine an ACE inhibitor with an ARB.',
        ],
      },
      {
        heading: 'Side effects',
        points: [
          'Dry persistent cough with ACE inhibitors (up to 15%, more common in some populations) — switch to an ARB, which does not cause it.',
          'First-dose hypotension, hyperkalaemia, deteriorating renal function.',
          'Angioedema — rare, can be delayed by months, and is a medical emergency.',
        ],
      },
      {
        heading: 'Interactions',
        points: [
          'NSAIDs — reduced effect and acute kidney injury risk.',
          'Potassium-sparing diuretics, potassium supplements, co-trimoxazole, trimethoprim — hyperkalaemia.',
          'Lithium levels rise.',
        ],
      },
    ],
    redFlags: [
      'Swelling of lips, tongue or throat — stop the drug and treat as an airway emergency.',
    ],
    source: 'BNF / WHO HEARTS',
  },
  {
    id: 'drug-thiazide',
    title: 'Hydrochlorothiazide and other diuretics',
    category: 'drug',
    aliases: [
      'hctz',
      'hydrochlorothiazide',
      'bendroflumethiazide',
      'furosemide',
      'lasix',
      'spironolactone',
      'indapamide',
    ],
    tags: ['hypertension', 'diuretic', 'oedema', 'heart failure', 'water tablet'],
    summary:
      'Thiazides are first-line antihypertensives; loop diuretics treat fluid overload; spironolactone is used in resistant hypertension and heart failure.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Hydrochlorothiazide 12.5–25 mg once daily in the morning.',
          'Indapamide 1.5 mg MR or 2.5 mg once daily.',
          'Furosemide 20–40 mg once or twice daily for oedema; titrate to response.',
          'Spironolactone 25 mg daily for resistant hypertension or heart failure.',
        ],
      },
      {
        heading: 'Monitoring and side effects',
        points: [
          'Check urea, electrolytes and creatinine at baseline, 2–4 weeks after starting, and periodically.',
          'Thiazides: hyponatraemia, hypokalaemia, hyperuricaemia (gout), raised glucose and lipids, erectile dysfunction.',
          'Loops: dehydration, hypokalaemia, ototoxicity at high IV doses.',
          'Spironolactone: hyperkalaemia and gynaecomastia.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'Take in the morning so night-time urination does not disturb sleep; a second dose of furosemide should be before 4 pm.',
          'Report muscle cramps, palpitations or extreme weakness (electrolyte disturbance).',
          'Avoid potassium supplements with spironolactone unless specifically told otherwise.',
        ],
      },
    ],
    source: 'BNF / WHO HEARTS',
  },
  {
    id: 'drug-betablockers',
    title: 'Beta blockers (atenolol, bisoprolol, carvedilol, propranolol)',
    category: 'drug',
    aliases: ['atenolol', 'bisoprolol', 'carvedilol', 'propranolol', 'metoprolol', 'beta blocker'],
    tags: ['hypertension', 'angina', 'heart failure', 'arrhythmia', 'migraine prophylaxis'],
    summary:
      'Reduce heart rate and contractility. Core therapy after myocardial infarction, in stable heart failure (bisoprolol, carvedilol), angina, arrhythmia and migraine prophylaxis.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Bisoprolol 1.25–2.5 mg daily in heart failure, doubling no faster than every 2 weeks to a target of 10 mg.',
          'Atenolol 25–50 mg daily for hypertension or angina.',
          'Propranolol 40 mg two to three times daily for migraine prophylaxis, essential tremor or anxiety-related tachycardia.',
        ],
      },
      {
        heading: 'Cautions and contraindications',
        points: [
          'Asthma — non-selective beta blockers are contraindicated; cardioselective agents only if essential and specialist supervised.',
          'Second- or third-degree heart block, severe bradycardia, decompensated heart failure.',
          'They mask the warning signs of hypoglycaemia in insulin-treated diabetes.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'Never stop abruptly — rebound angina, arrhythmia or infarction can follow. Taper over 1–2 weeks.',
          'Cold hands, fatigue and vivid dreams are common early and often settle.',
          'Check pulse if dizzy; report a resting rate under 50.',
        ],
      },
    ],
    source: 'BNF',
  },
  {
    id: 'drug-statins',
    title: 'Statins (atorvastatin, simvastatin, rosuvastatin)',
    category: 'drug',
    aliases: [
      'atorvastatin',
      'simvastatin',
      'rosuvastatin',
      'lipitor',
      'statin',
      'cholesterol tablet',
    ],
    tags: ['cholesterol', 'lipid', 'cardiovascular prevention', 'stroke'],
    summary:
      'Lower LDL cholesterol and reduce cardiovascular events. Used for secondary prevention after any vascular event, and for primary prevention when risk is high.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Atorvastatin 20 mg daily for primary prevention; 40–80 mg for secondary prevention.',
          'Simvastatin 20–40 mg at night (its short half-life makes evening dosing matter).',
          'Atorvastatin and rosuvastatin can be taken at any time of day.',
        ],
      },
      {
        heading: 'Monitoring',
        points: [
          'Baseline lipids, liver function and, if symptomatic, creatine kinase.',
          'Repeat lipids at 3 months; aim for at least a 40% reduction in non-HDL cholesterol.',
          'Check LFTs at 3 and 12 months; stop if transaminases exceed 3× the upper limit.',
        ],
      },
      {
        heading: 'Side effects and interactions',
        points: [
          'Muscle aches are common and usually benign; true myopathy with markedly raised CK is rare, and rhabdomyolysis rarer still.',
          'Simvastatin with amlodipine (max 20 mg), with diltiazem, or with clarithromycin/itraconazole — serious myopathy risk.',
          'Grapefruit juice raises simvastatin and atorvastatin levels.',
          'Contraindicated in pregnancy and breastfeeding.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'Report unexplained muscle pain, tenderness or dark cola-coloured urine.',
          'Statins work silently — there is nothing to feel, but the benefit is real and cumulative.',
        ],
      },
    ],
    source: 'BNF / NICE lipid modification',
  },
  {
    id: 'drug-ppi',
    title: 'Omeprazole and other proton pump inhibitors',
    category: 'drug',
    aliases: ['omeprazole', 'esomeprazole', 'pantoprazole', 'lansoprazole', 'ppi', 'losec'],
    tags: ['acid', 'reflux', 'ulcer', 'gastritis', 'heartburn', 'h pylori'],
    summary:
      'Suppress gastric acid for reflux, peptic ulcer, H. pylori eradication and NSAID gastroprotection.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'GORD: omeprazole 20 mg once daily for 4–8 weeks.',
          'Peptic ulcer: 20–40 mg once daily for 4–8 weeks.',
          'Gastroprotection with an NSAID: 20 mg once daily.',
          'H. pylori: PPI twice daily plus two antibiotics (commonly amoxicillin 1 g and clarithromycin 500 mg, both twice daily) for 14 days.',
        ],
      },
      {
        heading: 'Cautions',
        points: [
          'Take 30–60 minutes before the first meal of the day — PPIs only inhibit actively secreting pumps.',
          'Long-term use: hypomagnesaemia, B12 deficiency, reduced calcium absorption and fracture risk, increased C. difficile and enteric infection risk.',
          'They can mask the symptoms of gastric cancer — never continue indefinitely without review.',
        ],
      },
      {
        heading: 'Interactions',
        points: [
          'Omeprazole reduces the activation of clopidogrel — prefer pantoprazole in patients on clopidogrel.',
          'Reduced absorption of ketoconazole, itraconazole, atazanavir and iron.',
          'Raises methotrexate levels at high doses.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'Swallow capsules whole before breakfast.',
          'Review the need every few months; step down to on-demand use where possible.',
          'Lifestyle: smaller meals, avoid late eating, raise the head of the bed, reduce alcohol, spice and smoking.',
        ],
      },
    ],
    redFlags: [
      'Dysphagia, unintentional weight loss, persistent vomiting, GI bleeding, anaemia, or new dyspepsia over age 55 — refer for endoscopy rather than repeat OTC supply.',
    ],
    source: 'BNF / NICE dyspepsia guidance',
  },
  {
    id: 'drug-salbutamol',
    title: 'Salbutamol (albuterol)',
    category: 'drug',
    aliases: ['ventolin', 'albuterol', 'salbutamol inhaler', 'blue inhaler'],
    tags: ['asthma', 'copd', 'inhaler', 'bronchodilator', 'wheeze', 'reliever'],
    summary:
      'Short-acting beta-2 agonist reliever that opens the airways within minutes. It treats symptoms; it does not treat the underlying inflammation.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Inhaler: 100–200 micrograms (1–2 puffs) as needed, up to four times daily.',
          'Acute attack: 4–10 puffs via a spacer, one puff at a time with 4–5 breaths each, repeated every 10–20 minutes while arranging help.',
          'Nebulised: 2.5–5 mg, repeated as required.',
        ],
      },
      {
        heading: 'Inhaler technique — the single most valuable counselling you can give',
        points: [
          'Shake, remove the cap, breathe out fully away from the device.',
          'Seal lips around the mouthpiece, start a slow deep breath and press the canister at the same time.',
          'Keep breathing in slowly, then hold your breath for up to 10 seconds.',
          'Wait 30 seconds before a second puff. A spacer improves delivery in almost everyone and is essential for children.',
          'Ask the patient to demonstrate — never assume the technique is correct.',
        ],
      },
      {
        heading: 'Control indicator',
        points: [
          'Needing the reliever more than twice a week, or using more than one canister a month, means asthma is poorly controlled and preventer therapy must be reviewed.',
        ],
      },
      {
        heading: 'Side effects',
        points: ['Tremor, palpitations, headache, muscle cramp, and hypokalaemia at high doses.'],
      },
    ],
    redFlags: [
      'Silent chest, inability to complete a sentence, cyanosis, exhaustion, oxygen saturation below 92% — emergency.',
      'Reliever no longer lasting 4 hours.',
    ],
    source: 'GINA / BNF',
  },
  {
    id: 'drug-inhaled-steroid',
    title: 'Inhaled corticosteroids and combination inhalers',
    category: 'drug',
    aliases: [
      'beclometasone',
      'budesonide',
      'fluticasone',
      'seretide',
      'symbicort',
      'brown inhaler',
      'preventer',
    ],
    tags: ['asthma', 'copd', 'preventer', 'inhaler', 'steroid'],
    summary:
      'The preventer therapy that treats airway inflammation. Modern asthma guidance recommends that every asthma patient receives inhaled corticosteroid-containing therapy, not reliever alone.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Beclometasone 100–200 micrograms twice daily for mild to moderate asthma; higher doses under specialist review.',
          'Combination ICS/formoterol can be used both as maintenance and as reliever (MART) in suitable patients.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'Rinse the mouth and spit after every dose to prevent oral thrush and hoarseness.',
          'It must be taken every day even when well — the benefit builds over days to weeks.',
          'It will not relieve an acute attack; that is what the reliever is for.',
          'Use a spacer, and clean it monthly in warm soapy water and air-dry (do not rub dry — static reduces delivery).',
        ],
      },
      {
        heading: 'Cautions',
        points: [
          'Oral candidiasis, dysphonia, and at high doses adrenal suppression and reduced growth velocity in children.',
          'A long-acting beta agonist must never be used without an inhaled corticosteroid in asthma.',
        ],
      },
    ],
    source: 'GINA 2024 / BNF',
  },
  {
    id: 'drug-prednisolone',
    title: 'Prednisolone and systemic corticosteroids',
    category: 'drug',
    aliases: ['prednisolone', 'prednisone', 'dexamethasone', 'hydrocortisone', 'steroid'],
    tags: ['steroid', 'inflammation', 'asthma exacerbation', 'allergy', 'autoimmune'],
    summary:
      'Potent anti-inflammatory used in short bursts for exacerbations of asthma or COPD, severe allergy and inflammatory flares, or long term in autoimmune disease.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Acute asthma: prednisolone 40–50 mg once daily for 5 days (children 1–2 mg/kg, maximum 40 mg).',
          'COPD exacerbation: 30 mg once daily for 5 days.',
          'Courses of 3 weeks or less can usually be stopped abruptly; longer courses need tapering.',
        ],
      },
      {
        heading: 'Cautions',
        points: [
          'Systemic infection, including latent TB and strongyloidiasis, can be unmasked or worsened.',
          'Raises blood glucose substantially — diabetic patients need closer monitoring and often temporary dose changes.',
          'Peptic ulcer risk rises sharply when combined with an NSAID.',
          'Long term: osteoporosis, adrenal suppression, cataract, hypertension, weight gain, mood change.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'Take the whole dose in the morning with food.',
          'Never stop a long-term steroid suddenly — adrenal crisis can result.',
          'Carry a steroid card for courses longer than 3 weeks or repeated courses.',
          'Report contact with chickenpox or measles if not immune.',
        ],
      },
    ],
    source: 'BNF',
  },
  {
    id: 'drug-antihistamines',
    title: 'Antihistamines (cetirizine, loratadine, chlorphenamine)',
    category: 'drug',
    aliases: [
      'cetirizine',
      'loratadine',
      'chlorphenamine',
      'piriton',
      'zyrtec',
      'clarityn',
      'promethazine',
    ],
    tags: ['allergy', 'antihistamine', 'rash', 'hay fever', 'itching', 'urticaria'],
    summary:
      'Block histamine H1 receptors for allergic rhinitis, urticaria, itch and allergic reactions. Second-generation agents are preferred because they are non-sedating.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Cetirizine 10 mg once daily (children 2–6 years 2.5 mg twice daily; 6–12 years 5 mg twice daily).',
          'Loratadine 10 mg once daily.',
          'Chlorphenamine 4 mg every 4–6 hours, maximum 24 mg/day — sedating.',
          'In chronic urticaria, the dose of a second-generation antihistamine may be increased up to fourfold under medical direction.',
        ],
      },
      {
        heading: 'Cautions',
        points: [
          'Sedating antihistamines impair driving and operating machinery, and are best avoided in the elderly (falls, confusion, urinary retention) and in children under 2.',
          'Avoid in narrow-angle glaucoma, prostatic enlargement and severe liver disease for the sedating agents.',
          'Antihistamines do not treat anaphylaxis — adrenaline does.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'Take regularly through the allergy season rather than only when symptomatic.',
          'Avoid alcohol with sedating agents.',
          'A nasal corticosteroid is more effective than an antihistamine for nasal blockage.',
        ],
      },
    ],
    redFlags: [
      'Lip or tongue swelling, wheeze, or faintness with a rash — this is anaphylaxis, give adrenaline and call for emergency help.',
    ],
    source: 'BNF / ARIA allergic rhinitis guidance',
  },
  {
    id: 'drug-ors-zinc',
    title: 'Oral rehydration salts and zinc',
    category: 'drug',
    aliases: ['ors', 'oral rehydration', 'zinc sulphate', 'rehydration salts', 'sro'],
    tags: ['diarrhoea', 'dehydration', 'child health', 'cholera', 'gastroenteritis'],
    summary:
      'Low-osmolarity ORS plus zinc is the WHO standard of care for childhood diarrhoea and prevents the great majority of diarrhoeal deaths.',
    sections: [
      {
        heading: 'How to prepare and give',
        points: [
          'Dissolve one sachet in exactly 1 litre of clean or boiled-and-cooled water. Never use less water — a concentrated solution is dangerous.',
          'Discard any solution not used within 24 hours.',
          'Under 2 years: 50–100 mL after each loose stool. Age 2–10: 100–200 mL. Older children and adults: as much as they want.',
          'Give by small frequent sips or spoonfuls; continue breastfeeding throughout.',
        ],
      },
      {
        heading: 'Zinc',
        points: [
          'Children under 6 months: 10 mg daily for 10–14 days.',
          'Children 6 months and older: 20 mg daily for 10–14 days.',
          'Zinc shortens the episode and reduces recurrence over the following 2–3 months.',
        ],
      },
      {
        heading: 'What not to do',
        points: [
          'Do not give antidiarrhoeals such as loperamide to young children.',
          'Do not give antibiotics for routine watery diarrhoea — reserve them for dysentery, cholera and confirmed bacterial causes.',
          'Do not stop feeding; continue age-appropriate food.',
        ],
      },
    ],
    redFlags: [
      'Sunken eyes, lethargy, inability to drink, skin pinch going back very slowly, no urine for 6–8 hours, blood in stool, or high fever — refer immediately.',
    ],
    source: 'WHO/UNICEF diarrhoea management guidance',
  },
  {
    id: 'drug-iron-folate',
    title: 'Iron, folic acid and pregnancy supplements',
    category: 'drug',
    aliases: [
      'ferrous sulphate',
      'ferrous sulfate',
      'folic acid',
      'iron tablet',
      'haematinic',
      'multivitamin',
    ],
    tags: ['anaemia', 'pregnancy', 'antenatal', 'supplement', 'iron'],
    summary:
      'Iron and folic acid supplementation treats and prevents anaemia, which is highly prevalent in pregnancy and in young children.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Treatment of iron deficiency anaemia: ferrous sulphate 200 mg (65 mg elemental iron) two to three times daily, continued for 3 months after the haemoglobin normalises to refill stores.',
          'Antenatal prophylaxis: 30–60 mg elemental iron plus 400 micrograms folic acid daily throughout pregnancy.',
          'Preconception and first trimester: folic acid 400 micrograms daily; 5 mg daily if diabetic, on antiepileptics, obese, or with a previous neural tube defect.',
          'Alternate-day dosing can improve absorption and tolerability.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'Take on an empty stomach with vitamin C (orange juice) for best absorption; take with food if it causes nausea.',
          'Black stools are expected and harmless. Constipation is common — increase fluid and fibre.',
          'Separate from tea, coffee, milk, calcium, antacids, and from tetracyclines or quinolones by at least 2 hours.',
          'Keep iron well out of reach — overdose is a leading cause of fatal poisoning in toddlers.',
        ],
      },
    ],
    source: 'WHO anaemia guidance / BNF',
  },
];
