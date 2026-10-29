---
name: Tagrivo
description: "Print smarter. Ship better."
colors:
  green: "#185642"
  green-ink: "#ffffff"
  paper: "#ffffff"
  ink: "#171e1b"
  muted: "#59635e"
  soft: "#f3f6f1"
  line: "#dce2dd"
  control-border: "#7a8c80"
  hover: "#eaf1e9"
  danger: "#9c372d"
  photo: "#ffffff"
  dark-paper: "#101c17"
  dark-ink: "#f3f0e7"
  dark-muted: "#b7c6bc"
  dark-green: "#b9ddc1"
  dark-green-ink: "#142c1e"
  dark-soft: "#192a21"
  dark-line: "#35473d"
  dark-control-border: "#789582"
  dark-hover: "#253b2c"
  dark-danger: "#ffa99e"
typography:
  display:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "clamp(78px, 8.7vw, 126px)"
    fontWeight: 400
    lineHeight: 0.97
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "clamp(38px, 4.2vw, 60px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  title:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  article:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.9
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  square: "0px"
  circle: "50%"
spacing:
  "8": "8px"
  "12": "12px"
  "16": "16px"
  "20": "20px"
  "24": "24px"
  "28": "28px"
  "32": "32px"
  "36": "36px"
  "48": "48px"
  "64": "64px"
  "72": "72px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.green-ink}"
    rounded: "{rounded.square}"
    padding: "16px 28px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.green}"
    rounded: "{rounded.square}"
    padding: "16px 28px"
  button-secondary-hover:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.green}"
  text-link:
    textColor: "{colors.green}"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "12px 14px"
  option:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "22px"
  option-selected:
    backgroundColor: "{colors.hover}"
    textColor: "{colors.ink}"
  navigation-link:
    textColor: "{colors.ink}"
    padding: "16px 0"
  product-card:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
  calculator-results:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "38px"
---

# Design System: Tagrivo

## Overview

**Creative North Star: "Editorial Premium"**

Tagrivo uses the first selected green editorial concept: confident serif headlines, true white space, deep pine accents, and a calm reading rhythm. Its precise promise is **“Print smarter. Ship better.”** The serif supplies character; quiet sans-serif controls make comparison and decision tools approachable.

The finished implementation extends that approved world with a real-printer shortlist, a five-step Finder, comparison, and cost tools. These additions share the same visual language. Open editorial layouts, authentic manufacturer photographs, and visible source notes convey considered guidance. The dedicated forest dark theme preserves this hierarchy through warm text, tonal surfaces, and pale mint actions.

**Key Characteristics:**
- Large serif statements with real italic emphasis.
- White and pine in light mode; forest and warm parchment in dark mode.
- Open columns, generous space, and fine rules.
- Square controls and restrained interaction feedback.
- Original editorial artwork paired with genuine manufacturer product photographs.

<!-- Authority: first selected green Editorial Premium concept, retained locally. Implementation evidence: src/styles/global.css, src/pages/index.astro, src/components/Icon.astro, src/components/ProductCard.astro; local rendered evidence in .impeccable/review/. This merges the provisional seed into implemented facts. -->

## Colors

A single pine accent sits within a quiet neutral palette; the frontmatter records exact implemented values.

### Primary
- **Deep Pine** (`green`): primary actions, links, selected controls, wordmark geometry, and the methodology band.
- **Pale Mint** (`dark-green`): dark-theme actions, links, selection, and visible focus. **Forest Button Ink** (`dark-green-ink`) supplies readable text on this pale fill.
- **White Button Ink** (`green-ink`): text and icons on pine actions in light mode.

### Neutral
- **True White** (`paper`): the light page canvas. **Photo White** (`photo`) remains white in both themes to preserve manufacturer images.
- **Botanical Ink** (`ink`) and **Quiet Grey Green** (`muted`): headings/body and supporting explanations respectively.
- **Soft Leaf** (`soft`): Finder and calculator support surfaces. **Pale Leaf Hover** (`hover`) marks option interaction and selection.
- **Fine Sage Rule** (`line`): structural dividers and control borders.
- **Deep Forest** (`dark-paper`), **Forest Surface** (`dark-soft`), and **Forest Hover** (`dark-hover`): dark canvas, supporting layers, and selected controls.
- **Warm Parchment** (`dark-ink`), **Silver Sage** (`dark-muted`), and **Forest Rule** (`dark-line`): dark text hierarchy and boundaries.
- **Clay Error** (`danger`) and **Soft Coral Error** (`dark-danger`): validation feedback for each theme.

**The Photo Integrity Rule.** Keep manufacturer product images unmodified and visibly credited. Editorial artwork can express shipping materials and atmosphere; it must not stand in for photographs of real hardware.

Theme mapping follows the root CSS variables: dark-prefixed tokens replace their same-named light roles under `data-theme='dark'`; `photo` remains white. The methodology band deliberately retains Deep Pine and white text in both themes. The mobile product-image backing uses the implemented very pale neutral (`#fafbf9`) and multiply blending.

## Typography

**Display Font:** self-hosted DM Serif Display, with Georgia and serif fallbacks.

**Body Font:** self-hosted DM Sans, with sans-serif fallback.

**Character:** the substantial serif and its genuine italic carry the selected editorial voice. DM Sans keeps navigation, product facts, and tools clear. DM Serif Display uses regular weight (400); DM Sans ships regular, medium, semibold, and bold (400/500/600/700). Font synthesis is disabled.

### Hierarchy
- **Display:** the frontmatter display role governs the home hero. “smarter.” uses the separately loaded italic font. At mobile widths it uses `clamp(44px, 13.7vw, 78px)` and line height (1).
- **Headline:** section headings use the headline role. General page titles use `clamp(56px, 6.4vw, 88px)`; the mobile page-title override is (48px).
- **Title:** the base third-level serif title uses the title role. Product, principle, and guide headings have contextual sizes, generally (29–36px) on desktop.
- **Body:** the body role supports ordinary reading. Hero support copy is larger (24px, line height 1.55), becoming (16px) on mobile.
- **Article:** the article role uses a comfortable maximum measure (66ch). At mobile width article text becomes (15px).
- **Label:** the label role covers field labels and compact tool text; metadata uses contextual small sans sizes (11–14px). Keep labels in natural case as implemented.

**The Real Italic Rule.** Use the loaded DM Serif Display italic for emphasis; do not simulate italic or heavier serif weights. The earlier Instrument Serif seed is superseded by the implemented DM Serif Display pairing.

## Layout

The centered outer container caps at (1520px), with desktop gutters (64px), medium gutters (36px at 1100px and below), and mobile gutters (22px at 600px and below). Section rhythm commonly uses (72px) vertical spacing on desktop and (48px) below 800px. Fine horizontal rules divide major groups without enclosing each item.

The home hero uses a near-even split (1.08fr / 1fr), a (38px) gap, and a (650px) desktop height; heights adjust to (690px) above 1600px, (550px) below 1100px, and (500px) below 800px. Below 600px it becomes a single column with copy first and a full-width (360px) image. The two-line tagline stays intact within its responsive type sizes.

The implemented home sequence is hero, three principles, real-printer shortlist, Finder invitation, varied buying guides, methodology band, and footer. That sequence describes this page rather than prescribing every future page. Product lists use three open columns; guides use an asymmetric feature-and-sidebar layout. They become single columns below 600px.

Tools keep the same page grid and reading hierarchy. Finder uses a main column with a narrow ruled aside, moving to one column below 800px. Comparison preserves horizontal scrolling on small screens and a sticky first column below 600px. The calculator's summary is sticky on desktop and returns to normal flow below 800px. Article layouts pair a readable column with contextual navigation, then collapse below 800px.

## Elevation & Depth

The system uses no box shadows. Depth comes from tonal backgrounds, whitespace, image crops, and hairline boundaries. Product listings stay open against the canvas; the Finder band and calculator result area use Soft Leaf or Forest Surface to establish a supporting plane.

**The Open Surface Rule.** Preserve the flat editorial structure: use tonal separation and fine rules for hierarchy instead of floating dashboard panels.

## Shapes

Buttons, fields, image crops, and supporting containers have square corners. Thin borders (1px) organize information and controls. Circular radio indicators (17px, 50% radius) are the deliberate exception. Phosphor regular icons provide simple arrows and utility symbols, typically (18–24px); the methodology shield is larger (36px).

## Components

### Buttons

Refined, confident rectangles with clear text and directional arrows.

- **Shape:** square, with primary and secondary padding (16px 28px) and minimum height (58px).
- **Primary:** Deep Pine with white text in light mode; Pale Mint with Forest Button Ink in dark mode.
- **Hover / Focus:** hover swaps to page ink with page-colored text. Arrows move right (4px). A visible green outline (2px) sits outside focusable controls with offset (5px).
- **Secondary:** transparent background, green text, and a fine rule border; hover uses the soft surface and accent border.
- **Plain:** unfilled text controls use muted text, a minimum height (44px), and green underlined hover feedback.
- **Motion:** color changes use (0.2s). Reduced-motion preferences disable transitions and animation.

### Cards / Containers

Product cards are open editorial entries rather than raised panels. A white product-image area contains the photograph without cropping hardware; title, fit description, specifications, and a text link sit beneath. Desktop image ratio is (1.35); the photograph occupies (88%) of the frame. Image hover scales gently (1.045) over (0.45s). Mobile changes the ratio to (1.55).

Calculator results use the soft supporting surface, square corners, and padding (38px desktop; 28px 24px mobile). Thin rules separate cost rows; numeric breakdowns use tabular figures.

### Inputs / Fields

Square, quiet fields use the page background, ink text, a control-border token distinct from decorative rules, padding (12px 14px), and minimum height (50px). Hover shifts the border to green; keyboard focus uses the common visible outline. Errors use the theme's error color. Disabled buttons reduce opacity (0.45) and show a disabled cursor.

### Iteration 2: clarity and conversion

The existing Finder invitation now follows the unchanged hero. Its five-step promise describes a real flow rather than an unmeasured completion time. It remains a native HTML form without a React island on the home page. Dedicated Finder choices use native radios with keyboard navigation and associated validation errors. Budget limits eligibility, never perceived product quality or a paid placement.

Product entries share an aligned specification grid, media requirements, a documented advantage and limitation, and separate analysis/comparison actions. Authentic product photographs retain their aspect ratio and credits. Supporting notes, media specifications and footer links use 13–14px type; copyright uses 12px. Standalone text actions have at least 44px height. The restrained transitions and reduced-motion override remain in place.

Control outlines use `#7a8c80` in light mode and `#789582` in dark mode. Decorative rules retain their original subtle tokens. The approved fonts, hero, photographs, palette and light/dark identities remain authoritative.

### Navigation

The header pairs a closely spaced DM Sans wordmark with natural-case navigation. Desktop links use a thin underline that grows from the left on hover; the current page retains the underline. Below 800px, a menu control replaces desktop links, and the expanded mobile navigation uses a ruled list. Icon controls retain minimum touch targets (44px).

### Finder Options

Two-column option groups use square, outlined choices and circular indicators. Each standard option has padding (22px), minimum height (82px), and gap (16px). Hover and selected states share the pale hover surface and accent border; the selected circle fills green. Native input variants retain accent-color feedback and an outlined focus-within state. The compact home invitation uses shorter options (63px) and a link into the five-step Finder.

### Text Links

Green inline links have a quiet underline and a separated arrow. Hover moves the arrow (4px); keyboard focus remains clearly visible. In running article copy, conventional underlined links preserve discoverability.

### Motion and Artwork

The hero copy settles in over (0.8s), moving upward (10px) from a visible initial opacity (0.8), using `cubic-bezier(0.16, 1, 0.3, 1)`. The editorial hero depicts a label ribbon, green plinth, kraft boxes, and natural light. Manufacturer photos supply product identity. Reduced-motion users receive the same content without animated transitions or smooth scrolling.

## Do's and Don'ts

### Do:
- **Do** preserve the exact tagline “Print smarter. Ship better.” and its real italic emphasis on “smarter.” in the hero.
- **Do** use DM Serif Display for editorial headings and DM Sans for body text and controls.
- **Do** apply the dedicated forest theme through the implemented semantic color roles.
- **Do** retain authentic manufacturer photographs, source credits, and unmodified hardware proportions.
- **Do** use open columns, tonal supporting surfaces, fine rules, and visible keyboard focus.
- **Do** carry the same editorial hierarchy into the Finder, comparison, and cost tools.

### Don't:
- **Don't** reintroduce the superseded Instrument Serif seed or synthesize serif weights and italics.
- **Don't** replace true-white light surfaces with a global cream tint.
- **Don't** add floating dashboard panels or shadows to this flat editorial system.
- **Don't** use generated or altered hardware images as representations of real printer models.
- **Don't** remove visible focus feedback or reduced-motion behavior when adding interactions.
