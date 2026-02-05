/**
 * Design Tokens for Halstack Theme
 *
 * These tokens can be overridden by passing an opinionatedTheme to HalstackProvider
 * Documentation: https://developer.dxc.com/halstack/
 */

export const defaultTheme = {
  // Primary Colors
  'color-primary': '#0095FF',
  'color-secondary': '#5F249F',

  // Semantic Colors
  'color-success': '#24A148',
  'color-warning': '#FFED00',
  'color-error': '#D0011B',
  'color-info': '#0095FF',

  // Text Colors
  'color-text-primary': '#000000',
  'color-text-secondary': '#666666',
  'color-text-tertiary': '#999999',
  'color-text-inverse': '#FFFFFF',

  // Background Colors
  'color-background-primary': '#FFFFFF',
  'color-background-secondary': '#F2F2F2',
  'color-background-tertiary': '#E6E6E6',
  'color-background-overlay': 'rgba(0, 0, 0, 0.4)',

  // Border Colors
  'color-border-primary': '#D9D9D9',
  'color-border-secondary': '#BFBFBF',

  // Status Colors (for trends, indicators, etc)
  'color-status-positive': '#24A148',
  'color-status-negative': '#D0011B',
  'color-status-neutral': '#666666',

  // Spacing (if needed for future use)
  'spacing-small': '0.5rem',
  'spacing-medium': '1rem',
  'spacing-large': '1.5rem',
  'spacing-xlarge': '2rem',

  // Typography (if needed for future use)
  'font-size-small': '0.875rem',
  'font-size-medium': '1rem',
  'font-size-large': '1.25rem',
  'font-size-xlarge': '1.5rem',
};

export type ThemeTokens = typeof defaultTheme;

/**
 * Helper to get CSS custom property
 */
export const cssVar = (token: keyof ThemeTokens): string => {
  return `var(--${token})`;
};
