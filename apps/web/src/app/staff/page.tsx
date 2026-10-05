'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Check,
  Copy,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
} from 'lucide-react';
import AppShell, { usePharmacy } from '@/components/AppShell';
import { formatShortDate } from '@/utils/format';

type Member = {
  id: number;
  user_id: string;
  member_role: 'admin' | 'staff';
  joined_at: string;
  name: string;
  email: string;
};

function JoinCodeCard() {
  const { pharmacy } = usePharmacy();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['join-code', pharmacy.id],
    queryFn: async () => {
      const response = await fetch(`/api/pharmacies/join-code?pharmacyId=${pharmacy.id}`);
      if (!response.ok) {
        throw new Error(
          `When fetching /api/pharmacies/join-code, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  const mutate = useMutation({
    mutationFn: async (action: 'generate' | 'revoke') => {
      const response = await fetch('/api/pharmacies/join-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pharmacyId: pharmacy.id, action }),
      });
      if (!response.ok) {
        throw new Error(
          `When updating the join code, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['join-code', pharmacy.id] });
      setCopied(false);
    },
    onError: (err) => {
      console.error(err);
      setError('Could not update the join code. Please try again.');
    },
  });

  const copyCode = async () => {
    if (!data?.joinCode) return;
    try {
      await navigator.clipboard.writeText(data.joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
      setError('Could not copy the code — please select and copy it manually.');
    }
  };

  const active = !!data?.active;

  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
      <div className="flex items-center gap-2">
        <KeyRound size={16} className="text-black" />
        <h2 className="text-base font-semibold text-black">Pharmacy join code</h2>
      </div>
      <p className="mt-1 text-sm text-[#737373]">
        Share this code with staff so they can join {pharmacy.name}. Anyone who joins with it gets
        staff access only.
      </p>

      {isLoading ? (
        <div className="mt-4 text-sm text-[#737373]">Loading code…</div>
      ) : active ? (
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-2 font-mono text-lg font-semibold tracking-widest text-black">
              {data.joinCode}
            </span>
            <button
              onClick={copyCode}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-[#262626]"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy Code'}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E5E5] px-3 py-1 text-xs font-medium text-black">
              <span className="h-1.5 w-1.5 rounded-full bg-black" />
              Active
            </span>
            {data.createdAt && (
              <span className="text-xs text-[#737373]">
                Created {formatShortDate(data.createdAt)}
              </span>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => mutate.mutate('generate')}
              disabled={mutate.isPending}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-xs font-medium text-black transition-colors hover:bg-[#FAFAFA] disabled:opacity-40"
            >
              <RefreshCw size={12} />
              Regenerate Code
            </button>
            <button
              onClick={() => mutate.mutate('revoke')}
              disabled={mutate.isPending}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-xs font-medium text-black transition-colors hover:bg-[#FAFAFA] disabled:opacity-40"
            >
              Revoke Code
            </button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#737373]">
            Regenerating or revoking stops the current code from working for new joins. Staff who
            have already joined are not affected.
          </p>
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E5E5] px-3 py-1 text-xs font-medium text-[#737373]">
              No active code
            </span>
          </div>
          <button
            onClick={() => mutate.mutate('generate')}
            disabled={mutate.isPending}
            className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-[#262626] disabled:opacity-40"
          >
            <KeyRound size={14} />
            {mutate.isPending ? 'Generating…' : 'Generate Join Code'}
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-black">{error}</p>}
    </div>
  );
}

function StaffList() {
  const { pharmacy, role } = usePharmacy();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['staff', pharmacy.id],
    queryFn: async () => {
      const response = await fetch(`/api/pharmacies/staff?pharmacyId=${pharmacy.id}`);
      if (!response.ok) {
        throw new Error(
          `When fetching /api/pharmacies/staff, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  const removeMember = useMutation({
    mutationFn: async (memberId: number) => {
      const response = await fetch('/api/pharmacies/staff', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pharmacyId: pharmacy.id, memberId }),
      });
      if (!response.ok) {
        throw new Error(
          `When removing a member, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', pharmacy.id] });
    },
    onError: (err) => {
      console.error(err);
      setError('Could not remove this member. Please try again.');
    },
  });

  const members: Member[] = data?.members ?? [];

  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
      <div className="flex items-center gap-2">
        <Users size={16} className="text-black" />
        <h2 className="text-base font-semibold text-black">Team</h2>
      </div>
      <p className="mt-1 text-sm text-[#737373]">Everyone with access to {pharmacy.name}.</p>

      {isLoading ? (
        <div className="mt-4 text-sm text-[#737373]">Loading team…</div>
      ) : (
        <ul className="mt-4 divide-y divide-[#E5E5E5]">
          {members.map((m) => {
            const isAdmin = m.member_role === 'admin';
            return (
              <li key={m.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5]">
                    {isAdmin ? (
                      <ShieldCheck size={15} className="text-black" />
                    ) : (
                      <UserRound size={15} className="text-black" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-black">{m.name}</div>
                    <div className="truncate text-xs text-[#737373]">{m.email}</div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={
                      isAdmin
                        ? 'rounded-full bg-black px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white'
                        : 'rounded-full border border-[#E5E5E5] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-black'
                    }
                  >
                    {m.member_role}
                  </span>
                  <span className="hidden text-xs text-[#737373] sm:inline">
                    Joined {formatShortDate(m.joined_at)}
                  </span>
                  {role === 'admin' && !isAdmin && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Remove ${m.name} from ${pharmacy.name}?`)) {
                          removeMember.mutate(m.id);
                        }
                      }}
                      disabled={removeMember.isPending}
                      title="Remove member"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E5E5] text-black transition-colors hover:bg-[#FAFAFA] disabled:opacity-40"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {error && <p className="mt-3 text-sm text-black">{error}</p>}
    </div>
  );
}

function StaffContent() {
  const { pharmacy, role } = usePharmacy();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-black">Staff Management</h1>
        <p className="text-sm text-[#737373]">
          {pharmacy.name} — {role === 'admin' ? 'manage your team and join code' : 'your team'}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {role === 'admin' ? (
          <JoinCodeCard />
        ) : (
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
            <p className="text-sm leading-relaxed text-[#404040]">
              You&apos;re a staff member of {pharmacy.name}. Only the pharmacy admin can manage the
              join code and remove members.
            </p>
          </div>
        )}
        <StaffList />
      </div>
    </div>
  );
}

export default function StaffPage() {
  return (
    <AppShell>
      <StaffContent />
    </AppShell>
  );
}
