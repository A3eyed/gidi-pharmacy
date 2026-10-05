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
import { ChevronLeft, Plus, Search, Trash2 } from '@/components/Icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authFetch } from '@/utils/auth/getSession';
import { readOffline, writeOffline } from '@/utils/offline';
import PharmacyGate, { usePharmacy } from '@/components/PharmacyGate';
import { formatCurrency, formatShortDate } from '@/utils/format';

type Medication = {
  id: number;
  name: string;
  generic_name: string | null;
  category: string | null;
  sku: string | null;
  unit_price: string;
  cost_price: string;
  stock_quantity: number;
  reorder_level: number;
  expiry_date: string | null;
};

const FILTERS = [
  { id: '', label: 'All' },
  { id: 'low', label: 'Low stock' },
  { id: 'out', label: 'Out of stock' },
  { id: 'expiring', label: 'Expiring' },
];

const emptyForm = {
  name: '',
  genericName: '',
  category: '',
  sku: '',
  unitPrice: '',
  costPrice: '',
  stockQuantity: '',
  reorderLevel: '10',
  expiryDate: '',
};

function MedicationForm({
  medication,
  onClose,
}: {
  medication: Medication | null;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { pharmacy } = usePharmacy();
  const queryClient = useQueryClient();
  const isEditing = !!medication;
  const [form, setForm] = useState(() => {
    if (!medication) return emptyForm;
    return {
      name: medication.name ?? '',
      genericName: medication.generic_name ?? '',
      category: medication.category ?? '',
      sku: medication.sku ?? '',
      unitPrice: String(medication.unit_price ?? ''),
      costPrice: String(medication.cost_price ?? ''),
      stockQuantity: String(medication.stock_quantity ?? ''),
      reorderLevel: String(medication.reorder_level ?? '10'),
      expiryDate: medication.expiry_date ? medication.expiry_date.slice(0, 10) : '',
    };
  });
  const [error, setError] = useState<string | null>(null);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['medications'] });
    queryClient.invalidateQueries({ queryKey: ['analytics'] });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        pharmacyId: pharmacy.id,
        name: form.name,
        genericName: form.genericName,
        category: form.category,
        sku: form.sku,
        unitPrice: Number(form.unitPrice || 0),
        costPrice: Number(form.costPrice || 0),
        stockQuantity: Number(form.stockQuantity || 0),
        reorderLevel: Number(form.reorderLevel || 0),
        expiryDate: form.expiryDate || null,
      };
      const url = isEditing ? `/api/medications/${medication.id}` : '/api/medications';
      const response = await authFetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(
          `When saving medication, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
    onSuccess: () => {
      invalidate();
      onClose();
    },
    onError: (err) => {
      console.error(err);
      setError('Could not save the medication. Please try again.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await authFetch(`/api/medications/${medication?.id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(
          `When deleting medication, the response was [${response.status}] ${response.statusText}`
        );
      }
    },
    onSuccess: () => {
      invalidate();
      onClose();
    },
    onError: (err) => {
      console.error(err);
      setError('Could not delete the medication.');
    },
  });

  const confirmDelete = () => {
    Alert.alert('Remove medication', `Remove ${medication?.name} from inventory?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteMutation.mutate() },
    ]);
  };

  const set = (key: keyof typeof emptyForm) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

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

  const saveDisabled = saveMutation.isPending || !form.name.trim();

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', paddingTop: insets.top }}>
        <StatusBar />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#E5E5E5',
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}
          >
            <ChevronLeft size={18} color="#000000" />
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: '#000000' }}>
              Back
            </Text>
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#000000' }}>
            {isEditing ? 'Edit medication' : 'Add medication'}
          </Text>
          <View style={{ width: 52 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={labelStyle}>Name</Text>
          <TextInput
            style={inputStyle}
            value={form.name}
            onChangeText={set('name')}
            placeholder="e.g. Paracetamol 500mg"
            placeholderTextColor="#A3A3A3"
          />
          <Text style={labelStyle}>Generic name</Text>
          <TextInput
            style={inputStyle}
            value={form.genericName}
            onChangeText={set('genericName')}
            placeholder="e.g. Acetaminophen"
            placeholderTextColor="#A3A3A3"
          />
          <Text style={labelStyle}>Category</Text>
          <TextInput
            style={inputStyle}
            value={form.category}
            onChangeText={set('category')}
            placeholder="e.g. Analgesic"
            placeholderTextColor="#A3A3A3"
          />
          <Text style={labelStyle}>SKU / Barcode</Text>
          <TextInput
            style={inputStyle}
            value={form.sku}
            onChangeText={set('sku')}
            placeholder="Optional"
            placeholderTextColor="#A3A3A3"
          />
          <Text style={labelStyle}>Selling price (GH₵)</Text>
          <TextInput
            style={inputStyle}
            value={form.unitPrice}
            onChangeText={set('unitPrice')}
            placeholder="0.00"
            placeholderTextColor="#A3A3A3"
            keyboardType="decimal-pad"
          />
          <Text style={labelStyle}>Cost price (GH₵)</Text>
          <TextInput
            style={inputStyle}
            value={form.costPrice}
            onChangeText={set('costPrice')}
            placeholder="0.00"
            placeholderTextColor="#A3A3A3"
            keyboardType="decimal-pad"
          />
          <Text style={labelStyle}>Stock quantity</Text>
          <TextInput
            style={inputStyle}
            value={form.stockQuantity}
            onChangeText={set('stockQuantity')}
            placeholder="0"
            placeholderTextColor="#A3A3A3"
            keyboardType="number-pad"
          />
          <Text style={labelStyle}>Reorder level</Text>
          <TextInput
            style={inputStyle}
            value={form.reorderLevel}
            onChangeText={set('reorderLevel')}
            placeholder="10"
            placeholderTextColor="#A3A3A3"
            keyboardType="number-pad"
          />
          <Text style={labelStyle}>Expiry date (YYYY-MM-DD)</Text>
          <TextInput
            style={inputStyle}
            value={form.expiryDate}
            onChangeText={set('expiryDate')}
            placeholder="e.g. 2027-06-30"
            placeholderTextColor="#A3A3A3"
          />

          {error ? (
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
          ) : null}

          <TouchableOpacity
            onPress={() => {
              setError(null);
              if (form.name.trim()) saveMutation.mutate();
            }}
            disabled={saveDisabled}
            style={{
              marginTop: 22,
              height: 48,
              borderRadius: 10,
              backgroundColor: '#000000',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: saveDisabled ? 0.4 : 1,
            }}
          >
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 15, color: '#FFFFFF' }}>
              {saveMutation.isPending ? 'Saving…' : isEditing ? 'Save changes' : 'Add medication'}
            </Text>
          </TouchableOpacity>

          {isEditing ? (
            <TouchableOpacity
              onPress={confirmDelete}
              style={{
                marginTop: 10,
                height: 48,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#E5E5E5',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 6,
              }}
            >
              <Trash2 size={15} color="#000000" />
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 15, color: '#000000' }}>
                Remove from inventory
              </Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}

function StockPill({ med }: { med: Medication }) {
  let label = 'In stock';
  let dotColor = '#000000';
  if (med.stock_quantity === 0) {
    label = 'Out';
    dotColor = '#FFFFFF';
  } else if (med.stock_quantity <= med.reorder_level) {
    label = 'Low';
    dotColor = '#737373';
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: dotColor,
          borderWidth: dotColor === '#FFFFFF' ? 1 : 0,
          borderColor: '#000000',
        }}
      />
      <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: '#000000' }}>
        {med.stock_quantity} · {label}
      </Text>
    </View>
  );
}

function InventoryContent() {
  const insets = useSafeAreaInsets();
  const { pharmacy } = usePharmacy();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['medications', pharmacy.id, search, filter],
    queryFn: async () => {
      const params = new URLSearchParams({ pharmacyId: String(pharmacy.id) });
      if (search) params.set('search', search);
      if (filter) params.set('filter', filter);
      const cacheKey = `medications.${pharmacy.id}.${search}.${filter}`;
      try {
        const response = await authFetch(`/api/medications?${params.toString()}`);
        if (!response.ok) {
          throw new Error(
            `When fetching /api/medications, the response was [${response.status}] ${response.statusText}`
          );
        }
        const body = await response.json();
        await writeOffline(cacheKey, body);
        return body;
      } catch (error) {
        const cached = await readOffline<{ medications: Medication[] }>(cacheKey);
        if (cached) return cached;
        throw error;
      }
    },
  });

  if (formOpen) {
    return (
      <MedicationForm
        medication={editingMed}
        onClose={() => {
          setFormOpen(false);
          setEditingMed(null);
        }}
      />
    );
  }

  const medications: Medication[] = data?.medications ?? [];

  let listContent: React.ReactNode = null;
  if (isLoading) {
    listContent = (
      <Text
        style={{
          fontFamily: 'Inter_400Regular',
          fontSize: 14,
          color: '#737373',
          paddingHorizontal: 20,
          marginTop: 20,
        }}
      >
        Loading inventory…
      </Text>
    );
  } else if (error) {
    listContent = (
      <Text
        style={{
          fontFamily: 'Inter_400Regular',
          fontSize: 14,
          color: '#000000',
          paddingHorizontal: 20,
          marginTop: 20,
        }}
      >
        Could not load inventory. Please try again.
      </Text>
    );
  } else if (medications.length === 0) {
    listContent = (
      <View style={{ alignItems: 'center', marginTop: 48, paddingHorizontal: 32 }}>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#000000' }}>
          No medications found
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
          {search || filter
            ? 'Try adjusting your search or filter.'
            : 'Tap + to add your first medication.'}
        </Text>
      </View>
    );
  } else {
    listContent = (
      <FlatList
        data={medications}
        keyExtractor={(item) => String(item.id)}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, paddingTop: 4 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setEditingMed(item);
              setFormOpen(true);
            }}
            style={{
              borderWidth: 1,
              borderColor: '#E5E5E5',
              borderRadius: 12,
              backgroundColor: '#FFFFFF',
              padding: 14,
              marginTop: 10,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#000000' }}
                >
                  {item.name}
                </Text>
                {item.generic_name ? (
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'Inter_400Regular',
                      fontSize: 12,
                      color: '#737373',
                      marginTop: 2,
                    }}
                  >
                    {item.generic_name}
                  </Text>
                ) : null}
              </View>
              <StockPill med={item} />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10,
              }}
            >
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#000000' }}>
                {formatCurrency(item.unit_price)}
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#737373' }}>
                {item.expiry_date
                  ? `Expires ${formatShortDate(item.expiry_date)}`
                  : 'No expiry set'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', paddingTop: insets.top }}>
      <StatusBar />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 12,
        }}
      >
        <Text
          style={{
            fontFamily: 'Inter_600SemiBold',
            fontSize: 24,
            color: '#000000',
            letterSpacing: -0.5,
          }}
        >
          Inventory
        </Text>
        <TouchableOpacity
          onPress={() => {
            setEditingMed(null);
            setFormOpen(true);
          }}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: '#000000',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Plus size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: 14 }}>
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
            placeholder="Search name, generic, SKU…"
            placeholderTextColor="#A3A3A3"
          />
        </View>
      </View>

      <ScrollView
        horizontal
        style={{ flexGrow: 0, marginTop: 12 }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      >
        {FILTERS.map((f) => {
          const isActive = filter === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              onPress={() => setFilter(f.id)}
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
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={{ flex: 1, marginTop: 6 }}>{listContent}</View>
    </View>
  );
}

export default function InventoryScreen() {
  return (
    <PharmacyGate>
      <InventoryContent />
    </PharmacyGate>
  );
}
