import React, { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { COUNTRIES, Country } from '../constants/countries';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type Props = {
  country: Country;
  onChangeCountry: (country: Country) => void;
  phone: string;
  onChangePhone: (digits: string) => void;
  onBlur?: () => void;
  error?: string;
  scaleFont: (size: number) => number;
  placeholder?: string;
};

export function PhoneCountryInput({
  country,
  onChangeCountry,
  phone,
  onChangePhone,
  onBlur,
  error,
  scaleFont,
  placeholder = '71 234 5678',
}: Props) {
  const [pickerVisible, setPickerVisible] = useState(false);
  const [search, setSearch] = useState('');

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return COUNTRIES;
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(query) || c.dialCode.includes(query),
    );
  }, [search]);

  const handleSelect = (selected: Country) => {
    onChangeCountry(selected);
    setPickerVisible(false);
    setSearch('');
  };

  return (
    <>
      <View style={styles.phoneRow}>
        <Pressable onPress={() => setPickerVisible(true)} style={styles.countrySelect}>
          <Text style={{ fontSize: scaleFont(15) }}>{country.flag}</Text>
          <Text style={[styles.countrySelectText, { fontSize: scaleFont(13) }]}>
            {country.dialCode}
          </Text>
          <Text style={styles.countrySelectChevron}>▾</Text>
        </Pressable>
        <TextInput
          placeholderTextColor={colors.muted}
          style={[
            styles.input,
            styles.phoneInput,
            { fontSize: scaleFont(13) },
            error ? styles.inputError : null,
          ]}
          placeholder={placeholder}
          value={phone}
          onChangeText={(text) => onChangePhone(text.replace(/\D/g, ''))}
          onBlur={onBlur}
          keyboardType="phone-pad"
          autoCorrect={false}
          spellCheck={false}
        />
      </View>

      <Modal
        visible={pickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
      >
        <KeyboardAvoidingView style={styles.modalBackdrop} behavior="padding">
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={() => setPickerVisible(false)}
          />
          <Pressable style={styles.countryModalCard} onPress={() => {}}>
            <Text style={[styles.modalTitle, { fontSize: scaleFont(13) }]}>Select country</Text>
            <TextInput
              placeholderTextColor={colors.muted}
              style={[styles.searchInput, { fontSize: scaleFont(13) }]}
              placeholder="Search countries"
              value={search}
              onChangeText={setSearch}
              autoCorrect={false}
              spellCheck={false}
            />
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              style={styles.countryList}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable onPress={() => handleSelect(item)} style={styles.countryOption}>
                  <Text style={{ fontSize: scaleFont(16) }}>{item.flag}</Text>
                  <Text style={[styles.countryOptionText, { fontSize: scaleFont(12.5) }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.countryOptionDialCode, { fontSize: scaleFont(12.5) }]}>
                    {item.dialCode}
                  </Text>
                </Pressable>
              )}
            />
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  phoneRow: {
    flexDirection: 'row',
    gap: 8,
  },
  countrySelect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 160, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  countrySelectText: {
    fontFamily: typography.medium,
    color: colors.text,
  },
  countrySelectChevron: {
    color: colors.muted,
    fontSize: 10,
    marginLeft: 1,
  },
  input: {
    fontFamily: typography.regular,
    fontSize: 13,
    color: colors.text,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 160, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: colors.error,
  },
  phoneInput: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  modalTitle: {
    fontFamily: typography.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  countryModalCard: {
    width: '100%',
    maxHeight: '70%',
    backgroundColor: colors.bgTop,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 160, 0.25)',
    paddingHorizontal: 18,
    paddingVertical: 22,
  },
  searchInput: {
    fontFamily: typography.regular,
    color: colors.text,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 160, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  countryList: {
    marginTop: 4,
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(232, 201, 160, 0.1)',
  },
  countryOptionText: {
    flex: 1,
    fontFamily: typography.regular,
    color: colors.text,
  },
  countryOptionDialCode: {
    fontFamily: typography.medium,
    color: colors.muted,
  },
});
