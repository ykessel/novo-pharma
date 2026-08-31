---
name: Teal Health & Wellness
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3e4949'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
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
  secondary-container: '#d7e5e2'
  on-secondary-container: '#5a6765'
  tertiary: '#974000'
  on-tertiary: '#ffffff'
  tertiary-container: '#be5300'
  on-tertiary-container: '#fff9f7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#93f2f2'
  primary-fixed-dim: '#76d6d5'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#004f4f'
  secondary-fixed: '#d7e5e2'
  secondary-fixed-dim: '#bcc9c7'
  on-secondary-fixed: '#121e1c'
  on-secondary-fixed-variant: '#3d4947'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb690'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#783200'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
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
---

## Brand & Style
The design system focuses on establishing immediate trust, clarity, and a sense of medical precision for a pharmacy and medicine delivery platform. The brand personality is dependable and professional yet approachable, avoiding the coldness of traditional clinical environments.

The visual style follows a **Modern Corporate** aesthetic with a lean toward **Minimalism**. It prioritizes high legibility and a logical hierarchy to ensure users—including those who may be unwell or elderly—can navigate the interface without cognitive friction. The interface utilizes generous white space to reduce anxiety, high-quality iconography for quick recognition, and a sophisticated color palette that feels hygienic and contemporary.

## Colors
The palette is centered around **Deep Teal (#008080)**, a color that evokes health, stability, and professional care. This is used for primary actions and brand-defining moments.

**Soft Mint (#E6F4F1)** serves as a functional background and surface color for subtle grouping, providing a refreshing alternative to harsh grays. **Accent Coral (#F97316)** is used sparingly for high-priority alerts, urgent delivery statuses, or promotional callouts, ensuring they stand out without overwhelming the calming teal base. The neutral scale uses cool grays to maintain a clean, clinical (but not cold) feel.

## Typography
This design system utilizes **Inter** for its exceptional legibility and systematic structure. The type scale is optimized for mobile reading, with a strong emphasis on weight contrast to distinguish between drug names (Headlines) and dosage instructions (Body).

For mobile specific constraints:
- **Headline XL** is reserved for main dashboard greetings or empty state headings.
- **Headline LG** is the standard for screen titles.
- **Body MD** is the primary size for all functional text to ensure accessibility for users with varying visual acuity.
- **Label MD** is utilized for metadata like "Prescription Required" or "In Stock" badges.

## Layout & Spacing
The layout follows a **Fluid Mobile Grid** with a standard 4-column structure for mobile devices. 

- **Safe Areas:** A 20px horizontal margin is maintained on all screens to prevent content from hitting the device edges.
- **Vertical Rhythm:** A base-8 spacing system is used. Components are separated by 24px (Large Gap) for distinct sections, and 16px (Medium Gap) for related elements within a section.
- **Touch Targets:** All interactive elements maintain a minimum height of 48px to ensure ease of use during high-stress situations.

## Elevation & Depth
Hierarchy is established using **Tonal Layers** combined with **Ambient Shadows**. 

- **Surface Level 0 (Background):** Pure white (#FFFFFF) or extremely light gray (#F8FAFC).
- **Surface Level 1 (Cards):** White surfaces with a "Soft Ambient" shadow: `0px 4px 20px rgba(0, 128, 128, 0.06)`. This subtle teal-tinted shadow keeps the UI feeling cohesive with the brand color.
- **Surface Level 2 (Modals/Floating Actions):** Elevated with a more pronounced shadow: `0px 10px 30px rgba(0, 0, 0, 0.08)`.

Outlines are used for secondary UI elements like inactive input fields, using a low-contrast gray (#E2E8F0) to keep the interface feeling soft.

## Shapes
The shape language is friendly and ergonomic, characterized by significant rounding to reduce the "sharp" feel of medical institutions.

- **Standard Elements:** 8px radius for input fields and small buttons.
- **Cards & Containers:** 16px radius for all product tiles, prescription cards, and main containers.
- **Pill Elements:** Full rounding (999px) for search bars, status badges (e.g., "Shipped"), and category chips.

## Components
- **Buttons:** Primary buttons use the Deep Teal background with white text. They should have a minimum height of 52px for mobile accessibility. Secondary buttons use the Soft Mint background with Deep Teal text.
- **Cards:** Product cards must include a 1px subtle border (#F1F5F9) in addition to the ambient shadow to maintain definition against white backgrounds.
- **Input Fields:** Search bars and quantity selectors use a "Pill" shape. Standard form inputs use the 8px "Rounded" shape with a focus state indicated by a 2px Deep Teal border.
- **Chips:** Used for filtering (e.g., "Pain Relief", "Vitamin C"). Inactive chips have a white background and gray border; active chips have a Deep Teal background and white text.
- **Status Indicators:** Use the Accent Coral for "Low Stock" or "Action Required" (e.g., "Upload Prescription"). Use a soft green for "Verified" or "Delivered."
- **Prescription Slot:** A specialized card component with a dashed border and Soft Mint background to signify a drop-zone for document uploads.