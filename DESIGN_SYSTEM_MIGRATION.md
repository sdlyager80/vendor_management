# Design System Migration - Halstack Native Tokens

This document summarizes the refactoring completed to align the Vendor Management and Time & Expense applications with the Halstack Design System's native tokens and patterns, matching the Underwriter Assistant reference implementation.

## Changes Made

### 1. **Removed Custom Theme System**
- ❌ Removed `ThemeProvider` wrapper component
- ❌ Removed custom theme tokens (`packages/shared/src/theme/`)
- ✅ Now using Halstack's built-in CSS custom properties directly

**Before:**
```tsx
<ThemeProvider theme={customTheme}>
  <App />
</ThemeProvider>
```

**After:**
```tsx
<App />
```

### 2. **Added Material Icons & Open Sans Font**
Updated `index.html` in both applications:
- Added Google Fonts - Open Sans (300, 400, 600, 700 weights)
- Added Material Icons from Google Fonts

**Files Updated:**
- `packages/vendor-management/index.html`
- `packages/time-expense/index.html`

### 3. **Created Global CSS Files**
Added global stylesheets with:
- CSS reset and box-sizing
- Open Sans font-family
- Material Icons styles
- Body background color
- Footer hide rule

**Files Created:**
- `packages/vendor-management/src/index.css`
- `packages/time-expense/src/index.css`

### 4. **Refactored Shared Components**

#### **StatCard Component**
- Added `variant` prop: `'default' | 'primary' | 'success' | 'warning' | 'error'`
- Gradient backgrounds for colored variants
- Uses Halstack typography tokens: `font-scale-01`, `font-scale-02`, `font-weight-semibold`
- Color tokens: `var(--color-blue-600)`, `var(--color-green-600)`, `var(--color-red-600)`

#### **PageHeader Component**
- Replaced hardcoded font sizes with `font-scale-03`
- Uses `var(--color-fg-neutral-stronger)` for subtitle color
- Spacing with `var(--spacing-gap-l)`, `var(--spacing-gap-xs)`

#### **LoadingSpinner Component**
- Uses `var(--spacing-gap-m)`, `var(--spacing-padding-xl)`
- Maintained rgba backdrop for fullscreen mode

#### **EmptyState Component**
- Typography: `font-scale-03`
- Color: `var(--color-fg-neutral-stronger)`
- Spacing: `var(--spacing-gap-l)`, `var(--spacing-padding-xl)`

#### **DataTable Component**
- Replaced `DxcTable` with custom `<table>` using CSS classes
- Uses `.data-table` CSS class for styled tables
- Header background: `var(--color-blue-600)`
- Hover: `var(--color-bg-neutral-lighter)`

### 5. **Created Component Styles CSS**
**File:** `packages/shared/src/components/components.css`

Includes:
- Stat card variants with gradient backgrounds
- Icon button styles (`.icon-btn`, `.icon-btn-small`)
- Data table styles
- All using Halstack CSS custom properties

### 6. **Updated Dashboard Component**
**File:** `packages/vendor-management/src/pages/Dashboard.tsx`

Changes:
- Added `Dashboard.css` import
- Uses `.dashboard-container` class with `#f5f5f5` background
- Uses `.dashboard-card` class for card containers
- StatCards now use `variant` prop for colored metrics
- Typography uses Halstack tokens

**New Dashboard Structure:**
```tsx
<div className="dashboard-container">
  <DxcFlex direction="column" gap="var(--spacing-gap-l)">
    <DxcHeading level={1} text="Dashboard Title" />

    {/* Stat Cards with variants */}
    <DxcFlex gap="var(--spacing-gap-m)" wrap="wrap">
      <StatCard variant="default" ... />
      <StatCard variant="primary" ... />
      <StatCard variant="warning" ... />
    </DxcFlex>

    {/* Content Cards */}
    <div className="dashboard-card">
      ...
    </div>
  </DxcFlex>
</div>
```

## Halstack Design Tokens Reference

### Color Tokens
| Token | Usage | Example Value |
|-------|-------|---------------|
| `--color-bg-neutral-lightest` | Card backgrounds, white surfaces | #FFFFFF |
| `--color-bg-neutral-lighter` | Hover states, secondary backgrounds | #F7F7F7 |
| `--color-bg-secondary-lightest` | Page backgrounds | #F5F5F5 |
| `--color-fg-neutral-stronger` | Primary text, labels | #666666 |
| `--color-fg-neutral-dark` | Secondary text | #999999 |
| `--color-border-neutral-lighter` | Light borders | #E0E0E0 |
| `--color-border-neutral-medium` | Medium borders | #BFBFBF |
| `--color-blue-600` | Primary actions, links | #0095FF |
| `--color-blue-700` | Hover states | #0075CC |
| `--color-green-600` | Success states | #24A148 |
| `--color-red-600` | Error states | #D0021B |
| `--color-orange-600` | Warning states | #FF6B00 |

### Spacing Tokens
| Token | Typical Value |
|-------|---------------|
| `--spacing-gap-xs` | 4px |
| `--spacing-gap-s` | 8px |
| `--spacing-gap-m` | 16px |
| `--spacing-gap-l` | 24px |
| `--spacing-gap-xl` | 32px |
| `--spacing-padding-xs` | 4px |
| `--spacing-padding-s` | 8px |
| `--spacing-padding-m` | 16px |
| `--spacing-padding-l` | 24px |
| `--spacing-padding-xl` | 32px |

### Typography Tokens
| Token | Usage |
|-------|-------|
| `font-scale-01` | Small text (12px) |
| `font-scale-02` | Body text (14px) |
| `font-scale-03` | Subheadings (16px) |
| `font-scale-04` | Headings (18px) |
| `font-weight-medium` | 500 |
| `font-weight-semibold` | 600 |

### Other Tokens
| Token | Usage |
|-------|-------|
| `--border-radius-s` | Small corners |
| `--border-radius-m` | Medium corners |
| `--shadow-mid-02` | Card shadows |

## CSS Class Patterns

### From Underwriter Assistant
```css
/* Metric cards with gradients */
.metric-card-primary {
  background: linear-gradient(135deg, #4DD0E1 0%, #0095FF 100%);
  border-radius: var(--border-radius-m);
  box-shadow: var(--shadow-mid-02);
  padding: var(--spacing-padding-m);
}

/* Icon buttons */
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-padding-xs);
  border-radius: 50%;
  color: var(--color-fg-neutral-stronger);
}

.icon-btn:hover {
  background-color: var(--color-bg-neutral-lighter);
  color: var(--color-blue-600);
}

/* Data tables */
.data-table thead {
  background-color: var(--color-blue-600);
  color: white;
}

.data-table tbody tr:hover {
  background-color: var(--color-bg-neutral-lighter);
}
```

## Typography Component Usage

### DxcTypography Props
Instead of inline styles, use Halstack token props:

```tsx
// OLD - Hardcoded values
<DxcTypography fontSize="14px" fontWeight="600" color="#666">

// NEW - Token-based
<DxcTypography
  fontSize="font-scale-02"
  fontWeight="font-weight-semibold"
  color="var(--color-fg-neutral-stronger)"
>
```

## Material Icons Usage

```tsx
<button className="icon-btn">
  <span className="material-icons">dashboard</span>
</button>
```

Common icons:
- `dashboard` - Dashboard view
- `folder_open` - Files/submissions
- `request_quote` - Quotes
- `autorenew` - Renewals
- `add` - Add/create
- `check` - Approve
- `cancel` - Decline
- `share` - Share
- `visibility` - Preview
- `chat` - Chat/AI assistant

## Page Layout Pattern

```tsx
function PageComponent() {
  return (
    <div className="page-container">
      <DxcFlex direction="column" gap="var(--spacing-gap-l)">
        <DxcHeading level={1} text="Page Title" />

        {/* Content */}
        <div className="content-card">
          ...
        </div>
      </DxcFlex>
    </div>
  );
}
```

With CSS:
```css
.page-container {
  padding: var(--spacing-padding-l);
  width: 100%;
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px);
}

.content-card {
  background-color: var(--color-bg-neutral-lightest);
  border-radius: var(--border-radius-m);
  box-shadow: var(--shadow-mid-02);
  padding: var(--spacing-padding-l);
}
```

## Benefits of This Approach

1. **No Custom Theme Management** - Direct use of Halstack tokens
2. **Consistent with Halstack** - Follows official design system patterns
3. **Easier Maintenance** - No custom abstraction layer
4. **Better Performance** - CSS custom properties are native and fast
5. **Future-Proof** - Updates to Halstack automatically apply
6. **Simpler Codebase** - Less code to maintain

## Migration Checklist for Other Pages

- [ ] Replace `style={{padding: '2rem'}}` with `className` and CSS file
- [ ] Update background colors to use `.page-container` pattern
- [ ] Change inline `fontSize="16px"` to `fontSize="font-scale-03"`
- [ ] Replace hardcoded colors with Halstack tokens
- [ ] Use `variant` prop on StatCards for highlighted metrics
- [ ] Import and use `.icon-btn` classes for icon buttons
- [ ] Replace custom spacing with `var(--spacing-gap-*)` and `var(--spacing-padding-*)`
- [ ] Use `.data-table` class instead of `DxcTable` for styled tables

## Next Steps

To complete the migration:
1. Update remaining pages in both applications
2. Replace `DxcApplicationLayout.Header` with custom header if needed
3. Add more CSS classes for common patterns (forms, modals, etc.)
4. Document any app-specific color choices (if deviating from Halstack)
5. Consider creating a storybook for component documentation
