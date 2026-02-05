# Theme Configuration

This folder contains the theme configuration and design tokens for the Claims Smart Apps.

## Overview

The theming system is built on top of Halstack Design System and uses CSS custom properties (CSS variables) to ensure all components respect the theme.

## Usage

### Default Theme

By default, the `ThemeProvider` uses the default Halstack theme with standard DXC colors:

```tsx
import { ThemeProvider } from '@claims-smart-apps/shared';

<ThemeProvider>
  <App />
</ThemeProvider>
```

### Custom Theme

To apply a custom theme, pass a `theme` prop with your custom design tokens:

```tsx
import { ThemeProvider } from '@claims-smart-apps/shared';

const customTheme = {
  'color-primary': '#0066CC',
  'color-secondary': '#7B1FA2',
  'color-text-secondary': '#555555',
  // ... other tokens
};

<ThemeProvider theme={customTheme}>
  <App />
</ThemeProvider>
```

## Available Design Tokens

### Color Tokens

| Token | Default Value | Usage |
|-------|---------------|-------|
| `color-primary` | #0095FF | Primary brand color |
| `color-secondary` | #5F249F | Secondary brand color |
| `color-success` | #24A148 | Success states |
| `color-warning` | #FFED00 | Warning states |
| `color-error` | #D0011B | Error states |
| `color-info` | #0095FF | Informational states |
| `color-text-primary` | #000000 | Primary text |
| `color-text-secondary` | #666666 | Secondary text |
| `color-text-tertiary` | #999999 | Tertiary text |
| `color-text-inverse` | #FFFFFF | Inverse text (on dark backgrounds) |
| `color-background-primary` | #FFFFFF | Primary background |
| `color-background-secondary` | #F2F2F2 | Secondary background |
| `color-background-tertiary` | #E6E6E6 | Tertiary background |
| `color-background-overlay` | rgba(0, 0, 0, 0.4) | Overlay/modal backgrounds |
| `color-border-primary` | #D9D9D9 | Primary borders |
| `color-border-secondary` | #BFBFBF | Secondary borders |
| `color-status-positive` | #24A148 | Positive trends/indicators |
| `color-status-negative` | #D0011B | Negative trends/indicators |
| `color-status-neutral` | #666666 | Neutral status |

### Spacing Tokens

| Token | Default Value | Usage |
|-------|---------------|-------|
| `spacing-small` | 0.5rem | Small spacing |
| `spacing-medium` | 1rem | Medium spacing |
| `spacing-large` | 1.5rem | Large spacing |
| `spacing-xlarge` | 2rem | Extra large spacing |

### Typography Tokens

| Token | Default Value | Usage |
|-------|---------------|-------|
| `font-size-small` | 0.875rem | Small text |
| `font-size-medium` | 1rem | Medium text |
| `font-size-large` | 1.25rem | Large text |
| `font-size-xlarge` | 1.5rem | Extra large text |

## Using Tokens in Components

### In Inline Styles

```tsx
<div style={{ color: 'var(--color-text-secondary)' }}>
  Secondary text
</div>
```

### With the cssVar Helper

```tsx
import { cssVar } from '@claims-smart-apps/shared';

<div style={{ color: cssVar('color-text-secondary') }}>
  Secondary text
</div>
```

## Component Theming

All shared components (`StatCard`, `PageHeader`, `LoadingSpinner`, `EmptyState`, etc.) use CSS custom properties and will automatically respond to theme changes.

All Halstack components will also respect the theme passed to `HalstackProvider` via the `opinionatedTheme` prop.

## Example: Applying a Corporate Theme

```tsx
import { ThemeProvider } from '@claims-smart-apps/shared';

// Your corporate brand colors
const corporateTheme = {
  'color-primary': '#003DA5',        // Corporate blue
  'color-secondary': '#00A3E0',      // Corporate light blue
  'color-success': '#00A878',        // Corporate green
  'color-error': '#C8102E',          // Corporate red
  'color-text-primary': '#1A1A1A',   // Dark gray
  'color-text-secondary': '#5A5A5A', // Medium gray
};

function Root() {
  return (
    <ThemeProvider theme={corporateTheme}>
      <App />
    </ThemeProvider>
  );
}
```

## Dark Mode Support

To implement dark mode, create a dark theme and toggle between themes:

```tsx
const darkTheme = {
  'color-background-primary': '#1A1A1A',
  'color-background-secondary': '#2A2A2A',
  'color-text-primary': '#FFFFFF',
  'color-text-secondary': '#CCCCCC',
  // ... other dark theme tokens
};

const [isDark, setIsDark] = useState(false);

<ThemeProvider theme={isDark ? darkTheme : undefined}>
  <App />
</ThemeProvider>
```

## Migration Notes

All hardcoded colors have been replaced with CSS custom properties:
- `#666` → `var(--color-text-secondary)`
- `#0095FF` → `var(--color-status-positive)` or `var(--color-primary)`
- `#D0011B` → `var(--color-status-negative)` or `var(--color-error)`
- `rgba(255, 255, 255, 0.9)` → `var(--color-background-overlay)`

This ensures all components will respect theme changes.
