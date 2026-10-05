import { useState } from 'react';
import { Alert } from 'react-native';
import {
  FlatList,
  KeyboardAvoidingAnimatedView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from '@/components/Themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Minus, Plus, Search, X } from '@/components/Icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authFetch } from '@/utils/auth/getSession';
import PharmacyGate, { usePharmacy } from '@/components/PharmacyGate';
import { formatCurrency, formatDateTime } from '@/utils/format';

type Med = {
  id: number;
  name: string;
  unit_price: string;
  stock_quantity: number;
};

type CartLine = {
  medicationId: number;
  name: string;
  unitPrice: number;
  quantity: number;
  maxStock: number;
};

function NewSaleView() {
  const { pharmacy } = usePharmacy();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartLine[]>([]);

  const { data: medsData, isLoading } = useQuery({
    queryKey: ['medications', pharmacy.id, search, 'sale-picker'],
    queryFn: async () => {
      const params = new URLSearchParams({ pharmacyId: String(pharmacy.id) });
      if (search) params.set('search', search);
      const response = await authFetch(`/api/medications?${params.toString()}`);
      if (!response.ok) {
        throw new Error(
          `When fetching /api/medications, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  const recordSale = useMutation({
    mutationFn: async () => {
      const response = await authFetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pharmacyId: pharmacy.id,
          items: cart.map((l) => ({ medicationId: l.medicationId, quantity: l.quantity })),
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.error ??
            `When recording sale, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
    onSuccess: () => {
      setCart([]);
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      Alert.alert('Sale recorded', 'The sale was saved and stock levels were updated.');
    },
    onError: (err: Error) => {
      console.error(err);
      Alert.alert('Could not record sale', err.message || 'Please try again.');
    },
  });

  const meds: Med[] = (medsData?.medications ?? []).filter((m: Med) => m.stock_quantity > 0);

  const addToCart = (med: Med) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.medicationId === med.id);
      if (existing) {
        if (existing.quantity >= existing.maxStock) return prev;
        return prev.map((l) =>
          l.medicationId === med.id ? { ...l, quantity: l.quantity + 1 } : l
        );
      }
      return [
        ...prev,
        {
          medicationId: med.id,
          name: med.name,
          unitPrice: Number(med.unit_price),
          quantity: 1,
          maxStock: med.stock_quantity,
        },
      ];
    });
  };

  const changeQty = (medicationId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((l) => {
          if (l.medicationId !== medicationId) return l;
          const next = Math.min(Math.max(l.quantity + delta, 0), l.maxStock);
          return { ...l, quantity: next };
        })
        .filter((l) => l.quantity > 0)
    );
  };

  const removeLine = (medicationId: number) => {
    setCart((prev) => prev.filter((l) => l.medicationId !== medicationId));
  };

  const total = cart.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const recordDisabled = cart.length === 0 || recordSale.isPending;

  let pickerContent: React.ReactNode = null;
  if (isLoading) {
    pickerContent = (
      <Text
        style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#737373', marginTop: 10 }}
      >
        Loading medications…
      </Text>
    );
  } else if (meds.length === 0) {
    pickerContent = (
      <Text
        style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#737373', marginTop: 10 }}
      >
        {search ? 'No matching medications in stock.' : 'No medications in stock yet.'}
      </Text>
    );
  } else {
    pickerContent = (
      <View
        style={{
          borderWidth: 1,
          borderColor: '#E5E5E5',
          borderRadius: 12,
          marginTop: 10,
          maxHeight: 200,
          overflow: 'hidden',
        }}
      >
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
          {meds.map((med, index) => (
            <TouchableOpacity
              key={med.id}
              onPress={() => addToCart(med)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderTopWidth: index === 0 ? 0 : 1,
                borderTopColor: '#F5F5F5',
              }}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text
                  numberOfLines={1}
                  style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#000000' }}
                >
                  {med.name}
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#737373' }}>
                  {med.stock_quantity} in stock
                </Text>
              </View>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#000000' }}>
                {formatCurrency(med.unit_price)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          borderWidth: 1,
          borderColor: '#E5E5E5',
          borderRadius: 10,
          paddingHorizontal: 12,
          height: 44,
          marginTop: 14,
        }}
      >
        <Search size={15} color="#737373" />
        <TextInput
          style={{
            flex: 1,
            fontFamily: 'Inter_400Regular',
            fontSize: 14,
            color: '#000000',
            height: '100%',
          }}
          value={search}
          onChangeText={setSearch}
          placeholder="Search medications…"
          placeholderTextColor="#A3A3A3"
        />
      </View>

      {pickerContent}

      <Text
        style={{
          fontFamily: 'Inter_500Medium',
          fontSize: 12,
          color: '#737373',
          marginTop: 18,
        }}
      >
        Items in this sale
      </Text>

      {cart.length === 0 ? (
        <Text
          style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#737373', marginTop: 8 }}
        >
          Nothing added yet. Tap a medication above to add it.
        </Text>
      ) : (
        cart.map((line) => (
          <View
            key={line.medicationId}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderColor: '#E5E5E5',
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginTop: 8,
              gap: 8,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#000000' }}
              >
                {line.name}
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#737373' }}>
                {formatCurrency(line.unitPrice)} each
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <TouchableOpacity
                onPress={() => changeQty(line.medicationId, -1)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#E5E5E5',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Minus size={13} color="#000000" />
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 14,
                  color: '#000000',
                  width: 24,
                  textAlign: 'center',
                }}
              >
                {line.quantity}
              </Text>
              <TouchableOpacity
                onPress={() => changeQty(line.medicationId, 1)}
                disabled={line.quantity >= line.maxStock}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#E5E5E5',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: line.quantity >= line.maxStock ? 0.4 : 1,
                }}
              >
                <Plus size={13} color="#000000" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeLine(line.medicationId)}
                style={{
                  width: 28,
                  height: 28,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={14} color="#737373" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          marginTop: 18,
          paddingTop: 14,
        }}
      >
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: '#737373' }}>Total</Text>
        <Text
          style={{
            fontFamily: 'Inter_600SemiBold',
            fontSize: 22,
            color: '#000000',
            letterSpacing: -0.4,
          }}
        >
          {formatCurrency(total)}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => recordSale.mutate()}
        disabled={recordDisabled}
        style={{
          marginTop: 14,
          height: 48,
          borderRadius: 10,
          backgroundColor: '#000000',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: recordDisabled ? 0.4 : 1,
        }}
      >
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 15, color: '#FFFFFF' }}>
          {recordSale.isPending ? 'Recording…' : 'Record sale'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function HistoryView() {
  const { pharmacy } = usePharmacy();
  const { data, isLoading, error } = useQuery({
    queryKey: ['sales', pharmacy.id, 25],
    queryFn: async () => {
      const response = await authFetch(`/api/sales?pharmacyId=${pharmacy.id}&limit=25`);
      if (!response.ok) {
        throw new Error(
          `When fetching /api/sales, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  const sales = data?.sales ?? [];

  if (isLoading) {
    return (
      <Text
        style={{
          fontFamily: 'Inter_400Regular',
          fontSize: 14,
          color: '#737373',
          paddingHorizontal: 20,
          marginTop: 20,
        }}
      >
        Loading sales…
      </Text>
    );
  }
  if (error) {
    return (
      <Text
        style={{
          fontFamily: 'Inter_400Regular',
          fontSize: 14,
          color: '#000000',
          paddingHorizontal: 20,
          marginTop: 20,
        }}
      >
        Could not load sales history.
      </Text>
    );
  }
  if (sales.length === 0) {
    return (
      <View style={{ alignItems: 'center', marginTop: 48, paddingHorizontal: 32 }}>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#000000' }}>
          No sales yet
        </Text>
        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 13,
            color: '#737373',
            marginTop: 4,
            textAlign: 'center',
          }}
        >
          Sales you record will appear here.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={sales}
      keyExtractor={(item) => String(item.id)}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, paddingTop: 6 }}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View
          style={{
            borderWidth: 1,
            borderColor: '#E5E5E5',
            borderRadius: 12,
            padding: 14,
            marginTop: 10,
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
              {formatDateTime(item.created_at)}
            </Text>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#000000' }}>
              {formatCurrency(item.total_amount)}
            </Text>
          </View>
          <View style={{ marginTop: 6 }}>
            {item.items.map(
              (line: {
                id: number;
                medication_name: string;
                quantity: number;
                subtotal: string;
              }) => (
                <Text
                  key={line.id}
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 12,
                    color: '#737373',
                    marginTop: 2,
                  }}
                >
                  - {line.medication_name} ×{line.quantity} · {formatCurrency(line.subtotal)}
                </Text>
              )
            )}
          </View>
        </View>
      )}
    />
  );
}

function SalesContent() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<'new' | 'history'>('new');

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', paddingTop: insets.top }}>
        <StatusBar />
        <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
          <Text
            style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 24,
              color: '#000000',
              letterSpacing: -0.5,
            }}
          >
            Sales
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            {(
              [
                { id: 'new', label: 'New sale' },
                { id: 'history', label: 'History' },
              ] as const
            ).map((option) => {
              const isActive = mode === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setMode(option.id)}
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
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {mode === 'new' ? <NewSaleView /> : <HistoryView />}
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}

export default function SalesScreen() {
  return (
    <PharmacyGate>
      <SalesContent />
    </PharmacyGate>
  );
}
