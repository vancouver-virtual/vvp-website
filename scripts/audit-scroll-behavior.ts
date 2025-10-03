#!/usr/bin/env tsx
/**
 * Bienville Horizontal Scroll Deep Dive
 *
 * Captures the actual scroll behavior by:
 * 1. Monitoring scroll events in real-time
 * 2. Detecting smooth horizontal page transitions
 * 3. Analyzing the underlying implementation (scroll-snap, JS, transform, etc.)
 * 4. Documenting exact timing and easing functions
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'https://www.bienvillecapital.com';
const AUDIT_DIR = join(process.cwd(), 'audit');

async function main() {
  console.log('🔬 Deep Dive: Bienville Horizontal Scroll Analysis\n');

  const browser = await chromium.launch({ headless: false }); // Non-headless to see interaction
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  console.log('📸 Taking initial screenshot...');
  await page.screenshot({ path: join(AUDIT_DIR, 'screenshots', 'scroll-initial.png') });

  // Inject scroll monitoring script
  console.log('💉 Injecting scroll monitor...');
  const scrollData = await page.evaluate(() => {
    return new Promise<any>((resolve) => {
      const data: any = {
        implementation: 'unknown',
        scrollEvents: [],
        transformEvents: [],
        pageStructure: [],
        timing: {},
        containerInfo: {},
      };

      // Detect scroll container
      const body = document.body;
      const html = document.documentElement;
      const main = document.querySelector('main');
      const wrapper = document.querySelector('[class*="wrapper"], [id*="app"], [class*="container"]');

      let scrollContainer: Element = body;
      let implementationType = 'unknown';

      // Check for horizontal scroll container
      const containers = [wrapper, main, body, html].filter(Boolean);
      for (const container of containers) {
        if (!container) continue;
        const computed = window.getComputedStyle(container as Element);

        if (computed.overflowX === 'scroll' || computed.overflowX === 'auto') {
          scrollContainer = container as Element;
          implementationType = 'native-scroll';
          break;
        }

        if (computed.scrollSnapType && computed.scrollSnapType !== 'none') {
          scrollContainer = container as Element;
          implementationType = 'scroll-snap';
          break;
        }
      }

      // Check for transform-based scrolling
      const sections = Array.from(document.querySelectorAll('section, [class*="page"], [class*="slide"], [class*="view"]'));
      if (sections.length > 1) {
        const firstSection = sections[0];
        const computed = window.getComputedStyle(firstSection);

        if (computed.transform !== 'none' || computed.willChange.includes('transform')) {
          implementationType = 'transform-based';
        }
      }

      data.implementation = implementationType;

      // Capture container details
      const containerComputed = window.getComputedStyle(scrollContainer);
      data.containerInfo = {
        selector: scrollContainer.className || scrollContainer.tagName,
        width: containerComputed.width,
        height: containerComputed.height,
        overflowX: containerComputed.overflowX,
        overflowY: containerComputed.overflowY,
        scrollSnapType: containerComputed.scrollSnapType,
        scrollBehavior: containerComputed.scrollBehavior,
        transform: containerComputed.transform,
        transition: containerComputed.transition,
        willChange: containerComputed.willChange,
      };

      // Capture page structure
      data.pageStructure = sections.map((section, index) => {
        const computed = window.getComputedStyle(section);
        const rect = section.getBoundingClientRect();

        return {
          index,
          id: section.id || section.className,
          width: computed.width,
          height: computed.height,
          position: computed.position,
          left: computed.left,
          top: computed.top,
          transform: computed.transform,
          transition: computed.transition,
          scrollSnapAlign: computed.scrollSnapAlign,
          boundingRect: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          },
        };
      });

      // Monitor scroll events
      let scrollEventCount = 0;
      const maxEvents = 20;

      const scrollHandler = () => {
        if (scrollEventCount >= maxEvents) return;

        data.scrollEvents.push({
          time: Date.now(),
          scrollX: window.scrollX,
          scrollY: window.scrollY,
          scrollLeft: scrollContainer.scrollLeft,
          scrollTop: scrollContainer.scrollTop,
        });

        scrollEventCount++;
      };

      scrollContainer.addEventListener('scroll', scrollHandler);
      window.addEventListener('scroll', scrollHandler);

      // Monitor transform changes (if JS-based)
      if (implementationType === 'transform-based' && sections.length > 0) {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
              const target = mutation.target as HTMLElement;
              const computed = window.getComputedStyle(target);

              data.transformEvents.push({
                time: Date.now(),
                element: target.className || target.tagName,
                transform: computed.transform,
                transition: computed.transition,
              });
            }
          });
        });

        sections.forEach(section => {
          observer.observe(section, { attributes: true, attributeFilter: ['style'] });
        });
      }

      // Simulate scroll and wait
      setTimeout(() => {
        // Try scrolling right
        if (implementationType === 'native-scroll' || implementationType === 'scroll-snap') {
          scrollContainer.scrollBy({ left: 1440, behavior: 'smooth' });
        } else {
          // Try mouse wheel
          window.scrollBy({ left: 1440, behavior: 'smooth' });
        }
      }, 500);

      setTimeout(() => {
        scrollContainer.removeEventListener('scroll', scrollHandler);
        window.removeEventListener('scroll', scrollHandler);
        resolve(data);
      }, 3000);
    });
  });

  console.log('\n📊 Scroll Analysis Results:\n');
  console.log(`  Implementation type: ${scrollData.implementation}`);
  console.log(`  Pages detected: ${scrollData.pageStructure.length}`);
  console.log(`  Scroll events captured: ${scrollData.scrollEvents.length}`);
  console.log(`  Transform events: ${scrollData.transformEvents.length}`);

  // Save detailed analysis
  writeFileSync(
    join(AUDIT_DIR, 'scroll-deep-dive.json'),
    JSON.stringify(scrollData, null, 2)
  );

  // Take screenshot after scroll
  await page.waitForTimeout(1000);
  await page.screenshot({ path: join(AUDIT_DIR, 'screenshots', 'scroll-after.png') });

  // Try manual scroll with mouse wheel
  console.log('\n🖱️  Simulating mouse wheel scroll...');
  await page.mouse.move(720, 450);
  await page.mouse.wheel(500, 0); // Horizontal wheel
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(AUDIT_DIR, 'screenshots', 'scroll-wheel.png') });

  // Capture final state
  const finalState = await page.evaluate(() => {
    return {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      currentPage: Math.round(window.scrollX / window.innerWidth),
      bodyTransform: window.getComputedStyle(document.body).transform,
      htmlTransform: window.getComputedStyle(document.documentElement).transform,
    };
  });

  console.log('\n📍 Final scroll position:');
  console.log(`  scrollX: ${finalState.scrollX}px`);
  console.log(`  Current page: ${finalState.currentPage}`);

  await browser.close();

  // Generate implementation report
  const report = `# Bienville Horizontal Scroll Implementation Analysis

## Implementation Type
**${scrollData.implementation}**

## Container Details
- Element: \`${scrollData.containerInfo.selector}\`
- Overflow X: \`${scrollData.containerInfo.overflowX}\`
- Scroll Snap: \`${scrollData.containerInfo.scrollSnapType}\`
- Scroll Behavior: \`${scrollData.containerInfo.scrollBehavior}\`
- Transform: \`${scrollData.containerInfo.transform}\`
- Transition: \`${scrollData.containerInfo.transition}\`
- Will Change: \`${scrollData.containerInfo.willChange}\`

## Page Structure
Found ${scrollData.pageStructure.length} pages/sections:

${scrollData.pageStructure.map((page: any, i: number) => `
### Page ${i + 1}
- ID/Class: \`${page.id}\`
- Width: ${page.width}
- Height: ${page.height}
- Position: ${page.position}
- Transform: \`${page.transform}\`
- Scroll Snap Align: \`${page.scrollSnapAlign}\`
`).join('\n')}

## Scroll Events Captured
${scrollData.scrollEvents.length} scroll events recorded during scroll simulation.

${scrollData.scrollEvents.length > 0 ? `
Sample scroll progression:
${scrollData.scrollEvents.slice(0, 5).map((e: any, i: number) =>
  `- Event ${i + 1}: scrollX=${e.scrollX}, scrollY=${e.scrollY}`
).join('\n')}
` : 'No scroll events captured - likely JS-controlled.'}

## Implementation Recommendation

${scrollData.implementation === 'scroll-snap' ? `
### Use CSS Scroll Snap
\`\`\`css
.scroll-container {
  overflow-x: scroll;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scroll-padding-inline: 0;
}

.page {
  scroll-snap-align: start;
  width: 100vw;
  height: 100vh;
}
\`\`\`
` : scrollData.implementation === 'transform-based' ? `
### Use Transform-Based Scrolling (JS)
Likely using a library like Locomotive Scroll, GSAP ScrollTrigger, or custom implementation.

Check for:
- Wheel event listeners
- Transform animations on scroll
- RequestAnimationFrame loops
` : `
### Implementation unclear - manual investigation needed
The site may be using:
- A JS framework (Vue.js/React) with custom scroll handling
- A scroll library (Swiper, FullPage.js, etc.)
- Custom scroll hijacking

Recommend inspecting the bundled JavaScript for scroll-related libraries.
`}

## Screenshots
- Initial state: \`audit/screenshots/scroll-initial.png\`
- After scroll: \`audit/screenshots/scroll-after.png\`
- Wheel scroll: \`audit/screenshots/scroll-wheel.png\`

## Next Steps
1. Review screenshots to understand visual transition
2. Inspect page structure in \`scroll-deep-dive.json\`
3. Choose implementation strategy (scroll-snap vs JS-based)
4. Reference design system tokens for timing/easing
`;

  writeFileSync(join(AUDIT_DIR, 'SCROLL_IMPLEMENTATION.md'), report);

  console.log('\n✅ Deep dive complete!');
  console.log(`   Detailed data: ${AUDIT_DIR}/scroll-deep-dive.json`);
  console.log(`   Implementation guide: ${AUDIT_DIR}/SCROLL_IMPLEMENTATION.md`);
  console.log(`   Screenshots: ${AUDIT_DIR}/screenshots/`);
}

main().catch(console.error);
