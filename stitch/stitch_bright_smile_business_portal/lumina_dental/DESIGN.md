---
name: Lumina Dental
colors:
  surface: '#f7fafc'
  surface-dim: '#d7dadc'
  surface-bright: '#f7fafc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f6'
  surface-container: '#ebeef0'
  surface-container-high: '#e5e9eb'
  surface-container-highest: '#e0e3e5'
  on-surface: '#181c1e'
  on-surface-variant: '#444748'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eef1f3'
  outline: '#747878'
  outline-variant: '#c4c7c8'
  surface-tint: '#5d5f5f'
  primary: '#5d5f5f'
  on-primary: '#ffffff'
  primary-container: '#ffffff'
  on-primary-container: '#747676'
  inverse-primary: '#c6c6c7'
  secondary: '#0453cd'
  on-secondary: '#ffffff'
  secondary-container: '#356ee7'
  on-secondary-container: '#fefcff'
  tertiary: '#006688'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffffff'
  on-tertiary-container: '#007fa8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#dae2ff'
  secondary-fixed-dim: '#b2c5ff'
  on-secondary-fixed: '#001848'
  on-secondary-fixed-variant: '#0040a2'
  tertiary-fixed: '#c2e8ff'
  tertiary-fixed-dim: '#75d1ff'
  on-tertiary-fixed: '#001e2b'
  on-tertiary-fixed-variant: '#004d67'
  background: '#f7fafc'
  on-background: '#181c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Open Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Open Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Open Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Open Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  section-padding: 80px
---

## Brand & Style

The design system is built upon the principles of clinical excellence and aesthetic rejuvenation. It targets a discerning audience seeking both professional medical results and a premium, spa-like experience. The UI must evoke a sense of absolute hygiene, precision, and confidence.

The design style is **High-End Minimalist with Medical Clarity**. It leverages expansive whitespace to simulate the "breathability" of a modern dental studio. By utilizing high-contrast typography against sterile surfaces, the interface remains authoritative yet approachable. The aesthetic avoids "clinical coldness" by employing soft transitions and subtle depth, ensuring the user feels cared for rather than processed.

## Colors

The palette is anchored by **Bright Dental White**, which serves as the primary canvas to reinforce the core product benefit: purity and brilliance. **Deep Trust Blue** is used strategically for primary actions and navigational anchors to establish authority and reliability.

**Glistening Mint** acts as a vibrant accent for highlights, success states, and interactive elements, providing a refreshing visual "pop." Surfaces are layered using **Clean Light Gray** and **Soft Medical Teal** to differentiate content blocks without introducing jarring borders. Text should primarily use a deep navy-tinted charcoal (#091E42) rather than pure black to maintain a sophisticated, high-end feel while ensuring maximum readability.

## Typography

This design system utilizes a tiered typographic scale to balance marketing impact with clinical detail. **Montserrat** provides a geometric, confident structure for headlines, echoing the precision of dental instruments. **Open Sans** is used for all functional and descriptive text, chosen for its exceptional legibility and friendly, open apertures.

To maintain the high-end aesthetic, use generous line heights (1.5x for body) and slight negative letter-spacing on large display titles to give them a "locked-in" professional look. Use the `label-sm` style for technical specifications or secondary metadata, ensuring the uppercase treatment provides clear visual hierarchy.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** on desktop and a **Fluid Grid** on mobile devices. A 12-column system is used for desktop to allow for flexible content arrangements, such as "before and after" galleries or service grids.

Spacing is based on an 8px rhythmic scale. To convey "Cleanliness" and "Luxury," avoid crowding elements; use `section-padding` generously to separate distinct service areas. Components should favor internal padding over external margins to create "islands" of information on the `neutral_color_hex` background.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Ambient Shadows**. Instead of heavy borders, use subtle shifts between the primary white surface and the `Clean Light Gray` background to define content areas.

For interactive elements like cards or modals, use extremely soft, diffused shadows with a slight blue tint (using `Deep Trust Blue` at 5-8% opacity). This "glow" effect mimics the clean, bright light of a dental studio. Avoid multiple stacked shadows; keep the interface flat and lightweight to maintain the sterile, high-end aesthetic.

## Shapes

The design system employs **Rounded** geometry. A radius of `0.5rem` (8px) is the standard for most components, striking a balance between the precision of medical technology and the approachability of a lifestyle brand. Large containers or featured "before and after" cards should use `rounded-xl` (1.5rem) to soften the visual impact and appear more modern and welcoming.

## Components

### Buttons
Primary buttons use `Deep Trust Blue` with white text, featuring a high-gloss hover state using a `Glistening Mint` bottom border (2px). Secondary buttons are outlined in the same blue or use a `Soft Medical Teal` background for a softer call-to-action.

### Cards
Cards should have a pure white background on the light gray surface. They should utilize the `rounded-lg` radius and a soft ambient shadow. Keep card borders non-existent or use a 1px stroke of `E6F7FF`.

### Input Fields
Inputs should feel spacious. Use a 16px internal padding and a 1px border in `Clean Light Gray`. On focus, the border should transition to `Glistening Mint` with a 2px soft outer glow.

### Lists & Steps
Use custom icons (thin-line weight) in `Glistening Mint` for bullet points to emphasize a "checked and clean" feeling. Progress steps for treatment plans should use a soft teal connector line.

### High-End Detail: The "Shine"
Apply a subtle, low-opacity linear gradient (white to transparent) at a 45-degree angle across primary buttons or hero image overlays to subtly simulate a light reflection on polished enamel.