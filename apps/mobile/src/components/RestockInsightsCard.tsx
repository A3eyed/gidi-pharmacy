import { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from '@/components/Themed';
import { ChevronDown, ChevronUp, CloudSun, Sparkles, TriangleAlert } from '@/components/Icons';
import { useQuery } from '@tanstack/react-query';
import { authFetch } from '@/utils/auth/getSession';

type Recommendation = {
  medication: string;
  action: string;
  suggestedQuantity: number | null;
  urgency: string;
  reason: string;
};

const cardStyle = {
  borderWidth: 1,
  borderColor: '#E5E5E5',
  borderRadius: 12,
  backgroundColor: '#FFFFFF',
  padding: 16,
  marginTop: 12,
} as const;

/**
 * AI restock briefing for mobile. Loads on demand so the Analytics screen stays
 * fast on slower connections.
 */
export default function RestockInsightsCard({ pharmacyId }: { pharmacyId: number }) {
  const [enabled, setEnabled] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const { data, isFetching, error } = useQuery({
    queryKey: ['restock-insights', pharmacyId],
    enabled,
    retry: false,
    staleTime: 1000 * 60 * 30,
    queryFn: async () => {
      const response = await authFetch(`/api/insights?pharmacyId=${pharmacyId}`);
      if (!response.ok) {
        throw new Error(
          `When fetching /api/insights, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  if (!enabled) {
    return (
      <View style={cardStyle}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
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
            <Sparkles size={15} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#000000' }}>
              What to restock
            </Text>
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 12,
                color: '#737373',
                marginTop: 2,
              }}
            >
              Calculated from your sales run-rate, the season and the weather.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setEnabled(true)}
          style={{
            marginTop: 14,
            height: 40,
            borderRadius: 10,
            backgroundColor: '#000000',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: '#FFFFFF' }}>
            Generate briefing
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 11,
            lineHeight: 16,
            color: '#737373',
            marginTop: 10,
          }}
        >
          Commercial stocking estimates only — not clinical or procurement advice. Apply your own
          professional judgement.
        </Text>
      </View>
    );
  }

  if (isFetching) {
    return (
      <View style={[cardStyle, { alignItems: 'center', paddingVertical: 28 }]}>
        <ActivityIndicator color="#000000" />
        <Text
          style={{
            fontFamily: 'Inter_500Medium',
            fontSize: 13,
            color: '#000000',
            marginTop: 10,
          }}
        >
          Azara is reviewing your pharmacy…
        </Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={cardStyle}>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#000000' }}>
          Could not generate the briefing right now.
        </Text>
        <TouchableOpacity
          onPress={() => setEnabled(false)}
          style={{
            marginTop: 12,
            height: 38,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#E5E5E5',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#000000' }}>
            Try again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const recommendations: Recommendation[] = data.recommendations ?? [];
  const weather = data.weather;
  const season = data.season;

  return (
    <View style={cardStyle}>
      <TouchableOpacity
        onPress={() => setExpanded((v) => !v)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
      >
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
          <Sparkles size={15} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#000000' }}>
            What to restock
          </Text>
          <Text
            style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#737373', marginTop: 2 }}
          >
            {recommendations.length} suggestions
          </Text>
        </View>
        {expanded ? (
          <ChevronUp size={18} color="#737373" />
        ) : (
          <ChevronDown size={18} color="#737373" />
        )}
      </TouchableOpacity>

      {expanded && (
        <View style={{ marginTop: 14 }}>
          {data.headline ? (
            <Text
              style={{
                fontFamily: 'Inter_500Medium',
                fontSize: 14,
                lineHeight: 21,
                color: '#000000',
              }}
            >
              {data.headline}
            </Text>
          ) : null}

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
            {season ? (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E5E5',
                  borderRadius: 999,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: '#000000' }}>
                  {season.label}
                </Text>
              </View>
            ) : null}
            {weather ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  borderWidth: 1,
                  borderColor: '#E5E5E5',
                  borderRadius: 999,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <CloudSun size={11} color="#000000" />
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: '#000000' }}>
                  {weather.city}: {weather.condition}, {Math.round(weather.tempC)}°C
                </Text>
              </View>
            ) : null}
          </View>

          {data.seasonalOutlook ? (
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 13,
                lineHeight: 20,
                color: '#404040',
                marginTop: 12,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: '#F5F5F5',
              }}
            >
              {data.seasonalOutlook}
            </Text>
          ) : null}

          {recommendations.map((r, index) => (
            <View
              key={`${r.medication}-${index}`}
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: '#F5F5F5',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 14,
                    color: '#000000',
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  {r.medication}
                </Text>
                <View
                  style={{
                    borderRadius: 999,
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    backgroundColor: r.urgency === 'high' ? '#000000' : '#FFFFFF',
                    borderWidth: r.urgency === 'high' ? 0 : 1,
                    borderColor: '#E5E5E5',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Inter_600SemiBold',
                      fontSize: 10,
                      textTransform: 'uppercase',
                      color: r.urgency === 'high' ? '#FFFFFF' : '#000000',
                    }}
                  >
                    {r.urgency}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  fontFamily: 'Inter_500Medium',
                  fontSize: 12,
                  color: '#737373',
                  marginTop: 3,
                }}
              >
                {r.action}
                {r.suggestedQuantity ? ` · ${r.suggestedQuantity} units` : ''}
              </Text>
              <Text
                style={{
                  fontFamily: 'Inter_400Regular',
                  fontSize: 13,
                  lineHeight: 20,
                  color: '#404040',
                  marginTop: 5,
                }}
              >
                {r.reason}
              </Text>
            </View>
          ))}

          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              marginTop: 14,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: '#F5F5F5',
            }}
          >
            <TriangleAlert size={12} color="#000000" style={{ marginTop: 2 }} />
            <Text
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 11,
                lineHeight: 17,
                color: '#737373',
                flex: 1,
              }}
            >
              Calculated from your own sales history, the season and current weather. These are
              commercial stocking estimates, not clinical or procurement advice. Verify before
              ordering.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
