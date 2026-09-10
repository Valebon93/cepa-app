import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

interface Props extends TextInputProps {
  label?: string;
  optional?: boolean;
  error?: string;
}

export function TextField({ label, optional, error, style, ...rest }: Props) {
  return (
    <View style={{ gap: 8 }}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {optional ? <Text style={styles.optional}> · opcional</Text> : null}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.roseLight}
        style={[styles.input, error ? { borderColor: colors.alertRed } : null, style]}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.maroon,
  },
  optional: {
    fontFamily: fonts.body,
    color: colors.rose,
    fontSize: 12,
  },
  input: {
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.creamCard,
    paddingHorizontal: 19,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.maroon,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.alertRed,
  },
});
