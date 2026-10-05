import type { KnowledgeEntry } from './types';

/**
 * Disease conditions — presentation, assessment, first-line management and the
 * referral triggers a pharmacist, nurse or prescriber needs at the counter or
 * the bedside.
 */
export const CONDITIONS: KnowledgeEntry[] = [
  {
    id: 'cond-malaria',
    title: 'Malaria',
    category: 'condition',
    aliases: ['plasmodium', 'falciparum', 'fever malaria'],
    tags: ['fever', 'infection', 'tropical', 'parasite', 'rdt'],
    summary:
      'Febrile illness caused by Plasmodium species, transmitted by Anopheles mosquitoes. Every suspected case should be confirmed by rapid diagnostic test or microscopy before treatment.',
    sections: [
      {
        heading: 'Presentation',
        points: [
          'Fever with chills and rigors, headache, muscle and joint pain, fatigue, nausea and vomiting.',
          'Children may present only with fever, poor feeding, irritability or convulsion.',
          'Anaemia and splenomegaly in longer-standing infection.',
        ],
      },
      {
        heading: 'Diagnosis',
        points: [
          'Rapid diagnostic test or thick and thin blood film. Do not treat on clinical suspicion alone where testing is available.',
          'A negative RDT in a persistently febrile patient still needs a cause — consider typhoid, urinary infection, pneumonia, dengue or viral illness.',
        ],
      },
      {
        heading: 'Treatment',
        points: [
          'Uncomplicated falciparum malaria: a full 3-day artemisinin-based combination course, dosed by weight, taken with fatty food.',
          'Severe malaria: parenteral artesunate 2.4 mg/kg at 0, 12 and 24 hours, then daily, followed by a full ACT course.',
          'First-trimester pregnancy: quinine plus clindamycin, or ACT if that is the only option available, on medical advice.',
          'Add paracetamol for fever; avoid ibuprofen where dengue has not been excluded.',
        ],
      },
      {
        heading: 'Prevention',
        points: [
          'Insecticide-treated nets every night, indoor residual spraying, and removal of standing water.',
          'IPTp with sulfadoxine–pyrimethamine from the second trimester at each antenatal visit.',
          'Chemoprophylaxis for non-immune travellers.',
        ],
      },
    ],
    redFlags: [
      'Impaired consciousness, convulsions, inability to drink or breastfeed, repeated vomiting, dark or absent urine, severe pallor, jaundice, respiratory distress, or bleeding — refer immediately as severe malaria.',
    ],
    source: 'WHO Guidelines for Malaria 2023',
  },
  {
    id: 'cond-typhoid',
    title: 'Typhoid and enteric fever',
    category: 'condition',
    aliases: ['enteric fever', 'salmonella typhi', 'widal'],
    tags: ['fever', 'infection', 'gastrointestinal', 'water-borne'],
    summary:
      'Systemic infection with Salmonella Typhi from contaminated food or water, presenting with a stepwise rising fever and abdominal symptoms.',
    sections: [
      {
        heading: 'Presentation',
        points: [
          'Gradual-onset fever rising over days, headache, abdominal discomfort, constipation or diarrhoea, relative bradycardia.',
          'Second week: rose spots, hepatosplenomegaly, confusion.',
        ],
      },
      {
        heading: 'Diagnosis',
        points: [
          'Blood culture is the reference standard.',
          'The Widal test is widely used but poorly specific in endemic areas — a single positive titre does not confirm typhoid, and it should not be the sole basis for antibiotics.',
        ],
      },
      {
        heading: 'Treatment',
        points: [
          'Guided by local resistance patterns: azithromycin, ceftriaxone or a fluoroquinolone where sensitivity is retained.',
          'Typical course 7–14 days; fever may take 3–5 days to settle even on the correct antibiotic.',
          'Maintain hydration and nutrition.',
        ],
      },
    ],
    redFlags: [
      'Severe abdominal pain with rigidity or sudden shock — possible intestinal perforation, a surgical emergency.',
      'Gastrointestinal bleeding or altered consciousness.',
    ],
    source: 'WHO / national treatment guidelines',
  },
  {
    id: 'cond-pneumonia',
    title: 'Pneumonia and lower respiratory infection',
    category: 'condition',
    aliases: ['chest infection', 'lrti', 'community acquired pneumonia', 'cap'],
    tags: ['respiratory', 'infection', 'cough', 'fever', 'breathing'],
    summary:
      'Infection of the lung parenchyma presenting with cough, fever and breathlessness. Severity assessment decides whether the patient is treated at home or referred.',
    sections: [
      {
        heading: 'Presentation',
        points: [
          'Productive cough, fever, pleuritic chest pain, breathlessness, raised respiratory rate.',
          'Children: fast breathing is the key WHO sign — over 60/min under 2 months, over 50/min at 2–11 months, over 40/min at 1–5 years.',
          'Older adults may present only with confusion or a fall.',
        ],
      },
      {
        heading: 'Assessment',
        points: [
          'CRB-65: Confusion, Respiratory rate ≥30, Blood pressure <90/60, age ≥65. A score of 1 or more warrants clinical review; 2 or more usually means hospital.',
          'Oxygen saturation below 92% on room air is a referral trigger.',
        ],
      },
      {
        heading: 'Treatment',
        points: [
          'Low severity adult community-acquired pneumonia: amoxicillin 500 mg – 1 g three times daily for 5 days.',
          'Penicillin allergy: doxycycline or a macrolide.',
          'Children: amoxicillin dispersible tablets by weight per IMCI.',
          'Supportive care: fluids, antipyretics, rest; oxygen if saturation is low.',
        ],
      },
    ],
    redFlags: [
      'Chest indrawing, grunting, nasal flaring, inability to feed, central cyanosis, or convulsion in a child.',
      'Confusion, saturation under 92%, respiratory rate over 30, or systolic BP under 90 in an adult.',
    ],
    source: 'WHO IMCI / NICE pneumonia guidance',
  },
  {
    id: 'cond-uri',
    title: 'Common cold and upper respiratory infection',
    category: 'condition',
    aliases: ['common cold', 'uri', 'urti', 'sore throat', 'pharyngitis', 'catarrh'],
    tags: ['viral', 'cough', 'cold', 'self-care', 'antibiotic stewardship'],
    summary:
      'Almost always viral and self-limiting over 7–10 days. The pharmacist\u2019s job is symptomatic relief, safety-netting and resisting unnecessary antibiotics.',
    sections: [
      {
        heading: 'Management',
        points: [
          'Rest, fluids, paracetamol or ibuprofen, saline nasal irrigation, steam inhalation, honey and lemon in those over 1 year.',
          'Short-course topical decongestant for blocked nose, maximum 5–7 days.',
          'Explain the expected course: cough can persist for up to 3 weeks after the cold clears.',
        ],
      },
      {
        heading: 'When antibiotics may be appropriate',
        points: [
          'Streptococcal sore throat suggested by a Centor/FeverPAIN score of 4 or more: fever, tonsillar exudate, tender anterior cervical nodes, absence of cough.',
          'Symptoms worsening after initial improvement, or persisting beyond 10 days with purulent discharge and facial pain (acute bacterial sinusitis).',
        ],
      },
      {
        heading: 'Stewardship message for the patient',
        points: [
          'Antibiotics do not work on viruses, do not shorten a cold, and cause side effects and resistance.',
          'Offer a clear plan for when to come back rather than an unnecessary prescription.',
        ],
      },
    ],
    redFlags: [
      'Difficulty breathing or swallowing, drooling, stridor, unilateral neck swelling, or a stiff neck with photophobia.',
    ],
    source: 'NICE respiratory tract infection guidance / WHO AWaRe',
  },
  {
    id: 'cond-hypertension',
    title: 'Hypertension',
    category: 'condition',
    aliases: ['high blood pressure', 'bp', 'htn'],
    tags: ['cardiovascular', 'chronic disease', 'blood pressure', 'stroke prevention'],
    summary:
      'Persistently raised blood pressure, usually symptomless, and the leading modifiable risk factor for stroke, heart failure and kidney disease.',
    sections: [
      {
        heading: 'Diagnosis and targets',
        points: [
          'Diagnose on repeated readings, at least two on separate occasions, with a correctly sized cuff and the arm supported at heart level.',
          'Stage 1: 140–159/90–99. Stage 2: 160–179/100–109. Severe: 180/110 or above.',
          'Usual target below 140/90, or below 130/80 in diabetes, chronic kidney disease or established cardiovascular disease.',
        ],
      },
      {
        heading: 'Treatment',
        points: [
          'In patients of African ancestry, a calcium channel blocker (amlodipine) or a thiazide-like diuretic is preferred first line; ACE inhibitors are less effective as monotherapy.',
          'With diabetes, proteinuria or heart failure, an ACE inhibitor or ARB is first line regardless of ethnicity.',
          'Step 2: combine a calcium channel blocker with an ACE inhibitor/ARB or a thiazide.',
          'Step 3: all three. Step 4: add spironolactone if potassium allows.',
          'Single-pill combinations markedly improve adherence.',
        ],
      },
      {
        heading: 'Lifestyle',
        points: [
          'Reduce salt below 5 g/day — watch bouillon cubes, dried fish and processed sauces.',
          '30 minutes of activity on most days, weight reduction, limited alcohol, stop smoking, increase fruit and vegetables.',
        ],
      },
      {
        heading: 'Pharmacy role',
        points: [
          'Opportunistic blood pressure measurement, adherence support, and checking for OTC products that raise BP (NSAIDs, oral decongestants, some herbal tonics).',
        ],
      },
    ],
    redFlags: [
      'BP ≥180/120 with chest pain, breathlessness, severe headache, visual change, focal weakness or confusion — hypertensive emergency, refer immediately.',
    ],
    source: 'WHO HEARTS technical package / ISH guidelines',
  },
  {
    id: 'cond-diabetes',
    title: 'Diabetes mellitus',
    category: 'condition',
    aliases: ['type 2 diabetes', 'type 1 diabetes', 'sugar disease', 'dm', 'hyperglycaemia'],
    tags: ['endocrine', 'chronic disease', 'blood sugar', 'hba1c', 'foot care'],
    summary:
      'Chronic hyperglycaemia from insulin deficiency or resistance, causing microvascular and macrovascular complications if uncontrolled.',
    sections: [
      {
        heading: 'Diagnosis',
        points: [
          'Fasting plasma glucose ≥7.0 mmol/L, or 2-hour OGTT ≥11.1 mmol/L, or HbA1c ≥6.5% (48 mmol/mol), or a random glucose ≥11.1 mmol/L with classic symptoms.',
          'Classic symptoms: polyuria, polydipsia, weight loss, blurred vision, recurrent infection, slow-healing wounds.',
        ],
      },
      {
        heading: 'Management',
        points: [
          'Lifestyle first and always: diet, weight reduction, physical activity, smoking cessation.',
          'Metformin is first-line pharmacotherapy in type 2 diabetes unless contraindicated.',
          'Add a sulfonylurea, DPP-4 inhibitor, SGLT2 inhibitor or insulin according to availability, comorbidity and cost.',
          'Type 1 diabetes always requires insulin — it is never managed with tablets alone.',
          'Treat blood pressure and lipids: most diabetic patients benefit from a statin.',
        ],
      },
      {
        heading: 'Monitoring and complication screening',
        points: [
          'HbA1c every 3–6 months, individualised target usually below 7% (53 mmol/mol).',
          'Annual: feet (sensation and pulses), eyes (retinopathy), urine albumin-to-creatinine ratio, renal function, lipids.',
          'Daily foot inspection at home; never walk barefoot; treat any ulcer urgently.',
        ],
      },
      {
        heading: 'Sick day rules',
        points: [
          'Never stop insulin during illness even if not eating.',
          'Increase glucose monitoring, maintain fluids, check ketones if available.',
          'Hold metformin, ACE inhibitors, diuretics and NSAIDs if dehydrated.',
        ],
      },
    ],
    redFlags: [
      'Vomiting with high glucose and ketones, deep sighing breathing, fruity breath, abdominal pain — diabetic ketoacidosis, emergency.',
      'Very high glucose with profound dehydration and confusion — hyperosmolar hyperglycaemic state.',
      'Hypoglycaemia with reduced consciousness.',
    ],
    source: 'IDF / WHO diabetes guidance',
  },
  {
    id: 'cond-asthma',
    title: 'Asthma',
    category: 'condition',
    aliases: ['wheezing', 'bronchial asthma', 'reactive airway'],
    tags: ['respiratory', 'chronic disease', 'inhaler', 'wheeze', 'breathlessness'],
    summary:
      'Chronic inflammatory airway disease with variable airflow obstruction, presenting with wheeze, cough, chest tightness and breathlessness, often worse at night.',
    sections: [
      {
        heading: 'Assessment of control',
        points: [
          'In the past 4 weeks: daytime symptoms more than twice a week, any night waking, reliever use more than twice a week, or any activity limitation.',
          'None of these means well controlled; 1–2 partly controlled; 3–4 uncontrolled.',
        ],
      },
      {
        heading: 'Treatment principles',
        points: [
          'Every patient with asthma should be on inhaled corticosteroid-containing therapy — short-acting beta agonist alone is no longer recommended.',
          'Step up by adding a long-acting beta agonist to the inhaled corticosteroid; never give a LABA without an ICS.',
          'Review inhaler technique and adherence before escalating the dose — poor technique is the commonest cause of apparent treatment failure.',
          'Identify and reduce triggers: dust, smoke, cooking fumes, cold air, pollen, exercise, NSAIDs, beta blockers.',
        ],
      },
      {
        heading: 'Acute exacerbation',
        points: [
          'Salbutamol 4–10 puffs via spacer, repeated every 20 minutes for the first hour.',
          'Prednisolone 40–50 mg (children 1–2 mg/kg) for 5 days.',
          'Oxygen to keep saturation 94–98%.',
          'Arrange follow-up within 48 hours of any exacerbation and give a written action plan.',
        ],
      },
    ],
    redFlags: [
      'Unable to complete sentences, silent chest, exhaustion, confusion, cyanosis, saturation under 92%, or a reliever no longer working — life-threatening, call emergency services.',
    ],
    source: 'GINA 2024',
  },
  {
    id: 'cond-uti',
    title: 'Urinary tract infection',
    category: 'condition',
    aliases: ['uti', 'cystitis', 'bladder infection', 'pyelonephritis'],
    tags: ['infection', 'urinary', 'dysuria', 'antibiotic'],
    summary:
      'Bacterial infection of the urinary tract, usually E. coli. Uncomplicated cystitis in a non-pregnant woman can be managed with a short antibiotic course.',
    sections: [
      {
        heading: 'Presentation',
        points: [
          'Cystitis: burning on urination, frequency, urgency, suprapubic discomfort, cloudy or strong-smelling urine.',
          'Pyelonephritis: adds fever, rigors, flank pain and vomiting.',
          'Older adults may present with confusion alone.',
        ],
      },
      {
        heading: 'Treatment',
        points: [
          'Uncomplicated cystitis in women: nitrofurantoin 100 mg modified-release twice daily for 3 days, or trimethoprim where resistance is low.',
          'Men, pregnant women and children need assessment and a longer course — 7 days.',
          'Pregnancy: nitrofurantoin (avoid at term), amoxicillin or cefalexin per sensitivity; avoid trimethoprim in the first trimester.',
          'Pyelonephritis: 7–10 days of a suitable oral agent, or admission if systemically unwell.',
          'Advise good fluid intake and analgesia; there is no strong evidence for urinary alkalinisers.',
        ],
      },
    ],
    redFlags: [
      'Fever with flank pain, vomiting, pregnancy, male patient, catheter, or a child — refer for assessment.',
    ],
    source: 'NICE UTI guidance / WHO AWaRe',
  },
  {
    id: 'cond-diarrhoea',
    title: 'Acute diarrhoea and gastroenteritis',
    category: 'condition',
    aliases: ['diarrhea', 'gastroenteritis', 'running stomach', 'dysentery', 'cholera'],
    tags: ['gastrointestinal', 'dehydration', 'child health', 'ors'],
    summary:
      'Three or more loose stools a day, usually viral and self-limiting. The priority is rehydration, not antibiotics.',
    sections: [
      {
        heading: 'Management',
        points: [
          'Oral rehydration solution after every loose stool, plus zinc for 10–14 days in children.',
          'Continue feeding and breastfeeding.',
          'Loperamide may be used in adults with non-bloody, afebrile diarrhoea only — never in children, dysentery or suspected cholera.',
          'Antibiotics only for dysentery (bloody stool with fever), cholera, confirmed giardia or amoebiasis, or severe traveller\u2019s diarrhoea.',
        ],
      },
      {
        heading: 'Assessing dehydration in a child',
        points: [
          'No dehydration: alert, drinks normally, skin pinch returns immediately.',
          'Some dehydration: restless or irritable, sunken eyes, thirsty, skin pinch returns slowly — treat with ORS under observation.',
          'Severe dehydration: lethargic or unconscious, unable to drink, skin pinch returns very slowly — IV fluids immediately.',
        ],
      },
      {
        heading: 'Prevention',
        points: [
          'Safe water, handwashing with soap, food hygiene, exclusive breastfeeding for 6 months, rotavirus vaccination.',
        ],
      },
    ],
    redFlags: [
      'Blood in the stool, high fever, severe dehydration, rice-water stool with rapid deterioration (cholera), persistent vomiting, diarrhoea over 14 days.',
    ],
    source: 'WHO/UNICEF diarrhoea guidance',
  },
  {
    id: 'cond-anaemia',
    title: 'Anaemia',
    category: 'condition',
    aliases: ['low blood', 'iron deficiency', 'pallor', 'haemoglobin'],
    tags: ['haematology', 'pregnancy', 'iron', 'fatigue', 'nutrition'],
    summary:
      'Reduced haemoglobin causing fatigue, pallor and breathlessness. Iron deficiency is commonest, but malaria, worms, sickle cell disease, chronic disease and blood loss must be considered.',
    sections: [
      {
        heading: 'Diagnostic thresholds',
        points: [
          'Non-pregnant women: Hb below 12 g/dL. Pregnant women: below 11 g/dL. Men: below 13 g/dL. Children 6–59 months: below 11 g/dL.',
          'Microcytic suggests iron deficiency or thalassaemia; macrocytic suggests B12 or folate deficiency.',
        ],
      },
      {
        heading: 'Management',
        points: [
          'Treat the cause as well as the deficiency: deworming, malaria treatment, investigation of bleeding.',
          'Ferrous sulphate 200 mg two to three times daily, continued for 3 months after Hb normalises.',
          'Expect Hb to rise about 1–2 g/dL in 3–4 weeks; if it does not, reconsider the diagnosis or adherence.',
          'Dietary advice: leafy greens, liver, beans, fortified cereals, with vitamin C to aid absorption.',
        ],
      },
    ],
    redFlags: [
      'Severe pallor with breathlessness at rest, chest pain, tachycardia, or heart failure — urgent referral, transfusion may be needed.',
      'Anaemia with unexplained weight loss or change in bowel habit in an adult — investigate for malignancy.',
    ],
    source: 'WHO anaemia guidance',
  },
  {
    id: 'cond-sickle-cell',
    title: 'Sickle cell disease',
    category: 'condition',
    aliases: ['sickle cell', 'ss disease', 'vaso-occlusive crisis', 'sickle'],
    tags: ['haematology', 'genetic', 'crisis', 'pain', 'child health'],
    summary:
      'Inherited haemoglobinopathy causing chronic haemolytic anaemia and recurrent vaso-occlusive pain crises, with a high burden in West Africa.',
    sections: [
      {
        heading: 'Routine care',
        points: [
          'Daily folic acid 5 mg.',
          'Penicillin V prophylaxis from infancy to at least 5 years, plus pneumococcal and meningococcal vaccination.',
          'Malaria prevention is essential — nets and prompt treatment.',
          'Hydroxyurea reduces crisis frequency in those with recurrent crises, under specialist supervision with blood count monitoring.',
          'Generous hydration, avoiding cold, dehydration, extreme exertion and high altitude.',
        ],
      },
      {
        heading: 'Managing a pain crisis',
        points: [
          'Early and adequate analgesia: paracetamol and an NSAID for mild pain, adding an opioid for moderate to severe pain. Do not undertreat.',
          'Warmth, rest and oral or IV hydration.',
          'Look for a precipitant: infection, dehydration, cold, stress.',
        ],
      },
    ],
    redFlags: [
      'Chest pain with fever and breathlessness (acute chest syndrome), sudden weakness or speech difficulty (stroke), priapism over 4 hours, rapidly enlarging spleen, or severe pallor — all are emergencies.',
    ],
    source: 'WHO / national sickle cell guidelines',
  },
  {
    id: 'cond-hiv',
    title: 'HIV infection',
    category: 'condition',
    aliases: ['hiv', 'aids', 'retroviral'],
    tags: ['infectious disease', 'chronic', 'arv', 'prevention', 'confidentiality'],
    summary:
      'Chronic viral infection managed with lifelong antiretroviral therapy. With adherence, life expectancy approaches normal and transmission is prevented.',
    sections: [
      {
        heading: 'Testing and diagnosis',
        points: [
          'Offer testing widely: in TB, pregnancy, STI, unexplained weight loss, recurrent infection, or on request.',
          'Counsel before and after testing, and maintain strict confidentiality.',
        ],
      },
      {
        heading: 'Management',
        points: [
          'Start ART immediately after diagnosis regardless of CD4 count.',
          'First line for most adults is a single daily tablet of tenofovir, lamivudine and dolutegravir.',
          'Viral load monitoring at 6 and 12 months, then annually; undetectable means untransmittable.',
          'Screen for and treat TB, hepatitis B, cryptococcal disease and other opportunistic infections.',
        ],
      },
      {
        heading: 'Prevention',
        points: [
          'Pre-exposure prophylaxis for those at substantial risk.',
          'Post-exposure prophylaxis within 72 hours of exposure, continued for 28 days.',
          'Prevention of mother-to-child transmission through maternal ART and infant prophylaxis.',
          'Condoms, harm reduction and voluntary medical male circumcision.',
        ],
      },
    ],
    source: 'WHO consolidated HIV guidelines',
  },
  {
    id: 'cond-tuberculosis',
    title: 'Tuberculosis',
    category: 'condition',
    aliases: ['tb', 'koch', 'pulmonary tuberculosis'],
    tags: ['infectious disease', 'cough', 'respiratory', 'public health'],
    summary:
      'Mycobacterial infection, usually pulmonary, and a leading infectious cause of death. Any cough over two weeks should prompt TB screening in endemic settings.',
    sections: [
      {
        heading: 'When to suspect',
        points: [
          'Cough for 2 weeks or more, drenching night sweats, unexplained weight loss, fever, haemoptysis, or contact with a known case.',
          'Screen anyone with HIV at every visit using the four-symptom screen.',
        ],
      },
      {
        heading: 'Diagnosis',
        points: [
          'Xpert MTB/RIF on sputum is the preferred initial test and also detects rifampicin resistance.',
          'Chest radiograph supports but does not confirm the diagnosis.',
        ],
      },
      {
        heading: 'Treatment and infection control',
        points: [
          'Standard 6-month regimen: 2 months RHZE then 4 months RH, dosed by weight, with pyridoxine.',
          'Directly observed or digitally supported therapy improves completion.',
          'Screen and test household contacts; provide TB preventive therapy where indicated.',
          'Cough hygiene, ventilation and separation until sputum converts.',
        ],
      },
    ],
    redFlags: [
      'Massive haemoptysis, severe breathlessness, or treatment failure suggesting drug resistance.',
    ],
    source: 'WHO TB guidelines',
  },
  {
    id: 'cond-peptic-ulcer',
    title: 'Dyspepsia, gastritis and peptic ulcer disease',
    category: 'condition',
    aliases: ['ulcer', 'gastritis', 'heartburn', 'gord', 'gerd', 'acid reflux', 'h pylori'],
    tags: ['gastrointestinal', 'pain', 'acid', 'otc'],
    summary:
      'Upper abdominal pain or burning related to acid, often with Helicobacter pylori or NSAID use as the underlying cause.',
    sections: [
      {
        heading: 'Assessment',
        points: [
          'Ask about NSAID and steroid use, alcohol, smoking, and the pattern of pain relative to meals.',
          'Test for H. pylori (stool antigen or urea breath test) in persistent dyspepsia and eradicate if positive.',
        ],
      },
      {
        heading: 'Management',
        points: [
          'Stop or protect against the causative NSAID.',
          'A proton pump inhibitor for 4–8 weeks; antacids and alginates for immediate symptom relief.',
          'H. pylori eradication: PPI twice daily plus two antibiotics for 14 days.',
          'Lifestyle: smaller meals, avoid late-night eating, reduce alcohol, spicy and fatty food, stop smoking, raise the head of the bed.',
        ],
      },
    ],
    redFlags: [
      'ALARM features — anaemia, unintentional weight loss, anorexia, recent onset or progressive symptoms, melaena or haematemesis, dysphagia, or new dyspepsia over 55. Refer for endoscopy.',
    ],
    source: 'NICE dyspepsia and GORD guidance',
  },
  {
    id: 'cond-helminths',
    title: 'Intestinal worms and parasites',
    category: 'condition',
    aliases: [
      'worms',
      'deworming',
      'albendazole',
      'mebendazole',
      'schistosomiasis',
      'praziquantel',
    ],
    tags: ['parasite', 'child health', 'public health', 'nutrition'],
    summary:
      'Soil-transmitted helminths and schistosomiasis are common and contribute to anaemia and malnutrition; periodic deworming is standard public-health practice.',
    sections: [
      {
        heading: 'Treatment',
        points: [
          'Albendazole 400 mg as a single dose (200 mg for children 12–23 months), or mebendazole 500 mg single dose.',
          'Periodic deworming every 6–12 months in endemic areas for children, adolescent girls and pregnant women after the first trimester.',
          'Schistosomiasis: praziquantel 40 mg/kg as a single dose.',
          'Tapeworm: praziquantel 5–10 mg/kg single dose.',
        ],
      },
      {
        heading: 'Prevention',
        points: [
          'Handwashing, wearing footwear, safe water and sanitation, thorough cooking of meat and fish, avoiding contact with infested fresh water.',
        ],
      },
    ],
    source: 'WHO preventive chemotherapy guidance',
  },
  {
    id: 'cond-skin-infections',
    title: 'Common skin conditions and infections',
    category: 'condition',
    aliases: ['rash', 'eczema', 'scabies', 'impetigo', 'boil', 'ringworm', 'abscess'],
    tags: ['dermatology', 'infection', 'itch', 'topical'],
    summary:
      'Frequent counter presentations — fungal infection, bacterial infection, scabies and eczema — each with a distinct first-line treatment.',
    sections: [
      {
        heading: 'Recognition and treatment',
        points: [
          'Ringworm (tinea): scaly annular patch with a raised edge — topical clotrimazole or terbinafine twice daily for 2–4 weeks. Scalp involvement needs oral therapy.',
          'Impetigo: golden crusted lesions — topical antibiotic for limited disease, oral flucloxacillin for widespread disease; keep the child off school until crusted or 48 hours of treatment.',
          'Scabies: intense itch worse at night with burrows in web spaces — permethrin 5% applied neck-down and left 8–12 hours, repeated after 7 days; treat all household members simultaneously and wash bedding hot.',
          'Eczema: emollients generously and often, with a topical corticosteroid of the lowest effective potency for flares; avoid soap and hot water.',
          'Boil or abscess: warm compresses; incision and drainage if fluctuant. Antibiotics only if there is spreading cellulitis or systemic upset.',
        ],
      },
    ],
    redFlags: [
      'Spreading redness with fever, rapidly advancing pain out of proportion, blistering with mucosal involvement, or a non-blanching rash — urgent referral.',
    ],
    source: 'BNF / WHO skin disease guidance',
  },
  {
    id: 'cond-mental-health',
    title: 'Depression and anxiety',
    category: 'condition',
    aliases: ['depression', 'anxiety', 'mental health', 'panic', 'stress'],
    tags: ['mental health', 'psychiatry', 'counselling', 'referral'],
    summary:
      'Common, treatable and frequently presenting first as physical symptoms — fatigue, headache, palpitations or unexplained pain.',
    sections: [
      {
        heading: 'Recognition',
        points: [
          'Two screening questions: over the past month, have you been bothered by little interest or pleasure in doing things, or by feeling down, depressed or hopeless?',
          'Assess sleep, appetite, concentration, guilt, energy and, always, thoughts of self-harm.',
        ],
      },
      {
        heading: 'Management',
        points: [
          'Mild: structured self-care, physical activity, sleep hygiene, social support, problem-solving and brief psychological therapy.',
          'Moderate to severe: an SSRI plus psychological therapy, with review at 1–2 weeks and again at 4 weeks.',
          'Continue medication for at least 6 months after remission.',
          'Rule out organic contributors: thyroid disease, anaemia, chronic infection, alcohol use, and medicines such as steroids.',
        ],
      },
    ],
    redFlags: [
      'Active suicidal thoughts with intent or a plan, psychosis, self-neglect, or risk to others — arrange urgent mental health assessment and do not leave the person alone.',
    ],
    source: 'WHO mhGAP intervention guide',
  },
  {
    id: 'cond-epilepsy',
    title: 'Epilepsy and seizures',
    category: 'condition',
    aliases: ['seizure', 'convulsion', 'fits', 'epilepsy', 'status epilepticus'],
    tags: ['neurology', 'emergency', 'chronic disease'],
    summary:
      'Recurrent unprovoked seizures. Most people become seizure-free on a single well-chosen medicine taken consistently.',
    sections: [
      {
        heading: 'Acute seizure management',
        points: [
          'Protect the head, remove hazards, place in the recovery position once the movements stop.',
          'Never put anything in the mouth or restrain the person.',
          'Time the seizure. If it lasts more than 5 minutes, or a second occurs without recovery, treat as status epilepticus: rectal or buccal/IM benzodiazepine and urgent transfer.',
        ],
      },
      {
        heading: 'Long-term therapy',
        points: [
          'Common options: carbamazepine, sodium valproate, phenytoin, phenobarbital, levetiracetam, chosen by seizure type and availability.',
          'Sodium valproate must be avoided in girls and women of childbearing potential unless no alternative and a pregnancy prevention programme is in place.',
          'Adherence is everything — most breakthrough seizures follow missed doses, sleep deprivation, alcohol or infection.',
          'Never switch brands or stop abruptly.',
        ],
      },
      {
        heading: 'Safety advice',
        points: [
          'Avoid swimming alone, cooking over an open fire unaccompanied, and working at height until seizure-free.',
          'Discuss driving restrictions and preconception folic acid 5 mg in women.',
        ],
      },
    ],
    redFlags: [
      'Seizure lasting over 5 minutes, repeated seizures, first-ever seizure, seizure in pregnancy, or seizure with fever and stiff neck.',
    ],
    source: 'WHO mhGAP / BNF',
  },
  {
    id: 'cond-stroke',
    title: 'Stroke and TIA',
    category: 'condition',
    aliases: ['stroke', 'cva', 'tia', 'mini stroke'],
    tags: ['neurology', 'emergency', 'cardiovascular', 'fast'],
    summary:
      'Sudden focal neurological deficit from infarction or haemorrhage. Time is brain — recognition and immediate transfer determine the outcome.',
    sections: [
      {
        heading: 'Recognition — FAST',
        points: [
          'Face drooping, Arm weakness, Speech difficulty, Time to call emergency services.',
          'Also: sudden visual loss, severe unexplained headache, sudden loss of balance or coordination.',
        ],
      },
      {
        heading: 'Immediate actions',
        points: [
          'Call emergency services and record the exact time symptoms began.',
          'Nothing by mouth until swallowing is assessed.',
          'Check blood glucose — hypoglycaemia mimics stroke.',
          'Do not give aspirin until haemorrhage has been excluded by imaging.',
        ],
      },
      {
        heading: 'Secondary prevention',
        points: [
          'Antiplatelet (or anticoagulation if atrial fibrillation), a statin, blood pressure control, diabetes control, smoking cessation.',
          'Rehabilitation: physiotherapy, speech and occupational therapy, and carer support.',
        ],
      },
    ],
    redFlags: [
      'Any sudden focal deficit — treat as stroke until proven otherwise and transfer immediately.',
    ],
    source: 'WHO / stroke society guidance',
  },
];
