#!/usr/bin/env tsx
/**
 * Audit Analysis & Report Generator
 *
 * Compares Bienville snapshot with current design system
 * and generates recommendations.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const AUDIT_DIR = join(process.cwd(), 'audit');
const DESIGN_DIR = join(process.cwd(), 'design');

interface Snapshot {
  headerNav: any[];
  inlineLinks: any[];
  footerLinks: any[];
  headerContainer: any;
}

interface DesignTokens {
  colors: any;
  motion: any;
  spacing: any;
  [key: string]: any;
}

interface ButtonSpec {
  variants: any;
}

interface MenuSpec {
  variants: any;
}

function rgbToHex(rgb: string): string {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return rgb;
  const [, r, g, b] = match.map(Number);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function parseTransitionDuration(duration: string): number {
  const match = duration.match(/([\d.]+)s/);
  return match ? Math.round(parseFloat(match[1]) * 1000) : 0;
}

function main() {
  console.log('📊 Analyzing Bienville audit vs. current design system\n');

  // Load files
  const snapshot: Snapshot = JSON.parse(
    readFileSync(join(AUDIT_DIR, 'bienville-snapshot.json'), 'utf-8')
  );
  const tokens: DesignTokens = JSON.parse(
    readFileSync(join(DESIGN_DIR, 'tokens.json'), 'utf-8')
  );
  const buttonSpec: ButtonSpec = JSON.parse(
    readFileSync(join(DESIGN_DIR, 'components', 'button.json'), 'utf-8')
  );
  const menuSpec: MenuSpec = JSON.parse(
    readFileSync(join(DESIGN_DIR, 'components', 'menu.json'), 'utf-8')
  );

  // Analysis
  const report: string[] = [];
  report.push('# Bienville Capital Design Audit Report\n');
  report.push(`Generated: ${new Date().toISOString()}\n`);
  report.push('---\n\n');

  // Typography Analysis
  report.push('## Typography & Text Styling\n');
  report.push('### Header Navigation Links (Team, About)\n');
  const headerLink = snapshot.headerNav[0]?.computed;
  if (headerLink) {
    report.push('| Metric | Bienville | Current | Recommendation |\n');
    report.push('|--------|-----------|---------|----------------|\n');
    report.push(`| Font Family | ${headerLink.fontFamily} | System UI (no token) | Add Benton Sans Med or system fallback |\n`);
    report.push(`| Font Weight | ${headerLink.fontWeight} | 800 (VideoPrimary) | Keep 800 for CTAs; use 500 for nav |\n`);
    report.push(`| Font Size | ${headerLink.fontSize} | No nav token | Add 12px token |\n`);
    report.push(`| Letter Spacing | ${headerLink.letterSpacing} | No tracking token | Add 1px tracking |\n`);
    report.push(`| Text Transform | ${headerLink.textTransform} | uppercase ✓ | Match |\n`);
    report.push(`| Line Height | ${headerLink.lineHeight} | No token | Add 12px (1:1 ratio) |\n\n`);
  }

  // Color Analysis
  report.push('## Color & Theme\n');
  report.push('### Observed Colors\n');
  report.push('| Element | Color | RGB | Hex | Usage |\n');
  report.push('|---------|-------|-----|-----|-------|\n');
  const navColor = headerLink?.color;
  if (navColor) {
    report.push(`| Header Nav | ${navColor} | ${navColor} | ${rgbToHex(navColor)} | Primary brand color |\n`);
  }
  const hoverColor = snapshot.headerNav[0]?.hover?.['color'];
  if (hoverColor) {
    report.push(`| Nav Hover | ${hoverColor} | ${hoverColor} | ${rgbToHex(hoverColor)} | Darker brand shade |\n`);
  }
  const footerText = snapshot.footerLinks[0]?.computed?.color;
  if (footerText) {
    report.push(`| Footer Text | ${footerText} | ${footerText} | ${rgbToHex(footerText)} | Light on dark |\n`);
  }
  report.push('\n');

  report.push('**Current Tokens:**\n');
  report.push(`- \`colors.on.bg\`: ${tokens.colors.on.bg} (white)\n`);
  report.push(`- \`colors.on.bgSecondary\`: ${tokens.colors.on.bgSecondary} (semi-transparent white)\n\n`);

  report.push('**Recommendations:**\n');
  report.push('- Bienville uses a **blue brand color** (rgb(23, 121, 186) / #1779BA) for nav links on light backgrounds\n');
  report.push('- Current VVP system uses white on dark. **No change needed** for dark theme.\n');
  report.push('- If adding light theme: introduce `colors.brand.primary` and `colors.brand.primaryHover`\n\n');

  // Spacing & Layout
  report.push('## Spacing & Layout\n');
  report.push('### Button/Link Padding\n');
  if (headerLink) {
    const [pLeft] = headerLink.paddingInline.split(' ');
    const [pTop, pBottom] = headerLink.paddingBlock.split(' ');
    report.push(`- **Bienville nav buttons**: \`${pTop} ${pLeft}\` → ~18px/19px\n`);
    report.push(`- **Current VideoPrimary**: \`spacing.sm spacing.md\` → 8px 12px\n`);
    report.push(`- **Recommendation**: Increase to \`spacing.md spacing.lg\` (12px 16px) or introduce \`spacing.navButton\` = 18px/19px\n\n`);
  }

  // Interactions & Motion
  report.push('## Interactions & Motion\n');
  report.push('### Transition Durations\n');
  report.push('| Element | Bienville | Current | Recommendation |\n');
  report.push('|---------|-----------|---------|----------------|\n');

  const navTransition = headerLink?.transitionDuration;
  const navDurationMs = parseTransitionDuration(navTransition || '0s');
  report.push(`| Header Nav | ${navTransition} (${navDurationMs}ms) | motion.dur.base (200ms) | Increase to 300ms or create motion.dur.navHover |\n`);

  const footerTransition = snapshot.footerLinks[0]?.computed?.transitionDuration;
  const footerDurationMs = parseTransitionDuration(footerTransition || '0s');
  report.push(`| Footer Links | ${footerTransition} (${footerDurationMs}ms) | motion.dur.base (200ms) | Increase to 300ms |\n\n`);

  report.push('### Transition Easing\n');
  const navEasing = headerLink?.transitionTimingFunction || 'ease';
  report.push(`- **Bienville**: \`${navEasing}\` (standard CSS ease)\n`);
  report.push(`- **Current**: \`${tokens.motion.ease.standard}\` and \`${tokens.motion.ease.emphasis}\`\n`);
  report.push(`- **Recommendation**: Current easing is more refined. Keep \`emphasis\` for buttons/nav.\n\n`);

  // Underline & Decoration
  report.push('## Text Decoration (Underlines)\n');
  report.push('### Current State\n');
  report.push('- **Bienville**: No underline by default; color change on hover (no underline observed)\n');
  report.push('- **Current VideoPrimary**: `textDecorationHover: "underline"` (underline appears on hover)\n\n');

  report.push('### Observations\n');
  const navDecoration = headerLink?.textDecorationLine;
  report.push(`- Bienville nav: \`textDecorationLine: ${navDecoration}\`\n`);
  report.push(`- Bienville nav hover: **color change only** (no underline)\n`);
  report.push(`- Footer links: **opacity change on hover** (\`opacity: 0.7\`)\n\n`);

  report.push('**Recommendation**:\n');
  report.push('- Remove underline-on-hover for nav/menu items\n');
  report.push('- Use **color shift** or **opacity reduction** instead\n');
  report.push('- Keep underline for inline content CTAs if desired (or follow Bienville: no underline, color only)\n\n');

  // Header Container
  report.push('## Header/Navigation Container\n');
  if (snapshot.headerContainer) {
    const nav = snapshot.headerContainer.computed;
    report.push('| Metric | Bienville | Current Menu | Notes |\n');
    report.push('|--------|-----------|--------------|-------|\n');
    report.push(`| Background | ${nav.backgroundColor} | colors.glass.bg (rgba(20,22,26,0.38)) | Bienville uses very light transparent white |\n`);
    report.push(`| Backdrop Blur | ${nav.backdropFilter} | blur(18px) saturate(140%) | Bienville uses 10px; current is stronger |\n`);
    report.push(`| Padding | ${nav.padding} | Varies by component | Bienville nav has no padding (buttons have margin) |\n\n`);

    report.push('**Recommendations**:\n');
    report.push('- Current glassmorphism is **darker and more saturated** than Bienville (which is very subtle)\n');
    report.push('- If aligning to Bienville: reduce blur to 10px, use lighter bg (rgba(255,255,255,0.05))\n');
    report.push('- **OR** keep current dark glass aesthetic as intentional departure (VVP is darker theme)\n\n');
  }

  // Summary
  report.push('---\n\n');
  report.push('## Summary of Proposed Changes\n\n');

  report.push('### Tokens (`/design/tokens.json`)\n');
  report.push('1. **Typography**: Add letter-spacing token for nav/CTAs: `letterSpacing.nav = "1px"`\n');
  report.push('2. **Motion**: Increase transition duration: `motion.dur.base = 300` (from 200ms)\n');
  report.push('3. **Spacing**: Optionally add `spacing.navButton = 18` for tighter parity\n\n');

  report.push('### Button Component (`/design/components/button.json`)\n');
  report.push('1. **VideoPrimary**: Remove `textDecorationHover: "underline"` → use color/opacity shift\n');
  report.push('2. **VideoPrimary**: Add `letterSpacing: "1px"` for uppercase tracking\n');
  report.push('3. **VideoPrimary**: Adjust padding if needed (currently 8px 12px; Bienville ~18px 19px)\n');
  report.push('4. **Ghost**: Similar adjustments (no underline, add letter-spacing)\n\n');

  report.push('### Menu Component (`/design/components/menu.json`)\n');
  report.push('1. **Styles**: Keep current glassmorphism (intentional dark aesthetic)\n');
  report.push('2. **Transition**: Update to `motion.dur.base` (now 300ms)\n');
  report.push('3. **Menu items**: Ensure no underline on hover (color shift only)\n\n');

  report.push('### Video Player\n');
  report.push('- No changes needed (interaction timing will inherit updated `motion.dur.base`)\n\n');

  report.push('---\n\n');
  report.push('## Uncertainties & Notes\n');
  report.push('- **Font**: Bienville uses "Benton Sans Med". Not loaded in audit (likely CORS). Current system has no font token. Recommend adding system UI stack or webfont.\n');
  report.push('- **Glass effect**: Bienville nav has very subtle blur (10px) vs. VVP\'s stronger effect (18px + saturate). This is a **stylistic choice**—VVP\'s dark theme warrants the stronger glass.\n');
  report.push('- **Color palette**: Bienville is **light theme with blue accents**. VVP is **dark theme with white/cyan accents**. Recommend keeping VVP palette but adopting interaction patterns (timing, no-underline, letter-spacing).\n\n');

  report.push('---\n\n');
  report.push('## Verification Checklist\n');
  report.push('After applying changes:\n');
  report.push('- [ ] Nav buttons use 1px letter-spacing\n');
  report.push('- [ ] Hover transitions are 300ms\n');
  report.push('- [ ] No underline on nav/button hover (color shift only)\n');
  report.push('- [ ] Padding/spacing matches visual density (optional: increase to 16px/18px)\n');
  report.push('- [ ] Glass panel retains current blur/saturation (intentional)\n');
  report.push('- [ ] Run `/scripts/verify-design-audit.ts` to validate token paths\n');

  // Write report
  const reportPath = join(AUDIT_DIR, 'report.md');
  writeFileSync(reportPath, report.join(''));
  console.log(`✅ Report generated: ${reportPath}\n`);
}

main();
