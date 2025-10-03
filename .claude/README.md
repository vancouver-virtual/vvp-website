# Claude Code Configuration for VVP

This directory contains instructions and rules that Claude Code will automatically follow when working in this project.

## Files

### `instructions.md`
**Purpose:** Enforces design system compliance for all UI code changes.

**What it does:**
- Requires reading `/design/` files before writing UI code
- Enforces token-based values (no hard-coding)
- Documents interaction patterns (opacity hover, 1px letter-spacing, etc.)
- Provides quick reference for common patterns
- Lists validation steps

**When it's used:**
- Automatically loaded when Claude Code starts
- Referenced when writing components
- Checked before submitting code changes

### `../.claudeignore`
**Purpose:** Prevents Claude from modifying certain files/directories.

**What it ignores:**
- `node_modules/`, `.next/`, build outputs
- OS and IDE files
- Log files

## How It Works

Claude Code automatically:
1. Reads `.claude/instructions.md` at session start
2. Follows the rules when writing code
3. References design tokens from `/design/tokens.json`
4. Validates against component specs in `/design/components/*.json`

## For Developers

### When You See Claude Enforcing Design Rules

If Claude refuses to hard-code a value or insists on using tokens, it's following `.claude/instructions.md`. This is **intentional** and ensures design system consistency.

### Updating Instructions

To modify Claude's behavior:
1. Edit `.claude/instructions.md`
2. Update design system rules as needed
3. Claude will pick up changes in the next session

### Temporarily Overriding

If you need to bypass design rules for prototyping:
- Explicitly tell Claude: "ignore design system for this prototype"
- Remember to refactor before production

## Design System Enforcement

### What Claude Will Check

✅ **Automatic checks:**
- Token references (not hard-coded values)
- Letter-spacing on uppercase text
- Opacity/color hover effects (not underlines)
- Motion timing uses token-based durations
- Z-index uses token-based layers

❌ **Will reject:**
- Hard-coded colors, spacing, timing
- Underline hover effects
- Arbitrary z-index values
- Non-token easings (ease, linear, etc.)
- Missing letter-spacing on uppercase

### Verification

Run after changes:
```bash
npx tsx scripts/verify-design-audit.ts
```

## Related Files

- `/design/tokens.json` - Design tokens source of truth
- `/design/components/*.json` - Component specifications
- `/design/components/*.md` - Component documentation
- `/audit/report.md` - Design audit rationale
- `/scripts/verify-design-audit.ts` - Validation script

## Example: Claude Following Rules

**User:** "Add a button with hover underline"

**Claude Response:**
> "I'll create a button using the VideoPrimary variant from the design system. Note: VVP uses opacity fade on hover (not underline) per the design audit. Here's the code using tokens..."

```typescript
// Claude will write this (using tokens, opacity hover)
<button style={{
  letterSpacing: tokens.typography.letterSpacing.nav,
  transition: `all ${tokens.motion.dur.base}ms ${tokens.motion.ease.emphasis}`,
}}>
  Click Me
</button>

// NOT this (hard-coded, underline hover)
<button style={{
  letterSpacing: '1px',
  transition: 'all 200ms ease',
  '&:hover': { textDecoration: 'underline' }
}}>
```

---

**Last Updated:** 2025-10-03
**Purpose:** Enforce design system compliance automatically
**Benefit:** Consistent UI without manual review
