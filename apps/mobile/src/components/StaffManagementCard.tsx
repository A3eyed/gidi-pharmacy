import { useState } from 'react';
import { Alert } from 'react-native';
import { ActivityIndicator, Text, TouchableOpacity, View } from '@/components/Themed';
import * as Clipboard from 'expo-clipboard';
import {
  Check,
  Copy,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
} from '@/components/Icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authFetch } from '@/utils/auth/getSession';
import { usePharmacy } from '@/components/PharmacyGate';
import { formatShortDate } from '@/utils/format';

type Member = {
  id: number;
  user_id: string;
  member_role: 'admin' | 'staff';
  joined_at: string;
  name: string;
  email: string;
};

const cardStyle = {
  borderWidth: 1,
  borderColor: '#E5E5E5',
  borderRadius: 12,
  backgroundColor: '#FFFFFF',
  padding: 16,
  marginTop: 12,
} as const;

const headingStyle = {
  fontFamily: 'Inter_600SemiBold',
  fontSize: 15,
  color: '#000000',
} as const;

const bodyStyle = {
  fontFamily: 'Inter_400Regular',
  fontSize: 13,
  lineHeight: 20,
  color: '#404040',
  marginTop: 6,
} as const;

const outlineButtonStyle = {
  height: 40,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#E5E5E5',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 7,
} as const;

/**
 * Staff Management for the mobile Settings screen.
 * Admins can manage the join code and remove staff; staff see the team list.
 */
export default function StaffManagementCard() {
  const { pharmacy, role } = usePharmacy();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = role === 'admin';

  const { data: codeData, isLoading: codeLoading } = useQuery({
    queryKey: ['join-code', pharmacy.id],
    enabled: isAdmin,
    queryFn: async () => {
      const response = await authFetch(`/api/pharmacies/join-code?pharmacyId=${pharmacy.id}`);
      if (!response.ok) {
        throw new Error(
          `When fetching join code, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  const { data: staffData, isLoading: staffLoading } = useQuery({
    queryKey: ['staff', pharmacy.id],
    queryFn: async () => {
      const response = await authFetch(`/api/pharmacies/staff?pharmacyId=${pharmacy.id}`);
      if (!response.ok) {
        throw new Error(
          `When fetching staff, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  const codeMutation = useMutation({
    mutationFn: async (action: 'generate' | 'revoke') => {
      const response = await authFetch('/api/pharmacies/join-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pharmacyId: pharmacy.id, action }),
      });
      if (!response.ok) {
        throw new Error(
          `When updating join code, the response was [${response.status}] ${response.statusText}`
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

  const removeMember = useMutation({
    mutationFn: async (memberId: number) => {
      const response = await authFetch('/api/pharmacies/staff', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pharmacyId: pharmacy.id, memberId }),
      });
      if (!response.ok) {
        throw new Error(
          `When removing member, the response was [${response.status}] ${response.statusText}`
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

  const copyCode = async () => {
    if (!codeData?.joinCode) return;
    try {
      await Clipboard.setStringAsync(codeData.joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
      setError('Could not copy the code.');
    }
  };

  const confirmRemove = (member: Member) => {
    Alert.alert('Remove staff member?', `${member.name} will lose access to ${pharmacy.name}.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeMember.mutate(member.id),
      },
    ]);
  };

  const members: Member[] = staffData?.members ?? [];
  const codeActive = !!codeData?.active;

  let codeSection: React.ReactNode = null;
  if (isAdmin) {
    let codeBody: React.ReactNode;
    if (codeLoading) {
      codeBody = <ActivityIndicator color="#000000" style={{ marginTop: 14 }} />;
    } else if (codeActive) {
      codeBody = (
        <View style={{ marginTop: 12 }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#E5E5E5',
              borderRadius: 10,
              backgroundColor: '#FAFAFA',
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 18,
                letterSpacing: 3,
                color: '#000000',
              }}
            >
              {codeData.joinCode}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                borderWidth: 1,
                borderColor: '#E5E5E5',
                borderRadius: 999,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#000000' }} />
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: '#000000' }}>
                Active
              </Text>
            </View>
            {codeData.createdAt ? (
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#737373' }}>
                Created {formatShortDate(codeData.createdAt)}
              </Text>
            ) : null}
          </View>
          <TouchableOpacity
            onPress={copyCode}
            style={{
              marginTop: 12,
              height: 44,
              borderRadius: 10,
              backgroundColor: '#000000',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
            }}
          >
            {copied ? <Check size={15} color="#FFFFFF" /> : <Copy size={15} color="#FFFFFF" />}
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: '#FFFFFF' }}>
              {copied ? 'Copied' : 'Copy Code'}
            </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <TouchableOpacity
              onPress={() => codeMutation.mutate('generate')}
              disabled={codeMutation.isPending}
              style={[outlineButtonStyle, { flex: 1, opacity: codeMutation.isPending ? 0.4 : 1 }]}
            >
              <RefreshCw size={13} color="#000000" />
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#000000' }}>
                Regenerate
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => codeMutation.mutate('revoke')}
              disabled={codeMutation.isPending}
              style={[outlineButtonStyle, { flex: 1, opacity: codeMutation.isPending ? 0.4 : 1 }]}
            >
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#000000' }}>
                Revoke
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 11,
              lineHeight: 16,
              color: '#737373',
              marginTop: 10,
            }}
          >
            Regenerating or revoking stops the current code from working for new joins. Staff who
            already joined keep their access.
          </Text>
        </View>
      );
    } else {
      codeBody = (
        <View style={{ marginTop: 12 }}>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#737373' }}>
            No active code. Generate one to invite staff.
          </Text>
          <TouchableOpacity
            onPress={() => codeMutation.mutate('generate')}
            disabled={codeMutation.isPending}
            style={{
              marginTop: 12,
              height: 44,
              borderRadius: 10,
              backgroundColor: '#000000',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              opacity: codeMutation.isPending ? 0.4 : 1,
            }}
          >
            <KeyRound size={15} color="#FFFFFF" />
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: '#FFFFFF' }}>
              {codeMutation.isPending ? 'Generating…' : 'Generate Join Code'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    codeSection = (
      <View style={cardStyle}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <KeyRound size={15} color="#000000" />
          <Text style={headingStyle}>Pharmacy join code</Text>
        </View>
        <Text style={bodyStyle}>
          Share this code with staff so they can join {pharmacy.name}. New members always get staff
          access only.
        </Text>
        {codeBody}
      </View>
    );
  }

  return (
    <View>
      {codeSection}

      <View style={cardStyle}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <Users size={15} color="#000000" />
          <Text style={headingStyle}>Team</Text>
        </View>
        <Text style={bodyStyle}>Everyone with access to {pharmacy.name}.</Text>

        {staffLoading ? (
          <ActivityIndicator color="#000000" style={{ marginTop: 14 }} />
        ) : (
          <View style={{ marginTop: 6 }}>
            {members.map((m) => {
              const memberIsAdmin = m.member_role === 'admin';
              return (
                <View
                  key={m.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    paddingVertical: 10,
                    borderTopWidth: 1,
                    borderTopColor: '#F5F5F5',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 9,
                        borderWidth: 1,
                        borderColor: '#E5E5E5',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {memberIsAdmin ? (
                        <ShieldCheck size={14} color="#000000" />
                      ) : (
                        <UserRound size={14} color="#000000" />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        numberOfLines={1}
                        style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#000000' }}
                      >
                        {m.name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#737373' }}
                      >
                        {m.email}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View
                      style={{
                        borderRadius: 999,
                        paddingHorizontal: 9,
                        paddingVertical: 3,
                        backgroundColor: memberIsAdmin ? '#000000' : '#FFFFFF',
                        borderWidth: memberIsAdmin ? 0 : 1,
                        borderColor: '#E5E5E5',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'Inter_600SemiBold',
                          fontSize: 9,
                          textTransform: 'uppercase',
                          color: memberIsAdmin ? '#FFFFFF' : '#000000',
                        }}
                      >
                        {m.member_role}
                      </Text>
                    </View>
                    {isAdmin && !memberIsAdmin ? (
                      <TouchableOpacity
                        onPress={() => confirmRemove(m)}
                        disabled={removeMember.isPending}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: '#E5E5E5',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: removeMember.isPending ? 0.4 : 1,
                        }}
                      >
                        <Trash2 size={12} color="#000000" />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {error ? (
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 12,
              color: '#000000',
              marginTop: 10,
            }}
          >
            {error}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
