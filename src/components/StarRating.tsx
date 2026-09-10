import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

interface Props {
  value: number; // 0-5
  onChange?: (value: number) => void;
  size?: number;
}

export function StarRating({ value, onChange, size = 28 }: Props) {
  const readonly = !onChange;
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.round(value);
        const star = (
          <Text style={{ fontSize: size, color: filled ? colors.purple : colors.roseLight }}>
            {filled ? '★' : '☆'}
          </Text>
        );
        if (readonly) return <View key={i}>{star}</View>;
        return (
          <Pressable
            key={i}
            onPress={() => onChange!(i === Math.round(value) ? i - 1 : i)}
            hitSlop={6}
          >
            {star}
          </Pressable>
        );
      })}
      <Text style={styles.count}>{value.toFixed(0)} / 5</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  count: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.maroon,
    marginLeft: 8,
  },
});
