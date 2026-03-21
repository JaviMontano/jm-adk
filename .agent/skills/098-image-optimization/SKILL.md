---
name: image-optimization
description: WebP/AVIF format selection, responsive images with srcset, lazy loading, and Firebase Storage image resize extension
version: 1.0.0
status: production
owner: Javier Montaño
tags: [performance, images, webp, avif, srcset, lazy-loading, firebase-storage]
---

# 098 — Image Optimization {Performance}

## Purpose
Minimize image payload while maintaining visual quality. Serve the optimal format, size, and resolution for each device and viewport through modern formats, responsive images, and automated processing.

## Physics — 3 Immutable Laws

1. **Law of Format Efficiency**: AVIF > WebP > JPEG > PNG for photographic content. Always serve the most efficient format the browser supports.
2. **Law of Right-Sizing**: Never serve a 2000px image to a 375px viewport. Responsive images deliver the exact resolution needed.
3. **Law of Deferred Loading**: Images below the fold are lazy-loaded. Only above-the-fold hero images load eagerly. The browser decides when to fetch the rest.

## Protocol

### Phase 1 — Format Pipeline
1. Source images stored as high-quality originals (JPEG/PNG) in Firebase Storage.
2. Install Firebase Extension: `storage-resize-images` — auto-generates resized variants.
3. Configure sizes: `[320, 640, 960, 1280, 1920]` widths. Formats: `[webp, avif]`.
4. Build-time alternative: `sharp` or `squoosh` CLI for static assets in `public/`.

### Phase 2 — Responsive Image Markup
1. Use `<picture>` element with `<source>` for format selection:
   ```
   <picture>
     <source srcset="img.avif" type="image/avif">
     <source srcset="img.webp" type="image/webp">
     <img src="img.jpg" alt="description">
   </picture>
   ```
2. Add `srcset` with width descriptors: `srcset="img-320.webp 320w, img-640.webp 640w"`.
3. Add `sizes` attribute: `sizes="(max-width: 768px) 100vw, 50vw"`.
4. Set explicit `width` and `height` attributes to prevent CLS.

### Phase 3 — Loading Strategy
1. Above-the-fold images: `loading="eager"`, `fetchpriority="high"`, preload in `<head>`.
2. Below-the-fold images: `loading="lazy"`, `decoding="async"`.
3. Background images: use `IntersectionObserver` for lazy loading CSS backgrounds.

## I/O

| Input | Output |
|-------|--------|
| Original image (JPEG/PNG) | Resized variants (320-1920px) in WebP + AVIF |
| Firebase Storage upload | Auto-generated resized images via extension |
| Image component | `<picture>` with srcset, sizes, lazy loading |
| Build pipeline | Optimized static images in `dist/` |

## Quality Gates — 5 Checks

1. **No images > 200KB** served to any device — resize or compress further.
2. **WebP/AVIF served** to supporting browsers — `<picture>` fallback for others.
3. **All images have `width`/`height`** — prevents CLS.
4. **Below-fold images lazy-loaded** — `loading="lazy"` present.
5. **Hero image preloaded** — `<link rel="preload">` in document head.

## Edge Cases

- **SVG images**: Don't convert SVGs to raster. Optimize with `svgo` instead.
- **User-uploaded images**: Process via Firebase Extension on upload — never serve originals.
- **Animated images**: Use `<video>` for animations instead of GIF. MP4 is 90% smaller.
- **High-DPI displays**: Serve 2x images for Retina (`srcset` with density descriptors).

## Self-Correction Triggers

- LCP image slow → check if preloaded, verify CDN cache, reduce image size.
- CLS from images → add missing `width`/`height` attributes.
- Storage costs rising → audit image sizes, remove unused resized variants.
- AVIF not serving → verify `<picture>` source order (AVIF before WebP).
