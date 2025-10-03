#!/usr/bin/env tsx
/**
 * Bienville Capital Site Auditor - Enhanced
 *
 * NEW OBJECTIVES:
 * 1. Capture horizontal scroll mechanics (scroll-snap, page transitions)
 * 2. Analyze team page layout structure and content organization
 * 3. Document seamless page-to-page scroll transitions
 *
 * Outputs:
 * - /audit/scroll-mechanics.json (scroll behavior, snap points, easing)
 * - /audit/team-layout.json (team page structure, grid, spacing)
 * - /audit/page-transitions.json (transition timing, effects)
 * - /audit/screenshots/*.png (visual references per page)
 */

import { chromium, Browser, Page } from 'playwright';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'https://www.bienvillecapital.com';
const DESKTOP_VIEWPORT = { width: 1440, height: 900 };
const AUDIT_DIR = join(process.cwd(), 'audit');
const SCREENSHOTS_DIR = join(AUDIT_DIR, 'screenshots');

interface ScrollMechanics {
  scrollDirection: 'horizontal' | 'vertical' | 'both';
  scrollSnapType: string | null;
  scrollBehavior: string;
  overflowX: string;
  overflowY: string;
  scrollPaddingInline: string;
  scrollSnapAlign: string;
  containerWidth: string;
  containerHeight: string;
  pageWidth: string;
  pageCount: number;
  transitionDuration: string;
  transitionTimingFunction: string;
  transformProperty: string;
}

interface TeamPageLayout {
  containerSelector: string;
  layoutType: 'grid' | 'flex' | 'custom';
  columns: number;
  gap: string;
  itemWidth: string;
  itemHeight: string;
  padding: string;
  alignment: string;
  teamMembers: Array<{
    name: string;
    title: string;
    imageUrl: string | null;
    layout: {
      display: string;
      flexDirection: string;
      alignItems: string;
      gap: string;
    };
  }>;
  typography: {
    nameFont: string;
    nameSize: string;
    nameWeight: string;
    titleFont: string;
    titleSize: string;
    titleWeight: string;
  };
}

interface PageTransition {
  page: string;
  url: string;
  scrollPosition: number;
  transform: string;
  opacity: string;
  transitionProperties: string[];
  timing: {
    duration: string;
    easing: string;
    delay: string;
  };
}

async function captureScrollMechanics(page: Page): Promise<ScrollMechanics> {
  console.log('\n🔄 Analyzing scroll mechanics...');

  const mechanics = await page.evaluate(() => {
    // Find the main scroll container (likely body or a wrapper)
    const containers = [
      document.body,
      document.documentElement,
      document.querySelector('main'),
      document.querySelector('[class*="scroll"]'),
      document.querySelector('[class*="container"]'),
    ].filter(Boolean);

    let scrollContainer: Element | null = null;
    for (const container of containers) {
      if (!container) continue;
      const computed = window.getComputedStyle(container as Element);
      if (computed.overflowX === 'scroll' || computed.overflowX === 'auto' ||
          computed.scrollSnapType !== 'none') {
        scrollContainer = container as Element;
        break;
      }
    }

    if (!scrollContainer) scrollContainer = document.body;

    const computed = window.getComputedStyle(scrollContainer);
    const pages = Array.from(document.querySelectorAll('section, [class*="page"], [class*="slide"]'));

    return {
      scrollDirection: computed.overflowX !== 'visible' ?
        (computed.overflowY !== 'visible' ? 'both' : 'horizontal') : 'vertical',
      scrollSnapType: computed.scrollSnapType || null,
      scrollBehavior: computed.scrollBehavior,
      overflowX: computed.overflowX,
      overflowY: computed.overflowY,
      scrollPaddingInline: computed.scrollPaddingInline || computed.scrollPadding,
      scrollSnapAlign: pages[0] ? window.getComputedStyle(pages[0]).scrollSnapAlign : 'none',
      containerWidth: computed.width,
      containerHeight: computed.height,
      pageWidth: pages[0] ? window.getComputedStyle(pages[0]).width : '100vw',
      pageCount: pages.length,
      transitionDuration: computed.transitionDuration,
      transitionTimingFunction: computed.transitionTimingFunction,
      transformProperty: computed.transform,
    };
  });

  console.log(`  ✓ Scroll type: ${mechanics.scrollDirection}`);
  console.log(`  ✓ Scroll snap: ${mechanics.scrollSnapType || 'none'}`);
  console.log(`  ✓ Pages found: ${mechanics.pageCount}`);

  return mechanics;
}

async function captureTeamPageLayout(page: Page): Promise<TeamPageLayout | null> {
  console.log('\n👥 Analyzing team page layout...');

  // Navigate to team page
  const teamUrls = ['/team', '/about', '/our-team'];
  let teamUrl: string | null = null;

  for (const url of teamUrls) {
    try {
      const response = await page.goto(`${BASE_URL}${url}`, {
        waitUntil: 'domcontentloaded',
        timeout: 5000
      });
      if (response?.ok()) {
        teamUrl = url;
        console.log(`  ✓ Found team page at: ${teamUrl}`);
        break;
      }
    } catch {
      continue;
    }
  }

  if (!teamUrl) {
    console.log('  ⚠️  Team page not found');
    return null;
  }

  await page.waitForTimeout(2000);

  // Screenshot team page
  await page.screenshot({
    path: join(SCREENSHOTS_DIR, 'team-page.png'),
    fullPage: true
  });

  const layout = await page.evaluate(() => {
    // Find team member containers
    const selectors = [
      '[class*="team"]',
      '[class*="member"]',
      '[class*="people"]',
      '[class*="staff"]',
      '.grid',
      '[class*="profile"]',
    ];

    let container: Element | null = null;
    let items: Element[] = [];

    for (const selector of selectors) {
      const elements = Array.from(document.querySelectorAll(selector));
      if (elements.length > 0) {
        // Find parent container
        const parent = elements[0].parentElement;
        if (parent && elements.length > 2) {
          container = parent;
          items = elements;
          break;
        }
      }
    }

    if (!container || items.length === 0) {
      // Fallback: look for repeated card-like structures
      const sections = Array.from(document.querySelectorAll('section'));
      for (const section of sections) {
        const children = Array.from(section.children).filter(child => {
          const computed = window.getComputedStyle(child);
          return computed.display === 'flex' || computed.display === 'grid';
        });
        if (children.length > 2) {
          container = section;
          items = children;
          break;
        }
      }
    }

    if (!container) {
      return null;
    }

    const containerStyle = window.getComputedStyle(container);
    const itemStyle = items[0] ? window.getComputedStyle(items[0]) : null;

    // Extract team member data
    const teamMembers = items.slice(0, 6).map(item => {
      const nameEl = item.querySelector('h2, h3, h4, [class*="name"]');
      const titleEl = item.querySelector('p, [class*="title"], [class*="role"]');
      const imgEl = item.querySelector('img');
      const itemComputed = window.getComputedStyle(item);

      return {
        name: nameEl?.textContent?.trim() || '',
        title: titleEl?.textContent?.trim() || '',
        imageUrl: imgEl?.src || null,
        layout: {
          display: itemComputed.display,
          flexDirection: itemComputed.flexDirection,
          alignItems: itemComputed.alignItems,
          gap: itemComputed.gap,
        },
      };
    });

    // Detect typography
    const firstMember = items[0];
    const nameEl = firstMember?.querySelector('h2, h3, h4, [class*="name"]');
    const titleEl = firstMember?.querySelector('p, [class*="title"], [class*="role"]');

    const nameStyle = nameEl ? window.getComputedStyle(nameEl) : null;
    const titleStyle = titleEl ? window.getComputedStyle(titleEl) : null;

    return {
      containerSelector: container.className || container.tagName.toLowerCase(),
      layoutType: containerStyle.display === 'grid' ? 'grid' :
                  containerStyle.display === 'flex' ? 'flex' : 'custom',
      columns: containerStyle.gridTemplateColumns?.split(' ').length ||
               (containerStyle.display === 'flex' ? Math.ceil(Math.sqrt(items.length)) : 1),
      gap: containerStyle.gap || containerStyle.columnGap,
      itemWidth: itemStyle?.width || 'auto',
      itemHeight: itemStyle?.height || 'auto',
      padding: containerStyle.padding,
      alignment: containerStyle.justifyContent || containerStyle.alignItems,
      teamMembers,
      typography: {
        nameFont: nameStyle?.fontFamily || '',
        nameSize: nameStyle?.fontSize || '',
        nameWeight: nameStyle?.fontWeight || '',
        titleFont: titleStyle?.fontFamily || '',
        titleSize: titleStyle?.fontSize || '',
        titleWeight: titleStyle?.fontWeight || '',
      },
    };
  });

  if (layout) {
    console.log(`  ✓ Layout: ${layout.layoutType}`);
    console.log(`  ✓ Columns: ${layout.columns}`);
    console.log(`  ✓ Team members: ${layout.teamMembers.length}`);
  }

  return layout;
}

async function capturePageTransitions(page: Page): Promise<PageTransition[]> {
  console.log('\n🎬 Analyzing page transitions...');

  // Go back to homepage
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const transitions: PageTransition[] = [];

  // Detect pages/sections
  const pages = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section, [class*="page"], [class*="slide"]'));
    return sections.map((section, index) => ({
      index,
      id: section.id || `section-${index}`,
      className: section.className,
    }));
  });

  console.log(`  ✓ Found ${pages.length} pages/sections`);

  // Simulate scroll between pages to capture transitions
  for (let i = 0; i < Math.min(pages.length, 4); i++) {
    const scrollAmount = i * 1440; // Assuming page width

    // Scroll to page
    await page.evaluate((scroll) => {
      window.scrollTo({ left: scroll, behavior: 'smooth' });
    }, scrollAmount);

    await page.waitForTimeout(800); // Allow transition to complete

    // Capture transition state
    const transition = await page.evaluate((pageIndex) => {
      const section = document.querySelectorAll('section, [class*="page"]')[pageIndex];
      if (!section) return null;

      const computed = window.getComputedStyle(section);
      const transitionProps = computed.transitionProperty.split(',').map(p => p.trim());

      return {
        page: section.id || `section-${pageIndex}`,
        url: window.location.href,
        scrollPosition: window.scrollX,
        transform: computed.transform,
        opacity: computed.opacity,
        transitionProperties: transitionProps,
        timing: {
          duration: computed.transitionDuration,
          easing: computed.transitionTimingFunction,
          delay: computed.transitionDelay,
        },
      };
    }, i);

    if (transition) {
      transitions.push(transition);

      // Screenshot this page
      await page.screenshot({
        path: join(SCREENSHOTS_DIR, `page-${i}.png`),
        fullPage: false
      });
    }
  }

  console.log(`  ✓ Captured ${transitions.length} transitions`);

  return transitions;
}

async function main() {
  console.log('🚀 Bienville Capital Enhanced Site Audit\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Output: ${AUDIT_DIR}\n`);

  // Create directories
  if (!existsSync(SCREENSHOTS_DIR)) {
    mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: DESKTOP_VIEWPORT });
  const page = await context.newPage();

  // Navigate to homepage
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // 1. Capture scroll mechanics
  const scrollMechanics = await captureScrollMechanics(page);
  writeFileSync(
    join(AUDIT_DIR, 'scroll-mechanics.json'),
    JSON.stringify(scrollMechanics, null, 2)
  );

  // 2. Capture page transitions
  const pageTransitions = await capturePageTransitions(page);
  writeFileSync(
    join(AUDIT_DIR, 'page-transitions.json'),
    JSON.stringify(pageTransitions, null, 2)
  );

  // 3. Capture team page layout
  const teamLayout = await captureTeamPageLayout(page);
  if (teamLayout) {
    writeFileSync(
      join(AUDIT_DIR, 'team-layout.json'),
      JSON.stringify(teamLayout, null, 2)
    );
  }

  await browser.close();

  console.log('\n✅ Enhanced audit complete!');
  console.log(`   Scroll mechanics: ${AUDIT_DIR}/scroll-mechanics.json`);
  console.log(`   Page transitions: ${AUDIT_DIR}/page-transitions.json`);
  console.log(`   Team layout: ${AUDIT_DIR}/team-layout.json`);
  console.log(`   Screenshots: ${SCREENSHOTS_DIR}/`);
  console.log('\n📝 Next: Review captured data and generate implementation guide');
}

main().catch(console.error);
