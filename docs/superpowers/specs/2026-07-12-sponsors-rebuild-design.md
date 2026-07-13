# Sponsors Section Rebuild — Design Spec

**Date:** 2026-07-12
**Status:** Approved

## Problem

The Sponsors section renders each sponsor as part of a single pre-composited PNG:

- Body grid: `wp-content/uploads/2023/12/sponsors-v3.png` (2254×1274, 3-col grid)
- Footer strip: `wp-content/uploads/2023/12/footer-sponsors-v3.png` (6007×475)

Both have ~6 resized `srcset` variants each. Because logos are baked into these
images, any sponsor change requires image editing plus regenerating every
resized variant. Two current sponsors are no longer active (maxon, Mastercam)
and one must be added (SendCutSend), which is impossible without re-compositing.

## Goal

Replace the baked composites with individual per-sponsor logo files laid out in
HTML/CSS, so future sponsor changes are a one-line HTML edit plus a dropped file.

## Current sponsor roster (7)

1. Irvine Electro-Optics
2. Saddleback College
3. Protospace MFG
4. Dassault Systèmes (SolidWorks)
5. Altium
6. bild
7. SendCutSend  *(new)*

Removed: maxon, Mastercam.

## Design decisions

- **Presentation:** floating transparent logos directly on the dark section
  background (preserves current aesthetic). Not white "cards".
- **Legibility:** the section sits on a dark hero image, so dark logos need
  white/knockout variants.

| Sponsor | Asset | Finish |
|---|---|---|
| Irvine Electro-Optics | crop from existing composite | white (already) |
| Saddleback College | from composite | red/white (already reads on dark) |
| Protospace MFG | recolor its logo to white | white knockout |
| Dassault Systèmes | from composite | blue (reads on dark) |
| Altium | from composite | white (already) |
| bild | provided by user | white wordmark |
| SendCutSend | official brand kit (horiz + laser) | white |

## Implementation

- New folder: `wp-content/uploads/sponsors/` — one PNG per sponsor.
- **Body** (`index.html`, the `sponsors-v3.png` image block): replace with a
  `flex-wrap` container of 7 `<img>` tags, centered; wraps 3→3→1 with the last
  row auto-centered.
- **Footer** (`footer-sponsors-v3.png` block): replace with the same 7 logos as a
  single horizontal strip, referencing the identical files (DRY).
- Scoped `<style>` block: uniform logo heights (~90px body / ~55px footer),
  `width:auto`, consistent gaps, responsive shrink on narrow screens.
- Old composite PNGs and their `srcset` variants: left in place, unused
  (harmless); removal optional and deferred.

## Non-goals

- No white-card treatment.
- No changes to other page sections.
- No deletion of the old composite image files in this change.

## Success criteria

- All 7 logos render legibly on the dark background, aligned and evenly spaced.
- Section wraps gracefully on mobile.
- maxon and Mastercam no longer appear anywhere on the page.
- Adding/removing a future sponsor requires only an `<img>` line + a file.
