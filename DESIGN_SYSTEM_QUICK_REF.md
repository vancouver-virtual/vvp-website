# VVP Design System - Quick Reference

**🚨 Before writing any UI code, import and use tokens from `/design/tokens.json`**

---

## Token Import Pattern

```typescript
import tokens from '@/design/tokens.json';
```

---

## Colors

| Token | Value | Usage |
|-------|-------|-------|
| `colors.bg.base` | `#0A0B0D` | Main background |
| `colors.on.bg` | `#FFFFFF` | Primary text |
| `colors.on.bgSecondary` | `rgba(255,255,255,0.78)` | Secondary text |
| `colors.glass.bg` | `rgba(20,22,26,0.38)` | Glass panel background |
| `colors.glass.border` | `rgba(255,255,255,0.18)` | Glass panel border |
| `colors.glass.highlight` | `rgba(255,255,255,0.06)` | Hover highlight |
| `colors.focus.ring` | `#7DD3FC` | Keyboard focus |
| `colors.divider.subtle` | `rgba(255,255,255,0.12)` | Divider lines |

**Rule:** Never hard-code hex/rgb values

---

## Typography

| Token | Value | Usage |
|-------|-------|-------|
| `typography.letterSpacing.nav` | `1px` | **ALL uppercase text** |
| `typography.letterSpacing.tight` | `0px` | Normal text |
| `typography.letterSpacing.wide` | `2px` | Display/hero text |

**Rule:** All uppercase text MUST use 1px letter-spacing

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `spacing.xs` | `4` | Tiny gaps |
| `spacing.sm` | `8` | Small padding |
| `spacing.md` | `12` | Medium padding |
| `spacing.lg` | `16` | Large padding |
| `spacing.xl` | `24` | Extra large |
| `spacing.2xl` | `32` | Section spacing |
| `spacing.3xl` | `48` | Major sections |

**Common patterns:**
- Button padding: `${spacing.sm} ${spacing.md}` (8px 12px)
- Container gaps: `spacing.md` or `spacing.lg`

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radii.sm` | `6` | Small corners |
| `radii.md` | `12` | Medium corners |
| `radii.lg` | `16` | Large corners |
| `radii.pill` | `999` | Fully rounded (buttons) |

---

## Motion & Timing

| Token | Value (ms) | Usage |
|-------|------------|-------|
| `motion.dur.fast` | `120` | Quick feedback |
| `motion.dur.base` | `200` | **Standard hover/transitions** |
| `motion.dur.slow` | `320` | Panel slides, complex animations |

**Easing:**
- `motion.ease.standard` → `cubic-bezier(0.2, 0.8, 0.2, 1)`
- `motion.ease.emphasis` → `cubic-bezier(0.2, 0.95, 0.1, 1)` (for buttons/menu)

**Rule:** Never use `ease`, `ease-in`, `ease-out`, `linear` directly

---

## Z-Index Layers

| Token | Value | Usage |
|-------|-------|-------|
| `z.videoBg` | `0` | Background video |
| `z.content` | `10` | Main content |
| `z.scrim` | `20` | Overlay/backdrop |
| `z.menu` | `30` | Menu panel |
| `z.fsControls` | `40` | Fullscreen controls |
| `z.toasts` | `100` | Notifications |

**Rule:** Always use token-based z-index, never arbitrary numbers

---

## Glassmorphism Pattern

```typescript
{
  background: tokens.colors.glass.bg,
  backdropFilter: `blur(${tokens.blur.glass}px) saturate(140%)`, // 18px
  border: `1px solid ${tokens.colors.glass.border}`,
  boxShadow: tokens.elevation.e2,
}
```

**Rule:** Always use saturate(140%) with blur for VVP's dark aesthetic

---

## Button Styles (VideoPrimary)

```typescript
{
  textTransform: 'uppercase',
  fontWeight: 800,
  letterSpacing: tokens.typography.letterSpacing.nav, // 1px ✓
  color: tokens.colors.on.bg,
  padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
  borderRadius: tokens.radii.pill,
  transition: `all ${tokens.motion.dur.base}ms ${tokens.motion.ease.emphasis}`,

  '&:hover': {
    opacity: 0.85, // NOT textDecoration: 'underline' ✗
  },

  '&:focus-visible': {
    outline: `2px solid ${tokens.colors.focus.ring}`,
    outlineOffset: '2px',
  },
}
```

---

## Hover Interaction Rules

### ✅ DO (VVP Pattern)
```typescript
'&:hover': {
  opacity: 0.85,           // Opacity fade
  color: 'rgba(...)',      // Color shift
  background: 'rgba(...)', // Background shift
}
```

### ❌ DON'T (Not VVP Pattern)
```typescript
'&:hover': {
  textDecoration: 'underline', // ✗ NO UNDERLINES
  borderBottom: '1px solid',   // ✗ NO UNDERLINES
}
```

**Rationale:** Based on Bienville Capital audit—VVP uses opacity/color shifts, not underlines

---

## Common Mistakes

| ❌ Wrong | ✅ Correct |
|---------|----------|
| `fontSize: '12px'` | `fontSize: tokens.typography.size.nav` |
| `letterSpacing: '1px'` | `letterSpacing: tokens.typography.letterSpacing.nav` |
| `padding: '8px 12px'` | `padding: \`${tokens.spacing.sm} ${tokens.spacing.md}\`` |
| `transition: 'all 200ms ease'` | `transition: \`all ${tokens.motion.dur.base}ms ${tokens.motion.ease.emphasis}\`` |
| `zIndex: 50` | `zIndex: tokens.z.menu` |
| `'&:hover': { textDecoration: 'underline' }` | `'&:hover': { opacity: 0.85 }` |
| `TEXT TRANSFORM` (no letter-spacing) | `TEXT TRANSFORM` + `letterSpacing: '1px'` ✓ |

---

## Validation

**After any UI changes:**
```bash
npx tsx scripts/verify-design-audit.ts
```

**Checks:**
- ✓ All token paths are valid
- ✓ Motion durations match design intent
- ✓ Letter-spacing applied to uppercase
- ✓ No underline hovers

---

## When You Need a New Value

1. **Don't hard-code it** ❌
2. **Add to `/design/tokens.json`** first
3. **Then use the new token** ✅
4. **Run verification** to confirm

---

## Files to Reference

- [/design/tokens.json](design/tokens.json) - All tokens
- [/design/components/button.json](design/components/button.json) - Button variants
- [/design/components/menu.json](design/components/menu.json) - Menu specs
- [/audit/report.md](audit/report.md) - Design rationale
- [/.claude/instructions.md](.claude/instructions.md) - Full rules

---

**Print this and keep it visible while coding! 🎯**

**Last Updated:** 2025-10-03
