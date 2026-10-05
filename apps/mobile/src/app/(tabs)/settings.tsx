import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ExternalLink, FileText, LogOut, ShieldCheck, TriangleAlert } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/utils/auth/useAuth';
import { authFetch } from '@/utils/auth/getSession';
import KeyboardAvoidingAnimatedView from '@/components/KeyboardAvoidingAnimatedView';
import PharmacyGate from '@/components/PharmacyGate';
import StaffManagementCard from '@/components/StaffManagementCard';
import AppearanceRegionCards from '@/components/AppearanceRegionCards';
import { usePreferences } from '@/utils/locale/PreferencesProvider';

const PRIVACY_URL = `${process.env.EXPO_PUBLIC_BASE_URL ?? ''}/privacy`;

function Row({ label, value }: { label: string; value: string }) {
  const { colors } = usePreferences();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 9,
        borderTopWidth: 1,
        borderTopColor: colors.divider,
        gap: 12,
      }}
    >
      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textMuted }}>
        {label}
      </Text>
      <Text
        numberOfLines={1}
        style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.text, flexShrink: 1 }}
      >
        {value}
      </Text>
    </View>
  );
}

function SettingsContent() {
  const insets = useSafeAreaInsets();
  const { auth, signOut } = useAuth();
  const { colors, resolvedTheme, t } = usePreferences();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = auth?.user?.email ?? '';

  const cardStyle = {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    padding: 16,
    marginTop: 12,
  } as const;

  const headingStyle = {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: colors.text,
  } as const;

  const bodyStyle = {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSoft,
    marginTop: 6,
  } as const;

  const { data } = useQuery({
    queryKey: ['account-summary'],
    queryFn: async () => {
      const response = await authFetch('/api/account');
      if (!response.ok) {
        throw new Error(
          `When fetching /api/account, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  const counts = data?.data ?? {};

  const performDelete = async () => {
    setError(null);
    setIsDeleting(true);
    try {
      const response = await authFetch('/api/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmEmail }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? `Delete failed with status ${response.status}`);
      }
      // Account and all data are gone — drop the local session.
      signOut();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'Could not delete your account. Please try again.'
      );
      setIsDeleting(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete account?',
      'This permanently removes your account, all pharmacies, your full medication list and every sale you have recorded. This cannot be undone.',
      [
        { text: t('cancel'), style: 'cancel' },
        { text: 'Delete forever', style: 'destructive', onPress: performDelete },
      ]
    );
  };

  const emailMatches = confirmEmail.trim().toLowerCase() === email.trim().toLowerCase();

  return (
    <KeyboardAvoidingAnimatedView
      style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}
      behavior="padding"
    >
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={{
            fontFamily: 'Inter_600SemiBold',
            fontSize: 24,
            color: colors.text,
            marginTop: 16,
            letterSpacing: -0.5,
          }}
        >
          {t('settings')}
        </Text>
        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 13,
            color: colors.textMuted,
            marginTop: 4,
          }}
        >
          Appearance, region, account, privacy and data.
        </Text>

        {/* Appearance + Region & language */}
        <AppearanceRegionCards />

        {/* Account */}
        <View style={cardStyle}>
          <Text style={headingStyle}>Account</Text>
          <View style={{ marginTop: 8 }}>
            <Row label="Email" value={email || '—'} />
            <Row label="Pharmacies" value={String(counts.pharmacy_count ?? '—')} />
            <Row label="Medications" value={String(counts.medication_count ?? '—')} />
            <Row label="Sales recorded" value={String(counts.sale_count ?? '—')} />
          </View>
          <TouchableOpacity
            onPress={signOut}
            style={{
              marginTop: 14,
              height: 42,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
            }}
          >
            <LogOut size={14} color={colors.text} />
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.text }}>
              {t('signOut')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Staff management: join code + team */}
        <StaffManagementCard />

        {/* Privacy */}
        <View style={cardStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
            <ShieldCheck size={15} color={colors.text} />
            <Text style={headingStyle}>Privacy</Text>
          </View>
          <Text style={bodyStyle}>
            GiDi shows no advertisements and never uses your pharmacy data, sales or Azara
            conversations for advertising, marketing or profiling. Your data is encrypted in transit
            and scoped to your account.
          </Text>
          <Text style={bodyStyle}>
            GiDi does not request access to your camera, microphone, photos, contacts, calendar or
            location. It only stores the pharmacy records you enter yourself.
          </Text>
          <Text style={bodyStyle}>
            Azara runs on a reference library built into the app. Your questions are answered on
            your own server and are never sent to an external AI service.
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL(PRIVACY_URL)}
            style={{
              marginTop: 14,
              height: 42,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
            }}
          >
            <FileText size={14} color={colors.text} />
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.text }}>
              Read privacy policy
            </Text>
            <ExternalLink size={12} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Medical disclaimer */}
        <View style={cardStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
            <TriangleAlert size={15} color={colors.text} />
            <Text style={headingStyle}>Medical disclaimer</Text>
          </View>
          <Text style={bodyStyle}>
            Azara is a reference lookup tool for qualified pharmacy and healthcare professionals. It
            returns general reference information from a built-in library and from notes your own
            team adds. It does not diagnose patients, does not recommend treatment for any
            individual patient, does not prescribe, and is not a substitute for the professional
            judgement of a qualified pharmacist or physician.
          </Text>
          <Text style={bodyStyle}>
            Entries can be incomplete or out of date. Always verify against an authoritative source
            such as the BNF, WHO guidance or your national formulary, and follow the
            prescriber&apos;s instructions. In an emergency, contact your local emergency services.
          </Text>
          <Text style={bodyStyle}>
            Restock briefings are commercial stocking estimates calculated from your own sales
            history, the season and current weather. They are not clinical or procurement advice.
          </Text>
        </View>

        {/* Delete account */}
        <View style={[cardStyle, { borderWidth: 2, borderColor: colors.text }]}>
          <Text style={headingStyle}>Delete account</Text>
          <Text style={bodyStyle}>
            This permanently removes your login, all of your pharmacies, your full medication
            catalogue and every sale you have recorded. It happens immediately and cannot be undone.
          </Text>
          <Text style={bodyStyle}>
            If you want to keep your records, download them from the Reports page on the web app
            first.
          </Text>

          {!showConfirm ? (
            <TouchableOpacity
              onPress={() => setShowConfirm(true)}
              style={{
                marginTop: 14,
                height: 44,
                borderRadius: 10,
                backgroundColor: colors.inverseBg,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.inverseText }}
              >
                Delete my account
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{ marginTop: 14 }}>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.text }}>
                Type {email} to confirm
              </Text>
              <TextInput
                value={confirmEmail}
                onChangeText={setConfirmEmail}
                placeholder={email}
                placeholderTextColor={colors.placeholder}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                style={{
                  marginTop: 8,
                  height: 44,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  fontFamily: 'Inter_400Regular',
                  fontSize: 14,
                  color: colors.text,
                  backgroundColor: colors.surface,
                }}
              />
              {error ? (
                <Text
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 12,
                    color: colors.text,
                    marginTop: 8,
                  }}
                >
                  {error}
                </Text>
              ) : null}

              <TouchableOpacity
                onPress={confirmDelete}
                disabled={!emailMatches || isDeleting}
                style={{
                  marginTop: 12,
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: colors.inverseBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: !emailMatches || isDeleting ? 0.3 : 1,
                }}
              >
                {isDeleting ? (
                  <ActivityIndicator color={colors.inverseText} />
                ) : (
                  <Text
                    style={{
                      fontFamily: 'Inter_500Medium',
                      fontSize: 14,
                      color: colors.inverseText,
                    }}
                  >
                    Permanently delete
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowConfirm(false);
                  setConfirmEmail('');
                  setError(null);
                }}
                disabled={isDeleting}
                style={{ marginTop: 10, alignItems: 'center', paddingVertical: 8 }}
              >
                <Text
                  style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.textMuted }}
                >
                  {t('cancel')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingAnimatedView>
  );
}

export default function SettingsScreen() {
  return (
    <PharmacyGate>
      <SettingsContent />
    </PharmacyGate>
  );
}
