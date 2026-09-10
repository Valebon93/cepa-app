import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({ label, onPress, variant = 'primary', disabled, loading, style }: Props) {
  const isPrimary = variant === 'primary';
  const isDestructive = variant === 'destructive';
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isPrimary && { backgroundColor: colors.maroon },
        isDestructive && { backgroundColor: colors.purple },
        isSecondary && { backgroundColor: colors.creamCard, borderWidth: 1, borderColor: colors.border },
        variant === 'ghost' && { backgroundColor: 'transparent' },
        (disabled || loading) && { opacity: 0.5 },
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary || isDestructive ? colors.white : colors.maroon} />
      ) : (
        <Text
          style={[
            styles.label,
            { color: isPrimary || isDestructive ? colors.white : colors.maroon },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
});
