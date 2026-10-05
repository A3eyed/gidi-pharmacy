import type { InteractionEntry, KnowledgeEntry } from './types';
import { PAIN_AND_INFECTION_DRUGS } from './drugs-pain-infection';
import { CHRONIC_CARE_DRUGS } from './drugs-chronic-care';
import { SPECIALIST_DRUGS } from './drugs-specialist';
import { CONDITIONS } from './conditions';
import { CLINICAL_PRACTICE } from './clinical-practice';
import { PHARMACY_OPERATIONS } from './pharmacy-operations';
import { INTERACTIONS } from './interactions';

export type { KnowledgeEntry, KnowledgeSection, InteractionEntry } from './types';
export { INTERACTIONS } from './interactions';

/** Every entry Azara can draw on, in one flat list. */
export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  ...PAIN_AND_INFECTION_DRUGS,
  ...CHRONIC_CARE_DRUGS,
  ...SPECIALIST_DRUGS,
  ...CONDITIONS,
  ...CLINICAL_PRACTICE,
  ...PHARMACY_OPERATIONS,
];

export const KNOWLEDGE_STATS = {
  entries: KNOWLEDGE_BASE.length,
  interactions: INTERACTIONS.length,
  byCategory: KNOWLEDGE_BASE.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.category] = (acc[entry.category] ?? 0) + 1;
    return acc;
  }, {}),
};

/* ------------------------------------------------------------------ *
 * Text processing
 * ------------------------------------------------------------------ */

const STOPWORDS = new Set([
  'a',
  'an',
  'the',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'of',
  'to',
  'in',
  'on',
  'for',
  'with',
  'and',
  'or',
  'but',
  'if',
  'then',
  'than',
  'that',
  'this',
  'these',
  'those',
  'it',
  'its',
  'as',
  'at',
  'by',
  'from',
  'can',
  'could',
  'should',
  'would',
  'will',
  'shall',
  'do',
  'does',
  'did',
  'have',
  'has',
  'had',
  'i',
  'you',
  'he',
  'she',
  'we',
  'they',
  'my',
  'me',
  'what',
  'which',
  'who',
  'whom',
  'how',
  'when',
  'where',
  'why',
  'please',
  'tell',
  'about',
  'give',
  'need',
  'want',
  'know',
  'any',
  'some',
  'there',
  'here',
  'also',
  'not',
  'no',
  'yes',
  'good',
  'bad',
  'ok',
  'okay',
  'thanks',
  'thank',
  'hello',
  'hi',
  'hey',
]);

/**
 * Everyday and local phrasings mapped onto the vocabulary the knowledge base
 * actually uses. This is what lets "running stomach" find the diarrhoea entry.
 */
const SYNONYMS: Record<string, string[]> = {
  bp: ['blood', 'pressure', 'hypertension'],
  hbp: ['blood', 'pressure', 'hypertension'],
  sugar: ['diabetes', 'glucose'],
  sugars: ['diabetes', 'glucose'],
  dm: ['diabetes'],
  runny: ['cold', 'rhinitis'],
  running: ['diarrhoea'],
  stomach: ['abdominal', 'gastric'],
  purging: ['diarrhoea'],
  loose: ['diarrhoea'],
  runs: ['diarrhoea'],
  catarrh: ['cold', 'rhinitis'],
  waist: ['back', 'pain'],
  pile: ['haemorrhoid'],
  piles: ['haemorrhoid'],
  painkiller: ['analgesic', 'pain'],
  painkillers: ['analgesic', 'pain'],
  antibiotics: ['antibiotic'],
  jab: ['injection'],
  shot: ['injection'],
  vomit: ['vomiting', 'nausea'],
  vomiting: ['nausea', 'antiemetic'],
  temperature: ['fever'],
  hot: ['fever'],
  bp_machine: ['blood', 'pressure'],
  preggy: ['pregnancy'],
  pregnant: ['pregnancy'],
  breastfeeding: ['lactation', 'pregnancy'],
  kids: ['child', 'paediatric'],
  kid: ['child', 'paediatric'],
  children: ['child', 'paediatric'],
  baby: ['child', 'infant', 'paediatric'],
  dose: ['dosing', 'dosage'],
  dosage: ['dosing', 'dose'],
  doses: ['dosing', 'dose'],
  interact: ['interaction'],
  interacts: ['interaction'],
  contraindication: ['contraindications', 'caution'],
  sideeffect: ['side', 'effects'],
  tab: ['tablet'],
  tabs: ['tablet'],
  jaundice: ['liver', 'hepatic'],
  kidney: ['renal'],
  liver: ['hepatic'],
  heart: ['cardiac', 'cardiovascular'],
  stroke: ['cva'],
  bleeding: ['haemorrhage'],
  family: ['contraception', 'planning'],
  planning: ['contraception'],
  worms: ['helminth', 'deworming'],
  stock: ['inventory'],
  profit: ['margin', 'business'],
  expiry: ['expired', 'expiring'],
};

function normalise(text: string) {
  return text
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[^a-z0-9+\-/' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Very light stemming — enough to match plurals without a full stemmer. */
function stem(token: string) {
  if (token.length > 4 && token.endsWith('ies')) return `${token.slice(0, -3)}y`;
  if (token.length > 4 && token.endsWith('es')) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith('s') && !token.endsWith('ss')) return token.slice(0, -1);
  return token;
}

export function tokenize(text: string): string[] {
  const words = normalise(text).split(' ').filter(Boolean);
  const out: string[] = [];
  for (const word of words) {
    if (STOPWORDS.has(word)) continue;
    const base = stem(word);
    if (base.length < 2) continue;
    out.push(base);
    const expansions = SYNONYMS[word] ?? SYNONYMS[base];
    if (expansions) {
      for (const extra of expansions) out.push(stem(extra));
    }
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * Index
 * ------------------------------------------------------------------ */

type EntryIndex = {
  entry: KnowledgeEntry;
  weights: Map<string, number>;
  phrases: string[];
};

function addTokens(map: Map<string, number>, text: string, weight: number) {
  for (const token of tokenize(text)) {
    map.set(token, (map.get(token) ?? 0) + weight);
  }
}

function indexEntry(entry: KnowledgeEntry): EntryIndex {
  const weights = new Map<string, number>();
  addTokens(weights, entry.title, 8);
  for (const alias of entry.aliases ?? []) addTokens(weights, alias, 7);
  for (const tag of entry.tags ?? []) addTokens(weights, tag, 5);
  addTokens(weights, entry.summary, 2.5);
  for (const section of entry.sections) {
    addTokens(weights, section.heading, 2.5);
    for (const point of section.points) addTokens(weights, point, 1);
  }
  for (const flag of entry.redFlags ?? []) addTokens(weights, flag, 1);

  const phrases = [entry.title.toLowerCase(), ...(entry.aliases ?? []).map((a) => a.toLowerCase())];

  return { entry, weights, phrases };
}

let baseIndex: EntryIndex[] | null = null;
let documentFrequency: Map<string, number> | null = null;

function ensureIndex() {
  if (baseIndex && documentFrequency) return { baseIndex, documentFrequency };
  baseIndex = KNOWLEDGE_BASE.map(indexEntry);
  documentFrequency = new Map<string, number>();
  for (const item of baseIndex) {
    for (const token of item.weights.keys()) {
      documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
    }
  }
  return { baseIndex, documentFrequency };
}

export type ScoredEntry = { entry: KnowledgeEntry; score: number };

/**
 * Ranks knowledge entries against a question.
 *
 * `extraEntries` carries notes the pharmacy has taught Azara, so learned
 * content competes on equal footing with the shipped knowledge base.
 */
export function searchKnowledge(
  query: string,
  extraEntries: KnowledgeEntry[] = [],
  limit = 4
): ScoredEntry[] {
  const { baseIndex: index, documentFrequency: df } = ensureIndex();
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const normalisedQuery = ` ${normalise(query)} `;
  const total = index.length + extraEntries.length;
  const candidates = [...index, ...extraEntries.map(indexEntry)];

  const scored = candidates.map(({ entry, weights, phrases }) => {
    let score = 0;
    let matched = 0;

    for (const token of new Set(queryTokens)) {
      const weight = weights.get(token);
      if (!weight) continue;
      matched += 1;
      const frequency = df.get(token) ?? 1;
      const idf = Math.log(1 + total / frequency);
      score += Math.min(weight, 12) * idf;
    }

    // Whole-name matches are a very strong signal ("dose of amoxicillin").
    for (const phrase of phrases) {
      if (phrase.length > 3 && normalisedQuery.includes(` ${phrase} `)) score += 30;
      else if (phrase.length > 5 && normalisedQuery.includes(phrase)) score += 18;
    }

    // Reward entries that cover more of the question rather than one rare word.
    const coverage = matched / new Set(queryTokens).size;
    score *= 0.6 + 0.4 * coverage;

    return { entry, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/* ------------------------------------------------------------------ *
 * Intent detection
 * ------------------------------------------------------------------ */

export type Intent =
  | 'dose'
  | 'sideEffects'
  | 'contraindications'
  | 'interaction'
  | 'pregnancy'
  | 'paediatric'
  | 'counselling'
  | 'storage'
  | 'stock'
  | 'referral'
  | 'general';

const INTENT_PATTERNS: Array<{ intent: Intent; pattern: RegExp }> = [
  {
    intent: 'interaction',
    pattern: /\b(interact\w*|together|combine\w*|co-?administer|with each other|mix)\b/,
  },
  {
    intent: 'dose',
    pattern: /\b(dose|doses|dosing|dosage|how much|mg|strength|regimen|how many tablets)\b/,
  },
  { intent: 'sideEffects', pattern: /\b(side effect\w*|adverse|reaction\w*|toxicity|harm\w*)\b/ },
  {
    intent: 'contraindications',
    pattern: /\b(contraindicat\w*|avoid|unsafe|can i give|safe in|caution\w*)\b/,
  },
  { intent: 'pregnancy', pattern: /\b(pregnan\w*|breastfeed\w*|lactation|trimester|antenatal)\b/ },
  {
    intent: 'paediatric',
    pattern: /\b(child|children|baby|babies|infant|paediatric|pediatric|kg child)\b/,
  },
  { intent: 'counselling', pattern: /\b(counsel\w*|advice|advise|tell the patient|explain to)\b/ },
  {
    intent: 'storage',
    pattern: /\b(store|storage|storing|fridge|refrigerat\w*|cold chain|temperature)\b/,
  },
  {
    intent: 'stock',
    pattern: /\b(in stock|do we have|our stock|inventory|shelf|dispense from|available)\b/,
  },
  {
    intent: 'referral',
    pattern: /\b(refer\w*|red flag\w*|when to send|hospital|emergency|urgent)\b/,
  },
];

export function detectIntent(query: string): Intent {
  const text = normalise(query);
  for (const { intent, pattern } of INTENT_PATTERNS) {
    if (pattern.test(text)) return intent;
  }
  return 'general';
}

/* ------------------------------------------------------------------ *
 * Interactions
 * ------------------------------------------------------------------ */

/** Finds documented interaction pairs where both names appear in the question. */
export function findInteractions(query: string): InteractionEntry[] {
  const text = ` ${normalise(query)} `;
  return INTERACTIONS.filter(
    (item) => text.includes(item.a.toLowerCase()) && text.includes(item.b.toLowerCase())
  );
}

/** All documented interactions that mention a single drug name. */
export function interactionsFor(name: string): InteractionEntry[] {
  const needle = normalise(name);
  if (!needle) return [];
  return INTERACTIONS.filter((item) => item.a.includes(needle) || item.b.includes(needle));
}
