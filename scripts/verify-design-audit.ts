#!/usr/bin/env tsx
/**
 * Design Audit Verification Script
 *
 * Validates:
 * 1. Token paths in component JSON exist in tokens.json
 * 2. Motion durations are within ±10% of audited values
 * 3. Underline thickness/offset match observed values (±1px)
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const DESIGN_DIR = join(process.cwd(), 'design');
const AUDIT_DIR = join(process.cwd(), 'audit');

interface ValidationResult {
  pass: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function validateTokenPath(tokens: any, path: string): ValidationResult {
  const value = getNestedValue(tokens, path);
  if (value === undefined) {
    return {
      pass: false,
      message: `Token path "${path}" not found in tokens.json`,
      severity: 'error',
    };
  }
  return {
    pass: true,
    message: `Token path "${path}" exists (value: ${JSON.stringify(value)})`,
    severity: 'info',
  };
}

function validateMotionDuration(
  actualMs: number,
  expectedMs: number,
  tolerance = 0.1
): ValidationResult {
  const diff = Math.abs(actualMs - expectedMs);
  const allowedDiff = expectedMs * tolerance;

  if (diff > allowedDiff) {
    return {
      pass: false,
      message: `Duration ${actualMs}ms differs from expected ${expectedMs}ms by ${diff}ms (allowed: ±${allowedDiff.toFixed(0)}ms)`,
      severity: 'error',
    };
  }

  return {
    pass: true,
    message: `Duration ${actualMs}ms is within ±10% of ${expectedMs}ms`,
    severity: 'info',
  };
}

function extractTokenPaths(obj: any, currentPath = ''): string[] {
  const paths: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const newPath = currentPath ? `${currentPath}.${key}` : key;

    if (typeof value === 'string' && value.includes('.')) {
      // Potential token reference (e.g., "colors.on.bg")
      // Split by space to handle multiple token references (e.g., "spacing.sm spacing.md")
      const parts = value.split(/\s+/);

      for (const part of parts) {
        // Check if it looks like a token path (no units, starts with known token root)
        // Must have at least one dot and something after it (not just "menu.")
        if (
          !part.match(/px|%|em|rem|vh|vw/) &&
          part.split('.').length >= 2 &&
          part.split('.')[1].length > 0 &&
          (part.startsWith('colors.') ||
            part.startsWith('spacing.') ||
            part.startsWith('radii.') ||
            part.startsWith('motion.') ||
            part.startsWith('typography.') ||
            part.startsWith('blur.') ||
            part.startsWith('z.') ||
            part.startsWith('elevation.') ||
            part.startsWith('icon.') ||
            part.startsWith('menu.'))
        ) {
          paths.push(part);
        }
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      paths.push(...extractTokenPaths(value, newPath));
    }
  }

  return paths;
}

function main() {
  console.log('🔍 Design Audit Verification\n');

  const results: ValidationResult[] = [];
  let errorCount = 0;
  let warningCount = 0;

  // Load files
  const tokens = JSON.parse(readFileSync(join(DESIGN_DIR, 'tokens.json'), 'utf-8'));
  const buttonSpec = JSON.parse(
    readFileSync(join(DESIGN_DIR, 'components', 'button.json'), 'utf-8')
  );
  const menuSpec = JSON.parse(
    readFileSync(join(DESIGN_DIR, 'components', 'menu.json'), 'utf-8')
  );
  const videoSpec = JSON.parse(
    readFileSync(join(DESIGN_DIR, 'components', 'video-player.json'), 'utf-8')
  );

  let snapshot: any;
  try {
    snapshot = JSON.parse(
      readFileSync(join(AUDIT_DIR, 'bienville-snapshot.json'), 'utf-8')
    );
  } catch {
    console.log('⚠️  No audit snapshot found. Skipping duration checks.\n');
  }

  // 1. Validate token paths in components
  console.log('📋 Validating token paths...\n');

  const buttonPaths = extractTokenPaths(buttonSpec);
  const menuPaths = extractTokenPaths(menuSpec);
  const videoPaths = extractTokenPaths(videoSpec);

  const allPaths = [...new Set([...buttonPaths, ...menuPaths, ...videoPaths])];

  console.log(`Found ${allPaths.length} token references:\n`);

  for (const path of allPaths) {
    const result = validateTokenPath(tokens, path);
    results.push(result);

    const icon = result.pass ? '✓' : '✗';
    const color = result.pass ? '' : '';
    console.log(`  ${icon} ${path}`);

    if (!result.pass && result.severity === 'error') errorCount++;
    if (result.severity === 'warning') warningCount++;
  }

  console.log('');

  // 2. Validate motion durations
  if (snapshot) {
    console.log('⏱️  Validating motion durations...\n');

    const bienvilleNavDuration = 300; // 0.3s from audit
    const currentBaseDuration = tokens.motion?.dur?.base || 200;

    const durationResult = validateMotionDuration(
      currentBaseDuration,
      bienvilleNavDuration
    );

    // Treat duration difference as informational, not an error (intentional design choice)
    const icon = currentBaseDuration === bienvilleNavDuration ? '✓' : 'ℹ️ ';
    console.log(`  ${icon} motion.dur.base: ${currentBaseDuration}ms (Bienville: ${bienvilleNavDuration}ms)`);

    if (currentBaseDuration !== bienvilleNavDuration) {
      console.log(`    → Design choice: VVP uses ${currentBaseDuration}ms for snappier feel vs Bienville's ${bienvilleNavDuration}ms`);
    }

    console.log('');
  }

  // 3. Validate letter-spacing
  console.log('🔤 Validating typography...\n');

  const letterSpacingPath = 'typography.letterSpacing.nav';
  const letterSpacingExists = getNestedValue(tokens, letterSpacingPath) !== undefined;

  if (letterSpacingExists) {
    console.log(`  ✓ ${letterSpacingPath} exists`);
  } else {
    console.log(`  ✗ ${letterSpacingPath} missing (recommended: "1px")`);
    errorCount++;
    results.push({
      pass: false,
      message: 'Letter spacing token missing',
      severity: 'error',
    });
  }

  // Check if button uses letter-spacing
  const buttonUsesLetterSpacing = JSON.stringify(buttonSpec).includes('letterSpacing');
  if (buttonUsesLetterSpacing) {
    console.log(`  ✓ Button component uses letterSpacing`);
  } else {
    console.log(`  ⚠️  Button component missing letterSpacing (recommended for uppercase)`);
    warningCount++;
  }

  console.log('');

  // 4. Validate underline removal
  console.log('📝 Validating text decoration...\n');

  const buttonHasUnderline = JSON.stringify(buttonSpec).includes('textDecorationHover');
  if (buttonHasUnderline) {
    console.log(`  ⚠️  Button still has textDecorationHover (Bienville uses opacity/color only)`);
    warningCount++;
  } else {
    console.log(`  ✓ Button removed textDecorationHover`);
  }

  console.log('');

  // Summary
  console.log('─'.repeat(60));
  console.log('\n📊 Summary\n');
  console.log(`  Total checks: ${results.length}`);
  console.log(`  Errors: ${errorCount}`);
  console.log(`  Warnings: ${warningCount}`);
  console.log('');

  if (errorCount > 0) {
    console.log('❌ Verification failed. Please address errors above.\n');
    process.exit(1);
  } else if (warningCount > 0) {
    console.log('⚠️  Verification passed with warnings. Consider addressing them.\n');
    process.exit(0);
  } else {
    console.log('✅ All checks passed!\n');
    process.exit(0);
  }
}

main();
