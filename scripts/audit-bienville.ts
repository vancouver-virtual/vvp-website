#!/usr/bin/env tsx
/**
 * Bienville Capital Landing Page Auditor
 *
 * Captures computed styles, interaction metrics, and visual snapshots
 * from https://www.bienvillecapital.com/ (homepage only).
 *
 * Outputs:
 * - /audit/bienville-snapshot.json
 * - /audit/landing-desktop.png (1440×900)
 * - /audit/landing-mobile.png (390×844)
 */

import { chromium, Browser, Page } from 'playwright';
import { writeFileSync } from 'fs';
import { join } from 'path';

const TARGET_URL = 'https://www.bienvillecapital.com/';
const DESKTOP_VIEWPORT = { width: 1440, height: 900 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };
const AUDIT_DIR = join(process.cwd(), 'audit');

interface ElementMetrics {
  selector: string;
  textContent: string;
  computed: {
    fontFamily: string;
    fontWeight: string;
    fontSize: string;
    lineHeight: string;
    letterSpacing: string;
    textTransform: string;
    color: string;
    textDecorationLine: string;
    textDecorationStyle: string;
    textDecorationColor: string;
    textDecorationThickness: string;
    textUnderlineOffset: string;
    paddingInline: string;
    paddingBlock: string;
    marginInline: string;
    marginBlock: string;
    transitionProperty: string;
    transitionDuration: string;
    transitionTimingFunction: string;
    backgroundColor: string;
    borderColor: string;
    borderWidth: string;
  };
  hover?: Partial<typeof this.computed>;
  active?: Partial<typeof this.computed>;
  focus?: Partial<typeof this.computed>;
}

interface ContainerMetrics {
  selector: string;
  computed: {
    padding: string;
    gap: string;
    height: string;
    backgroundColor: string;
    borderColor: string;
    borderWidth: string;
    backdropFilter: string;
    boxShadow: string;
    display: string;
    alignItems: string;
    justifyContent: string;
  };
}

interface AuditSnapshot {
  url: string;
  timestamp: string;
  viewport: { width: number; height: number };
  headerNav: ElementMetrics[];
  inlineLinks: ElementMetrics[];
  footerLinks: ElementMetrics[];
  headerContainer?: ContainerMetrics;
  menuContainer?: ContainerMetrics;
}

async function captureComputedStyle(page: Page, selector: string): Promise<any> {
  return await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const computed = window.getComputedStyle(el);
    return {
      fontFamily: computed.fontFamily,
      fontWeight: computed.fontWeight,
      fontSize: computed.fontSize,
      lineHeight: computed.lineHeight,
      letterSpacing: computed.letterSpacing,
      textTransform: computed.textTransform,
      color: computed.color,
      textDecorationLine: computed.textDecorationLine,
      textDecorationStyle: computed.textDecorationStyle,
      textDecorationColor: computed.textDecorationColor,
      textDecorationThickness: computed.textDecorationThickness,
      textUnderlineOffset: computed.textUnderlineOffset,
      paddingInline: `${computed.paddingLeft} ${computed.paddingRight}`,
      paddingBlock: `${computed.paddingTop} ${computed.paddingBottom}`,
      marginInline: `${computed.marginLeft} ${computed.marginRight}`,
      marginBlock: `${computed.marginTop} ${computed.marginBottom}`,
      transitionProperty: computed.transitionProperty,
      transitionDuration: computed.transitionDuration,
      transitionTimingFunction: computed.transitionTimingFunction,
      backgroundColor: computed.backgroundColor,
      borderColor: computed.borderColor,
      borderWidth: computed.borderWidth,
    };
  }, selector);
}

async function captureContainerMetrics(page: Page, selector: string): Promise<ContainerMetrics | null> {
  const exists = await page.locator(selector).count() > 0;
  if (!exists) return null;

  const computed = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const computed = window.getComputedStyle(el);
    return {
      padding: computed.padding,
      gap: computed.gap,
      height: computed.height,
      backgroundColor: computed.backgroundColor,
      borderColor: computed.borderColor,
      borderWidth: computed.borderWidth,
      backdropFilter: computed.backdropFilter || computed.getPropertyValue('backdrop-filter') || 'none',
      boxShadow: computed.boxShadow,
      display: computed.display,
      alignItems: computed.alignItems,
      justifyContent: computed.justifyContent,
    };
  }, selector);

  return computed ? { selector, computed } : null;
}

async function captureElementMetrics(
  page: Page,
  selector: string,
  captureInteractions = true
): Promise<ElementMetrics | null> {
  const exists = await page.locator(selector).count() > 0;
  if (!exists) {
    console.log(`⚠️  Element not found: ${selector}`);
    return null;
  }

  const textContent = await page.locator(selector).textContent() || '';
  const computed = await captureComputedStyle(page, selector);

  const metrics: ElementMetrics = {
    selector,
    textContent: textContent.trim(),
    computed,
  };

  if (captureInteractions) {
    try {
      // Scroll into view first
      await page.locator(selector).scrollIntoViewIfNeeded({ timeout: 5000 });
      await page.waitForTimeout(50);

      // Capture hover styles via CSS evaluation (more reliable than forced hover)
      const hoverStyles = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;

        // Get styles from stylesheet rules
        const sheets = Array.from(document.styleSheets);
        const hoverRules: any = {};

        for (const sheet of sheets) {
          try {
            const rules = Array.from(sheet.cssRules || []);
            for (const rule of rules) {
              if (rule instanceof CSSStyleRule && rule.selectorText.includes(':hover')) {
                // Check if this rule matches our element
                const baseSelector = rule.selectorText.replace(':hover', '');
                if (el.matches(baseSelector)) {
                  const style = rule.style;
                  for (let i = 0; i < style.length; i++) {
                    const prop = style[i];
                    hoverRules[prop] = style.getPropertyValue(prop);
                  }
                }
              }
            }
          } catch (e) {
            // CORS or other issues - skip this sheet
          }
        }

        return Object.keys(hoverRules).length > 0 ? hoverRules : null;
      }, selector);

      if (hoverStyles) {
        metrics.hover = hoverStyles;
      }

    } catch (e) {
      console.log(`    ⚠️  Could not capture interactions for ${selector}: ${e}`);
    }
  }

  return metrics;
}

async function findLinksByText(page: Page, texts: string[]): Promise<ElementMetrics[]> {
  const results: ElementMetrics[] = [];

  for (const text of texts) {
    // Use Playwright's text locator
    const locator = page.locator('a').filter({ hasText: text }).first();
    const count = await locator.count();

    if (count === 0) {
      console.log(`  ⚠️  Link not found: "${text}"`);
      continue;
    }

    // Extract metrics directly from the locator element
    const metrics = await locator.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        selector: `a:has-text("${el.textContent?.trim()}")`, // Descriptive, not for re-query
        textContent: el.textContent?.trim() || '',
        computed: {
          fontFamily: computed.fontFamily,
          fontWeight: computed.fontWeight,
          fontSize: computed.fontSize,
          lineHeight: computed.lineHeight,
          letterSpacing: computed.letterSpacing,
          textTransform: computed.textTransform,
          color: computed.color,
          textDecorationLine: computed.textDecorationLine,
          textDecorationStyle: computed.textDecorationStyle,
          textDecorationColor: computed.textDecorationColor,
          textDecorationThickness: computed.textDecorationThickness,
          textUnderlineOffset: computed.textUnderlineOffset,
          paddingInline: `${computed.paddingLeft} ${computed.paddingRight}`,
          paddingBlock: `${computed.paddingTop} ${computed.paddingBottom}`,
          marginInline: `${computed.marginLeft} ${computed.marginRight}`,
          marginBlock: `${computed.marginTop} ${computed.marginBottom}`,
          transitionProperty: computed.transitionProperty,
          transitionDuration: computed.transitionDuration,
          transitionTimingFunction: computed.transitionTimingFunction,
          backgroundColor: computed.backgroundColor,
          borderColor: computed.borderColor,
          borderWidth: computed.borderWidth,
        },
      };
    });

    // Try to capture hover styles from stylesheet
    try {
      const hoverStyles = await page.evaluate((el) => {
        const sheets = Array.from(document.styleSheets);
        const hoverRules: any = {};

        for (const sheet of sheets) {
          try {
            const rules = Array.from(sheet.cssRules || []);
            for (const rule of rules) {
              if (rule instanceof CSSStyleRule && rule.selectorText.includes(':hover')) {
                const baseSelector = rule.selectorText.replace(':hover', '').trim();
                if (el.matches(baseSelector)) {
                  const style = rule.style;
                  for (let i = 0; i < style.length; i++) {
                    const prop = style[i];
                    hoverRules[prop] = style.getPropertyValue(prop);
                  }
                }
              }
            }
          } catch (e) {
            // CORS - skip
          }
        }

        return Object.keys(hoverRules).length > 0 ? hoverRules : null;
      }, await locator.elementHandle());

      if (hoverStyles) {
        metrics.hover = hoverStyles;
      }
    } catch (e) {
      // Skip hover if can't capture
    }

    results.push(metrics as ElementMetrics);
  }

  return results;
}

async function auditPage(browser: Browser, viewport: { width: number; height: number }): Promise<AuditSnapshot> {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();

  console.log(`\n📸 Auditing at ${viewport.width}×${viewport.height}...`);
  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000); // Allow animations/lazy loads

  // Screenshot
  const screenshotName = viewport.width > 500 ? 'landing-desktop.png' : 'landing-mobile.png';
  await page.screenshot({ path: join(AUDIT_DIR, screenshotName), fullPage: true });
  console.log(`✓ Screenshot saved: ${screenshotName}`);

  // Header nav links (common patterns: "Explore", "Contact", "Team", etc.)
  console.log('\n🔍 Scanning header navigation...');
  const headerNavTexts = ['Explore', 'Contact', 'Team', 'About'];
  let headerNav = await findLinksByText(page, headerNavTexts);

  // Fallback: scan header/nav elements
  if (headerNav.length === 0) {
    console.log('  ↳ Fallback: scanning header > a elements');
    const headerLinks = await page.locator('header a, nav a').all();
    for (let i = 0; i < Math.min(headerLinks.length, 6); i++) {
      const href = await headerLinks[i].getAttribute('href');
      if (href && !href.startsWith('#')) {
        const selector = `header a[href="${href}"], nav a[href="${href}"]`;
        const metrics = await captureElementMetrics(page, selector, true);
        if (metrics) headerNav.push(metrics);
      }
    }
  }

  console.log(`  ✓ Found ${headerNav.length} header nav links`);

  // Inline/mid-page links (investor relations, team, etc.)
  console.log('\n🔍 Scanning inline links...');
  const inlineLinkTexts = ['Investor Relations', 'Team', 'Our Team', 'Learn More'];
  const inlineLinks = await findLinksByText(page, inlineLinkTexts);
  console.log(`  ✓ Found ${inlineLinks.length} inline links`);

  // Footer links
  console.log('\n🔍 Scanning footer links...');
  const footerTexts = ['Terms', 'Website Privacy Policy', 'Privacy Policy', 'FORM CRS', 'Email', 'Call'];
  const footerLinks = await findLinksByText(page, footerTexts);
  console.log(`  ✓ Found ${footerLinks.length} footer links`);

  // Header container metrics
  console.log('\n🔍 Scanning header container...');
  const headerContainer = await captureContainerMetrics(page, 'header') ||
                          await captureContainerMetrics(page, 'nav');
  if (headerContainer) {
    console.log(`  ✓ Header container captured`);
  }

  // Menu panel (if visible)
  console.log('\n🔍 Scanning for menu panel...');
  const menuContainer = await captureContainerMetrics(page, '[role="dialog"]') ||
                        await captureContainerMetrics(page, 'aside') ||
                        await captureContainerMetrics(page, '.menu');
  if (menuContainer) {
    console.log(`  ✓ Menu container captured`);
  } else {
    console.log(`  ⚠️  No menu panel found (may be hidden)`);
  }

  await context.close();

  return {
    url: TARGET_URL,
    timestamp: new Date().toISOString(),
    viewport,
    headerNav,
    inlineLinks,
    footerLinks,
    headerContainer,
    menuContainer,
  };
}

async function main() {
  console.log('🚀 Bienville Capital Landing Page Audit\n');
  console.log(`Target: ${TARGET_URL}`);
  console.log(`Output: ${AUDIT_DIR}`);

  const browser = await chromium.launch({ headless: true });

  // Desktop audit
  const desktopSnapshot = await auditPage(browser, DESKTOP_VIEWPORT);

  // Mobile audit (optional, for responsive comparison)
  // const mobileSnapshot = await auditPage(browser, MOBILE_VIEWPORT);

  await browser.close();

  // Write snapshot
  const snapshotPath = join(AUDIT_DIR, 'bienville-snapshot.json');
  writeFileSync(snapshotPath, JSON.stringify(desktopSnapshot, null, 2));
  console.log(`\n✅ Audit complete!`);
  console.log(`   Snapshot: ${snapshotPath}`);
  console.log(`\nNext: Run comparison analysis to generate report.md`);
}

main().catch(console.error);
