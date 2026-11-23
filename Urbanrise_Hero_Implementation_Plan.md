# Urbanrise hero implementation plan

## Design intent

Open on the parchment drawing from the submitted film. Antique-gold paper edges pull away at different speeds as the camera settles into the full-bleed scene. The hand then completes the physical peel already present in the footage. The building carries the composition, with the campaign headline and two useful actions anchored below its roofline. The existing glass navigation floats above the scene.

Use the campaign language “A Life of Abundance” and the Lifescape name from the design system. Set the headline in EB Garamond and the interface in Lato. Use champagne glass, a localized warm scrim for legibility, ivory image text, and the bronze action token where its background calls for it. Keep the original render’s colors and use the building as the focal point on narrow screens. [Design system](Urbanrise_Abundance_Antique_Gold_Design_System.md) · [Visual excellence checklist](Website_Visual_Excellence_Master_Checklist.md)

<design_plan>

Python sampling with seed 1132 produced the following.

```text
Hero: Editorial split
Typography: Cabinet Grotesk. Modules: inline typography images, horizontal accordion, marquee
Motion: card stacking, scrubbing text reveals
```

The brief specifies EB Garamond and Lato, the existing navigation, and a single hero. Apply the editorial split through the left-aligned copy and right-weighted architectural focal point on the shared full-bleed image. The layered entrance and short scroll scrub fit the requested scope. The existing page carries the later interest, desire, and action sections. Its benchmarks, release, residences, and enquiry remain linked from the hero and navigation.

Use two deliberate headline lines in a block up to 12ch wide, with a fluid size down to 320px. Verify wrapping and contrast on the parchment, moving peel, and final image. Give the open composition to the film, project name, campaign headline, and two direct actions.

</design_plan>

## Four-second picture handoff

The 24 fps source still shows the hand and parchment at frame 96, 4.000 seconds. The scene clears around the fifth second. The supplied still also differs from the clean end of the video in framing, grading, and fine detail. Directly substituting the still at 4.000 seconds would create a visible cut.

1. Reframe and retime a dedicated 1080p edit from the source footage so the peel clears before the four-second boundary. Register the video backdrop to the supplied image and use the supplied render as the clean area revealed by the moving paper. Preserve the hand, paper, and edge shadow from the source with a spatial matte.
2. End both video encodes on the same plate used by the live image. Inspect adjacent frames, including a desktop and portrait crop. Compare the decoded final video frame to the optimized still in the same color space. Keep the original still and full-length video as source assets.
3. Stop playback through the exact four-second media duration. Pre-decode the final still, then remove the video layer and reveal the still in the same browser update. Share cover sizing, responsive focal point, scene transform, and scrim. If decoding the still takes longer, the video holds its matching last frame until the image is ready.
4. Let the opening poster cover the first decode. Offer the final still on reduced motion, data saving, unsupported playback, or a definitive media error. Keep navigation available while the entrance runs. Guests arriving at a section link can go there immediately.

## Navigation and entrance

- Reuse the existing `.lg` hosts, `HostGlass` adapter, pill, moving thumb, and hamburger destinations. Restore the thumb to the active link when interaction leaves the pill. Give the expanded panel a short opening and retracting motion anchored at the hamburger, with keyboard escape, outside-click dismissal, and correct focus.
- Feed the optical clones the same imagery and crop as the hero. During the film, sample the active decoded frame into small canvases belonging to the lenses. The opening and closing stills are ordinary shared image layers. One video decoder serves the hero.
- Choreograph a short GSAP entrance with paper sides and a small depth move on the scene. Reveal the live headline and actions as the aperture opens. A restrained ScrollTrigger scrub adds depth as the visitor leaves the hero. The four-second cut uses the media clock independently of these effects. Honor reduced motion and leave the first links usable from initial paint.
- Replace the previous startup overlay and hero-specific time slider and warning card. Route navigation and enquiry actions to the current sections and modal. Synchronize the production and named landing pages byte-for-byte.

## Implementation details

- The capture contains 128 frames at 32 fps, an even 4/3 retime of the first 128 source frames. The 1080p WebM weighs 2.67 MB. The H.264 fallback is 4.46 MB.
- The plate in the last three frames is the optimized WebP reproduced from the supplied Golden-Hour PNG. Registration uses facade and landscape features shared with the source. A frame-by-frame foreground matte draws on differences from a clean reference assembled from late source frames. The image and film share a crop and parallax transform in the page.
- The film controls its own end. GSAP opens the aperture and settles the hero copy in the first 1.2 seconds. The entrance can complete immediately on keyboard focus or scrolling, and the compositor samples the video only while it is playing.
- Assets and dependencies for the opening live under `assets/hero/`. The older section fonts load once the hero has initialized. Glass hosts in later sections initialize as they approach the viewport.

## Verification

- Check the hero film starts with the drawing, clears the hand and paper, reaches exactly four seconds, and matches the still in decoded-frame and before/after browser comparisons.
- Inspect the opening, mid-peel, and settled hero on desktop and mobile. Verify composition, legibility, visible focus, 320px wrapping, and the absence of horizontal overflow.
- Use a real browser to check the glass scene and thumb, open and retract the menu, follow section links, open and dismiss the enquiry, and exercise reduced-motion and failed-media paths.
- Verify the finished media sizes and both landing-page entry points.

### Results

- FFprobe confirmed 1920 × 1080 resolution, 128 frames, and 4.000 seconds in both encodes. Chrome reached the same media timestamp, including in an uninterrupted run with the optional remote fonts unavailable.
- Compared the last displayed video frame with the still in Chrome at 1440 × 900 and 390 × 844. Both layers occupied the same rectangle. The photographed area differed on average by 1.7 of 255 per RGB channel on desktop and 6.5 at 1× mobile density. Aligning the mobile rectangle to device pixels reduced the latter from 9.8. The remaining difference is most apparent in fine texture at 1× density.
- The menu passed desktop keyboard and mobile touch checks. Refraction sampled the playing film and switched to the still with the scene. The active nav thumb returned after hover, and the enquiry restored focus to the triggering control. The hero and expanded menu passed the scoped axe checks.
- Checked the responsive headline and actions at 320, 390, 720, 768, 1024, and 1440 pixels. Tested reduced motion, data saving, failed WebM playback, both encodes failing, direct section links, and the no-script action.
- The two landing-page entry points match byte-for-byte. [Production entry](index.html) · [Named entry](Urban_Rise_Landing_Page.html) · [Navigation mappings](button_to_sections.md)
