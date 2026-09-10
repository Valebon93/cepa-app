// CEPA design tokens — extracted directly from the Figma prototype
export const colors = {
  // Core palette
  maroon: '#380C12', // primary text / headlines / primary buttons
  maroonSoft: 'rgba(56, 12, 18, 0.6)',
  maroonFaint: 'rgba(56, 12, 18, 0.08)',

  cream: '#FFFDF6', // app background
  creamDark: '#F4EFDF', // input / chip / card-accent background
  creamCard: '#FFFDF6',

  rose: '#9B7F80', // secondary / muted text
  roseLight: 'rgba(155, 127, 128, 0.35)', // borders, placeholders

  olive: '#6B7B3F', // favorites tile, success accents
  oliveSoft: '#E7EBD9',

  purple: '#7A3B6A', // puntaje / score tile
  purpleSoft: '#F0E3EC',

  amber: '#B9762F', // warnings / badges
  amberSoft: '#F4E6CF',

  alertRed: '#9E2B2B', // destructive actions / errors

  white: '#FFFFFF',
  black: '#000000',
  border: '#E4D9C4',
} as const;

export type ColorToken = keyof typeof colors;
