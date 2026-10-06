import { createContext, useContext, useState, type ReactNode } from 'react';
import { Linking } from 'react-native';
import {
  ActivityIndicator,
  KeyboardAvoidingAnimatedView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from '@/components/Themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pill } from '@/components/Icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/utils/auth/useAuth';
import { authFetch } from '@/utils/auth/getSession';
import { usePharmacyStore } from '@/utils/pharmacyStore';
import { DashboardSkeleton, friendlyError } from '@/components/Skeleton';

export type Pharmacy = {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  member_role?: 'admin' | 'staff';
};

type PharmacyContextValue = {
  pharmacy: Pharmacy;
  pharmacies: Pharmacy[];
  setPharmacyId: (id: number) => void;
  role: 'admin' | 'staff';
};

const PharmacyContext = createContext<PharmacyContextValue | null>(null);

export function usePharmacy() {
  const ctx = useContext(PharmacyContext);
  if (!ctx) {
    throw new Error('usePharmacy must be used inside PharmacyGate');
  }
  return ctx;
}

function Wordmark() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: '#000000',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Pill size={18} color="#FFFFFF" />
      </View>
      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 20, color: '#000000' }}>GiDi</Text>
    </View>
  );
}

function SignInScreen() {
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();
  const samples = [
    { title: 'Dashboard', body: 'Today’s revenue, low stock, and sales just recorded.' },
    { title: 'Inventory', body: 'Paracetamol 500mg · 42 left · expires 12 Mar' },
    { title: 'Sales', body: 'A walk-in sale of Amoxicillin, receipt saved on this phone.' },
    { title: 'Azara', body: '“What can I suggest for a dry cough?” answered from the reference library.' },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 24,
          paddingBottom: 120,
        }}
      >
        <StatusBar />
        <Wordmark />
        <Text
          style={{
            fontFamily: 'Inter_600SemiBold',
            fontSize: 26,
            color: '#000000',
            marginTop: 24,
            letterSpacing: -0.5,
          }}
        >
          See the counter before you sign in
        </Text>
        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 14,
            color: '#737373',
            marginTop: 6,
            lineHeight: 20,
          }}
        >
          This is a sample of the tabs. Your own stock and sales stay private until you continue.
        </Text>
        {samples.map((item) => (
          <View
            key={item.title}
            style={{
              marginTop: 12,
              borderWidth: 1,
              borderColor: '#E5E5E5',
              borderRadius: 12,
              padding: 14,
            }}
          >
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#000000' }}>
              {item.title}
            </Text>
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 13,
                color: '#737373',
                marginTop: 4,
                lineHeight: 18,
              }}
            >
              {item.body}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: insets.bottom + 12,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
        }}
      >
        <TouchableOpacity
          onPress={signIn}
          activeOpacity={0.7}
          style={{
            height: 48,
            borderRadius: 10,
            backgroundColor: '#000000',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 15, color: '#FFFFFF' }}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CreatePharmacyScreen({ title, onDone }: { title: string; onDone?: () => void }) {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinedName, setJoinedName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createPharmacy = useMutation({
    mutationFn: async () => {
      const response = await authFetch('/api/pharmacies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, phone }),
      });
      if (!response.ok) {
        throw new Error(
          `When creating pharmacy, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacies'] });
      if (onDone) onDone();
    },
    onError: (err) => {
      console.error(err);
      setError('Could not create the pharmacy. Please try again.');
    },
  });

  const joinPharmacy = useMutation({
    mutationFn: async () => {
      const response = await authFetch('/api/pharmacies/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: joinCode }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error ?? `Join failed with status ${response.status}`);
      }
      return payload;
    },
    onSuccess: (data) => {
      setJoinedName(data.pharmacy?.name ?? 'your pharmacy');
      queryClient.invalidateQueries({ queryKey: ['pharmacies'] });
      if (onDone) {
        setTimeout(onDone, 1200);
      }
    },
    onError: (err) => {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Invalid or expired pharmacy code. Please check the code with your pharmacy administrator.'
      );
    },
  });

  const inputStyle = {
    height: 46,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  } as const;

  const labelStyle = {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#737373',
    marginBottom: 6,
    marginTop: 14,
  } as const;

  const modeToggle = (
    <View
      style={{
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 10,
        padding: 4,
        marginTop: 18,
        gap: 4,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setMode('create');
          setError(null);
        }}
        style={{
          flex: 1,
          paddingVertical: 8,
          borderRadius: 7,
          backgroundColor: mode === 'create' ? '#000000' : '#FFFFFF',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontFamily: 'Inter_500Medium',
            fontSize: 12,
            color: mode === 'create' ? '#FFFFFF' : '#737373',
          }}
        >
          Create New
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setMode('join');
          setError(null);
        }}
        style={{
          flex: 1,
          paddingVertical: 8,
          borderRadius: 7,
          backgroundColor: mode === 'join' ? '#000000' : '#FFFFFF',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontFamily: 'Inter_500Medium',
            fontSize: 12,
            color: mode === 'join' ? '#FFFFFF' : '#737373',
          }}
        >
          Join Existing
        </Text>
      </TouchableOpacity>
    </View>
  );

  let joinBody: React.ReactNode;
  if (joinedName) {
    joinBody = (
      <View style={{ marginTop: 24, alignItems: 'center' }}>
        <Text
          style={{
            fontFamily: 'Inter_600SemiBold',
            fontSize: 16,
            color: '#000000',
            textAlign: 'center',
          }}
        >
          You&apos;ve successfully joined {joinedName}.
        </Text>
        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 13,
            color: '#737373',
            marginTop: 6,
            textAlign: 'center',
          }}
        >
          Loading your pharmacy dashboard…
        </Text>
      </View>
    );
  } else {
    joinBody = (
      <View>
        <Text style={labelStyle}>Enter your pharmacy invitation code</Text>
        <TextInput
          style={[inputStyle, { letterSpacing: 2 }]}
          value={joinCode}
          onChangeText={(t) => setJoinCode(t.toUpperCase())}
          placeholder="e.g. GIDI-7K2M9QX4"
          placeholderTextColor="#A3A3A3"
          autoCapitalize="characters"
          autoCorrect={false}
        />
        {error && (
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 13,
              color: '#000000',
              marginTop: 12,
            }}
          >
            {error}
          </Text>
        )}
        <TouchableOpacity
          onPress={() => {
            setError(null);
            if (joinCode.trim()) joinPharmacy.mutate();
          }}
          disabled={joinPharmacy.isPending || !joinCode.trim()}
          style={{
            marginTop: 22,
            height: 48,
            borderRadius: 10,
            backgroundColor: '#000000',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: joinPharmacy.isPending || !joinCode.trim() ? 0.4 : 1,
          }}
        >
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 15, color: '#FFFFFF' }}>
            {joinPharmacy.isPending ? 'Joining…' : 'Join Pharmacy'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', paddingTop: insets.top }}>
        <StatusBar />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Wordmark />
          <Text
            style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 22,
              color: '#000000',
              marginTop: 24,
              letterSpacing: -0.5,
            }}
          >
            {mode === 'create' ? title : 'Join an Existing Pharmacy'}
          </Text>
          <Text
            style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#737373', marginTop: 6 }}
          >
            {mode === 'create'
              ? 'Set up your pharmacy to start managing inventory and sales.'
              : 'Enter the invitation code from your pharmacy administrator.'}
          </Text>

          {modeToggle}

          {mode === 'join' ? (
            <View style={{ marginTop: 8 }}>{joinBody}</View>
          ) : (
            <View>
              <Text style={labelStyle}>Pharmacy name</Text>
              <TextInput
                style={inputStyle}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Unity Chemists"
                placeholderTextColor="#A3A3A3"
              />
              <Text style={labelStyle}>Address (optional)</Text>
              <TextInput
                style={inputStyle}
                value={address}
                onChangeText={setAddress}
                placeholder="Street, city"
                placeholderTextColor="#A3A3A3"
              />
              <Text style={labelStyle}>Phone (optional)</Text>
              <TextInput
                style={inputStyle}
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone number"
                placeholderTextColor="#A3A3A3"
                keyboardType="phone-pad"
              />

              {error && (
                <Text
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 13,
                    color: '#000000',
                    marginTop: 12,
                  }}
                >
                  {error}
                </Text>
              )}

              <TouchableOpacity
                onPress={() => {
                  setError(null);
                  if (name.trim()) createPharmacy.mutate();
                }}
                disabled={createPharmacy.isPending || !name.trim()}
                style={{
                  marginTop: 22,
                  height: 48,
                  borderRadius: 10,
                  backgroundColor: '#000000',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: createPharmacy.isPending || !name.trim() ? 0.4 : 1,
                }}
              >
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 15, color: '#FFFFFF' }}>
                  {createPharmacy.isPending ? 'Creating…' : 'Create pharmacy'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {onDone && (
            <TouchableOpacity
              onPress={onDone}
              style={{ marginTop: 14, alignItems: 'center', paddingVertical: 8 }}
            >
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: '#737373' }}>
                Cancel
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}

export default function PharmacyGate({ children }: { children: ReactNode }) {
  const { isReady, isAuthenticated } = useAuth();
  const { selectedId, setSelectedId } = usePharmacyStore();
  const insets = useSafeAreaInsets();

  const { data, isLoading, error } = useQuery({
    queryKey: ['pharmacies'],
    queryFn: async () => {
      const response = await authFetch('/api/pharmacies');
      if (!response.ok) {
        throw new Error(
          `When fetching /api/pharmacies, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
    enabled: !!isAuthenticated,
  });

  if (!isReady) {
    return <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />;
  }

  if (!isAuthenticated) {
    return <SignInScreen />;
  }

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: insets.top,
        }}
      >
        <StatusBar />
        <DashboardSkeleton />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 32,
          paddingTop: insets.top,
        }}
      >
        <StatusBar />
        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 14,
            color: '#000000',
            textAlign: 'center',
          }}
        >
          {friendlyError()}
        </Text>
      </View>
    );
  }

  const pharmacies: Pharmacy[] = data?.pharmacies ?? [];

  if (pharmacies.length === 0) {
    return <CreatePharmacyScreen title="Create your first pharmacy" />;
  }

  const pharmacy = pharmacies.find((p) => p.id === selectedId) ?? pharmacies[0];
  const role: 'admin' | 'staff' = pharmacy.member_role === 'staff' ? 'staff' : 'admin';

  return (
    <PharmacyContext.Provider value={{ pharmacy, pharmacies, setPharmacyId: setSelectedId, role }}>
      {children}
    </PharmacyContext.Provider>
  );
}

export { CreatePharmacyScreen };
