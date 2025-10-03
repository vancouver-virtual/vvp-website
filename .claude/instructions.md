# Claude Code Instructions for VVP Project

## Design System Compliance

**CRITICAL: Always respect and enforce the design system in `/design/`**

### Before Writing Any UI Code

1. **Read the design system files:**
   - `/design/tokens.json` - All design tokens (colors, spacing, motion, typography)
   - `/design/components/*.json` - Component specifications
   - `/design/components/*.md` - Component documentation

2. **Use token references, never hard-coded values:**
   ```typescript
   // ❌ WRONG - Hard-coded values
   const button = { fontSize: '12px', letterSpacing: '1px', padding: '8px 12px' }

   // ✅ CORRECT - Token references
   const button = {
     fontSize: tokens.typography.size.nav,
     letterSpacing: tokens.typography.letterSpacing.nav,
     padding: `${tokens.spacing.sm} ${tokens.spacing.md}`
   }
   ```

3. **Follow component variants exactly:**
   - Check `/design/components/[component].json` for variants
   - Use the exact styles defined in the variant
   - Don't add new variants without updating the spec first

### Design Token Rules

#### Colors
- Use `colors.on.bg` for primary text on dark backgrounds (#FFFFFF)
- Use `colors.on.bgSecondary` for secondary text (rgba(255,255,255,0.78))
- Use `colors.glass.*` for glassmorphism panels
- Use `colors.focus.ring` for keyboard focus indicators (#7DD3FC)
- Never use hard-coded hex/rgb values

#### Typography
- Use `typography.letterSpacing.nav` (1px) for ALL uppercase text
- Font weights: 800 for bold CTAs, 500 for nav items
- Text transform: uppercase for buttons and nav items

#### Spacing
- Use `spacing.xs` through `spacing.3xl` (4px to 48px scale)
- Common patterns:
  - Button padding: `spacing.sm spacing.md` (8px 12px)
  - Container gaps: `spacing.md` or `spacing.lg`
  - Section margins: `spacing.2xl` or `spacing.3xl`

#### Motion & Transitions
- Duration: `motion.dur.fast` (120ms), `motion.dur.base` (200ms), `motion.dur.slow` (320ms)
- Easing: `motion.ease.standard` or `motion.ease.emphasis` (never use `ease`, `linear`, etc.)
- **Pattern:** Use 200ms (base) for button/link hovers

#### Interactions
- **Hover states:**
  - Buttons: Opacity fade to 0.85 (NOT underline)
  - Menu items: Color shift or opacity fade (NOT underline)
  - Duration: `motion.dur.base` (200ms)
- **Focus states:**
  - Always show focus ring using `colors.focus.ring`
  - Ring width: 2px
  - Offset: 2px from element
- **Active states:**
  - Slight opacity reduction or background color shift

### Component Guidelines

#### Button Component
From `/design/components/button.json`:

**VideoPrimary variant:**
```typescript
{
  textTransform: 'uppercase',
  fontWeight: 800,
  letterSpacing: tokens.typography.letterSpacing.nav, // 1px
  color: tokens.colors.on.bg,
  padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
  borderRadius: tokens.radii.pill,
  transition: `all ${tokens.motion.dur.base}ms ${tokens.motion.ease.emphasis}`,
  '&:hover': { opacity: 0.85 }, // NOT textDecoration: 'underline'
}
```

**IconGhost variant:**
- 44×44px minimum (accessibility)
- Circular (radii.pill)
- Transparent background with glass border

**Ghost variant:**
- Pill-shaped with transparent background
- Subtle border and hover effects

#### Menu Component
From `/design/components/menu.json`:

- Width: `menu.width` (420px)
- Header height: `menu.headerHeight` (72px)
- Background: `colors.glass.bg` with `blur.glass` (18px)
- Border: 1px solid `colors.glass.border`
- Slide animation: translateX with `motion.dur.base` and `motion.ease.emphasis`
- Menu items: 1px letter-spacing, opacity/color hover (no underline)

#### Video Player
From `/design/components/video-player.json`:

- Position: absolute, full container
- Z-index: `z.videoBg` (0)
- Object-fit: cover
- Background: `colors.bg.base`

### Glassmorphism Pattern

**VVP uses a dark, saturated glass effect:**
```css
background: colors.glass.bg; /* rgba(20,22,26,0.38) */
backdrop-filter: blur(${blur.glass}px) saturate(140%); /* 18px blur */
border: 1px solid colors.glass.border; /* rgba(255,255,255,0.18) */
box-shadow: elevation.e2; /* 0 10px 40px rgba(0,0,0,0.40) */
```

**Never use:**
- Lighter glass (rgba(255,255,255,...))
- Less blur (< 18px)
- Standard blur without saturate

### Z-Index Layering

Always use token-based z-index:
- `z.videoBg` (0) - Background video
- `z.content` (10) - Main content
- `z.scrim` (20) - Overlay/backdrop
- `z.menu` (30) - Menu panel
- `z.fsControls` (40) - Fullscreen controls
- `z.toasts` (100) - Notifications

### Validation Process

Before submitting any UI code:

1. **Token check:** All values come from `/design/tokens.json`
2. **Component check:** Matches variant in `/design/components/*.json`
3. **Interaction check:**
   - No underline hovers ✓
   - Opacity/color shifts only ✓
   - 1px letter-spacing on uppercase ✓
4. **Motion check:** Uses token-based durations and easings
5. **Accessibility check:**
   - Focus rings present ✓
   - Min 44×44px touch targets ✓
   - Proper ARIA labels ✓

### When to Update the Design System

If you need a value not in the design system:

1. **Don't hard-code it** - Propose a new token
2. **Read the audit report:** Check `/audit/report.md` for rationale
3. **Add to tokens.json** first, then use the token
4. **Update component spec** if creating a new variant
5. **Run verification:** `npx tsx scripts/verify-design-audit.ts`

### Common Mistakes to Avoid

❌ **Don't:**
- Hard-code colors, spacing, or timing values
- Use `textDecoration: 'underline'` on hover
- Use `ease`, `ease-in`, `ease-out` (use token-based cubic-bezier)
- Forget letter-spacing on uppercase text
- Use arbitrary z-index values
- Create light/subtle glass effects (VVP is dark theme)

✅ **Do:**
- Always reference tokens
- Use opacity/color shifts for hover
- Use `motion.ease.emphasis` for buttons/menu
- Add 1px letter-spacing to all uppercase
- Use token-based z-index
- Maintain dark, saturated glass aesthetic

### Running Verification

After making design changes:
```bash
npx tsx scripts/verify-design-audit.ts
```

This checks:
- All token paths are valid
- Motion durations match design intent
- Letter-spacing is applied
- Underline hovers are removed

---

## Quick Reference Card

```typescript
// Import pattern
import tokens from '@/design/tokens.json';

// Common patterns
const buttonStyles = {
  // Typography
  textTransform: 'uppercase',
  letterSpacing: tokens.typography.letterSpacing.nav, // 1px
  fontWeight: 800,

  // Colors
  color: tokens.colors.on.bg,
  backgroundColor: 'transparent',

  // Spacing
  padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,

  // Shape
  borderRadius: tokens.radii.pill,

  // Motion
  transition: `all ${tokens.motion.dur.base}ms ${tokens.motion.ease.emphasis}`,

  // Hover
  '&:hover': {
    opacity: 0.85, // NOT textDecoration
  },

  // Focus
  '&:focus-visible': {
    outline: `2px solid ${tokens.colors.focus.ring}`,
    outlineOffset: '2px',
  },
};
```

---

**Last Updated:** 2025-10-03
**Design Audit:** Based on Bienville Capital analysis (see `/audit/report.md`)
**Verification:** Run `npx tsx scripts/verify-design-audit.ts`
