// Comfortaa (display) + Plus Jakarta Sans (body) — same pairing as the Figma file
export const fonts = {
  display: 'Comfortaa_600SemiBold',
  displayBold: 'Comfortaa_700Bold',
  body: 'PlusJakartaSans_400Regular',
  bodyMedium: 'PlusJakartaSans_500Medium',
  bodySemiBold: 'PlusJakartaSans_600SemiBold',
  bodyBold: 'PlusJakartaSans_700Bold',
} as const;

export const type = {
  h1: { fontFamily: fonts.display, fontSize: 28, lineHeight: 34 },
  h2: { fontFamily: fonts.display, fontSize: 22, lineHeight: 28 },
  h3: { fontFamily: fonts.display, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 21 },
  bodySmall: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  label: { fontFamily: fonts.bodyBold, fontSize: 11, lineHeight: 14, letterSpacing: 1.2 },
  button: { fontFamily: fonts.bodyBold, fontSize: 15, lineHeight: 20 },
} as const;
