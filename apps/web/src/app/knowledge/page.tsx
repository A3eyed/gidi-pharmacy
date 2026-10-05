'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Brain, Database, Plus, Search, Trash2, TriangleAlert } from 'lucide-react';
import AppShell, { usePharmacy } from '@/components/AppShell';

type Topic = {
  id: string;
  title: string;
  category: string;
  summary: string;
  source: string | null;
};

type Note = {
  id: number;
  question: string;
  answer: string;
  keywords: string | null;
  created_at: string;
  author: string | null;
};

type Gap = { question: string; last_asked: string; times_asked: number };

const CATEGORIES = [
  { value: '', label: 'All topics' },
  { value: 'drug', label: 'Medicines' },
  { value: 'condition', label: 'Conditions' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'nursing', label: 'Nursing & hospital' },
  { value: 'practice', label: 'Pharmacy practice' },
  { value: 'guideline', label: 'Guidelines' },
];

function StatTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Brain;
}) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-[#737373]">
        <Icon size={13} className="text-gold" />
        {label}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-black">{value}</p>
    </div>
  );
}

function KnowledgeContent() {
  const { pharmacy } = usePharmacy();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ question: '', answer: '', keywords: '' });
  const [error, setError] = useState<string | null>(null);

  const key = ['azara-knowledge', pharmacy.id, search, category];

  const { data, isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const params = new URLSearchParams({ pharmacyId: String(pharmacy.id) });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      const response = await fetch(`/api/azara/knowledge?${params.toString()}`);
      if (!response.ok) {
        throw new Error(
          `When fetching /api/azara/knowledge, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  const addNote = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/azara/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pharmacyId: pharmacy.id, ...form }),
      });
      if (!response.ok) {
        throw new Error(
          `When saving the note, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
    onSuccess: () => {
      setForm({ question: '', answer: '', keywords: '' });
      setShowForm(false);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['azara-knowledge'] });
    },
    onError: (err) => {
      console.error(err);
      setError('Could not save that note. Please try again.');
    },
  });

  const removeNote = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/azara/knowledge?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(
          `When deleting the note, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['azara-knowledge'] }),
    onError: (err) => {
      console.error(err);
      setError('Could not delete that note.');
    },
  });

  const stats = data?.stats;
  const topics: Topic[] = data?.topics ?? [];
  const notes: Note[] = data?.notes ?? [];
  const gaps: Gap[] = data?.gaps ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black">Reference library</h1>
          <p className="mt-1 text-sm text-[#737373]">
            Everything Azara can look up, plus anything your team adds. Reference material for
            qualified professionals — not a diagnostic or prescribing tool.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-gold inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium text-black shadow-[0_6px_20px_rgba(201,162,39,0.3)]"
        >
          <Plus size={13} />
          Teach Azara
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Reference topics" value={String(stats?.entries ?? '—')} icon={BookOpen} />
        <StatTile label="Interactions" value={String(stats?.interactions ?? '—')} icon={Database} />
        <StatTile label="Your notes" value={String(notes.length)} icon={Brain} />
        <StatTile label="Questions asked" value={String(stats?.asked ?? 0)} icon={Search} />
      </div>

      {showForm && (
        <div className="glass-strong mt-4 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-black">Add a note to the reference library</h2>
          <p className="mt-1 text-xs text-[#737373]">
            Anything you save here is retrieved exactly like Azara&apos;s built-in content — use it
            for local protocols, supplier notes, or answers you want standardised across the team.
          </p>
          <input
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            placeholder="Topic or question — e.g. Our protocol for dispensing controlled drugs"
            className="mt-3 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 py-2 text-sm text-black placeholder:text-[#A3A3A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
          <textarea
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            rows={5}
            placeholder="The answer. One point per line works best."
            className="mt-2 w-full resize-y rounded-lg border border-[#E5E5E5] bg-white px-3 py-2 text-sm text-black placeholder:text-[#A3A3A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
          <input
            value={form.keywords}
            onChange={(e) => setForm({ ...form, keywords: e.target.value })}
            placeholder="Keywords, comma separated (optional)"
            className="mt-2 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 py-2 text-sm text-black placeholder:text-[#A3A3A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => addNote.mutate()}
              disabled={
                form.question.trim().length < 3 ||
                form.answer.trim().length < 3 ||
                addNote.isPending
              }
              className="bg-gold rounded-lg px-4 py-2 text-xs font-medium text-black disabled:opacity-40"
            >
              {addNote.isPending ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-[#E5E5E5] px-4 py-2 text-xs text-black"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-black">{error}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="glass flex min-w-[220px] flex-1 items-center gap-2 rounded-lg px-3 py-2">
          <Search size={14} className="text-gold" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the reference library…"
            className="w-full bg-transparent text-sm text-black placeholder:text-[#A3A3A3] focus:outline-none"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="glass rounded-lg px-3 py-2 text-sm text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {notes.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold text-black">Your pharmacy&apos;s notes</h2>
          <div className="mt-2 flex flex-col gap-2">
            {notes.map((note) => (
              <div key={note.id} className="glass-gold rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-black">{note.question}</p>
                    <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-[#404040]">
                      {note.answer}
                    </p>
                    <p className="mt-2 text-[10px] text-[#737373]">
                      Added by {note.author ?? 'a team member'}
                    </p>
                  </div>
                  <button
                    onClick={() => removeNote.mutate(note.id)}
                    title="Delete note"
                    className="shrink-0 text-[#737373] transition-colors hover:text-black"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {gaps.length > 0 && (
        <section className="mt-6">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-black">
            <TriangleAlert size={14} className="text-gold" />
            Questions Azara struggled with
          </h2>
          <p className="mt-1 text-xs text-[#737373]">
            Add a note for any of these and Azara will answer them confidently next time.
          </p>
          <div className="glass mt-2 divide-y divide-[#E5E5E5] rounded-xl">
            {gaps.map((gap) => (
              <button
                key={gap.question}
                onClick={() => {
                  setForm({ question: gap.question, answer: '', keywords: '' });
                  setShowForm(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex w-full items-center justify-between gap-3 p-3 text-left"
              >
                <span className="text-sm text-black">{gap.question}</span>
                <span className="shrink-0 text-xs text-[#737373]">asked {gap.times_asked}×</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-black">
          {search ? 'Search results' : 'Built-in reference topics'}
        </h2>
        {isLoading ? (
          <p className="mt-2 text-sm text-[#737373]">Loading…</p>
        ) : topics.length === 0 ? (
          <p className="mt-2 text-sm text-[#737373]">
            Nothing matched that search. Try a medicine or condition name.
          </p>
        ) : (
          <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
            {topics.map((topic) => (
              <div key={topic.id} className="glass rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <span className="glass-gold rounded-full px-2 py-0.5 text-[10px] font-medium text-gold">
                    {topic.category}
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-semibold text-black">{topic.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#404040]">{topic.summary}</p>
                {topic.source && (
                  <p className="mt-2 text-[10px] text-[#737373]">Source: {topic.source}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function KnowledgePage() {
  return (
    <AppShell>
      <KnowledgeContent />
    </AppShell>
  );
}
