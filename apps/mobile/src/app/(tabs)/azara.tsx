import { useEffect, useRef, useState } from 'react';
import type { ScrollView as RNScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from '@/components/Themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import {
  ArrowUp,
  BookOpen,
  Bot,
  RotateCcw,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
  TriangleAlert,
  User,
} from 'lucide-react-native';
import { useMutation } from '@tanstack/react-query';
import { authFetch } from '@/utils/auth/getSession';
import { usePreferences } from '@/utils/locale/PreferencesProvider';
import KeyboardAvoidingAnimatedView from '@/components/KeyboardAvoidingAnimatedView';
import GlassCard from '@/components/GlassCard';
import PharmacyGate, { usePharmacy } from '@/components/PharmacyGate';

type Source = { id: string; title: string; reference?: string };

type Message = {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  confidence?: 'high' | 'medium' | 'low';
  queryId?: number | null;
};

const SUGGESTIONS = [
  'List products',
  'What is low stock?',
  'What expires soon?',
  'Set expiry of paracetamol to 2027-03-01',
  'Record sale of ORS 2',
  'Add product ORS stock 30 price 4',
];

/** Lightweight markdown rendering for Azara's replies. */
function AssistantText({ content }: { content: string }) {
  const { colors } = usePreferences();
  const lines = content.split('\n').filter((l) => l.trim().length > 0);

  return (
    <View style={{ gap: 6, backgroundColor: 'transparent' }}>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        const nested = /^\s{2,}[-*•]/.test(line);
        const bullet = trimmed.match(/^[-*•]\s+(.*)$/);
        const heading = trimmed.match(/^#{1,6}\s+(.*)$/);
        const italic = trimmed.match(/^_(.+)_$/);
        const boldOnly = /^\*\*[^*]+\*\*$/.test(trimmed);
        const text = (italic?.[1] ?? bullet?.[1] ?? heading?.[1] ?? trimmed).replace(/\*\*/g, '');

        if (italic) {
          return (
            <Text
              key={index}
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 11,
                lineHeight: 17,
                color: '#737373',
                borderLeftWidth: 2,
                borderLeftColor: colors.gold,
                paddingLeft: 8,
                marginTop: 4,
              }}
            >
              {text}
            </Text>
          );
        }

        if (heading || boldOnly) {
          return (
            <Text
              key={index}
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 14,
                color: '#000000',
                marginTop: 4,
              }}
            >
              {text}
            </Text>
          );
        }

        if (bullet) {
          return (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                gap: 8,
                paddingLeft: nested ? 16 : 2,
                backgroundColor: 'transparent',
              }}
            >
              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: colors.gold,
                  marginTop: 7,
                }}
              />
              <Text
                style={{
                  fontFamily: 'Inter_400Regular',
                  fontSize: 14,
                  lineHeight: 21,
                  color: '#000000',
                  flex: 1,
                }}
              >
                {text}
              </Text>
            </View>
          );
        }

        return (
          <Text
            key={index}
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 14,
              lineHeight: 21,
              color: '#000000',
            }}
          >
            {text}
          </Text>
        );
      })}
    </View>
  );
}

/** Thumbs up / down, feeding the self-improvement loop. */
function FeedbackRow({ queryId }: { queryId: number }) {
  const { colors } = usePreferences();
  const [done, setDone] = useState(false);

  const send = useMutation({
    mutationFn: async (helpful: boolean) => {
      const response = await authFetch('/api/azara/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryId, helpful }),
      });
      if (!response.ok) {
        throw new Error(
          `When sending feedback, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
    onSuccess: () => setDone(true),
    onError: (error) => console.error(error),
  });

  if (done) {
    return (
      <Text
        style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.gold, marginTop: 6 }}
      >
        Thanks — Azara has noted that.
      </Text>
    );
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
        backgroundColor: 'transparent',
      }}
    >
      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#737373' }}>
        Useful?
      </Text>
      <TouchableOpacity
        onPress={() => send.mutate(true)}
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: '#E5E5E5',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ThumbsUp size={12} color={colors.gold} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => send.mutate(false)}
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: '#E5E5E5',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ThumbsDown size={12} color="#737373" />
      </TouchableOpacity>
    </View>
  );
}

function AzaraContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { pharmacy } = usePharmacy();
  const { colors, resolvedTheme } = usePreferences();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<RNScrollView | null>(null);

  const ask = useMutation({
    mutationFn: async (history: Message[]) => {
      const response = await authFetch('/api/azara', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          pharmacyId: pharmacy.id,
        }),
      });
      if (!response.ok) {
        throw new Error(
          `When asking Azara, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
          sources: data.sources ?? [],
          confidence: data.confidence,
          queryId: data.queryId ?? null,
        },
      ]);
    },
    onError: (err) => {
      console.error(err);
      setError('Azara could not answer that. Please try again.');
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    return () => clearTimeout(timer);
  }, [messages, ask.isPending]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || ask.isPending) return;
    setError(null);
    const next: Message[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(next);
    setInput('');
    ask.mutate(next);
  };

  const isEmpty = messages.length === 0;

  return (
    <KeyboardAvoidingAnimatedView
      style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}
      behavior="padding"
    >
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />

      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          backgroundColor: 'transparent',
        }}
      >
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
          <Text
            style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 22,
              color: '#000000',
              letterSpacing: -0.4,
            }}
          >
            Azara
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.gold }}>
            Pharmacy reference and inventory
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/knowledge')}
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.goldLine,
            backgroundColor: colors.goldSoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BookOpen size={16} color={colors.gold} />
        </TouchableOpacity>

        {!isEmpty ? (
          <TouchableOpacity
            onPress={() => {
              setMessages([]);
              setError(null);
            }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: '#E5E5E5',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RotateCcw size={15} color="#737373" />
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 28 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {isEmpty ? (
          <View style={{ paddingTop: 20, backgroundColor: 'transparent' }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 22, color: '#000000' }}>
              What should Azara do?
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#737373', marginTop: 6, lineHeight: 20 }}>
              List products, check low stock, or change a quantity. Reference answers stay available too.
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
              {SUGGESTIONS.map((s) => (
                <TouchableOpacity key={s} onPress={() => send(s)} activeOpacity={0.7}>
                  <View style={{ borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#FFFFFF' }}>
                    <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#000000' }}>{s}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={{ gap: 10, backgroundColor: 'transparent' }}>
            {messages.map((m, index) => {
              const isUser = m.role === 'user';
              return (
                <View key={index} style={{ alignItems: isUser ? 'flex-end' : 'flex-start', backgroundColor: 'transparent' }}>
                  <View
                    style={{
                      maxWidth: '86%',
                      borderRadius: 18,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      backgroundColor: isUser ? '#000000' : '#F5F5F5',
                    }}
                  >
                    {isUser ? (
                      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 21, color: '#FFFFFF' }}>{m.content}</Text>
                    ) : (
                      <AssistantText content={m.content} />
                    )}
                  </View>
                </View>
              );
            })}
            {ask.isPending ? (
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#737373' }}>Azara is looking at your stock…</Text>
            ) : null}
          </View>
        )}
        {error ? (
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#000000', marginTop: 12 }}>
            I could not finish that. Check the connection and send it again.
          </Text>
        ) : null}
      </ScrollView>

      {/* Composer */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 8,
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 12,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: '#E5E5E5',
          backgroundColor: '#FFFFFF',
        }}
      >
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="List products, low stock, or set a quantity"
          placeholderTextColor="#A3A3A3"
          multiline
          style={{
            flex: 1,
            minHeight: 44,
            maxHeight: 120,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: '#E5E5E5',
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingTop: 12,
            paddingBottom: 12,
            fontFamily: 'Inter_400Regular',
            fontSize: 14,
            color: '#000000',
            backgroundColor: '#FFFFFF',
          }}
        />
        <TouchableOpacity
          onPress={() => send(input)}
          disabled={!input.trim() || ask.isPending}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: colors.gold,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: !input.trim() || ask.isPending ? 0.35 : 1,
          }}
        >
          <ArrowUp size={18} color={resolvedTheme === 'dark' ? '#000000' : '#FFFFFF'} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}

export default function AzaraScreen() {
  return (
    <PharmacyGate>
      <AzaraContent />
    </PharmacyGate>
  );
}
