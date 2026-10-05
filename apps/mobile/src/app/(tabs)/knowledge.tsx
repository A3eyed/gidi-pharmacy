import { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from '@/components/Themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Plus, Search, Trash2 } from 'lucide-react-native';
import { authFetch } from '@/utils/auth/getSession';
import { usePreferences } from '@/utils/locale/PreferencesProvider';
import KeyboardAvoidingAnimatedView from '@/components/KeyboardAvoidingAnimatedView';
import GlassCard from '@/components/GlassCard';
import PharmacyGate, { usePharmacy } from '@/components/PharmacyGate';

type Topic = {
  id: string;
  title: string;
  category: string;
  summary: string;
  source: string | null;
};
type Note = { id: number; question: string; answer: string; author: string | null };

function KnowledgeContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { pharmacy } = usePharmacy();
  const { colors, resolvedTheme } = usePreferences();
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ question: '', answer: '' });
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['azara-knowledge', pharmacy.id, search],
    queryFn: async () => {
      const params = new URLSearchParams({ pharmacyId: String(pharmacy.id) });
      if (search) params.set('search', search);
      const response = await authFetch(`/api/azara/knowledge?${params.toString()}`);
      if (!response.ok) {
        throw new Error(
          `When fetching /api/azara/knowledge, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  const addNote = useMutation({
    mutationFn: async () => {
      const response = await authFetch('/api/azara/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pharmacyId: pharmacy.id, ...form }),
      });
      if (!response.ok) {
        throw new Error(
          `When saving the note, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
    onSuccess: () => {
      setForm({ question: '', answer: '' });
      setAdding(false);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['azara-knowledge'] });
    },
    onError: (err) => {
      console.error(err);
      setError('Could not save that note.');
    },
  });

  const removeNote = useMutation({
    mutationFn: async (id: number) => {
      const response = await authFetch(`/api/azara/knowledge?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(
          `When deleting the note, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['azara-knowledge'] }),
    onError: (err) => console.error(err),
  });

  const stats = data?.stats;
  const topics: Topic[] = data?.topics ?? [];
  const notes: Note[] = data?.notes ?? [];

  return (
    <KeyboardAvoidingAnimatedView
      style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}
      behavior="padding"
    >
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
            Reference library
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.gold }}>
            {stats ? `${stats.entries} topics · ${stats.interactions} interactions` : 'Loading…'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setAdding((v) => !v)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            backgroundColor: colors.gold,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Plus size={18} color={resolvedTheme === 'dark' ? '#000000' : '#FFFFFF'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {adding ? (
          <GlassCard tone="strong" style={{ marginBottom: 12 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#000000' }}>
              Teach Azara
            </Text>
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 11,
                color: '#737373',
                marginTop: 4,
              }}
            >
              Saved notes are searched exactly like the built-in reference content.
            </Text>
            <TextInput
              value={form.question}
              onChangeText={(question) => setForm({ ...form, question })}
              placeholder="Topic or question"
              placeholderTextColor="#A3A3A3"
              style={{
                marginTop: 10,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: '#E5E5E5',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontFamily: 'Inter_400Regular',
                fontSize: 13,
                color: '#000000',
                backgroundColor: '#FFFFFF',
              }}
            />
            <TextInput
              value={form.answer}
              onChangeText={(answer) => setForm({ ...form, answer })}
              placeholder="The answer — one point per line"
              placeholderTextColor="#A3A3A3"
              multiline
              style={{
                marginTop: 8,
                minHeight: 90,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: '#E5E5E5',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontFamily: 'Inter_400Regular',
                fontSize: 13,
                color: '#000000',
                backgroundColor: '#FFFFFF',
                textAlignVertical: 'top',
              }}
            />
            <TouchableOpacity
              onPress={() => addNote.mutate()}
              disabled={form.question.trim().length < 3 || form.answer.trim().length < 3}
              style={{
                marginTop: 10,
                backgroundColor: colors.gold,
                borderRadius: 10,
                paddingVertical: 11,
                alignItems: 'center',
                opacity: form.question.trim().length < 3 || form.answer.trim().length < 3 ? 0.4 : 1,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 13,
                  color: resolvedTheme === 'dark' ? '#000000' : '#FFFFFF',
                }}
              >
                {addNote.isPending ? 'Saving…' : 'Save to reference library'}
              </Text>
            </TouchableOpacity>
          </GlassCard>
        ) : null}

        {error ? (
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 13,
              color: '#000000',
              marginBottom: 8,
            }}
          >
            {error}
          </Text>
        ) : null}

        <GlassCard padding={10} radius={12} style={{ marginBottom: 12 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'transparent',
            }}
          >
            <Search size={15} color={colors.gold} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search medicines, conditions, protocols…"
              placeholderTextColor="#A3A3A3"
              style={{
                flex: 1,
                fontFamily: 'Inter_400Regular',
                fontSize: 13,
                color: '#000000',
                backgroundColor: 'transparent',
              }}
            />
          </View>
        </GlassCard>

        {notes.length > 0 ? (
          <View style={{ marginBottom: 12, gap: 8, backgroundColor: 'transparent' }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#000000' }}>
              Your pharmacy&apos;s notes
            </Text>
            {notes.map((note) => (
              <GlassCard key={note.id} tone="gold" padding={12} radius={12}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 8,
                    backgroundColor: 'transparent',
                  }}
                >
                  <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#000000' }}>
                      {note.question}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Inter_400Regular',
                        fontSize: 12,
                        lineHeight: 18,
                        color: '#404040',
                        marginTop: 4,
                      }}
                    >
                      {note.answer}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removeNote.mutate(note.id)}>
                    <Trash2 size={14} color="#737373" />
                  </TouchableOpacity>
                </View>
              </GlassCard>
            ))}
          </View>
        ) : null}

        <Text
          style={{
            fontFamily: 'Inter_600SemiBold',
            fontSize: 13,
            color: '#000000',
            marginBottom: 8,
          }}
        >
          {search ? 'Search results' : 'Built-in reference topics'}
        </Text>

        {isLoading ? (
          <ActivityIndicator color="#737373" />
        ) : (
          <View style={{ gap: 8, backgroundColor: 'transparent' }}>
            {topics.map((topic) => (
              <GlassCard key={topic.id} padding={12} radius={12}>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 10, color: colors.gold }}>
                  {topic.category.toUpperCase()}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 13,
                    color: '#000000',
                    marginTop: 3,
                  }}
                >
                  {topic.title}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 12,
                    lineHeight: 18,
                    color: '#404040',
                    marginTop: 4,
                  }}
                >
                  {topic.summary}
                </Text>
              </GlassCard>
            ))}
          </View>
        )}

        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 11,
            lineHeight: 17,
            color: '#737373',
            marginTop: 16,
            textAlign: 'center',
          }}
        >
          Reference material for qualified professionals. Not medical advice, not a diagnosis —
          always confirm against the BNF, WHO guidance or your national formulary.
        </Text>
      </ScrollView>
    </KeyboardAvoidingAnimatedView>
  );
}

export default function KnowledgeScreen() {
  return (
    <PharmacyGate>
      <KnowledgeContent />
    </PharmacyGate>
  );
}
