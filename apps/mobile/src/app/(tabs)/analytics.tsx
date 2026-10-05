import { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from '@/components/Themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { authFetch } from '@/utils/auth/getSession';
import PharmacyGate, { usePharmacy } from '@/components/PharmacyGate';
import RestockInsightsCard from '@/components/RestockInsightsCard';
import { formatCurrency, formatShortDate } from '@/utils/format';

type TopMed = { name: string; units_sold: number; revenue: string };

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flex: 1,
        minWidth: '46%',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        padding: 16,
      }}
    >
      <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: '#737373' }}>{label}</Text>
      <Text
        style={{
          fontFamily: 'Inter_600SemiBold',
          fontSize: 20,
          color: '#000000',
          marginTop: 6,
          letterSpacing: -0.3,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginTop: 12,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#000000' }}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 12,
                color: '#737373',
                marginTop: 2,
              }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
        {action}
      </View>
      <View style={{ marginTop: 12 }}>{children}</View>
    </View>
  );
}

function AnalyticsContent() {
  const insets = useSafeAreaInsets();
  const { pharmacy } = usePharmacy();
  const [rankBy, setRankBy] = useState<'revenue' | 'units'>('revenue');

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['analytics', pharmacy.id],
    queryFn: async () => {
      const response = await authFetch(`/api/analytics?pharmacyId=${pharmacy.id}`);
      if (!response.ok) {
        throw new Error(
          `When fetching /api/analytics, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  let body: React.ReactNode = null;

  if (isLoading) {
    body = (
      <Text
        style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#737373', marginTop: 20 }}
      >
        Loading analytics…
      </Text>
    );
  } else if (error || !data) {
    body = (
      <Text
        style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#000000', marginTop: 20 }}
      >
        Could not load analytics. Pull down to retry.
      </Text>
    );
  } else {
    const monthRevenue = Number(data.month?.revenue ?? 0);
    const monthSales = Number(data.month?.sale_count ?? 0);
    const avgSale = monthSales > 0 ? monthRevenue / monthSales : 0;

    const topMeds: TopMed[] = [...(data.topMedications ?? [])].sort((a, b) => {
      if (rankBy === 'units') return b.units_sold - a.units_sold;
      return Number(b.revenue) - Number(a.revenue);
    });
    const maxMetric = Math.max(
      1,
      ...topMeds.map((m) => (rankBy === 'units' ? m.units_sold : Number(m.revenue)))
    );

    const trend = (data.trend ?? []).map((t: { day: string; revenue: string }) => ({
      day: t.day,
      revenue: Number(t.revenue),
    }));
    const maxTrend = Math.max(1, ...trend.map((t: { revenue: number }) => t.revenue));

    const expiring = data.expiringSoon ?? [];

    const rankToggle = (
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {(
          [
            { id: 'revenue', label: 'Revenue' },
            { id: 'units', label: 'Units' },
          ] as const
        ).map((option) => {
          const isActive = rankBy === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => setRankBy(option.id)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 999,
                backgroundColor: isActive ? '#000000' : '#FFFFFF',
                borderWidth: 1,
                borderColor: isActive ? '#000000' : '#E5E5E5',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Inter_500Medium',
                  fontSize: 11,
                  color: isActive ? '#FFFFFF' : '#000000',
                }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );

    body = (
      <View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
          <StatCard label="Revenue (30 days)" value={formatCurrency(monthRevenue)} />
          <StatCard label="Sales (30 days)" value={String(monthSales)} />
          <StatCard label="Average sale" value={formatCurrency(avgSale)} />
          <StatCard
            label="Inventory value"
            value={formatCurrency(data.inventory?.inventory_value)}
          />
        </View>

        <SectionCard
          title="Top performing medications"
          subtitle="Best sellers, last 30 days"
          action={rankToggle}
        >
          {topMeds.length === 0 ? (
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#737373' }}>
              No sales in the last 30 days yet. Record sales to see top performers.
            </Text>
          ) : (
            topMeds.map((med, index) => {
              const metric = rankBy === 'units' ? med.units_sold : Number(med.revenue);
              const widthPct = Math.max(4, (metric / maxMetric) * 100);
              return (
                <View key={med.name} style={{ marginTop: index === 0 ? 0 : 14 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                      <View
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 11,
                          borderWidth: 1,
                          borderColor: '#E5E5E5',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: 'Inter_600SemiBold',
                            fontSize: 10,
                            color: '#000000',
                          }}
                        >
                          {index + 1}
                        </Text>
                      </View>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Inter_500Medium',
                          fontSize: 13,
                          color: '#000000',
                          flex: 1,
                        }}
                      >
                        {med.name}
                      </Text>
                    </View>
                    <Text
                      style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#000000' }}
                    >
                      {rankBy === 'units' ? `${med.units_sold} units` : formatCurrency(med.revenue)}
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#F5F5F5',
                      marginTop: 6,
                    }}
                  >
                    <View
                      style={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#000000',
                        width: `${widthPct}%`,
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: 'Inter_400Regular',
                      fontSize: 11,
                      color: '#737373',
                      marginTop: 4,
                    }}
                  >
                    {med.units_sold} units · {formatCurrency(med.revenue)}
                  </Text>
                </View>
              );
            })
          )}
        </SectionCard>

        <SectionCard title="Revenue trend" subtitle="Daily revenue, last 14 days">
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              gap: 4,
              height: 120,
            }}
          >
            {trend.map((t: { day: string; revenue: number }) => {
              const heightPct = t.revenue > 0 ? Math.max(6, (t.revenue / maxTrend) * 100) : 2;
              return (
                <View
                  key={t.day}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                  }}
                >
                  <View
                    style={{
                      width: '70%',
                      height: `${heightPct}%`,
                      backgroundColor: t.revenue > 0 ? '#000000' : '#E5E5E5',
                      borderRadius: 3,
                    }}
                  />
                </View>
              );
            })}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 8,
              borderTopWidth: 1,
              borderTopColor: '#E5E5E5',
              paddingTop: 6,
            }}
          >
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#737373' }}>
              {trend.length > 0 ? formatShortDate(trend[0].day) : ''}
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#737373' }}>
              {trend.length > 0 ? formatShortDate(trend[trend.length - 1].day) : ''}
            </Text>
          </View>
        </SectionCard>

        <SectionCard title="Expiring soon" subtitle="Within the next 90 days">
          {expiring.length === 0 ? (
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#737373' }}>
              Nothing expiring soon.
            </Text>
          ) : (
            expiring.map((m: { id: number; name: string; expiry_date: string }) => (
              <View
                key={m.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: '#F5F5F5',
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 13,
                    color: '#000000',
                    flex: 1,
                  }}
                >
                  {m.name}
                </Text>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: '#737373' }}>
                  {formatShortDate(m.expiry_date)}
                </Text>
              </View>
            ))
          )}
        </SectionCard>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', paddingTop: insets.top }}>
      <StatusBar />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#000000" />
        }
      >
        <Text
          style={{
            fontFamily: 'Inter_600SemiBold',
            fontSize: 24,
            color: '#000000',
            marginTop: 12,
            letterSpacing: -0.5,
          }}
        >
          Analytics
        </Text>
        <Text
          style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#737373', marginTop: 2 }}
        >
          {pharmacy.name} — last 30 days
        </Text>
        <RestockInsightsCard pharmacyId={pharmacy.id} />
        {body}
      </ScrollView>
    </View>
  );
}

export default function AnalyticsScreen() {
  return (
    <PharmacyGate>
      <AnalyticsContent />
    </PharmacyGate>
  );
}
