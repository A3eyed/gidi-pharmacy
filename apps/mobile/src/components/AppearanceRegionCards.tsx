import { useMemo, useState } from 'react';
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, ChevronRight, Globe, Monitor, Moon, Search, Sun, X } from 'lucide-react-native';
import { usePreferences, type ThemeMode } from '@/utils/locale/PreferencesProvider';
import { COUNTRIES, countryName } from '@/utils/locale/countries';
import { formatCurrency } from '@/utils/format';

type Option = { id: string; label: string; sublabel?: string };

/** Full-screen searchable picker — works for both the country and language lists. */
function PickerModal({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: Option[];
  selected: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const { colors } = usePreferences();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || (o.sublabel ?? '').toLowerCase().includes(q)
    );
  }, [options, query]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 17, color: colors.text }}>
            {title}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              height: 44,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 10,
              paddingHorizontal: 12,
            }}
          >
            <Search size={15} color={colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search"
              placeholderTextColor={colors.placeholder}
              style={{
                flex: 1,
                fontFamily: 'Inter_400Regular',
                fontSize: 14,
                color: colors.text,
              }}
            />
          </View>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 20 }}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const isSelected = item.id === selected;
            return (
              <TouchableOpacity
                onPress={() => {
                  onSelect(item.id);
                  onClose();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 13,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.divider,
                  gap: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    numberOfLines={1}
                    style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.text }}
                  >
                    {item.label}
                  </Text>
                  {item.sublabel ? (
                    <Text
                      style={{
                        fontFamily: 'Inter_400Regular',
                        fontSize: 12,
                        color: colors.textMuted,
                        marginTop: 2,
                      }}
                    >
                      {item.sublabel}
                    </Text>
                  ) : null}
                </View>
                {isSelected ? <Check size={16} color={colors.text} /> : null}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </Modal>
  );
}

function Row({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  const { colors } = usePreferences();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: colors.divider,
        gap: 12,
      }}
    >
      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textMuted }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 }}>
        <Text
          numberOfLines={1}
          style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.text }}
        >
          {value}
        </Text>
        <ChevronRight size={14} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

/** Appearance (theme) + Region & Language cards for the Settings screen. */
export default function AppearanceRegionCards() {
  const {
    colors,
    theme,
    setTheme,
    country,
    setCountry,
    language,
    setLanguage,
    languages,
    currency,
    locale,
    t,
  } = usePreferences();

  const [showCountry, setShowCountry] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);

  const cardStyle = {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    padding: 16,
    marginTop: 12,
  } as const;

  const themeOptions: Array<{ id: ThemeMode; label: string; icon: typeof Sun }> = [
    { id: 'light', label: t('light'), icon: Sun },
    { id: 'dark', label: t('dark'), icon: Moon },
    { id: 'system', label: t('system'), icon: Monitor },
  ];

  const countryOptions: Option[] = COUNTRIES.map((c) => ({
    id: c.code,
    label: c.name,
    sublabel: c.currency,
  }));

  const languageOptions: Option[] = languages.map((l) => ({
    id: l.code,
    label: l.native,
    sublabel: l.name,
  }));

  const currentLanguage = languages.find((l) => l.code === language);

  return (
    <View>
      {/* Appearance */}
      <View style={cardStyle}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <Sun size={15} color={colors.text} />
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.text }}>
            {t('appearance')}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 13,
            lineHeight: 20,
            color: colors.textSoft,
            marginTop: 6,
          }}
        >
          Choose light, dark, or follow your device setting.
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
          {themeOptions.map((option) => {
            const isActive = theme === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => setTheme(option.id)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  gap: 6,
                  paddingVertical: 12,
                  borderRadius: 10,
                  borderWidth: isActive ? 2 : 1,
                  borderColor: isActive ? colors.text : colors.border,
                }}
              >
                <option.icon size={16} color={isActive ? colors.text : colors.textMuted} />
                <Text
                  style={{
                    fontFamily: 'Inter_500Medium',
                    fontSize: 12,
                    color: isActive ? colors.text : colors.textMuted,
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Region & language */}
      <View style={cardStyle}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <Globe size={15} color={colors.text} />
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.text }}>
            {t('region')}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 13,
            lineHeight: 20,
            color: colors.textSoft,
            marginTop: 6,
          }}
        >
          Your country sets the currency used across the app. Your language changes the interface
          and the language Azara replies in.
        </Text>

        <View style={{ marginTop: 8 }}>
          <Row
            label={t('country')}
            value={countryName(country)}
            onPress={() => setShowCountry(true)}
          />
          <Row
            label={t('language')}
            value={currentLanguage?.native ?? language}
            onPress={() => setShowLanguage(true)}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 6,
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.divider,
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: colors.text }}>
              {t('currency')}: {currency}
            </Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: colors.text }}>
              {formatCurrency(1234.5)}
            </Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: colors.textMuted }}>
              {locale}
            </Text>
          </View>
        </View>
      </View>

      <PickerModal
        visible={showCountry}
        title={t('country')}
        options={countryOptions}
        selected={country}
        onSelect={setCountry}
        onClose={() => setShowCountry(false)}
      />
      <PickerModal
        visible={showLanguage}
        title={t('language')}
        options={languageOptions}
        selected={language}
        onSelect={setLanguage}
        onClose={() => setShowLanguage(false)}
      />
    </View>
  );
}
