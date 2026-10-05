import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from '@/components/Themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react-native';
import { authFetch } from '@/utils/auth/getSession';
import { usePreferences } from '@/utils/locale/PreferencesProvider';
import GlassCard from '@/components/GlassCard';
import PharmacyGate, { usePharmacy } from '@/components/PharmacyGate';
import { formatCurrency, formatShortDate } from '@/utils/format';

type StatementType = 'sales' | 'inventory' | 'summary';

const TABS: Array<{ value: StatementType; label: string }> = [
  { value: 'sales', label: 'Sales' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'summary', label: 'Summary' },
];

function isoDaysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

function Row({ left, right, sub }: { left: string; right: string; sub?: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#F5F5F5',
        backgroundColor: 'transparent',
      }}
    >
      <View style={{ flex: 1, backgroundColor: 'transparent' }}>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#000000' }}>
          {left}
        </Text>
        {sub ? (
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 11,
              color: '#737373',
              marginTop: 2,
            }}
          >
            {sub}
          </Text>
        ) : null}
      </View>
      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#000000' }}>
        {right}
      </Text>
    </View>
  );
}

function ReportsContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { pharmacy } = usePharmacy();
  const { colors, resolvedTheme } = usePreferences();
  const [type, setType] = useState<StatementType>('summary');
  const [days, setDays] = useState(30);

  const from = isoDaysAgo(days - 1);
  const to = new Date().toISOString().slice(0, 10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['statements', pharmacy.id, type, from, to],
    queryFn: async () => {
      const params = new URLSearchParams({
        pharmacyId: String(pharmacy.id),
        type,
        from,
        to,
      });
      const response = await authFetch(`/api/statements?${params.toString()}`);
      if (!response.ok) {
        throw new Error(
          `When fetching /api/statements, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  let body: React.ReactNode = null;

  if (isLoading) {
    body = <ActivityIndicator color="#737373" style={{ marginTop: 24 }} />;
  } else if (error || !data) {
    body = (
      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#000000' }}>
        Could not load this statement. Pull down or try again.
      </Text>
    );
  } else if (type === 'summary') {
    const totals = data.totals ?? {};
    body = (
      <View style={{ gap: 12, backgroundColor: 'transparent' }}>
        <GlassCard tone="gold">
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: '#737373' }}>
            Revenue in this period
          </Text>
          <Text
            style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 26,
              color: '#000000',
              marginTop: 4,
              letterSpacing: -0.5,
            }}
          >
            {formatCurrency(totals.revenue ?? 0)}
          </Text>
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 12,
              color: colors.gold,
              marginTop: 4,
            }}
          >
            {totals.sale_count ?? 0} sales · {totals.units ?? 0} units · gross profit{' '}
            {formatCurrency(totals.gross_profit ?? 0)}
          </Text>
        </GlassCard>

        <GlassCard>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#000000' }}>
            Revenue by category
          </Text>
          <View style={{ marginTop: 6, backgroundColor: 'transparent' }}>
            {(data.byCategory ?? []).length === 0 ? (
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#737373' }}>
                No sales in this period.
              </Text>
            ) : (
              (data.byCategory ?? []).map(
                (row: { category: string; units: number; revenue: string }) => (
                  <Row
                    key={row.category}
                    left={row.category}
                    sub={`${row.units} units`}
                    right={formatCurrency(row.revenue)}
                  />
                )
              )
            )}
          </View>
        </GlassCard>

        <GlassCard>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#000000' }}>
            Top medications
          </Text>
          <View style={{ marginTop: 6, backgroundColor: 'transparent' }}>
            {(data.byMedication ?? [])
              .slice(0, 10)
              .map((row: { name: string; units: number; revenue: string }) => (
                <Row
                  key={row.name}
                  left={row.name}
                  sub={`${row.units} units`}
                  right={formatCurrency(row.revenue)}
                />
              ))}
          </View>
        </GlassCard>
      </View>
    );
  } else if (type === 'inventory') {
    body = (
      <GlassCard>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#000000' }}>
          Stock on hand — {formatCurrency(data.totals?.stockValue ?? 0)}
        </Text>
        <View style={{ marginTop: 6, backgroundColor: 'transparent' }}>
          {(data.rows ?? []).map(
            (row: {
              name: string;
              stock_quantity: number;
              stock_value: string;
              expiry_date: string | null;
            }) => (
              <Row
                key={row.name}
                left={row.name}
                sub={`${row.stock_quantity} in stock${row.expiry_date ? ` · expires ${formatShortDate(row.expiry_date)}` : ''}`}
                right={formatCurrency(row.stock_value)}
              />
            )
          )}
        </View>
      </GlassCard>
    );
  } else {
    body = (
      <GlassCard>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#000000' }}>
          Itemised sales — {formatCurrency(data.totals?.revenue ?? 0)}
        </Text>
        <View style={{ marginTop: 6, backgroundColor: 'transparent' }}>
          {(data.rows ?? []).length === 0 ? (
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#737373' }}>
              No sales recorded in this period.
            </Text>
          ) : (
            (data.rows ?? []).map(
              (
                row: {
                  sale_id: number;
                  created_at: string;
                  medication_name: string;
                  quantity: number;
                  subtotal: string;
                },
                index: number
              ) => (
                <Row
                  key={`${row.sale_id}-${index}`}
                  left={`${row.medication_name} ×${row.quantity}`}
                  sub={`Receipt #${row.sale_id} · ${formatShortDate(row.created_at)}`}
                  right={formatCurrency(row.subtotal)}
                />
              )
            )
          )}
        </View>
      </GlassCard>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 12,
          paddingBottom: 10,
          backgroundColor: 'transparent',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronLeft size={22} color="#000000" />
        </TouchableOpacity>
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 20, color: '#000000' }}>
            Reports
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.gold }}>
            {formatShortDate(from)} – {formatShortDate(to)}
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        style={{ flexGrow: 0 }}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 10 }}
        showsHorizontalScrollIndicator={false}
      >
        {TABS.map((tab) => {
          const active = tab.value === type;
          return (
            <TouchableOpacity
              key={tab.value}
              onPress={() => setType(tab.value)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 999,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: active ? colors.goldLine : '#E5E5E5',
                backgroundColor: active ? colors.goldSoft : 'transparent',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Inter_500Medium',
                  fontSize: 13,
                  color: active ? colors.gold : '#737373',
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
        {[7, 30, 90].map((option) => {
          const active = option === days;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => setDays(option)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 999,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: active ? '#000000' : '#E5E5E5',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Inter_500Medium',
                  fontSize: 13,
                  color: active ? '#000000' : '#737373',
                }}
              >
                {option}d
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {body}
      </ScrollView>
    </View>
  );
}

export default function ReportsScreen() {
  return (
    <PharmacyGate>
      <ReportsContent />
    </PharmacyGate>
  );
}
