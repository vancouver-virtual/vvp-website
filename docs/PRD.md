# PRD — vvp (Vancouver Virtual Productions)
**Doc owner:** Brook  
**Last updated:** 2025-10-03  
**Status:** Draft → MVP Execution

## 1. Summary
Build a **fast, SEO-sound, static Next.js website** for Vancouver Virtual Productions and host it on **Firebase Hosting**. MVP centers on:
- A **hero background video** that autoplay loops **muted inline**, with a primary CTA to **Play with sound** which opens **fullscreen** (unmuted) and shows a persistent **Close** chip that returns to the muted inline background.
- A **right-side glassmorphism menu** (semi-transparent, blurred panel) that overlays without pausing the background video.

## 2. Goals (MVP)
- **G1.** Deliver a minimal, brand-neutral shell with the **video CTA** and **glass menu** working perfectly on desktop and mobile.
- **G2.** **Static export** (`output: 'export'`) and deploy to **Firebase Hosting** with correct caching and headers.
- **G3.** Ship **baseline SEO**: Metadata API, robots, sitemap, canonical tags, OpenGraph/Twitter, Organization JSON-LD.
- **G4.** Hit **Core Web Vitals** budgets on mid-tier mobile (4G/Slow 3G throttling): LCP ≤ 2.5s, CLS < 0.1, INP ≤ 200ms.

## 3. Non-Goals (for MVP)
- No CMS, no dashboards, no auth.
- No dynamic server rendering or edge functions.
- No paid A/B testing or complex analytics setup beyond GA4/basic pageview (optional).

## 4. Primary Users
- **Prospective clients**: want a fast, premium feel and quick contact path.
- **Industry partners/recruiters**: want capabilities overview and showreel.
- **Press/PR**: need accurate metadata and link previews.

## 5. Information Architecture (MVP)
- `/` (Landing, hero video, top-level narrative, contact affordances)
- Future placeholders only (not linked yet): `/work/`, `/about/`, `/contact/`

## 6. Feature Requirements

### 6.1 Hero Video + CTA
**Behavior**
- Autoplay inline, **muted**, **looped**, `playsInline`, and `object-cover`.
- CTA **Play with sound**:
  - On click: **unmute** + **enter fullscreen**.
  - Show **Close** chip (top-right), always visible above video chrome.
  - On Close/ESC: **exit fullscreen**, **re-mute**, continue inline loop.
- Secondary CTA **Play muted**: idempotent; ensures inline muted playback continues.

**Compatibility**
- iOS Safari: prefer `webkitEnterFullscreen()` on the `<video>` if container-FS is blocked; otherwise `requestFullscreen()` on a container for custom Close chip.
- Reuse a single `<video>` where possible. If device quirks appear, allow dual-element strategy (inline + fullscreen) with time sync on FS entry.

**Accessibility**
- The hero video is **decorative**: `aria-hidden="true"` and not keyboard-focusable.
- The Close chip is keyboard-reachable; 44×44 px minimum target; 2px visible focus ring.

**Analytics (optional)**
- Events: `video_play_with_sound`, `video_close_fs`, `video_play_muted`.

### 6.2 Right-Side Glassmorphism Menu
**Open action**
- Menu button in top bar opens a **right-docked panel** (max-width ~420px).
- Background video **continues** looping muted. Page scroll locked while open.

**Visual**
- `background: rgba(20,22,26,0.38)`; `backdrop-filter: blur(18px) saturate(140%)`;
- `border: 1px solid rgba(255,255,255,0.18)`; heavy shadow for separation.
- Links use **link-like CTA** (uppercase, underline on hover). Dividers are subtle hairlines.

**Motion**
- Enter: slide from +32px to 0 with opacity fade (≤ 200ms).  
- Respect `prefers-reduced-motion`: reduce to instant or ≤ 80ms fade.

**Accessibility**
- `role="dialog" aria-modal="true"` with **focus trap** and ESC to close.
- `aria-controls` and `aria-expanded` on the toggle; return focus to toggle on close.

**Interaction ordering**
- If menu is open and user clicks **Play with sound**, close the menu first, then go fullscreen.

## 7. SEO Requirements
- Use Next **Metadata API** for page titles, descriptions, OG/Twitter tags.
- **robots.ts** and **sitemap.ts** generated at build time (static).
- **Canonical** URLs on each route (static canonical for `/`).
- **Organization JSON-LD** in `app/layout.tsx` (name, url, logo when available).
- Social preview image (static file) for OG and Twitter.
- Prevent accidental indexing of non-prod deploys (set `x-robots-tag: noindex` on previews or gate by environment variable).

## 8. Performance Budgets & Assets
- **Budgets**: LCP ≤ 2.5s, CLS < 0.1, INP ≤ 200ms on Moto G4/4G throttling in Lighthouse.
- **Video**: 6–12s loop, H.264/MP4 baseline. Consider 720p ≤ ~3–5 MB. Poster image required.
- **Images**: Since `output: 'export'`, use **unoptimized** images; pre-compress and set explicit width/height to avoid CLS.
- **Caching**: Immutable assets (`*.css`, `*.js`, media) long-cache; HTML short-cache.

## 9. Accessibility (WCAG 2.2 AA)
- Color contrast ≥ 4.5:1 for nav/links/buttons.
- Visible focus states (2px ring) across all interactive elements.
- Keyboard: All functions available via keyboard, including menu and video Close.

## 10. Technical Architecture
- **Next.js (App Router)** + TypeScript.
- **Static export** (`output: 'export'`, `images.unoptimized = true`, `trailingSlash = true`).
- **Firebase Hosting**: `public: out`, cache headers for assets, default 404.
- No server components that require runtime. No dynamic APIs in MVP.

## 11. Repo & Design Conventions
- **Design tokens**: `/design/tokens.json`
- **Component rules**: `/design/components/{button,menu,video-player}.{md,json}`
- **Patterns**: `/design/patterns/{navigation,seo}.md`
- **Product docs**: `/docs/PRD.md`, `/docs/ADR-001-static-export.md`, `/docs/ROADMAP.md`
- Linting/formatting per default Next ESLint/Prettier config.

## 12. Telemetry & Privacy (optional)
- GA4 pageviews + custom events for video/menu.
- Anonymize IP; honor DNT where feasible. Cookie-light by default.

## 13. QA & Test Plan
- **Automated**: Playwright E2E for:
  - Open menu (ESC and button close; focus trap enforced).
  - Play with sound → fullscreen → Close → returns to loop muted.
  - Keyboard navigation: TAB order, focus ring visibility, ENTER/SPACE activation.
- **Manual**:
  - iOS Safari (latest), Android Chrome, Desktop Safari/Chrome/Edge/Firefox.
  - Lighthouse CI thresholds: LCP ≤ 2.5s, CLS < 0.1, INP ≤ 200ms.

## 14. Milestones
- **M0 (Day 0–1)**: Scaffold Next app, static export scripts, SEO boilerplate, Firebase config docs.
- **M1 (Day 2–3)**: Implement hero video inline autoplay + poster + CTAs (no FS yet).
- **M2 (Day 4–5)**: Fullscreen with sound + persistent Close chip + escape paths.
- **M3 (Day 6–7)**: Right-side glass menu with focus trap & reduced-motion handling.
- **M4 (Day 8)**: SEO finishes (robots/sitemap/canonical/OG), Lighthouse perf pass, cross-device QA.
- **M5 (Day 9)**: Prep Firebase Hosting and first deploy.

## 15. Risks & Mitigations
- **iOS fullscreen quirks**: Fall back to `webkitEnterFullscreen()`; if Close chip can’t overlay, use native controls and show a pre/post overlay for exit.
- **Autoplay blocked**: Ensure `muted` + `playsInline`; provide explicit Play Muted CTA.
- **CLS from media**: Always set fixed dimensions and poster; avoid layout shift with reserved aspect boxes.

## 16. Acceptance Criteria (MVP “done”)
- Page loads with muted, looping hero video; CTAs visible and keyboard-accessible.
- Clicking **Play with sound** reliably enters fullscreen with audio on all target browsers; **Close** returns to muted inline video.
- Right-side glass menu opens/closes smoothly, traps focus, and overlays while video continues.
- Static export succeeds; Firebase Hosting serves exported site with correct caching.
- SEO checks pass (robots, sitemap, canonical, OG/Twitter, JSON-LD); Lighthouse scores meet budgets.

## 17. Open Questions
- Will we add Tailwind or a custom token pipeline immediately?
- Do we need MDX/content collections in MVP?
- What’s the initial copy, brand palette, and logo treatment?