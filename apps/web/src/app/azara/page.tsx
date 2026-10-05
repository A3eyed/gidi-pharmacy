'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import {
  ArrowUp,
  BookOpen,
  Bot,
  Check,
  RotateCcw,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
  TriangleAlert,
  User,
} from 'lucide-react';
import AppShell, { usePharmacy } from '@/components/AppShell';

type Source = { id: string; title: string; reference?: string };

type Message = {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  confidence?: 'high' | 'medium' | 'low';
  queryId?: number | null;
};

const SUGGESTIONS = [
  'What is the adult dose of artemether-lumefantrine?',
  'Can I give metronidazole to a patient on warfarin?',
  'Counselling points for metformin',
  'When should I refer a child with diarrhoea?',
  'How do I calculate a reorder level?',
  'How do I manage anaphylaxis?',
];

/** Renders Azara's markdown-lite reply: headings, bullets, bold and italics. */
function AssistantText({ content }: { content: string }) {
  const blocks = content.split('\n').filter((line) => line.trim().length > 0);

  return (
    <div className="flex flex-col gap-1.5">
      {blocks.map((line, index) => {
        const trimmed = line.trim();
        const nested = /^\s{2,}[-*•]/.test(line);
        const bulletMatch = trimmed.match(/^[-*•]\s+(.*)$/);
        const headingMatch = trimmed.match(/^#{1,6}\s+(.*)$/);
        const italicMatch = trimmed.match(/^_(.+)_$/);
        const text = italicMatch?.[1] ?? bulletMatch?.[1] ?? headingMatch?.[1] ?? trimmed;

        const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
        const rendered = parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={i} className="font-semibold text-black">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={i}>{part}</span>;
        });

        if (italicMatch) {
          return (
            <p
              key={index}
              className="mt-2 border-l-2 border-gold pl-3 text-xs leading-relaxed text-[#737373]"
            >
              {text}
            </p>
          );
        }

        const isBoldOnlyLine = /^\*\*[^*]+\*\*$/.test(trimmed);
        if (headingMatch || isBoldOnlyLine) {
          return (
            <p key={index} className="mt-2 text-sm font-semibold text-black">
              {rendered}
            </p>
          );
        }

        if (bulletMatch) {
          return (
            <div key={index} className={nested ? 'flex gap-2 pl-6' : 'flex gap-2 pl-1'}>
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-gold" />
              <p className="text-sm leading-relaxed text-black">{rendered}</p>
            </div>
          );
        }

        return (
          <p key={index} className="text-sm leading-relaxed text-black">
            {rendered}
          </p>
        );
      })}
    </div>
  );
}

function ConfidenceBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const label =
    level === 'high' ? 'Strong match' : level === 'medium' ? 'Partial match' : 'Weak match';
  return (
    <span className="glass-gold inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-gold">
      <ShieldCheck size={10} />
      {label}
    </span>
  );
}

/** Thumbs up / down. A thumbs-down opens a box to teach Azara the right answer. */
function FeedbackBar({ queryId }: { queryId: number }) {
  const [state, setState] = useState<'idle' | 'correcting' | 'done'>('idle');
  const [correction, setCorrection] = useState('');

  const send = useMutation({
    mutationFn: async (payload: { helpful: boolean; correction?: string }) => {
      const response = await fetch('/api/azara/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryId, ...payload }),
      });
      if (!response.ok) {
        throw new Error(
          `When sending feedback, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
    onSuccess: () => setState('done'),
    onError: (error) => console.error(error),
  });

  if (state === 'done') {
    return (
      <p className="mt-2 inline-flex items-center gap-1 text-xs text-gold">
        <Check size={12} /> Thanks — Azara has learned from that.
      </p>
    );
  }

  if (state === 'correcting') {
    return (
      <div className="glass mt-2 rounded-lg p-2">
        <textarea
          value={correction}
          onChange={(e) => setCorrection(e.target.value)}
          rows={3}
          placeholder="What should Azara have said? This is saved to your pharmacy's knowledge base."
          className="w-full resize-y rounded-lg border border-[#E5E5E5] bg-white px-3 py-2 text-xs text-black placeholder:text-[#A3A3A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => send.mutate({ helpful: false, correction })}
            disabled={correction.trim().length < 10 || send.isPending}
            className="bg-gold rounded-lg px-3 py-1.5 text-xs font-medium text-black disabled:opacity-40"
          >
            Save to knowledge base
          </button>
          <button
            onClick={() => setState('idle')}
            className="rounded-lg border border-[#E5E5E5] px-3 py-1.5 text-xs text-black"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <span className="text-[11px] text-[#737373]">Was this useful?</span>
      <button
        onClick={() => send.mutate({ helpful: true })}
        title="Helpful"
        className="glass flex h-6 w-6 items-center justify-center rounded-md text-black transition-colors hover:text-gold"
      >
        <ThumbsUp size={11} />
      </button>
      <button
        onClick={() => setState('correcting')}
        title="Not helpful — teach Azara"
        className="glass flex h-6 w-6 items-center justify-center rounded-md text-black transition-colors hover:text-gold"
      >
        <ThumbsDown size={11} />
      </button>
    </div>
  );
}

function AzaraContent() {
  const { pharmacy } = usePharmacy();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const ask = useMutation({
    mutationFn: async (history: Message[]) => {
      const response = await fetch('/api/azara', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          pharmacyId: pharmacy.id,
        }),
      });
      if (!response.ok) {
        throw new Error(
          `When asking Azara, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
          sources: data.sources ?? [],
          confidence: data.confidence,
          queryId: data.queryId ?? null,
        },
      ]);
    },
    onError: (err) => {
      console.error(err);
      setError('Azara could not answer that just now. Please try again.');
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, ask.isPending]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || ask.isPending) return;
    setError(null);
    const next: Message[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(next);
    setInput('');
    ask.mutate(next);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="mx-auto flex h-[calc(100vh-160px)] max-w-3xl flex-col md:h-[calc(100vh-120px)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-black">
            Azara
            <span className="ml-2 align-middle text-xs font-normal text-gold">
              offline knowledge base
            </span>
          </h1>
          <p className="text-sm text-[#737373]">
            Medicines, conditions, nursing care and pharmacy practice — answered from built-in
            clinical knowledge, no internet AI required.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/knowledge"
            className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-black"
          >
            <BookOpen size={12} className="text-gold" />
            Knowledge
          </Link>
          {!isEmpty && (
            <button
              onClick={() => {
                setMessages([]);
                setError(null);
              }}
              className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-black"
            >
              <RotateCcw size={12} />
              New chat
            </button>
          )}
        </div>
      </div>

      <div className="glass-gold mt-4 flex gap-2.5 rounded-xl p-3">
        <TriangleAlert size={15} className="mt-0.5 shrink-0 text-gold" />
        <p className="text-xs leading-relaxed text-[#404040]">
          <strong className="font-semibold text-black">General information only.</strong> Azara does
          not diagnose patients and is not a substitute for the professional judgement of a
          qualified pharmacist or physician. Always verify against the BNF, WHO guidance or your
          national formulary, and follow the prescriber&apos;s instructions.
        </p>
      </div>

      <div ref={scrollRef} className="glass mt-3 flex-1 overflow-y-auto rounded-xl p-5">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="bg-gold flex h-11 w-11 items-center justify-center rounded-xl shadow-[0_6px_20px_rgba(201,162,39,0.35)]">
              <Bot size={20} className="text-black" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-black">Ask Azara about stock or a medicine</h2>
            <p className="mt-1 max-w-sm text-sm text-[#737373]">
              Dosing, interactions, symptoms, emergency protocols, counselling points, or what you
              can dispense from your own stock.
            </p>
            <div className="mt-6 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="glass rounded-lg p-3 text-left text-xs leading-relaxed text-black transition-colors hover:text-gold"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {messages.map((m, index) => {
              const isUser = m.role === 'user';
              return (
                <div key={index} className="flex gap-3">
                  <div
                    className={
                      isUser
                        ? 'glass flex h-7 w-7 shrink-0 items-center justify-center rounded-lg'
                        : 'bg-gold flex h-7 w-7 shrink-0 items-center justify-center rounded-lg'
                    }
                  >
                    {isUser ? (
                      <User size={14} className="text-black" />
                    ) : (
                      <Bot size={14} className="text-black" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2 text-xs font-medium text-[#737373]">
                      {isUser ? 'You' : 'Azara'}
                      {!isUser && m.confidence && <ConfidenceBadge level={m.confidence} />}
                    </div>
                    {isUser ? (
                      <p className="text-sm leading-relaxed text-black">{m.content}</p>
                    ) : (
                      <>
                        <AssistantText content={m.content} />
                        {m.sources && m.sources.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {m.sources.map((s) => (
                              <span
                                key={s.id}
                                title={s.reference ?? undefined}
                                className="glass rounded-full px-2 py-0.5 text-[10px] text-[#737373]"
                              >
                                {s.title}
                                {s.reference ? ` · ${s.reference}` : ''}
                              </span>
                            ))}
                          </div>
                        )}
                        {m.queryId ? <FeedbackBar queryId={m.queryId} /> : null}
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {ask.isPending && (
              <div className="flex gap-3">
                <div className="bg-gold flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                  <Bot size={14} className="text-black" />
                </div>
                <div className="pt-1 text-sm text-[#737373]">
                  Azara is checking the knowledge base…
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <div className="mt-2 text-sm text-black">{error}</div>}

      <form
        className="mt-3 flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={1}
          placeholder="List inventory, low stock, or ask about a medicine…"
          className="glass max-h-32 min-h-[44px] flex-1 resize-y rounded-xl px-4 py-3 text-sm text-black placeholder:text-[#A3A3A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />
        <button
          type="submit"
          disabled={!input.trim() || ask.isPending}
          className="bg-gold flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-black shadow-[0_6px_20px_rgba(201,162,39,0.3)] transition-opacity disabled:opacity-30"
        >
          <ArrowUp size={18} />
        </button>
      </form>

      <p className="mt-2 text-center text-xs text-[#737373]">
        Reference information from GiDi&apos;s built-in pharmacy reference library · Not medical
        advice, not a diagnosis · Always confirm with a qualified pharmacist or physician.
      </p>
    </div>
  );
}

export default function AzaraPage() {
  return (
    <AppShell>
      <AzaraContent />
    </AppShell>
  );
}
