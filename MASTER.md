# Kopi SEA — MASTER design system

Source of truth for every token. Code reads from `src/index.css`; nothing in components invents a value.

## Validated theses (mode: preserve brand)

**Visual.** Preserving the existing "sea" logo and cobalt palette, Kopi SEA is a night-shift interface: ink-black sections with chrome-lit product alternate with cool paper sections, cobalt as the only accent. Display face Unbounded 900 (round, wide, rhymes with the "sea" wordmark), one italic word per headline in Instrument Sans italic (as on their Instagram posters), prices and hours in DM Mono. Airy 8px base, 20px radius frames with 1px rules, flat, no shadows, no glass.

**Interaction.** 120 ms press, 200 ms hover, 700 ms one-time section entrances with 70 ms line stagger, `cubic-bezier(0.2, 0, 0, 1)`. Scroll drives two scenes only: the pinned dial (scrub 0.6) and three-layer hero parallax. Reduced motion becomes a 200 ms cross-fade. Forbidden: bounce on ordinary UI, animating layout properties, auto-advancing carousels, any loop except the hero cup float.

**Allowed patterns:** mono labels (price, hours, category), 1px hairlines, dark/light section alternation, hover line draw, hero cup float (±8 px, 9 s), "open now" indicator from the real hours.

## Dials
| Dial | Value | Clause |
|---|---|---|
| variance | 6 | alternating dark/light, asymmetric hero, regular grids elsewhere |
| motion | 6 | one orchestrated entrance per section, two scroll scenes |
| density | 3 | "airy 8px base" |

## Tokens
### Color (primitive)
| Token | Hex | Notes |
|---|---|---|
| cobalt | `#0f3bb4` | sampled by eye from Instagram screenshots, confirm with brand file |
| ink | `#0A0D18` | blue-biased near-black |
| paper | `#F3F5FB` | cool off-white (their posts use cool white, not cream) |
| steel | `#AEB9D0` | chrome highlights, secondary text on ink |
| glow | `#7C97FF` | cobalt's stand-in for text/lines on ink |
| night | `#11162A` | raised panel on ink |

Contrast: white on cobalt 9.68, cobalt on paper 8.88, glow on ink 7.13, paper on ink 17.78, steel on ink 9.83. **Cobalt on ink is 2.0: fills only, never text or lines.**

### Color (semantic)
`surface`, `on-surface`, `muted`, `line`, `accent` flip with theme. Light: paper / ink / `#4A5575` / `#C9D1E6` / cobalt. Dark: ink / paper / `#9AA6C4` / `#232A44` / glow.

### Type
| Role | Face | Use |
|---|---|---|
| display | Unbounded Variable 800–900 | headlines, tracking −0.03em, leading 1.02 |
| body | Instrument Sans Variable 400–700 (+ italic) | copy, italic accent word |
| mono | DM Mono 400/500 | price, hours, labels, uppercase, +0.08em |

Fonts are self-hosted through Fontsource with `font-display: swap`. Fallbacks: `"Arial Black"` (display), `system-ui` (body), `ui-monospace` (mono). Not checked: Unbounded's weight 900 on very small sizes; headlines are never below 20 px.

### Spacing (8px base)
8 · 16 · 24 · 32 · 48 · 64 · 96 · 128. Section padding 96/128 on desktop, 64 on phone. Side gutter ≥16px.

### Radius
8 (chips) · 20 (frames, cards) · 999 (pills, buttons).

### Elevation
None. Separation by 1px rules and ground change.

### Motion
| Token | Value |
|---|---|
| `--ease-out` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--dur-press` | 120 ms |
| `--dur-hover` | 200 ms |
| `--dur-enter` | 700 ms |
| `--stagger` | 70 ms |
| scrub | 0.6 |
| reduced | opacity 200 ms linear |

## Base components
Button (pill, cobalt fill + white text on light; glow fill + ink text on dark), Card (20 px frame, 1px line, mono price), Pill tag, Mono label.
States: default / hover / focus-visible (2 px accent outline, 3 px offset) / active (scale 0.97) / disabled (50% opacity, no pointer).

## Dataset filter (ui-ux-pro-max proposal)
Kept: bold block-based contrast, large type (32px+), 48px+ section gaps, visible opening hours, focus and 375/768/1024/1440 checklist.
Dropped: brown/cream palette (coffee reflex, fights the brand), Varela Round + Nunito (children's mood), `back.out` stagger (thesis forbids bounce).
`tells` filter: no founding-year badge, no fake counters, no section codes, no invented testimonials, no fake photo credits. Receipt card shows real menu items only, marked as an example.
