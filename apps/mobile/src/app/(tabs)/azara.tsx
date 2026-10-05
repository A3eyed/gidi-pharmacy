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
  'Adult dose of artemether-lumefantrine?',
  'Metronidazole with warfarin — safe?',
  'Counselling points for metformin',
  'How do I manage anaphylaxis?',
  'When should I refer a fever?',
  'How do I calculate a reorder level?',
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
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <GlassCard tone="gold" padding={12} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', gap: 8, backgroundColor: 'transparent' }}>
            <TriangleAlert size={14} color={colors.gold} style={{ marginTop: 2 }} />
            <Text
              style={{
                flex: 1,
                fontFamily: 'Inter_400Regular',
                fontSize: 11,
                lineHeight: 17,
                color: '#404040',
              }}
            >
              Azara answers from a built-in pharmacy reference library, so it works even when the
              internet does not. Reference information for qualified professionals — it does not
              diagnose patients or replace a pharmacist&apos;s judgement.
            </Text>
          </View>
        </GlassCard>

        {isEmpty ? (
          <View style={{ alignItems: 'center', paddingTop: 24, backgroundColor: 'transparent' }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                backgroundColor: colors.gold,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bot size={22} color={resolvedTheme === 'dark' ? '#000000' : '#FFFFFF'} />
            </View>
            <Text
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 16,
                color: '#000000',
                marginTop: 12,
              }}
            >
              Ask Azara about stock or a medicine
            </Text>
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 13,
                lineHeight: 19,
                color: '#737373',
                textAlign: 'center',
                marginTop: 4,
                paddingHorizontal: 12,
              }}
            >
              Dosing, interactions, emergencies, counselling points, or what you can dispense from
              your own stock.
            </Text>

            <View style={{ width: '100%', gap: 8, marginTop: 20, backgroundColor: 'transparent' }}>
              {SUGGESTIONS.map((s) => (
                <TouchableOpacity key={s} onPress={() => send(s)} activeOpacity={0.8}>
                  <GlassCard padding={12} radius={12}>
                    <Text
                      style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#000000' }}
                    >
                      {s}
                    </Text>
                  </GlassCard>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={{ gap: 16, backgroundColor: 'transparent' }}>
            {messages.map((m, index) => {
              const isUser = m.role === 'user';
              return (
                <View
                  key={index}
                  style={{ flexDirection: 'row', gap: 10, backgroundColor: 'transparent' }}
                >
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isUser ? 'transparent' : colors.gold,
                      borderWidth: isUser ? StyleSheet.hairlineWidth : 0,
                      borderColor: '#E5E5E5',
                    }}
                  >
                    {isUser ? (
                      <User size={14} color="#737373" />
                    ) : (
                      <Bot size={14} color={resolvedTheme === 'dark' ? '#000000' : '#FFFFFF'} />
                    )}
                  </View>

                  <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                        marginBottom: 4,
                        backgroundColor: 'transparent',
                      }}
                    >
                      <Text
                        style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: '#737373' }}
                      >
                        {isUser ? 'You' : 'Azara'}
                      </Text>
                      {!isUser && m.confidence ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 3,
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 999,
                            backgroundColor: colors.goldSoft,
                          }}
                        >
                          <ShieldCheck size={9} color={colors.gold} />
                          <Text
                            style={{
                              fontFamily: 'Inter_500Medium',
                              fontSize: 9,
                              color: colors.gold,
                            }}
                          >
                            {m.confidence === 'high'
                              ? 'Strong match'
                              : m.confidence === 'medium'
                                ? 'Partial match'
                                : 'Weak match'}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    {isUser ? (
                      <Text
                        style={{
                          fontFamily: 'Inter_400Regular',
                          fontSize: 14,
                          lineHeight: 21,
                          color: '#000000',
                        }}
                      >
                        {m.content}
                      </Text>
                    ) : (
                      <View style={{ backgroundColor: 'transparent' }}>
                        <AssistantText content={m.content} />
                        {m.sources && m.sources.length > 0 ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              flexWrap: 'wrap',
                              gap: 6,
                              marginTop: 8,
                              backgroundColor: 'transparent',
                            }}
                          >
                            {m.sources.map((s) => (
                              <View
                                key={s.id}
                                style={{
                                  paddingHorizontal: 8,
                                  paddingVertical: 3,
                                  borderRadius: 999,
                                  borderWidth: StyleSheet.hairlineWidth,
                                  borderColor: '#E5E5E5',
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: 'Inter_400Regular',
                                    fontSize: 10,
                                    color: '#737373',
                                  }}
                                >
                                  {s.title}
                                </Text>
                              </View>
                            ))}
                          </View>
                        ) : null}
                        {m.queryId ? <FeedbackRow queryId={m.queryId} /> : null}
                      </View>
                    )}
                  </View>
                </View>
              );
            })}

            {ask.isPending ? (
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#737373' }}>
                Azara is checking the knowledge base…
              </Text>
            ) : null}
          </View>
        )}

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
          placeholder="List inventory, low stock, or a medicine…"
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
