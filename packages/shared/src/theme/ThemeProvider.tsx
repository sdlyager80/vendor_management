import { ReactNode, useEffect } from 'react';
import { HalstackProvider } from '@dxc-technology/halstack-react';
import { defaultTheme, ThemeTokens } from './tokens';

interface ThemeProviderProps {
  children: ReactNode;
  theme?: Partial<ThemeTokens>;
}

/**
 * ThemeProvider wrapper that combines Halstack theming with CSS custom properties
 *
 * Usage:
 * <ThemeProvider theme={customTheme}>
 *   <App />
 * </ThemeProvider>
 */
export function ThemeProvider({ children, theme = {} }: ThemeProviderProps) {
  const mergedTheme = { ...defaultTheme, ...theme };

  useEffect(() => {
    // Inject CSS custom properties into the document root
    const root = document.documentElement;

    Object.entries(mergedTheme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, String(value));
    });

    // Cleanup function to remove properties on unmount (optional)
    return () => {
      Object.keys(mergedTheme).forEach((key) => {
        root.style.removeProperty(`--${key}`);
      });
    };
  }, [mergedTheme]);

  return (
    <HalstackProvider opinionatedTheme={mergedTheme}>
      {children}
    </HalstackProvider>
  );
}
