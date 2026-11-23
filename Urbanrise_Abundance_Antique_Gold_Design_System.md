# URBANRISE — THE LIFESCAPE
## A Life of Abundance · Pre-launch website design system v1.0

**Creative decision:** light antique gold is the primary canvas, not green. Rich botanical green is an occasional cinematic state. Actual liquid-glass refraction is retained.

### Source fidelity

- The brochure PDF contains text/drawing colours such as forest `#142B25`, warm ivory `#F7F3EA`, antique gold `#A68142`, champagne `#D9C9A5`, dark slate `#26302C`, and warm grey `#77766F`; these are *file colours*, not proof of an approved corporate brand guide.
- The PDF embeds EB Garamond and Lato. The campaign PPT artwork is primarily flattened imagery and does not establish a definitive original campaign headline font.
- Campaign lime `#C0E468` is an approximate visual sample, not an officially released digital token.
- All additional tokens in this document are *proposed digital design decisions*.

### The creative logic

**Gold is the atmosphere. Green is the punctuation.**

The site should resemble a premium architectural publication built on sunlit parchment, warm champagne, subtle bronze detailing and carefully art-directed photography. Avoid metallic gradients, saturated yellow, generic glassmorphism and forest-green surfaces on every screen.

### Colour hierarchy

| Class | Token | Colour | Role |
|---|---|---|---|
| Main canvas | `--color-antique-gold-light` | `#E8D9B6` | Primary page background |
| Soft canvas | `--color-champagne-paper` | `#F3E8D1` | Alternating editorial sections |
| Bright canvas | `--color-ivory` | `#F8F1E3` | Content breathing room |
| Raised surfaces | `--color-paper-white` | `#FCF9F2` | Cards, forms, popovers |
| Rich warm canvas | `--color-sand` | `#E3D1AE` | Sparse visual-depth breaks |
| Brand accent | `--color-antique-gold` | `#A68142` | Rules, fine accents, illustration |
| Readable bronze | `--color-gold-ink` | `#6F4A1F` | Accessible gold-like text |
| CTA bronze | `--color-bronze-action` | `#755024` | Primary action on light surfaces |
| Heading ink | `--color-brown-ink` | `#2C241A` | Headings on gold surfaces |
| Body ink | `--color-brown-body` | `#5C5144` | Body copy |
| Forest reference | `--color-forest` | `#142B25` | Brand connection, limited dark detail |
| Botanical contrast | `--color-botanical-dark` | `#243126` | One major immersive green chapter |
| Muted botanical | `--color-botanical-muted` | `#5E6E4C` | Secondary accents |
| Campaign lime | `--color-lime` | `#C0E468` | Deliberate campaign-only emphasis |

### Composition balance

- **Approx. 65–75%** of background-led composition: light antique gold / champagne / ivory / parchment.
- **Approx. 15–25%**: full-bleed architectural/lifestyle photography and paper-reveal media; photography should not be artificially recoloured green.
- **Approx. 5–10%**: forest / dark green or botanical contrast, carefully placed, not repetitive.
- Percentages are art-direction heuristics, not CSS rules or rigid page-area measurements.

### Website section assignment

| Chapter | Suggested theme | Treatment |
|---|---|---|
| 01. Hero | Image-led, warm-gold surroundings | Full-bleed approved render; warm, unobtrusive overlays; champagne glass nav |
| 02. Manifesto | Light antique gold | EB Garamond editorial statement and restrained bronze rules |
| 03. Living Parchment | Ivory / paper | Sketch and render with physically plausible paper peel; preserve warm paper colour |
| 04. Abundance Switch | Champagne -> rare botanical green | Explicit switch morphs background, imagery, copy and glass material in one coordinated state change |
| 05. Eight Abundances | Alternate light gold, ivory and photography | One coherent chapter system; do not make eight identical dark-green cards |
| 06. Residences | Ivory, antique-gold frame | Architecture imagery and fine details, no aggressive colour overlays |
| 07. Lifestyle / Wellbeing | Warm sand -> photography | Natural visual rhythm; avoid darkening all wellness imagery |
| 08. Location / Masterplan | Champagne parchment | Clear map, elegant lines, high-contrast verified location information |
| 09. Pre-launch enquiry | Light antique gold with ivory form | High-contrast form and prominent bronze CTA; do not imply CRM integration without verification |
| 10. Footer | Dark bronze-brown or deep botanical green | One contrasting close; keep concise and restrained |

### Typography

- `--font-display`: **EB Garamond**, editorial and aspirational display copy.
- `--font-body`: **Lato**, interface body, captions, forms and navigation.
- `--font-campaign`: **Lato fallback only** pending the source brand font for the campaign's bold uppercase headline imagery.
- Avoid tracking-heavy microcopy, extremely thin text on images, and all-caps long-form paragraphs.

### CTA system

- **Primary, light background:** solid deep bronze `#755024` with `#FCF9F2` text. Small interactive lift only.
- **Secondary:** ivory/paper-white with border and deep brown text.
- **Text link:** forest `#142B25` underlined or visibly distinguished.
- **On botanical background:** champagne-filled CTA with dark green ink.
- Keep pre-launch actions explicit: **Register Interest**, **Request Details**, **Get Launch Updates**. Do not show **Book Now** or other transaction states before their actual availability.

### Genuine liquid-glass system

The repository's root `index.html` uses `liquid-glass-js@0.1.0` and a custom `HostGlass` adapter with `.lg`, `data-lg`, `.lqg-lens`, `.lqg-glass`, and scene cloning via `sceneBg()`. Retain this optical implementation.

- Light scenes: warm, subtle champagne tint `#F3E8D1`, ~0.08 optical tint strength, delicate pale glass border.
- Dark scenes: very low gold tint `#D9C9A5`, ~0.06 tint strength, higher-contrast white edge.
- Use actual refraction for header/nav, perhaps a chapter control and the enquiry invitation. Do not turn every card into glass.
- CSS custom properties **do not automatically update** `data-lg` JSON / runtime `HostGlass` parameters. The UI agent must bridge actual mode changes into the glass instance or reinstate/refresh the correct instance.
- Changes to sectional image backgrounds must be visible in **lens-cloned** media inside `.lqg-lens-inner`, not merely direct-child `.bg .ph` rules.
- Maintain native/fallback glass and readable contrast if the library fails to load.

### The Abundance Switch

The state must change as **one transaction**:

1. Set the section to `data-experience="abundance"` or an equivalent component state.
2. Transition the section's surface from champagne `#F3E8D1` to botanical `#243126`.
3. Replace design-architecture copy with lifestyle-abundance copy.
4. Move matched photography / illustration using a shared-element transition, not a hard image swap.
5. Change controls and captions to accessible light/dark tokens.
6. Refresh/rebind optical backgrounds and the liquid-glass tint to the active scene.
7. Maintain accessible focus and reduced-motion behavior.

On mobile, make this a deliberate tap interaction, not an automatically triggered scroll state or a heavy video shader.

### Accessibility notes

Approximate WCAG contrast ratios: body ink `#5C5144` against main gold `#E8D9B6` ≈ **5.54:1**; main ink `#2C241A` against main gold ≈ **10.94:1**; deep bronze text `#6F4A1F` against main gold ≈ **5.62:1**. The original antique-gold accent `#A68142` against main gold ≈ **2.57:1**, so don't use it for normal small text. Deep botanical with warm ivory has strong contrast. Check image text on a per-image basis.

### Agent implementation rules

1. Add the companion CSS token sheet and migrate section styles to semantic variables, not ad-hoc hex codes.
2. Keep **primitives immutable**; update semantic variables in scoped section themes.
3. Treat imagery/scrims separately from solid background tokens.
4. Do not use dark green as the default document body background.
5. Do not replace actual `LiquidGlass` with CSS-only `backdrop-filter`.
6. Never invent apartment counts, project status, amenities, completed facilities or functioning enquiry integrations.
7. Verify transitions, responsive appearance, contrast, zoom, focus, reduced motion and optical glass against the actual campaign images.
8. User's agent performs any repository operations. Do not edit GitHub from this design handoff.

### Companion implementation source

See **`urbanrise-abundance-design-tokens.css`** for all palette primitives, semantic surface/ink/action tokens, light and dark scoped themes, glass tokens, typography and spacing, form fields, motion, focus, and Abundance Switch CSS states.
