import type { KnowledgeEntry } from './types';

/**
 * Analgesics, antipyretics, antimicrobials and antimalarials — the medicines
 * dispensed most often in a community pharmacy.
 *
 * Dosing shown is standard adult reference dosing unless stated. It is never a
 * prescription: the prescriber's instruction and the national formulary win.
 */
export const PAIN_AND_INFECTION_DRUGS: KnowledgeEntry[] = [
  {
    id: 'drug-paracetamol',
    title: 'Paracetamol (acetaminophen)',
    category: 'drug',
    aliases: ['panadol', 'acetaminophen', 'calpol', 'paracetamol', 'para'],
    tags: ['analgesic', 'antipyretic', 'pain', 'fever', 'otc', 'headache'],
    summary:
      'First-line analgesic and antipyretic for mild to moderate pain and fever. Safe in pregnancy and breastfeeding at normal doses, and the preferred painkiller when NSAIDs are contraindicated.',
    sections: [
      {
        heading: 'Adult dosing',
        points: [
          '500 mg – 1 g every 4–6 hours as needed.',
          'Maximum 4 g (8 × 500 mg tablets) in any 24 hours.',
          'Reduce the maximum to 2–3 g/day in adults under 50 kg, chronic alcohol use, malnutrition, or liver impairment.',
        ],
      },
      {
        heading: 'Paediatric dosing',
        points: [
          '10–15 mg/kg per dose every 4–6 hours, maximum 4 doses (60 mg/kg) in 24 hours.',
          'Always dose by weight, not age, and confirm the strength of the suspension (120 mg/5 mL vs 250 mg/5 mL).',
          'Give the caregiver a marked syringe or spoon, never a kitchen spoon.',
        ],
      },
      {
        heading: 'Cautions and contraindications',
        points: [
          'Severe hepatic impairment or active liver disease.',
          'Chronic heavy alcohol intake — lower ceiling dose.',
          'Check every other product the patient is taking: cold, flu and pain combinations very often contain paracetamol, which is the commonest route to accidental overdose.',
        ],
      },
      {
        heading: 'Side effects',
        points: [
          'Rare at therapeutic dose. Skin rash and blood dyscrasias are uncommon.',
          'Overdose causes delayed hepatotoxicity — the patient may feel well for 24 hours before liver failure appears.',
        ],
      },
      {
        heading: 'Interactions',
        points: [
          'Warfarin — regular high-dose paracetamol can raise INR; monitor.',
          'Enzyme inducers (carbamazepine, rifampicin, isoniazid, phenytoin) increase the risk of liver injury in overdose.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'Do not exceed 8 tablets of 500 mg in 24 hours, and space doses at least 4 hours apart.',
          'Check other medicines for hidden paracetamol.',
          'If fever persists beyond 3 days, or pain beyond 5 days, see a clinician.',
        ],
      },
    ],
    redFlags: [
      'Suspected overdose — refer to hospital immediately even if the patient looks well; N-acetylcysteine is most effective within 8 hours.',
      'Fever with stiff neck, rash that does not blanch, confusion or breathlessness.',
    ],
    source: 'BNF / WHO Model List of Essential Medicines',
  },
  {
    id: 'drug-ibuprofen',
    title: 'Ibuprofen',
    category: 'drug',
    aliases: ['brufen', 'nurofen', 'ibuprufen', 'ibruprofen'],
    tags: ['nsaid', 'analgesic', 'anti-inflammatory', 'pain', 'fever', 'otc'],
    summary:
      'Non-steroidal anti-inflammatory for pain with an inflammatory component — musculoskeletal pain, dysmenorrhoea, dental pain, fever.',
    sections: [
      {
        heading: 'Adult dosing',
        points: [
          '200–400 mg every 6–8 hours with or after food.',
          'OTC maximum 1.2 g/day; prescribed maximum 2.4 g/day in divided doses.',
          'Use the lowest effective dose for the shortest time.',
        ],
      },
      {
        heading: 'Paediatric dosing',
        points: [
          '5–10 mg/kg per dose every 6–8 hours, maximum 30 mg/kg/day.',
          'Avoid in infants under 3 months and in any child who is dehydrated or vomiting.',
        ],
      },
      {
        heading: 'Cautions and contraindications',
        points: [
          'Active or previous peptic ulcer or GI bleeding.',
          'Severe heart failure, significant renal impairment, or dehydration.',
          'Asthma where NSAIDs have previously triggered bronchospasm.',
          'Third trimester of pregnancy — avoid (premature closure of the ductus arteriosus). Avoid from week 20 unless specialist advised.',
          'Avoid in suspected dengue or any bleeding illness — use paracetamol instead.',
        ],
      },
      {
        heading: 'Side effects',
        points: [
          'Dyspepsia, nausea, gastric irritation and ulceration.',
          'Fluid retention, raised blood pressure, reduced renal function.',
          'Rarely bronchospasm in NSAID-sensitive asthma.',
        ],
      },
      {
        heading: 'Interactions',
        points: [
          'Other NSAIDs or aspirin — additive GI bleeding risk, do not combine.',
          'Warfarin, DOACs, clopidogrel, SSRIs, corticosteroids — increased bleeding risk.',
          'ACE inhibitors or ARBs + diuretics + NSAID = the "triple whammy" that precipitates acute kidney injury.',
          'Lithium and methotrexate levels rise.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'Take with or just after food, with a full glass of water.',
          'Stop and seek help if there is black tarry stool, vomiting blood, or severe stomach pain.',
          'Paracetamol and ibuprofen can be alternated for stubborn fever if both are appropriate for that patient.',
        ],
      },
    ],
    redFlags: ['Black or tarry stools, coffee-ground vomit, sudden reduction in urine output.'],
    source: 'BNF / WHO Model List of Essential Medicines',
  },
  {
    id: 'drug-diclofenac',
    title: 'Diclofenac',
    category: 'drug',
    aliases: ['voltaren', 'cataflam', 'diclo'],
    tags: ['nsaid', 'pain', 'arthritis', 'inflammation', 'injection'],
    summary:
      'Potent NSAID for moderate inflammatory pain — arthritis, renal colic, post-operative and musculoskeletal pain. Carries the highest cardiovascular risk of the common NSAIDs.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Oral: 50 mg two to three times daily, or 75 mg modified-release twice daily. Maximum 150 mg/day.',
          'IM: 75 mg once or twice daily into the upper outer gluteal quadrant, for no more than 2 days.',
          'Topical gel 1–4 g to the affected area up to 4 times daily — a much safer option for localised joint pain.',
        ],
      },
      {
        heading: 'Cautions',
        points: [
          'Contraindicated in ischaemic heart disease, cerebrovascular disease, peripheral arterial disease and moderate-to-severe heart failure.',
          'Same GI, renal and pregnancy cautions as all NSAIDs.',
          'Do not combine with any other systemic NSAID.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'Take with food.',
          'Report swelling of ankles, breathlessness or chest pain.',
          'Prefer topical gel for localised pain in older adults.',
        ],
      },
    ],
    source: 'BNF',
  },
  {
    id: 'drug-aspirin',
    title: 'Aspirin (acetylsalicylic acid)',
    category: 'drug',
    aliases: ['asa', 'acetylsalicylic acid', 'aspirin 75'],
    tags: ['antiplatelet', 'nsaid', 'cardiovascular', 'stroke', 'mi'],
    summary:
      'Low dose is an antiplatelet used for secondary prevention of heart attack and stroke; high dose is an analgesic/anti-inflammatory that is now rarely used for pain.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Antiplatelet (secondary prevention): 75–100 mg once daily, long term.',
          'Acute suspected myocardial infarction: 300 mg chewed immediately while arranging emergency transfer.',
          'Analgesic: 300–900 mg every 4–6 hours, maximum 4 g/day — rarely used now.',
        ],
      },
      {
        heading: 'Cautions and contraindications',
        points: [
          'Never give to children under 16 years (Reye syndrome) except for Kawasaki disease under specialist care.',
          'Active peptic ulcer, haemophilia or other bleeding disorders.',
          'Aspirin-sensitive asthma.',
          'Third trimester of pregnancy at analgesic doses.',
        ],
      },
      {
        heading: 'Interactions',
        points: [
          'Warfarin, DOACs, clopidogrel — additive bleeding risk; combinations only on specialist advice.',
          'Ibuprofen taken shortly before aspirin can block its antiplatelet effect — take aspirin at least 2 hours before ibuprofen.',
          'Methotrexate toxicity increases.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'Take with food; consider a gastroprotective agent if there are risk factors.',
          'Do not stop low-dose aspirin before surgery or dental work without asking the prescriber.',
        ],
      },
    ],
    redFlags: ['Ringing in the ears, hyperventilation and confusion suggest salicylate toxicity.'],
    source: 'BNF / WHO',
  },
  {
    id: 'drug-amoxicillin',
    title: 'Amoxicillin',
    category: 'drug',
    aliases: ['amoxil', 'amoxycillin', 'amox'],
    tags: ['antibiotic', 'penicillin', 'infection', 'chest infection', 'otitis'],
    summary:
      'Broad-spectrum penicillin, first line for many community respiratory, dental, ear and urinary infections.',
    sections: [
      {
        heading: 'Adult dosing',
        points: [
          'Typical: 500 mg every 8 hours for 5–7 days.',
          'Severe infection or community-acquired pneumonia: 1 g every 8 hours.',
          'Dental abscess: 500 mg every 8 hours for 5 days alongside drainage.',
        ],
      },
      {
        heading: 'Paediatric dosing',
        points: [
          '40–90 mg/kg/day divided every 8–12 hours depending on severity and local resistance.',
          'Standard mild infection: 25–50 mg/kg/day divided 8-hourly.',
        ],
      },
      {
        heading: 'Cautions',
        points: [
          'Absolute contraindication with any true penicillin allergy (rash, angioedema, anaphylaxis).',
          'Reduce dose in significant renal impairment.',
          'Avoid empirically in suspected glandular fever — it causes a florid rash.',
        ],
      },
      {
        heading: 'Side effects',
        points: [
          'Nausea, diarrhoea, oral or vaginal candidiasis.',
          'Rash — distinguish a benign maculopapular rash from true urticarial allergy.',
          'Antibiotic-associated colitis (Clostridioides difficile) after prolonged use.',
        ],
      },
      {
        heading: 'Interactions',
        points: [
          'Methotrexate — reduced excretion, increased toxicity.',
          'Allopurinol — increased rash frequency.',
          'May reduce the reliability of oral typhoid vaccine.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'Finish the full course exactly as prescribed even if feeling better.',
          'Can be taken with or without food; food reduces nausea.',
          'Report a spreading rash, facial swelling or breathing difficulty immediately.',
        ],
      },
    ],
    source: 'BNF / WHO AWaRe classification (Access group)',
  },
  {
    id: 'drug-coamoxiclav',
    title: 'Amoxicillin–clavulanate (co-amoxiclav)',
    category: 'drug',
    aliases: ['augmentin', 'co-amoxiclav', 'coamoxiclav', 'amoxiclav'],
    tags: ['antibiotic', 'penicillin', 'beta-lactamase', 'bite', 'sinusitis'],
    summary:
      'Amoxicillin plus a beta-lactamase inhibitor, which extends cover to many resistant organisms — used for bites, sinusitis, aspiration pneumonia and complicated skin or urinary infections.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Adults: 625 mg every 8 hours, or 1 g every 12 hours for more severe infection.',
          'Children: dose on the amoxicillin component, typically 25–45 mg/kg/day divided 12-hourly.',
        ],
      },
      {
        heading: 'How it differs from plain amoxicillin',
        points: [
          'Clavulanate protects amoxicillin from beta-lactamase enzymes, so it covers organisms that destroy plain amoxicillin (many Staph aureus, Haemophilus, E. coli, Bacteroides).',
          'It causes markedly more diarrhoea and carries a higher risk of cholestatic jaundice.',
          'Reserve it for when plain amoxicillin has failed or the indication requires the wider cover — this is good antimicrobial stewardship.',
        ],
      },
      {
        heading: 'Cautions',
        points: [
          'Penicillin allergy — contraindicated.',
          'Previous co-amoxiclav-associated jaundice or hepatic dysfunction.',
          'Take with food to reduce GI upset.',
        ],
      },
    ],
    source: 'BNF / WHO AWaRe (Access)',
  },
  {
    id: 'drug-azithromycin',
    title: 'Azithromycin',
    category: 'drug',
    aliases: ['zithromax', 'azithro', 'z-pack'],
    tags: ['antibiotic', 'macrolide', 'chest infection', 'atypical', 'chlamydia'],
    summary:
      'Macrolide with a long half-life allowing short courses. Useful in penicillin allergy, atypical pneumonia, chlamydia and some travellers diarrhoea.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Respiratory infection: 500 mg once daily for 3 days, or 500 mg day 1 then 250 mg daily for 4 days.',
          'Uncomplicated genital chlamydia: 1 g as a single dose (check current national guidance — doxycycline is now preferred in many).',
          'Children: 10 mg/kg once daily for 3 days.',
        ],
      },
      {
        heading: 'Cautions',
        points: [
          'QT prolongation — caution with existing QT prolongation, electrolyte disturbance, or other QT-prolonging drugs.',
          'Hepatic impairment.',
          'Myasthenia gravis may worsen.',
        ],
      },
      {
        heading: 'Interactions',
        points: [
          'Other QT-prolonging drugs: quinine, chloroquine, haloperidol, ondansetron, fluoroquinolones.',
          'Warfarin — monitor INR.',
          'Antacids reduce absorption; separate by 2 hours.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'The short course is complete even though symptoms may still be settling — tissue levels persist for days.',
          'Report palpitations or fainting.',
        ],
      },
    ],
    source: 'BNF / WHO AWaRe (Watch)',
  },
  {
    id: 'drug-ciprofloxacin',
    title: 'Ciprofloxacin',
    category: 'drug',
    aliases: ['cipro', 'ciproxin', 'ciprofloxacine'],
    tags: ['antibiotic', 'quinolone', 'fluoroquinolone', 'uti', 'typhoid'],
    summary:
      'Fluoroquinolone active against Gram-negative organisms; reserved for specific indications because of resistance and tendon/neurological toxicity.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Uncomplicated UTI: 250–500 mg twice daily for 3 days.',
          'Severe or systemic infection: 500–750 mg twice daily.',
          'Enteric fever: 500 mg twice daily for 7–14 days where the isolate is sensitive.',
        ],
      },
      {
        heading: 'Serious cautions',
        points: [
          'Tendonitis and tendon rupture, especially the Achilles, in patients over 60 and those on corticosteroids — stop at the first sign of tendon pain.',
          'Peripheral neuropathy and CNS effects (seizure threshold lowered) can be irreversible.',
          'Avoid in children and in pregnancy unless there is no alternative.',
          'Aortic aneurysm risk in predisposed patients.',
        ],
      },
      {
        heading: 'Interactions',
        points: [
          'Divalent and trivalent cations — antacids, calcium, iron, zinc, magnesium and milk block absorption. Separate by at least 2 hours before or 6 hours after.',
          'Theophylline toxicity, warfarin potentiation, NSAID-related seizure risk.',
          'Additive QT prolongation.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'Do not take with milk, yoghurt, antacids or iron tablets.',
          'Stop and report tendon, muscle or joint pain, or pins and needles.',
          'Keep well hydrated and avoid strong sun exposure (photosensitivity).',
        ],
      },
    ],
    source: 'BNF / WHO AWaRe (Watch)',
  },
  {
    id: 'drug-metronidazole',
    title: 'Metronidazole',
    category: 'drug',
    aliases: ['flagyl', 'metro', 'metronidazol'],
    tags: ['antibiotic', 'anaerobe', 'amoebiasis', 'giardia', 'bv', 'dental'],
    summary:
      'Covers anaerobic bacteria and protozoa — dental infection, bacterial vaginosis, trichomoniasis, amoebiasis, giardiasis and intra-abdominal sepsis.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Anaerobic infection / dental: 400 mg every 8 hours for 5–7 days.',
          'Bacterial vaginosis: 400 mg twice daily for 5–7 days, or 2 g single dose.',
          'Amoebiasis (intestinal): 800 mg three times daily for 5–10 days, followed by a luminal amoebicide.',
          'Giardiasis: 2 g once daily for 3 days, or 400 mg three times daily for 5 days.',
          'Children: 7.5 mg/kg every 8 hours.',
        ],
      },
      {
        heading: 'Cautions',
        points: [
          'Avoid high-dose regimens in the first trimester of pregnancy.',
          'Reduce dose in severe hepatic impairment.',
          'Prolonged courses risk peripheral neuropathy.',
        ],
      },
      {
        heading: 'Interactions',
        points: [
          'Alcohol — disulfiram-like reaction with flushing, vomiting and tachycardia. Avoid alcohol during treatment and for 48 hours after.',
          'Warfarin — INR rises significantly; monitor closely.',
          'Lithium and phenytoin levels rise.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'Absolutely no alcohol during the course or for 2 days after, including in tonics and cough syrups.',
          'Take with or after food to reduce nausea.',
          'A metallic taste and dark urine are expected and harmless.',
        ],
      },
    ],
    source: 'BNF / WHO',
  },
  {
    id: 'drug-doxycycline',
    title: 'Doxycycline',
    category: 'drug',
    aliases: ['vibramycin', 'doxy'],
    tags: ['antibiotic', 'tetracycline', 'acne', 'chlamydia', 'malaria prophylaxis'],
    summary:
      'Broad-spectrum tetracycline used for atypical pneumonia, chlamydia, acne, rickettsial disease and malaria prophylaxis.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'General infection: 200 mg on day 1, then 100 mg once daily; severe infection 100 mg twice daily.',
          'Chlamydia: 100 mg twice daily for 7 days.',
          'Acne: 100 mg once daily for 6–12 weeks.',
          'Malaria prophylaxis: 100 mg once daily starting 1–2 days before travel, continuing 4 weeks after leaving the area.',
        ],
      },
      {
        heading: 'Cautions and contraindications',
        points: [
          'Contraindicated in pregnancy, breastfeeding and children under 12 years (dental staining and effects on bone growth).',
          'Photosensitivity is common and can be severe.',
          'Oesophageal ulceration if swallowed without enough water or taken lying down.',
        ],
      },
      {
        heading: 'Interactions',
        points: [
          'Antacids, iron, calcium, zinc and milk reduce absorption — separate by 2 hours.',
          'Warfarin potentiation.',
          'Enzyme inducers (rifampicin, carbamazepine, phenytoin) reduce doxycycline levels.',
        ],
      },
      {
        heading: 'Counselling points',
        points: [
          'Swallow with a full glass of water, sitting or standing, and stay upright for 30 minutes.',
          'Use sunscreen and cover up in strong sun.',
        ],
      },
    ],
    source: 'BNF / WHO',
  },
  {
    id: 'drug-cotrimoxazole',
    title: 'Co-trimoxazole (sulfamethoxazole + trimethoprim)',
    category: 'drug',
    aliases: ['septrin', 'bactrim', 'cotrim', 'smx-tmp'],
    tags: ['antibiotic', 'hiv', 'pcp', 'prophylaxis', 'uti'],
    summary:
      'Fixed-dose antibacterial combination used for urinary and respiratory infection and, importantly, as prophylaxis in people living with HIV.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Adults, general infection: 960 mg twice daily.',
          'HIV prophylaxis: 960 mg once daily.',
          'Pneumocystis pneumonia treatment: high dose by body weight under specialist supervision.',
          'Children: 24 mg/kg twice daily of the combined strength.',
        ],
      },
      {
        heading: 'Cautions',
        points: [
          'Sulfonamide allergy, severe renal or hepatic impairment, G6PD deficiency (haemolysis), blood dyscrasias.',
          'Avoid in the first trimester (folate antagonist) and near term (kernicterus risk).',
          'Monitor potassium — hyperkalaemia is common, especially with ACE inhibitors or ARBs.',
        ],
      },
      {
        heading: 'Serious side effects',
        points: [
          'Stevens–Johnson syndrome and toxic epidermal necrolysis — stop at the first rash.',
          'Bone marrow suppression on prolonged therapy.',
        ],
      },
      {
        heading: 'Interactions',
        points: [
          'Warfarin, methotrexate, phenytoin — levels and effect increase.',
          'ACE inhibitors, ARBs, spironolactone — dangerous hyperkalaemia.',
        ],
      },
    ],
    redFlags: ['Any new rash, mouth ulcers, blistering, sore throat or unexplained bruising.'],
    source: 'BNF / WHO HIV guidelines',
  },
  {
    id: 'drug-ceftriaxone',
    title: 'Ceftriaxone',
    category: 'drug',
    aliases: ['rocephin', 'ceftriaxon'],
    tags: ['antibiotic', 'cephalosporin', 'injection', 'meningitis', 'sepsis'],
    summary:
      'Third-generation injectable cephalosporin for serious infection — meningitis, sepsis, severe pneumonia, enteric fever and gonorrhoea.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Adults: 1–2 g IV or IM once daily.',
          'Meningitis: 2 g every 12 hours.',
          'Gonorrhoea: 500 mg – 1 g IM as a single dose, usually with azithromycin per local guidance.',
          'Children: 50–80 mg/kg once daily; 100 mg/kg/day in meningitis.',
        ],
      },
      {
        heading: 'Cautions',
        points: [
          'Cephalosporin or severe penicillin allergy (cross-reactivity around 1–3%).',
          'Never mix or co-administer with calcium-containing infusions, especially in neonates — fatal precipitates.',
          'Avoid in neonates with jaundice.',
        ],
      },
      {
        heading: 'Practical notes',
        points: [
          'For IM use, reconstitute with 1% lidocaine to reduce pain — lidocaine reconstitution must never be given IV.',
          'Store reconstituted solution per the manufacturer insert and discard leftovers.',
        ],
      },
    ],
    source: 'BNF / WHO AWaRe (Watch)',
  },
  {
    id: 'drug-artemether-lumefantrine',
    title: 'Artemether–lumefantrine (ACT)',
    category: 'drug',
    aliases: ['coartem', 'al', 'act', 'lonart', 'artemether lumefantrine'],
    tags: ['antimalarial', 'malaria', 'act', 'artemisinin'],
    summary:
      'First-line artemisinin-based combination therapy for uncomplicated Plasmodium falciparum malaria.',
    sections: [
      {
        heading: 'Adult dosing (20/120 mg tablets)',
        points: [
          'Four tablets per dose, six doses over 3 days: at 0 and 8 hours on day 1, then twice daily on days 2 and 3.',
          'Total 24 tablets over three days for an adult of 35 kg or more.',
        ],
      },
      {
        heading: 'Paediatric dosing by weight',
        points: [
          '5 to under 15 kg: 1 tablet per dose.',
          '15 to under 25 kg: 2 tablets per dose.',
          '25 to under 35 kg: 3 tablets per dose.',
          '35 kg and above: 4 tablets per dose.',
          'Same six-dose schedule in every weight band.',
        ],
      },
      {
        heading: 'Critical counselling',
        points: [
          'Take with fatty food or milk — absorption of lumefantrine is very poor on an empty stomach and this is the commonest cause of treatment failure.',
          'If vomiting occurs within one hour, repeat the dose.',
          'Complete all six doses even if the fever settles after the second.',
        ],
      },
      {
        heading: 'Cautions',
        points: [
          'Avoid in the first trimester of pregnancy unless no alternative — quinine plus clindamycin is the usual first-trimester option.',
          'QT prolongation: caution with other QT-prolonging drugs.',
          'Not for severe malaria — that needs parenteral artesunate.',
        ],
      },
    ],
    redFlags: [
      'Severe malaria signs — impaired consciousness, convulsions, inability to drink or breastfeed, repeated vomiting, dark or absent urine, severe anaemia, respiratory distress. Refer immediately for parenteral artesunate.',
    ],
    source: 'WHO Guidelines for Malaria (2023) / national malaria treatment guidelines',
  },
  {
    id: 'drug-artesunate',
    title: 'Artesunate (injectable)',
    category: 'drug',
    aliases: ['injectable artesunate', 'iv artesunate'],
    tags: ['antimalarial', 'severe malaria', 'emergency', 'injection'],
    summary:
      'The definitive treatment for severe malaria in adults and children, superior to quinine for mortality.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          '2.4 mg/kg IV or IM at 0, 12 and 24 hours, then once daily until oral therapy is tolerated.',
          'Children under 20 kg: 3 mg/kg per dose.',
          'Minimum 24 hours of parenteral therapy, then a full 3-day ACT course.',
        ],
      },
      {
        heading: 'Practical notes',
        points: [
          'Reconstitute with the supplied sodium bicarbonate, then dilute; use within 1 hour.',
          'If parenteral treatment is impossible, give a single rectal artesunate dose and refer urgently.',
        ],
      },
      {
        heading: 'Follow-up',
        points: [
          'Post-artesunate delayed haemolysis can appear 1–3 weeks later — check haemoglobin at follow-up.',
        ],
      },
    ],
    source: 'WHO Guidelines for Malaria',
  },
  {
    id: 'drug-sp-iptp',
    title: 'Sulfadoxine–pyrimethamine (IPTp)',
    category: 'drug',
    aliases: ['sp', 'fansidar', 'iptp', 'maloxine'],
    tags: ['antimalarial', 'pregnancy', 'prevention', 'antenatal'],
    summary:
      'Used for intermittent preventive treatment of malaria in pregnancy (IPTp) rather than for treatment.',
    sections: [
      {
        heading: 'How it is used',
        points: [
          'Given as directly observed therapy at each scheduled antenatal visit from the second trimester, at least one month apart, for at least three doses.',
          'Give with folic acid 0.4 mg daily — high-dose folic acid (5 mg) antagonises its antimalarial effect.',
        ],
      },
      {
        heading: 'Cautions',
        points: [
          'Do not use in the first trimester or in women on co-trimoxazole prophylaxis.',
          'Sulfonamide allergy and G6PD deficiency.',
          'Severe cutaneous reactions are rare but serious.',
        ],
      },
    ],
    source: 'WHO IPTp guidance',
  },
  {
    id: 'drug-fluconazole',
    title: 'Fluconazole and topical antifungals',
    category: 'drug',
    aliases: ['diflucan', 'clotrimazole', 'canesten', 'ketoconazole', 'griseofulvin'],
    tags: ['antifungal', 'thrush', 'candida', 'ringworm', 'tinea'],
    summary:
      'Azole antifungals treat candidiasis and dermatophyte infection; topical agents are first line for localised disease.',
    sections: [
      {
        heading: 'Dosing',
        points: [
          'Vaginal candidiasis: fluconazole 150 mg as a single oral dose, or clotrimazole 500 mg pessary as a single dose.',
          'Oral candidiasis: fluconazole 50–100 mg daily for 7–14 days, or nystatin suspension after food four times daily.',
          'Tinea corporis/cruris: topical clotrimazole or terbinafine twice daily for 2–4 weeks, continuing 1 week after clearance.',
          'Tinea capitis needs systemic therapy (griseofulvin or terbinafine) — topicals will not work.',
        ],
      },
      {
        heading: 'Cautions',
        points: [
          'Fluconazole is avoided in pregnancy, particularly high or repeated doses; use topical therapy instead.',
          'Hepatotoxicity with prolonged azole therapy; monitor LFTs on long courses.',
          'QT prolongation at higher doses.',
        ],
      },
      {
        heading: 'Interactions',
        points: [
          'Fluconazole inhibits CYP2C9/3A4 — raises warfarin INR, phenytoin, and statin levels (avoid with simvastatin).',
          'Additive QT risk with macrolides and quinine.',
        ],
      },
    ],
    source: 'BNF',
  },
];
