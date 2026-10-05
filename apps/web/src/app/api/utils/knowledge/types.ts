/**
 * Shared types for Azara's built-in pharmacy reference library.
 *
 * Azara no longer depends on an external LLM API key. Every answer is composed
 * from these structured entries, which means the assistant works offline,
 * costs nothing per request, is fully auditable, and can never invent a dose
 * that was not written by a human.
 *
 * Azara is a reference lookup tool for qualified professionals — not a
 * diagnostic or prescribing system.
 */

export type KnowledgeSection = {
  heading: string;
  points: string[];
};

export type KnowledgeCategory =
  | 'drug'
  | 'condition'
  | 'emergency'
  | 'nursing'
  | 'practice'
  | 'guideline';

export type KnowledgeEntry = {
  /** Stable id — also used for feedback and analytics. */
  id: string;
  title: string;
  category: KnowledgeCategory;
  /** Brand names, generic spellings, abbreviations and common misspellings. */
  aliases?: string[];
  /** Free tags that help retrieval (class, system, symptom words). */
  tags?: string[];
  /** One or two sentences answering "what is this". */
  summary: string;
  sections: KnowledgeSection[];
  /** Symptoms or situations that require urgent referral. */
  redFlags?: string[];
  /** Where the content is drawn from, shown to the user as a citation. */
  source?: string;
};

/** A documented interaction between two knowledge-base drugs. */
export type InteractionEntry = {
  a: string;
  b: string;
  severity: 'avoid' | 'serious' | 'moderate' | 'minor';
  effect: string;
  action: string;
};
