# UI/UX Refinement — Smoked Liquid Glass with Live Optical Refraction

## Role

Act as an award-winning creative frontend developer, UI/UX designer and creative technologist with 10+ years of experience building high-end luxury websites, immersive digital experiences and advanced optical material effects.

Your expertise must encompass real-time refraction, GPU-accelerated rendering, sophisticated glass materials, accessibility, responsive design and frontend performance optimisation.

## Objective

Refine the existing Liquid Glass interface of the Urbanrise Abundance landing page, particularly the interactive carbon footprint calculator, into a sophisticated **Smoked Liquid Glass interface with live optical refraction**.

The objective is to achieve exceptional readability while retaining transparency, optical depth, dynamic reflections and the immersive architectural background.

This is a material and visual refinement exercise, not a redesign.

## 01. Smoked Liquid Glass Material

Replace the existing highly transparent glass material with a refined, warm charcoal smoked-glass material.

The glass should resemble premium architectural smoked glass rather than conventional CSS glassmorphism.

Use the following initial material specifications:

| Property | Specification |
|---|---|
| Base tint | #242321 — Warm Charcoal |
| Glass opacity | 75–85%, fine-tuned visually |
| Backdrop blur | 20–28px |
| Backdrop saturation | 75–85% |
| Primary text | #FFFDF8 |
| Secondary text | #E7E3DC |
| Numerical highlights | #F3D6A0 |
| Border opacity | 15–20% |
| Specular edge opacity | 30–40% |
| Corner radius | Retain existing |
| Surface finish | Polished smoked architectural glass |

Introduce a subtle tonal gradient within the glass material to create dimensional depth without creating visible colour bands.

The background must remain perceptible through the glass, but architectural details, vegetation, lighting and textures must not compete with foreground content.

Avoid making the glass completely opaque.

## 02. Live Optical Refraction

Implement genuine, dynamic optical refraction wherever technically feasible within the existing architecture.

Do not simply simulate Liquid Glass using backdrop blur and transparency.

The glass must respond optically to the actual background content behind it.

### Required optical characteristics

- Real-time background sampling and distortion.
- Subtle refraction along curved glass boundaries.
- Physically inspired displacement of underlying imagery.
- Edge-dependent refraction intensity.
- Soft specular highlights around the glass perimeter.
- Subtle Fresnel-inspired reflections.
- Optical depth that conveys the perceived thickness of the glass.
- Continuous updates as the user scrolls or the background changes.
- Seamless behaviour across existing animated and interactive states.

Keep refraction concentrated primarily around the perimeter and curved edges of the glass.

The central reading area should remain optically stable, with minimal distortion and controlled background visibility.

**Only the underlying background imagery should refract. Foreground text, numerical values, sliders, buttons and icons must remain perfectly sharp and undistorted.**

### Interaction behaviour

Where appropriate, introduce subtle pointer-responsive specular highlights that gently respond to cursor movement.

These interactions must remain understated, smooth and physically plausible.

Avoid excessive movement, visible rippling, wobbling, exaggerated magnification or distracting distortion.

The effect should feel like a premium physical material reacting to its environment, not a decorative animation.

## 03. Typography and Readability

Retain the existing brand font families and editorial typography hierarchy.

Improve readability through contrast, font weight, spacing and optical clarity rather than replacing the typography.

- Preserve the existing elegant serif headings.
- Increase supporting text font weight to 500 where appropriate.
- Use font weight 600 for important numerical values.
- Maintain body text at approximately 16px.
- Maintain supporting text at approximately 14–15px.
- Use warm off-white for primary content.
- Use sufficiently bright warm-grey tones for secondary information.
- Retain antique-gold accents for numerical highlights and interactive elements.
- Use tabular numerals for dynamically changing calculator values.
- Remove unnecessary text shadows.
- Maintain a minimum WCAG AA contrast ratio of 4.5:1 for normal text and 3:1 for large text.
- Maintain sufficient contrast for slider tracks, handles, interactive boundaries and focus indicators.

Evaluate contrast against the actual composited background rather than the nominal glass colour alone.

## 04. Internal Component Treatment

Apply a consistent smoked-glass material hierarchy throughout the calculator.

### Parent glass panels

Use the primary smoked Liquid Glass material with live refraction, controlled translucency, optical edge highlights and subtle depth.

### Nested result cards

Use slightly lighter smoked-glass surfaces with restrained borders.

Avoid stacking multiple heavy blur filters inside the parent panels, as this can create visual muddiness and unnecessary rendering overhead.

### Sliders

Retain the existing antique-gold visual identity.

- Improve the contrast between active and inactive tracks.
- Use clearly visible slider handles.
- Introduce subtle optical highlights without affecting usability.
- Preserve smooth interaction and immediate value updates.

### Buttons and selection states

Create visually distinct default, hover, active, selected and keyboard-focus states.

Selected states should use restrained champagne-gold highlights rather than excessive glow effects.

### Numerical results

Maintain strong visual hierarchy between primary results, supporting metrics, units and explanatory text.

Ensure that all calculator results remain immediately readable regardless of the imagery behind the panels.

## 05. Technical Implementation

Before implementing, inspect the existing codebase, design tokens, Liquid Glass implementation, component architecture and rendering pipeline.

Identify the most performant approach that integrates with the existing technology stack.

Evaluate the following implementation methods:

- GPU-accelerated WebGL or GLSL shaders for dynamic background sampling and optical displacement.
- SVG displacement filters where compatible and appropriate.
- Native CSS backdrop filters for controlled diffusion and saturation.
- Lightweight compositing layers for edge reflections and specular highlights.

Choose the implementation based on actual browser compatibility, rendering performance and integration feasibility.

Do not assume that CSS backdrop blur alone provides genuine optical refraction.

Where a live background texture is required, ensure that it remains synchronised with the actual architectural imagery, scrolling and background animations.

Avoid introducing a heavyweight rendering library if equivalent functionality can be achieved using the existing stack.

Create a reusable, configurable smoked Liquid Glass material system with adjustable design tokens for:

- Tint
- Opacity
- Blur intensity
- Refraction strength
- Optical edge thickness
- Fresnel intensity
- Specular intensity
- Saturation
- Reflection behaviour

Keep visual material logic separate from calculator functionality.

## 06. Performance Optimisation

The Liquid Glass effect must not compromise the landing page's responsiveness or existing cinematic animations.

- Target smooth 60 FPS rendering on capable devices.
- Avoid continuous DOM screenshots or expensive per-frame DOM capture.
- Avoid unnecessary React re-renders.
- Avoid layout recalculations during pointer movement.
- Reuse background textures and rendering resources wherever possible.
- Suspend expensive rendering when components are outside the viewport.
- Adapt rendering resolution and refraction complexity to device capability.
- Avoid excessive GPU memory consumption.
- Provide a reduced-motion mode.
- Provide a visually consistent CSS-based smoked-glass fallback for unsupported browsers and lower-powered devices.
- Prioritise interaction responsiveness over optical complexity.

## 07. Responsive Design

Maintain the smoked Liquid Glass aesthetic across desktop, tablet and mobile.

Independently optimise opacity, blur and refraction intensity for smaller screens where necessary.

Mobile readability and interaction must take priority over advanced optical effects.

Ensure that background cropping, changing typography positions, dynamic calculator values and responsive layouts never introduce contrast issues.

## 08. Strict Negative Constraints

- No removal of Liquid Glass.
- No replacement with opaque cards.
- No flat black or grey containers.
- No conventional low-quality glassmorphism.
- No artificial black shadow boxes.
- No excessive transparency.
- No excessive blur.
- No rainbow or exaggerated chromatic aberration.
- No neon borders.
- No excessive specular highlights.
- No jelly-like movement or wobbling.
- No distortion of typography or interactive controls.
- No background image duplication or visible sampling seams.
- No unnecessary layout changes.
- No changes to existing brand fonts or copy.
- No changes to calculator formulas, assumptions or functionality.
- No regression in existing animations or interactions.
- No unnecessary dependencies.
- No modifications to unrelated sections.

## 09. Final Quality Assurance

Test the implementation using the actual architectural background images and all existing section states.

Verify:

- Foreground readability over both bright and dark background areas.
- Genuine optical refraction that responds to background changes.
- Natural glass edge distortion and reflection.
- Consistent visual material quality across all panels.
- Sharp, undistorted typography.
- Smooth slider interactions and calculator updates.
- Responsive behaviour across screen sizes.
- Browser compatibility and graceful fallbacks.
- GPU utilisation and rendering performance.
- Consistency with the existing antique-gold luxury design system.

Iteratively refine the material until all of these conditions are satisfied.

## Final Creative Direction

The finished interface should feel like a precision-crafted piece of smoked architectural glass suspended over the Abundance property imagery.

Think Apple's Liquid Glass optical sophistication combined with the restrained materiality of a world-class luxury architectural experience.

The background should remain emotionally engaging, the glass should feel physically believable, and the information should be effortlessly readable.

**Luxury through optical sophistication, not visual excess.**

Execute the refinement directly within the existing codebase, preserving the established design language, section structure and functionality.