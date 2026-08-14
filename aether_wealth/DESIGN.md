---
name: Aether Wealth
colors:
  surface: '#fcf8f8'
  surface-dim: '#ddd9d9'
  surface-bright: '#fcf8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f1edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#444748'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#747878'
  outline-variant: '#c4c7c8'
  surface-tint: '#5d5f5f'
  primary: '#5d5f5f'
  on-primary: '#ffffff'
  primary-container: '#ffffff'
  on-primary-container: '#747676'
  inverse-primary: '#c6c6c7'
  secondary: '#006e2f'
  on-secondary: '#ffffff'
  secondary-container: '#6bff8f'
  on-secondary-container: '#007432'
  tertiary: '#b91a24'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffffff'
  on-tertiary-container: '#db3638'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#6bff8f'
  secondary-fixed-dim: '#4ae176'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#fcf8f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  numeric-data:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-desktop: 40px
  container-padding-mobile: 20px
  gutter: 24px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is engineered to evoke a sense of high-precision financial stewardship. It targets a demographic that values technological sophistication and premium aesthetics, blending **Modern Corporate** reliability with **Glassmorphism** accents to signify transparency and "forward-looking" liquidity.

The visual language is characterized by deep, cinematic depth, where data floats on subtle glass layers. High-precision typography and expansive whitespace communicate clarity, while vibrant functional colors (Growth Green, Expense Red, Goal Gold) act as critical beacons within a clean, monochromatic environment. The emotional response is one of calm control—transforming complex financial data into a serene, high-end digital experience.

## Colors

The palette leverages high-contrast neutrals to maintain a professional, high-fidelity atmosphere.

*   **Primary White (#FFFFFF):** Used for base surfaces and high-intensity text on dark backgrounds.
*   **Charcoal (#1F2937):** The primary color for text, iconography, and deep-tier containers to ensure maximum legibility.
*   **Soft Gray (#F3F4F6):** Used for background staging and secondary surfaces to create subtle separation.
*   **Growth Green (#22C55E):** Reserved exclusively for positive trends, income, and successful transactions.
*   **Expense Red (#EF4444):** Reserved for outflows, alerts, and critical budget overages.
*   **Goal Gold (#FACC15):** Highlighting milestones, savings targets, and premium features.

## Typography

This design system utilizes **Inter** for its systematic and neutral character, ensuring financial figures are legible at any scale. **Geist** is introduced for labels and technical data to provide a developer-grade precision feel.

*   **Financial Figures:** Always use `numeric-data` for balance displays to maintain a technical, "tabular" alignment.
*   **Hierarchy:** Use `display-lg` for total net worth or primary balances. 
*   **Secondary Info:** Use `label-caps` for table headers and metadata categories to create a clear structural rhythm.

## Layout & Spacing

The layout follows a **Fixed Grid** model for desktop to maintain a "dashboard" feel, while transitioning to a **Fluid Grid** for mobile.

*   **Desktop:** 12-column grid, 1140px max-width, 24px gutters.
*   **Tablet:** 8-column grid, 16px gutters.
*   **Mobile:** 4-column grid, 16px gutters with 20px side margins.

Spacing follows an 8px base unit. Use `stack-lg` for separating major sections like "Portfolio Overview" and "Recent Transactions." Use `stack-sm` for internal component elements like a label and its corresponding input.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Glassmorphism**. 

1.  **Level 0 (Background):** Soft Gray (#F3F4F6).
2.  **Level 1 (Main Cards):** Pure White (#FFFFFF) with a 1px border (#E5E7EB) and a "Soft Ambient" shadow: `0px 4px 20px rgba(31, 41, 55, 0.04)`.
3.  **Level 2 (Interactive Overlays):** Semi-transparent white (80% opacity) with a 16px backdrop-blur. 
4.  **Level 3 (Modals/Popovers):** Pure White with a sharper shadow: `0px 10px 30px rgba(31, 41, 55, 0.1)`.

Avoid heavy black shadows. All elevation should feel "light as air," supported by extremely thin, elegant borders.

## Shapes

The shape language is sophisticated and approachable. 
*   **Standard Cards:** Use `rounded-lg` (1rem / 16px) as the default to soften the technical nature of the data.
*   **Buttons & Inputs:** Use `rounded-lg` for a consistent, modern silhouette.
*   **Status Tags/Pills:** Use `rounded-xl` or full pill-shape for Growth/Expense indicators to distinguish them from structural elements.

## Components

### Financial Cards
The flagship component. Features a subtle gradient mesh background (White to Soft Gray), 16px corner radius, and 1px border. Financial figures should be rendered in `numeric-data` style.

### Balance Rings
Circular charts used for budget categories. Use a 12px stroke width. The "track" should be Soft Gray, while the "fill" uses Growth Green or Goal Gold. Center the percentage or remaining balance using `headline-md`.

### Interactive Charts
Line graphs should be "stepped" or "curved" with a 2px stroke width. Include a vertical glassmorphic hover state that follows the cursor, displaying a tooltip with precise financial data.

### Transaction Ledger
A list-based component. Each row features a Soft Gray bottom border. Use `body-md` for the merchant name and `label-caps` for the category. Amounts are color-coded: Green for positive, Charcoal for negative.

### Buttons
*   **Primary:** Charcoal background with White text.
*   **Secondary:** White background, 1px Charcoal border, Charcoal text.
*   **Ghost:** No background, subtle hover state (Soft Gray).

### Input Fields
Minimalist design with a 1px Soft Gray border that turns Charcoal on focus. Labels should sit above the field using `label-caps`.