/**
 * Seasonal context helper.
 *
 * Ghana (and most of West Africa) has a well-defined climate calendar that has a
 * strong, repeatable effect on which medications move. We use this to give the
 * AI restock advisor real-world grounding instead of guessing.
 */
export type SeasonInfo = {
  key: string;
  label: string;
  months: string;
  /** What typically happens to demand during this season. */
  demandNotes: string;
  /** Categories that usually spike. */
  likelyCategories: string[];
};

const SEASONS: Record<number, SeasonInfo> = {
  // Month index (0-11) -> season
  11: harmattan(),
  0: harmattan(),
  1: harmattan(),
  2: hotDry(),
  3: majorRains(),
  4: majorRains(),
  5: majorRains(),
  6: majorRains(),
  7: shortDry(),
  8: minorRains(),
  9: minorRains(),
  10: minorRains(),
};

function harmattan(): SeasonInfo {
  return {
    key: 'harmattan',
    label: 'Harmattan (dry, dusty winds)',
    months: 'December – February',
    demandNotes:
      'Dry dusty air drives respiratory irritation, coughs, sore throats, asthma flare-ups, allergic rhinitis, dry/cracked skin, nosebleeds and conjunctivitis. Cold and flu spread increases. Demand for cough syrups, antihistamines, inhalers, lozenges, eye drops, petroleum jelly and moisturisers rises sharply.',
    likelyCategories: [
      'Cough & Cold',
      'Antihistamine',
      'Respiratory',
      'Eye Care',
      'Skin Care',
      'Analgesic',
    ],
  };
}

function hotDry(): SeasonInfo {
  return {
    key: 'hot-dry',
    label: 'Hot dry season',
    months: 'March',
    demandNotes:
      'Peak heat causes dehydration, heat rash, fatigue and higher incidence of food-borne illness. Oral rehydration salts, electrolyte drinks, antidiarrhoeals, skin preparations and simple analgesics move faster.',
    likelyCategories: ['Rehydration', 'Antidiarrhoeal', 'Skin Care', 'Analgesic', 'Vitamins'],
  };
}

function majorRains(): SeasonInfo {
  return {
    key: 'major-rains',
    label: 'Major rainy season',
    months: 'April – July',
    demandNotes:
      'Standing water dramatically increases mosquito breeding, so malaria cases peak. Waterborne disease (typhoid, cholera, diarrhoea) also rises. Expect strong demand for antimalarials, rapid malaria test kits, ORS, antibiotics, antipyretics, insect repellents and water purification products.',
    likelyCategories: ['Antimalarial', 'Rehydration', 'Antibiotic', 'Analgesic', 'Antidiarrhoeal'],
  };
}

function shortDry(): SeasonInfo {
  return {
    key: 'short-dry',
    label: 'Short dry spell',
    months: 'August',
    demandNotes:
      'A brief drier, cooler break between the rains. Malaria remains elevated from the preceding rains, while respiratory infections begin to tick up with cooler nights.',
    likelyCategories: ['Antimalarial', 'Cough & Cold', 'Analgesic'],
  };
}

function minorRains(): SeasonInfo {
  return {
    key: 'minor-rains',
    label: 'Minor rainy season',
    months: 'September – November',
    demandNotes:
      'A second, shorter wet period. Malaria stays high, and school resumption increases circulation of colds, flu and childhood infections. Paediatric formulations, antimalarials and antipyretics move well.',
    likelyCategories: ['Antimalarial', 'Cough & Cold', 'Paediatric', 'Analgesic', 'Vitamins'],
  };
}

export function getSeasonInfo(date = new Date()): SeasonInfo {
  return SEASONS[date.getMonth()] ?? majorRains();
}

/** Human-readable month name, used in prompts and headings. */
export function monthName(date = new Date()) {
  return date.toLocaleDateString('en-GB', { month: 'long' });
}
