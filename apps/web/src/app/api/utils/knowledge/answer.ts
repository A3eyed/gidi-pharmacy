import type { KnowledgeEntry, KnowledgeSection } from './types';
import {
  detectIntent,
  findInteractions,
  interactionsFor,
  KNOWLEDGE_STATS,
  searchKnowledge,
  type Intent,
  type ScoredEntry,
} from './index';

export type StockItem = {
  name: string;
  category?: string | null;
  quantity: number;
  price: number;
  reorderLevel?: number;
  expiryDate?: string | null;
};

export type AnswerInput = {
  question: string;
  /** Notes this pharmacy has taught Azara, treated as first-class knowledge. */
  learned?: KnowledgeEntry[];
  stock?: StockItem[];
  currency?: string;
};

export type AnswerSource = { id: string; title: string; reference?: string };

export type ComposedAnswer = {
  reply: string;
  sources: AnswerSource[];
  confidence: 'high' | 'medium' | 'low';
  matchedIds: string[];
  intent: Intent;
  topScore: number;
  suggestions: string[];
};

const HIGH_CONFIDENCE = 45;
const MEDIUM_CONFIDENCE = 18;

const CLINICAL_CATEGORIES = new Set(['drug', 'condition', 'emergency', 'nursing', 'guideline']);

const SAFETY_LINE =
  '_Reference information only. Azara is a lookup tool, not a clinical decision-maker — it does not diagnose, prescribe or replace the judgement of a qualified pharmacist or physician. Always confirm against the BNF, WHO guidance or your national formulary before acting._';

/* ------------------------------------------------------------------ *
 * Small talk and meta questions
 * ------------------------------------------------------------------ */

function smallTalk(question: string): string | null {
  const text = question.toLowerCase().trim();

  if (/^(hi|hello|hey|good (morning|afternoon|evening)|yo)\b[\s!.?]*$/.test(text)) {
    return [
      "Hello — I'm Azara, the reference assistant inside GiDi.",
      '',
      'I can look up:',
      '- Medicines — dosing references, side effects, contraindications, interactions, counselling points',
      '- Conditions — typical presentation, standard treatment references, when to refer',
      '- Nursing and hospital care — vital sign ranges, emergency procedure references, infection control, wound care',
      '- Pharmacy operations — stock control, expiry management, stewardship, pricing',
      '- Your inventory — "list inventory", "low stock", "expiring stock", "how many cetirizine"',
      '',
      'I answer from a built-in reference library plus your pharmacy stock, so clinical lookups work even when the internet does not. Inventory answers use the stock recorded in GiDi.',
    ].join('\n');
  }

  if (/^(thanks|thank you|thx|nice one|great|perfect|ok thanks)\b/.test(text)) {
    return 'Happy to help. Ask me anything else about medicines, patient care or running the pharmacy.';
  }

  if (
    /\b(who are you|what are you|what can you do|how do you work|are you gemini|which ai|your knowledge)\b/.test(
      text
    )
  ) {
    return [
      "**I'm Azara**, the reference assistant built into GiDi.",
      '',
      `I look up answers in an embedded, curated reference library of ${KNOWLEDGE_STATS.entries} medicine and pharmacy topics plus ${KNOWLEDGE_STATS.interactions} documented drug interactions — covering pharmacology, disease references, nursing and emergency procedures, and pharmacy practice.`,
      '',
      'Everything runs inside your own app. There is no external AI service and no API key involved, so I keep working offline and your questions never leave the system.',
      '',
      'I also learn: say "remember: <topic> | <what to answer>" or add a note in the knowledge panel, and I use it from then on. Rate answers that miss so the gap stays on the improvement list.',
      '',
      '**What I am not:** I am a lookup tool for qualified professionals. I do not diagnose patients, recommend treatment for a specific person, or replace your training, your supervising pharmacist or the prescriber.',
      '',
      SAFETY_LINE,
    ].join('\n');
  }

  return null;
}

/* ------------------------------------------------------------------ *
 * Section selection
 * ------------------------------------------------------------------ */

const INTENT_HEADINGS: Record<Intent, RegExp | null> = {
  dose: /dos|regimen|schedule|treatment|how it is used/i,
  sideEffects: /side effect|adverse|toxicit|reaction/i,
  contraindications: /caution|contraindic|safety|serious/i,
  interaction: /interaction/i,
  pregnancy: /pregnan|caution|contraindic/i,
  paediatric: /paediatric|child|dos/i,
  counselling: /counsel|advice|practical|prevention/i,
  storage: /storage|store|cold chain|practical/i,
  stock: /dos|treatment/i,
  referral: /refer|red flag|assess|recognition|emergency/i,
  general: null,
};

function pickSections(entry: KnowledgeEntry, intent: Intent): KnowledgeSection[] {
  const pattern = INTENT_HEADINGS[intent];
  if (!pattern) return entry.sections.slice(0, 4);

  const preferred = entry.sections.filter((section) => pattern.test(section.heading));
  if (preferred.length === 0) return entry.sections.slice(0, 4);

  const rest = entry.sections.filter((section) => !preferred.includes(section));
  return [...preferred, ...rest].slice(0, Math.max(2, preferred.length + 1));
}

/** Pregnancy questions are usually answered by specific lines, not a section. */
function pregnancyLines(entry: KnowledgeEntry): string[] {
  const hits: string[] = [];
  for (const section of entry.sections) {
    for (const point of section.points) {
      if (/pregnan|trimester|breastfeed|lactation/i.test(point)) hits.push(point);
    }
  }
  return hits;
}

function renderSection(section: KnowledgeSection, maxPoints = 6): string {
  const points = section.points.slice(0, maxPoints).map((point) => `- ${point}`);
  return [`**${section.heading}**`, ...points].join('\n');
}

/* ------------------------------------------------------------------ *
 * Stock awareness
 * ------------------------------------------------------------------ */

function stockNote(entry: KnowledgeEntry, stock: StockItem[], currency: string): string | null {
  if (stock.length === 0) return null;
  const names = [entry.title, ...(entry.aliases ?? [])].map((n) => n.toLowerCase());

  const matches = stock.filter((item) => {
    const itemName = item.name.toLowerCase();
    return names.some((name) => {
      const core = name.split(/[\s(–—-]/)[0];
      return core.length > 3 && (itemName.includes(core) || name.includes(itemName));
    });
  });

  if (matches.length === 0) return null;

  const lines = matches.slice(0, 5).map((item) => {
    const status = item.quantity <= 0 ? 'out of stock' : `${item.quantity} in stock`;
    return `- ${item.name} — ${status} at ${currency} ${item.price.toFixed(2)}`;
  });

  return [`**In your pharmacy right now**`, ...lines].join('\n');
}

function daysUntil(expiryDate: string | null | undefined): number | null {
  if (!expiryDate) return null;
  const expiry = new Date(expiryDate);
  if (Number.isNaN(expiry.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
}

function formatStockLine(item: StockItem, currency: string): string {
  const status = item.quantity <= 0 ? 'out of stock' : `${item.quantity} in stock`;
  const reorder =
    item.reorderLevel != null && item.quantity <= item.reorderLevel ? ` · reorder at ${item.reorderLevel}` : '';
  const days = daysUntil(item.expiryDate);
  const expiry =
    days == null ? '' : days < 0 ? ' · expired' : days <= 90 ? ` · expires in ${days} day${days === 1 ? '' : 's'}` : '';
  const category = item.category ? ` · ${item.category}` : '';
  return `- ${item.name} — ${status} at ${currency} ${item.price.toFixed(2)}${reorder}${expiry}${category}`;
}

/**
 * Inventory commands are answered from the signed-in pharmacy's stock, not the
 * clinical library. Returns null when the question is not an inventory command.
 */
export function inventoryCommand(
  question: string,
  stock: StockItem[],
  currency: string
): ComposedAnswer | null {
  const text = question.toLowerCase().trim();
  const isInventory =
    /\b(list|show|display|give me|what(?:'s| is| do we))\b.{0,40}\b(inventory|stock|medications?|medicines?)\b/.test(text) ||
    /\b(inventory listing|stock list|low stock|out of stock|expiring stock|expiry list)\b/.test(text) ||
    /\b(how many|stock of|do we have|in stock)\b/.test(text) ||
    /\b(reorder list|what expires|what is expiring)\b/.test(text);
  if (!isInventory) return null;

  const named = text.match(/\b(?:how many|stock of|do we have)\s+(.+?)\??$/);
  const needle = named?.[1]?.replace(/\b(in stock|left|on hand)\b/g, '').trim() ?? '';
  const lowOnly = /\blow stock|reorder\b/.test(text);
  const outOnly = /\bout of stock|stockouts?\b/.test(text);
  const expiryOnly = /\bexpir/.test(text);

  let rows = stock;
  if (needle && needle.length > 1 && !/^(the )?(inventory|stock|medications?|medicines?)$/.test(needle)) {
    rows = rows.filter((item) => item.name.toLowerCase().includes(needle) || needle.includes(item.name.toLowerCase()));
  }
  if (lowOnly) rows = rows.filter((item) => item.quantity > 0 && item.quantity <= (item.reorderLevel ?? 10));
  if (outOnly) rows = rows.filter((item) => item.quantity <= 0);
  if (expiryOnly) rows = rows.filter((item) => {
    const days = daysUntil(item.expiryDate);
    return days != null && days <= 90;
  });

  const title = lowOnly
    ? 'Low stock'
    : outOnly
      ? 'Out of stock'
      : expiryOnly
        ? 'Expiring within 90 days'
        : needle
          ? `Stock matching “${needle}”`
          : 'Inventory listing';

  if (stock.length === 0) {
    return {
      reply: [
        `**${title}**`,
        '',
        'This pharmacy has no medications recorded yet. Add them in Inventory, then ask me to list stock again.',
      ].join('\n'),
      sources: [{ id: 'inventory', title: 'GiDi inventory' }],
      confidence: 'high',
      matchedIds: ['inventory'],
      intent: 'stock',
      topScore: 100,
      suggestions: ['List inventory', 'Low stock', 'Expiring stock'],
    };
  }

  const shown = rows.slice(0, 40);
  const lines = shown.map((item) => formatStockLine(item, currency));
  const extra = rows.length > shown.length ? `\n\nShowing ${shown.length} of ${rows.length}. Narrow it with a name, or ask for low stock or expiring stock.` : '';
  const reply = lines.length
    ? [`**${title}** — ${rows.length} item${rows.length === 1 ? '' : 's'}`, '', ...lines, extra].join('\n').trim()
    : `**${title}**\n\nNothing in the current inventory matches that.`;

  return {
    reply,
    sources: [{ id: 'inventory', title: 'GiDi inventory' }],
    confidence: 'high',
    matchedIds: ['inventory'],
    intent: 'stock',
    topScore: 100,
    suggestions: ['Low stock', 'Expiring stock', 'Out of stock'],
  };
}

/* ------------------------------------------------------------------ *
 * Main composer
 * ------------------------------------------------------------------ */

export function composeAnswer(input: AnswerInput): ComposedAnswer {
  const question = input.question.trim();
  const currency = input.currency ?? 'GHS';
  const stock = input.stock ?? [];
  const intent = detectIntent(question);

  const chat = smallTalk(question);
  if (chat) {
    return {
      reply: chat,
      sources: [],
      confidence: 'high',
      matchedIds: [],
      intent,
      topScore: 100,
      suggestions: ['List inventory', 'Low stock', 'Adult dose of amoxicillin'],
    };
  }

  const inventory = inventoryCommand(question, stock, currency);
  if (inventory) return inventory;

  const results: ScoredEntry[] = searchKnowledge(question, input.learned ?? [], 4);
  const pairInteractions = findInteractions(question);

  if (results.length === 0 && pairInteractions.length === 0) {
    return {
      reply: notFoundReply(question),
      sources: [],
      confidence: 'low',
      matchedIds: [],
      intent,
      topScore: 0,
      suggestions: defaultSuggestions(),
    };
  }

  const top = results[0];
  const topScore = top?.score ?? 0;
  const blocks: string[] = [];

  // 1. Documented interaction pairs answer the question directly.
  if (pairInteractions.length > 0) {
    blocks.push('**Documented interaction**');
    for (const item of pairInteractions.slice(0, 3)) {
      blocks.push(
        [
          `- **${item.a} + ${item.b}** — ${severityLabel(item.severity)}`,
          `  - Effect: ${item.effect}`,
          `  - What to do: ${item.action}`,
        ].join('\n')
      );
    }
  }

  if (top) {
    // 2. Headline and summary
    blocks.push(`**${top.entry.title}**`);
    blocks.push(top.entry.summary);

    // 3. Intent-matched detail
    if (intent === 'pregnancy') {
      const lines = pregnancyLines(top.entry);
      if (lines.length > 0) {
        blocks.push(
          ['**Pregnancy and breastfeeding**', ...lines.slice(0, 6).map((l) => `- ${l}`)].join('\n')
        );
      }
    }

    for (const section of pickSections(top.entry, intent)) {
      blocks.push(renderSection(section));
    }

    // 4. Single-drug interaction summary when asked about interactions
    if (intent === 'interaction' && pairInteractions.length === 0) {
      const related = interactionsFor(top.entry.title.split(/[\s(]/)[0]);
      if (related.length > 0) {
        blocks.push(
          [
            '**Documented interactions in the knowledge base**',
            ...related
              .slice(0, 6)
              .map(
                (item) =>
                  `- ${item.a} + ${item.b} (${severityLabel(item.severity)}): ${item.action}`
              ),
          ].join('\n')
        );
      }
    }

    // 5. Red flags
    if (top.entry.redFlags && top.entry.redFlags.length > 0) {
      blocks.push(
        ['**Refer urgently if**', ...top.entry.redFlags.map((flag) => `- ${flag}`)].join('\n')
      );
    }

    // 6. Stock awareness
    const stockBlock = stockNote(top.entry, stock, currency);
    if (stockBlock) blocks.push(stockBlock);
  }

  // 7. Related entries
  const related = results.slice(1).filter((item) => item.score >= topScore * 0.4);
  if (related.length > 0) {
    blocks.push(
      [
        '**Related topics I can expand on**',
        ...related.map((item) => `- ${item.entry.title} — ${shorten(item.entry.summary, 120)}`),
      ].join('\n')
    );
  }

  // 8. Safety footer for anything clinical
  const isClinical = top ? CLINICAL_CATEGORIES.has(top.entry.category) : true;
  if (isClinical) blocks.push(SAFETY_LINE);

  const sources: AnswerSource[] = results.map((item) => ({
    id: item.entry.id,
    title: item.entry.title,
    reference: item.entry.source,
  }));

  const confidence: ComposedAnswer['confidence'] =
    topScore >= HIGH_CONFIDENCE || pairInteractions.length > 0
      ? 'high'
      : topScore >= MEDIUM_CONFIDENCE
        ? 'medium'
        : 'low';

  const preamble =
    confidence === 'low'
      ? "I'm not certain this is exactly what you asked, but here is the closest match in my knowledge base. Rephrase with the medicine or condition name if it misses.\n\n"
      : '';

  return {
    reply: preamble + blocks.join('\n\n'),
    sources,
    confidence,
    matchedIds: results.map((item) => item.entry.id),
    intent,
    topScore: Math.round(topScore),
    suggestions: related.map((item) => `Tell me more about ${item.entry.title}`).slice(0, 3),
  };
}

function severityLabel(severity: string) {
  switch (severity) {
    case 'avoid':
      return 'avoid the combination';
    case 'serious':
      return 'serious';
    case 'moderate':
      return 'moderate';
    default:
      return 'minor';
  }
}

function shorten(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

function defaultSuggestions() {
  return [
    'Adult dose of amoxicillin',
    'Counselling points for metformin',
    'When should I refer a fever to hospital?',
    'How do I calculate a reorder level?',
  ];
}

function notFoundReply(question: string) {
  return [
    "I don't have a confident answer for that in my reference library yet.",
    '',
    'I cover medicines and dosing references, disease conditions and standard treatment references, nursing and emergency procedures, and pharmacy operations. Try naming the medicine or condition directly — for example "ciprofloxacin dose", "managing severe malaria" or "how do I control expiry losses".',
    '',
    `Your question has been logged so it can be added to the reference library. ${
      question.length > 120 ? 'Shorter, more specific questions also work better.' : ''
    }`.trim(),
  ].join('\n');
}

/**
 * Converts a pharmacy-authored note into a reference entry so learned content
 * is retrieved exactly like the shipped reference library.
 */
export function learnedToEntry(row: {
  id: number;
  question: string;
  answer: string;
  keywords: string | null;
}): KnowledgeEntry {
  return {
    id: `learned-${row.id}`,
    title: row.question,
    category: 'practice',
    aliases: row.keywords
      ? row.keywords
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean)
      : [],
    tags: ['pharmacy note', 'learned'],
    summary: row.answer.split('\n')[0].slice(0, 300),
    sections: [
      {
        heading: 'Saved note from your team',
        points: row.answer
          .split('\n')
          .map((line) => line.replace(/^[-*•]\s*/, '').trim())
          .filter(Boolean)
          .slice(0, 12),
      },
    ],
    source: 'Added by your pharmacy team',
  };
}
