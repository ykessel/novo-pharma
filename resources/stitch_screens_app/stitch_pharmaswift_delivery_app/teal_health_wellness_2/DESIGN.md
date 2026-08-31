---
name: Teal Health & Wellness
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dde9ff'
  surface-container-highest: '#d3e3ff'
  on-surface: '#0b1c30'
  on-surface-variant: '#3e4949'
  inverse-surface: '#213146'
  inverse-on-surface: '#ebf1ff'
  outline: '#6e7979'
  outline-variant: '#bdc9c8'
  surface-tint: '#006a6a'
  primary: '#006565'
  on-primary: '#ffffff'
  primary-container: '#008080'
  on-primary-container: '#e3fffe'
  inverse-primary: '#76d6d5'
  secondary: '#54615f'
  on-secondary: '#ffffff'
  secondary-container: '#d7e5e3'
  on-secondary-container: '#5a6765'
  tertiary: '#974000'
  on-tertiary: '#ffffff'
  tertiary-container: '#b7571b'
  on-tertiary-container: '#fff8f5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#93f2f2'
  primary-fixed-dim: '#76d6d5'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#004f4f'
  secondary-fixed: '#d7e5e3'
  secondary-fixed-dim: '#bcc9c7'
  on-secondary-fixed: '#121e1c'
  on-secondary-fixed-variant: '#3d4947'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb690'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#783100'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e3ff'
  success: '#16A34A'
  danger: '#DC2626'
  warning: '#D97706'
  soft-mint: '#e6f4f1'
  accent-coral: '#f97316'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  price-numeric:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
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
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  badge-label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 12px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-padding: 20px
  stack-gap-lg: 24px
  stack-gap-md: 16px
  stack-gap-sm: 8px
  grid-gutter: 12px
  touch-target-min: 48px
---

## Brand & Style
The design system is engineered to project a sense of clinical precision, unwavering trust, and modern accessibility. It is tailored for a health and wellness platform where users—ranging from tech-savvy enthusiasts to elderly patients—require clarity and calm. 

The aesthetic leans into **Modern Corporate Minimalism**. By utilizing a "High-Trust" visual language, the system balances the sterility of healthcare with the warmth of wellness. High-contrast typography and a logical spatial hierarchy ensure that critical information, such as dosage and status, is never lost. The interface feels "hygienic" through generous white space, yet "inviting" through its soft shape language and subtle tonal transitions.

## Colors
The color strategy prioritizes **Deep Teal (#008080)** as the primary brand anchor, symbolizing stability and professional medical care. 

To ensure safety and clarity, a suite of semantic status colors is integrated:
- **Success Green (#16A34A):** For completed actions, verified prescriptions, and delivery confirmations.
- **Danger Red (#DC2626):** For errors, expired documents, or critical warnings.
- **Warning Amber (#D97706):** For pending items or low-stock alerts.

All interactive combinations are audited to meet **WCAG AA 4.5:1 contrast standards**. Text on primary teal surfaces and semantic status backgrounds remains white to maintain maximum legibility.

## Typography
This design system utilizes **Inter** for its systematic clarity and high x-height, which is essential for reading drug names and medical instructions. 

- **Price/Numerics:** A specialized bold treatment (20px) is used for currency and dosages to ensure financial and medical data are immediately scannable.
- **Badge Labels:** A medium-weight 12px style is used for status indicators, ensuring metadata is distinct from body copy.
- **Scaling:** For mobile devices, `headline-xl` is used sparingly for empty states, while `headline-lg` serves as the primary screen title.

## Layout & Spacing
The layout follows a **Fluid Grid** philosophy. On mobile, a 4-column grid with 12px gutters is used. A consistent 20px horizontal margin ensures content does not touch device edges.

The vertical rhythm is governed by an 8px base unit. Sections are separated by `stack-gap-lg` (24px) to provide visual breathing room, while internal card elements use `stack-gap-sm` (8px). To accommodate users with limited dexterity or those in high-stress situations, all interactive components must adhere to a minimum touch target of 48px.

## Elevation & Depth
Hierarchy is achieved through **Tonal Layers** and **Ambient Shadows**. This avoids the clutter of heavy borders while maintaining distinct interactive zones.

- **Level 0 (Background):** Solid white or `#f8f9ff` for the base canvas.
- **Level 1 (Cards):** Utilizes a "Soft Ambient" shadow (`0px 4px 20px rgba(0, 128, 128, 0.06)`). The slight teal tint in the shadow creates a holistic brand feel.
- **Level 2 (Modals/Overlays):** A more aggressive shadow (`0px 10px 30px rgba(0, 0, 0, 0.08)`) is used to pull floating elements forward in the user's field of focus.

## Shapes
The shape language is **Rounded**, using an 8px (0.5rem) base to soften the clinical nature of the content.

- **Standard Inputs/Buttons:** 8px radius.
- **Containers/Cards:** 16px radius for a more prominent, friendly appearance.
- **Pills:** Full rounding (999px) is reserved for category chips, search bars, and status badges, providing a distinct visual contrast to structural cards.

## Components

### Buttons
Buttons require a minimum height of 52px on mobile.
- **Primary:** Deep Teal background, white text.
- **Secondary:** Soft Mint background, Deep Teal text.
- **States:**
    - **Default:** Solid fill.
    - **Pressed:** 10% black overlay on the base color.
    - **Disabled:** Grayscale fill (#E2E8F0) with muted text (#94A3B8).
    - **Loading:** Maintain button dimensions; replace text with a centered 24px spinner.

### Cards & Inputs
- **Cards:** Must feature the Level 1 Ambient Shadow and a subtle 1px border (#F1F5F9) to ensure separation on pure white backgrounds.
- **Input Fields:** 8px rounded corners. The focus state is a 2px Deep Teal border with a 4px soft teal outer glow.

### Specialized Health Components
- **Status Badges:** Use `badge-label` typography. Background colors must use the semantic Success, Danger, or Warning colors at 15% opacity with the full-saturation color for the text to ensure WCAG AA compliance.
- **Prescription Drop-zone:** A card with a dashed Deep Teal border and Soft Mint background to indicate a specialized interaction area for document uploads.