/**
 * PG Hub — Modern Theme Tokens (Spacing, Radii, Font Sizes)
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  '3xl': 40,
} as const;

export const Radii = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 26,
  full: 9999,
} as const;

export const FontSizes = {
  xs: 11,
  sm: 12,
  md: 13,
  base: 14,
  lg: 16,
  xl: 18,
  '2xl': 22,
  '3xl': 26,
  '4xl': 32,
} as const;

// Modern web & mobile elevation helper without deprecated shadow props
export const CardStyles = {
  glassBorder: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  glowActive: {
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.45)',
  },
  glowSuccess: {
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.45)',
  },
};
