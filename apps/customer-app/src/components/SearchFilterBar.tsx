import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useScaleFont } from '../theme/responsive';

type Option = { slug: string; name: string };
type PriceCondition = 'under' | 'over';
type SpecialFilter = 'luxe' | 'rent';
type ModalKey = 'special' | 'size' | 'price' | 'category' | null;

type Props = {
  sizes: string[];
  categories: Option[];
  subcategories: Option[];
  filterSize: string | null;
  filterCategories: string[];
  filterSubcategories: string[];
  filterSpecial: SpecialFilter | null;
  priceCondition: PriceCondition | null;
  priceValue: string;
  onSetSize: (size: string | null) => void;
  onToggleCategory: (slug: string) => void;
  onToggleSubcategory: (slug: string) => void;
  onClearCategoryFilters: () => void;
  onSetSpecial: (value: SpecialFilter | null) => void;
  onSetPrice: (condition: PriceCondition | null, value: string) => void;
};

const SPECIAL_LABELS: Record<SpecialFilter, string> = { luxe: 'Luxe Only', rent: 'Rentals Only' };

// Four buttons that always fit on one line, each opening a centered picker
// (not a bottom sheet — a bottom sheet fights the keyboard for the same
// space once the Price input is focused) grounded in what's actually in
// the current results. Button labels stay fixed ("Size", "Category", ...)
// regardless of selection — the gold highlight is what shows something's
// active, so the row doesn't reflow/relabel itself as you filter.
export function SearchFilterBar({
  sizes,
  categories,
  subcategories,
  filterSize,
  filterCategories,
  filterSubcategories,
  filterSpecial,
  priceCondition,
  priceValue,
  onSetSize,
  onToggleCategory,
  onToggleSubcategory,
  onClearCategoryFilters,
  onSetSpecial,
  onSetPrice,
}: Props) {
  const scaleFont = useScaleFont();
  const [openModal, setOpenModal] = useState<ModalKey>(null);
  const [draftPriceValue, setDraftPriceValue] = useState(priceValue);
  const [draftPriceCondition, setDraftPriceCondition] = useState<PriceCondition | null>(priceCondition);

  const openPriceModal = () => {
    setDraftPriceValue(priceValue);
    setDraftPriceCondition(priceCondition);
    setOpenModal('price');
  };

  const applyPrice = () => {
    onSetPrice(draftPriceCondition, draftPriceValue);
    setOpenModal(null);
  };

  const categoryActive = filterCategories.length > 0 || filterSubcategories.length > 0;

  const buttons: { key: Exclude<ModalKey, null>; label: string; active: boolean }[] = [
    { key: 'special', label: 'Luxe/Rent', active: !!filterSpecial },
    { key: 'size', label: 'Size', active: !!filterSize },
    { key: 'category', label: 'Category', active: categoryActive },
    { key: 'price', label: 'Price', active: !!(priceCondition && priceValue) },
  ];

  return (
    <View>
      <View style={styles.row}>
        {buttons.map((b) => (
          <Pressable
            key={b.key}
            style={[styles.button, b.active && styles.buttonActive]}
            onPress={() => (b.key === 'price' ? openPriceModal() : setOpenModal(b.key))}
          >
            <Text
              style={[styles.buttonText, { fontSize: scaleFont(10.5) }, b.active && styles.buttonTextActive]}
              numberOfLines={1}
            >
              {b.label}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={scaleFont(14)}
              color={b.active ? '#08090b' : colors.muted}
            />
          </Pressable>
        ))}
      </View>

      <Modal visible={openModal === 'special'} transparent animationType="fade" onRequestClose={() => setOpenModal(null)}>
        <Pressable style={styles.backdrop} onPress={() => setOpenModal(null)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.sheetTitle, { fontSize: scaleFont(14) }]}>Luxe / Rent</Text>
            <View style={styles.grid}>
              <Pressable
                style={[styles.gridOption, filterSpecial === null && styles.gridOptionActive]}
                onPress={() => {
                  onSetSpecial(null);
                  setOpenModal(null);
                }}
              >
                <Text
                  style={[
                    styles.gridOptionText,
                    { fontSize: scaleFont(12) },
                    filterSpecial === null && styles.gridOptionTextActive,
                  ]}
                >
                  None
                </Text>
              </Pressable>
              {(['luxe', 'rent'] as const).map((v) => (
                <Pressable
                  key={v}
                  style={[styles.gridOption, filterSpecial === v && styles.gridOptionActive]}
                  onPress={() => {
                    onSetSpecial(filterSpecial === v ? null : v);
                    setOpenModal(null);
                  }}
                >
                  <Text
                    style={[
                      styles.gridOptionText,
                      { fontSize: scaleFont(12) },
                      filterSpecial === v && styles.gridOptionTextActive,
                    ]}
                  >
                    {SPECIAL_LABELS[v]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={openModal === 'size'} transparent animationType="fade" onRequestClose={() => setOpenModal(null)}>
        <Pressable style={styles.backdrop} onPress={() => setOpenModal(null)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.sheetTitle, { fontSize: scaleFont(14) }]}>Size</Text>
            {sizes.length === 0 ? (
              <Text style={[styles.emptyOption, { fontSize: scaleFont(12) }]}>No sizes in these results.</Text>
            ) : (
              <View style={styles.grid}>
                <Pressable
                  style={[styles.gridOption, filterSize === null && styles.gridOptionActive]}
                  onPress={() => {
                    onSetSize(null);
                    setOpenModal(null);
                  }}
                >
                  <Text
                    style={[
                      styles.gridOptionText,
                      { fontSize: scaleFont(12) },
                      filterSize === null && styles.gridOptionTextActive,
                    ]}
                  >
                    None
                  </Text>
                </Pressable>
                {sizes.map((s) => (
                  <Pressable
                    key={s}
                    style={[styles.gridOption, filterSize === s && styles.gridOptionActive]}
                    onPress={() => {
                      onSetSize(filterSize === s ? null : s);
                      setOpenModal(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.gridOptionText,
                        { fontSize: scaleFont(12) },
                        filterSize === s && styles.gridOptionTextActive,
                      ]}
                    >
                      {s}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={openModal === 'category'} transparent animationType="fade" onRequestClose={() => setOpenModal(null)}>
        <Pressable style={styles.backdrop} onPress={() => setOpenModal(null)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.sheetTitle, { fontSize: scaleFont(14), marginBottom: 2 }]}>Category</Text>
            <Text style={[styles.sheetHint, { fontSize: scaleFont(11) }]}>Pick as many as you like</Text>
            {categories.length === 0 && subcategories.length === 0 ? (
              <Text style={[styles.emptyOption, { fontSize: scaleFont(12) }]}>No categories in these results.</Text>
            ) : (
              <View style={styles.grid}>
                <Pressable
                  style={[styles.gridOption, !categoryActive && styles.gridOptionActive]}
                  onPress={onClearCategoryFilters}
                >
                  <Text
                    style={[
                      styles.gridOptionText,
                      { fontSize: scaleFont(12) },
                      !categoryActive && styles.gridOptionTextActive,
                    ]}
                  >
                    None
                  </Text>
                </Pressable>
                {categories.map((c) => {
                  const active = filterCategories.includes(c.slug);
                  return (
                    <Pressable
                      key={`cat-${c.slug}`}
                      style={[styles.gridOption, active && styles.gridOptionActive]}
                      onPress={() => onToggleCategory(c.slug)}
                    >
                      <Text style={[styles.gridOptionText, { fontSize: scaleFont(12) }, active && styles.gridOptionTextActive]}>
                        {c.name}
                      </Text>
                    </Pressable>
                  );
                })}
                {subcategories.map((s) => {
                  const active = filterSubcategories.includes(s.slug);
                  return (
                    <Pressable
                      key={`sub-${s.slug}`}
                      style={[styles.gridOption, active && styles.gridOptionActive]}
                      onPress={() => onToggleSubcategory(s.slug)}
                    >
                      <Text style={[styles.gridOptionText, { fontSize: scaleFont(12) }, active && styles.gridOptionTextActive]}>
                        {s.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={openModal === 'price'} transparent animationType="fade" onRequestClose={() => setOpenModal(null)}>
        <Pressable style={styles.backdrop} onPress={() => setOpenModal(null)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.sheetTitle, { fontSize: scaleFont(14) }]}>Price</Text>
            <View style={styles.conditionRow}>
              {(['under', 'over'] as const).map((c) => (
                <Pressable
                  key={c}
                  style={[styles.gridOption, styles.conditionButton, draftPriceCondition === c && styles.gridOptionActive]}
                  onPress={() => setDraftPriceCondition(c)}
                >
                  <Text
                    style={[
                      styles.gridOptionText,
                      { fontSize: scaleFont(12) },
                      draftPriceCondition === c && styles.gridOptionTextActive,
                    ]}
                  >
                    {c === 'under' ? 'Under' : 'Over'}
                  </Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              style={[styles.priceInput, { fontSize: scaleFont(14) }]}
              placeholder="Enter amount (R)"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              value={draftPriceValue}
              onChangeText={setDraftPriceValue}
            />
            <View style={styles.priceActionsRow}>
              <Pressable
                style={[styles.gridOption, styles.conditionButton]}
                onPress={() => {
                  setDraftPriceCondition(null);
                  setDraftPriceValue('');
                  onSetPrice(null, '');
                  setOpenModal(null);
                }}
              >
                <Text style={[styles.gridOptionText, { fontSize: scaleFont(12) }]}>Clear</Text>
              </Pressable>
              <Pressable style={[styles.gridOption, styles.conditionButton, styles.gridOptionActive]} onPress={applyPrice}>
                <Text style={[styles.gridOptionText, styles.gridOptionTextActive, { fontSize: scaleFont(12) }]}>
                  Apply
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 160, 0.25)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  buttonActive: {
    backgroundColor: colors.dotGold,
    borderColor: colors.dotGold,
  },
  buttonText: {
    fontFamily: typography.medium,
    color: colors.text,
  },
  buttonTextActive: {
    color: '#08090b',
  },
  // Centered, not bottom-anchored — a bottom sheet would get fought over
  // by the keyboard once the Price amount field is focused.
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    width: '100%',
    backgroundColor: colors.bgTop,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 160, 0.2)',
    padding: 20,
    maxHeight: '70%',
  },
  sheetTitle: {
    fontFamily: typography.bold,
    color: colors.text,
    marginBottom: 18,
  },
  sheetHint: {
    fontFamily: typography.regular,
    color: colors.muted,
    marginBottom: 18,
  },
  emptyOption: {
    fontFamily: typography.regular,
    color: colors.muted,
  },
  // Same "square selector" box used everywhere a user picks one option:
  // the Luxe/Rent, Size, Category grids and the Price Under/Over/Clear/Apply row.
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridOption: {
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 160, 0.25)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  gridOptionActive: {
    backgroundColor: colors.dotGold,
    borderColor: colors.dotGold,
  },
  gridOptionText: {
    fontFamily: typography.medium,
    color: colors.text,
  },
  gridOptionTextActive: {
    color: '#08090b',
  },
  conditionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  conditionButton: {
    flex: 1,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: 'rgba(232, 201, 160, 0.25)',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.text,
    fontFamily: typography.regular,
    marginBottom: 16,
  },
  priceActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
