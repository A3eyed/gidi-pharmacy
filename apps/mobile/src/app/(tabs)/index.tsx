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
import { useRouter } from 'expo-router';
import { AlertTriangle, CalendarClock, LogOut, Pill, Plus } from '@/components/Icons';
import { BarChart3, Bot, FileText, Receipt } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/utils/auth/useAuth';
import { authFetch } from '@/utils/auth/getSession';
import { usePreferences } from '@/utils/locale/PreferencesProvider';
import GlassCard from '@/components/GlassCard';
import PharmacyGate, { CreatePharmacyScreen, usePharmacy } from '@/components/PharmacyGate';
import { DashboardSkeleton, friendlyError } from '@/components/Skeleton';
import { formatCurrency, formatDateTime, formatShortDate } from '@/utils/format';

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  const { colors } = usePreferences();
  return (
    <GlassCard style={{ flex: 1, minWidth: '46%' }} radius={14}>
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
      {hint ? (
        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 11,
            color: colors.gold,
            marginTop: 4,
          }}
        >
          {hint}
        </Text>
      ) : null}
    </GlassCard>
  );
}

/** Shortcuts to the jobs staff do every shift. */
function QuickActions() {
  const router = useRouter();
  const { colors } = usePreferences();
  const actions = [
    { key: 'sales', label: 'Record sale', icon: Receipt, go: () => router.push('/sales') },
    { key: 'inventory', label: 'Inventory', icon: Plus, go: () => router.push('/inventory') },
    { key: 'azara', label: 'Ask Azara', icon: Bot, go: () => router.push('/azara') },
    { key: 'reports', label: 'Reports', icon: FileText, go: () => router.push('/reports') },
    { key: 'analytics', label: 'Analytics', icon: BarChart3, go: () => router.push('/analytics') },
  ];

  return (
    <ScrollView
      horizontal
      style={{ flexGrow: 0, marginTop: 12 }}
      contentContainerStyle={{ gap: 8, paddingRight: 8 }}
      showsHorizontalScrollIndicator={false}
    >
      {actions.map((action) => (
        <TouchableOpacity key={action.key} onPress={action.go} activeOpacity={0.85}>
          <GlassCard tone="gold" padding={12} radius={12}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                backgroundColor: 'transparent',
              }}
            >
              <action.icon size={15} color={colors.gold} />
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#000000' }}>
                {action.label}
              </Text>
            </View>
          </GlassCard>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GlassCard style={{ marginTop: 12 }} radius={14}>
      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#000000' }}>
        {title}
      </Text>
      <View style={{ marginTop: 10, backgroundColor: 'transparent' }}>{children}</View>
    </GlassCard>
  );
}

function DashboardContent() {
  const insets = useSafeAreaInsets();
  const { pharmacy, pharmacies, setPharmacyId } = usePharmacy();
  const { signOut } = useAuth();
  const [showNewPharmacy, setShowNewPharmacy] = useState(false);

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

  const { data: salesData } = useQuery({
    queryKey: ['sales', pharmacy.id, 5],
    queryFn: async () => {
      const response = await authFetch(`/api/sales?pharmacyId=${pharmacy.id}&limit=5`);
      if (!response.ok) {
        throw new Error(
          `When fetching /api/sales, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  if (showNewPharmacy) {
    return (
      <CreatePharmacyScreen title="Add another pharmacy" onDone={() => setShowNewPharmacy(false)} />
    );
  }

  const inv = data?.inventory ?? {};
  const lowStock = data?.lowStock ?? [];
  const expiring = data?.expiringSoon ?? [];
  const recentSales = salesData?.sales ?? [];

  let body: React.ReactNode = null;
  if (isLoading) {
    body = <DashboardSkeleton />;
  } else if (error) {
    body = (
      <Text
        style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#000000', marginTop: 20 }}
      >
        {friendlyError()}
      </Text>
    );
  } else {
    body = (
      <View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
          <StatCard
            label="Today's revenue"
            value={formatCurrency(data?.today?.revenue)}
            hint={`${data?.today?.sale_count ?? 0} sales today`}
          />
          <StatCard
            label="Last 30 days"
            value={formatCurrency(data?.month?.revenue)}
            hint={`${data?.month?.sale_count ?? 0} sales`}
          />
          <StatCard
            label="Medications"
            value={String(inv.total_medications ?? 0)}
            hint={`${inv.out_of_stock_count ?? 0} out of stock`}
          />
          <StatCard
            label="Inventory value"
            value={formatCurrency(inv.inventory_value)}
            hint={`${inv.low_stock_count ?? 0} low stock items`}
          />
        </View>

        <SectionCard title="Low stock">
          {lowStock.length === 0 ? (
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#737373' }}>
              All medications are sufficiently stocked.
            </Text>
          ) : (
            lowStock.map(
              (m: { id: number; name: string; stock_quantity: number; reorder_level: number }) => (
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
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                    <AlertTriangle size={14} color="#000000" />
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
                  </View>
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: '#737373' }}>
                    {m.stock_quantity} left
                  </Text>
                </View>
              )
            )
          )}
        </SectionCard>

        <SectionCard title="Expiring soon">
          {expiring.length === 0 ? (
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#737373' }}>
              Nothing expiring in the next 90 days.
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
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                  <CalendarClock size={14} color="#000000" />
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
                </View>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: '#737373' }}>
                  {formatShortDate(m.expiry_date)}
                </Text>
              </View>
            ))
          )}
        </SectionCard>

        <SectionCard title="Recent sales">
          {recentSales.length === 0 ? (
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#737373' }}>
              No sales recorded yet. Record your first sale from the Sales tab.
            </Text>
          ) : (
            recentSales.map(
              (s: {
                id: number;
                total_amount: string;
                created_at: string;
                items: Array<{ id: number; medication_name: string; quantity: number }>;
              }) => (
                <View
                  key={s.id}
                  style={{
                    paddingVertical: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F5F5F5',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#000000' }}>
                      {formatDateTime(s.created_at)}
                    </Text>
                    <Text
                      style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#000000' }}
                    >
                      {formatCurrency(s.total_amount)}
                    </Text>
                  </View>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'Inter_400Regular',
                      fontSize: 12,
                      color: '#737373',
                      marginTop: 2,
                    }}
                  >
                    {s.items.map((i) => `${i.medication_name} ×${i.quantity}`).join(', ')}
                  </Text>
                </View>
              )
            )
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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                backgroundColor: '#000000',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Pill size={16} color="#FFFFFF" />
            </View>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, color: '#000000' }}>
              GiDi
            </Text>
          </View>
          <TouchableOpacity
            onPress={signOut}
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              borderWidth: 1,
              borderColor: '#E5E5E5',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogOut size={15} color="#000000" />
          </TouchableOpacity>
        </View>

        <Text
          style={{
            fontFamily: 'Inter_600SemiBold',
            fontSize: 24,
            color: '#000000',
            marginTop: 18,
            letterSpacing: -0.5,
          }}
        >
          Dashboard
        </Text>

        <ScrollView
          horizontal
          style={{ flexGrow: 0, marginTop: 12 }}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {pharmacies.map((p) => {
            const isActive = p.id === pharmacy.id;
            return (
              <TouchableOpacity
                key={p.id}
                onPress={() => setPharmacyId(p.id)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 999,
                  backgroundColor: isActive ? '#000000' : '#FFFFFF',
                  borderWidth: 1,
                  borderColor: isActive ? '#000000' : '#E5E5E5',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Inter_500Medium',
                    fontSize: 13,
                    color: isActive ? '#FFFFFF' : '#000000',
                  }}
                >
                  {p.name}
                </Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            onPress={() => setShowNewPharmacy(true)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 7,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: '#E5E5E5',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Plus size={13} color="#000000" />
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#000000' }}>
              New
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <QuickActions />

        {body}
      </ScrollView>
    </View>
  );
}

export default function DashboardScreen() {
  return (
    <PharmacyGate>
      <DashboardContent />
    </PharmacyGate>
  );
}
