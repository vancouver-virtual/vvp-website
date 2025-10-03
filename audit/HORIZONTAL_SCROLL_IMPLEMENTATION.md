# Horizontal Scroll Implementation - Complete Guide

**Based on Bienville Capital Site Analysis**
**Generated:** 2025-10-03
**Status:** ✅ Design System Updated, Ready for Implementation

---

## 🎯 Objectives Achieved

1. ✅ Analyzed Bienville's horizontal scroll mechanics
2. ✅ Captured team page layout structure
3. ✅ Documented scroll behavior patterns
4. ✅ Created design system tokens for scroll behavior
5. ✅ Defined component specifications

---

## 📦 What Was Added to Design System

### New Tokens (`/design/tokens.json`)

#### Typography Additions
```json
{
  "typography": {
    "size": {
      "displayLarge": "28px",  // Team member names
      "body": "16px",          // Titles, descriptions
      "small": "14px"          // Bio text
    },
    "weight": {
      "light": 300,            // Titles (Bienville pattern)
      "regular": 400,
      "medium": 500,
      "bold": 700,             // Names, headings
      "heavy": 800             // CTAs
    }
  }
}
```

#### Scroll Behavior
```json
{
  "scroll": {
    "snap": {
      "type": "x mandatory",   // Horizontal mandatory snap
      "align": "start",        // Snap to start of each page
      "stop": "always"         // Force stop at each snap point
    },
    "behavior": "smooth",      // Smooth scroll animation
    "threshold": 50            // Wheel delta threshold (px)
  }
}
```

#### Page Layout
```json
{
  "page": {
    "width": "100vw",          // Full viewport width
    "height": "100vh",         // Full viewport height
    "padding": "spacing.3xl",  // 48px padding
    "maxWidth": 1200           // Max content width
  }
}
```

### New Components

#### 1. HorizontalScroll Component
**File:** `/design/components/horizontal-scroll.json`

**Key Features:**
- Horizontal scroll container with snap points
- Wheel-to-horizontal conversion
- Keyboard navigation (Arrow keys, Home, End)
- Touch swipe support
- Respects `prefers-reduced-motion`
- Integrates with menu (closes on scroll)

**Styles:**
```typescript
{
  overflowX: 'scroll',
  overflowY: 'hidden',
  scrollSnapType: 'x mandatory',
  scrollBehavior: 'smooth',
  display: 'flex',
  width: '100vw',
  height: '100vh',
  scrollbarWidth: 'none', // Hide scrollbar
}
```

#### 2. TeamMemberPage Component
**File:** `/design/components/team-member-page.json`

**Key Features:**
- Full-page team member card
- Side-by-side image + content layout
- Responsive (stacks on mobile)
- Typography matches Bienville patterns

**Layout:**
```typescript
{
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: tokens.spacing['2xl'], // 32px
  padding: tokens.spacing['3xl'], // 48px
  maxWidth: tokens.page.maxWidth, // 1200px
}
```

**Typography:**
- Name: 28px, bold (700), 2px letter-spacing, uppercase
- Title: 16px, light (300), 0px letter-spacing
- Bio: 14px, regular (400), 1.6 line-height

---

## 🚀 Implementation Steps

### Step 1: Create HorizontalScroll Component

```tsx
// src/components/HorizontalScroll.tsx

'use client';

import { useEffect, useRef, useState } from 'react';
import tokens from '@/design/tokens.json';

interface HorizontalScrollProps {
  children: React.ReactNode;
  enableWheelHijack?: boolean;
  enableKeyboardNav?: boolean;
  onPageChange?: (index: number) => void;
}

export default function HorizontalScroll({
  children,
  enableWheelHijack = true,
  enableKeyboardNav = true,
  onPageChange,
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Wheel event hijacking
  useEffect(() => {
    if (!enableWheelHijack) return;

    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (isScrollingRef.current) return;

      const delta = e.deltaY || e.deltaX;
      if (Math.abs(delta) < tokens.scroll.threshold) return;

      const pageWidth = window.innerWidth;
      const currentPageNum = Math.round(container.scrollLeft / pageWidth);
      const direction = delta > 0 ? 1 : -1;
      const maxPage = Math.floor(container.scrollWidth / pageWidth) - 1;
      const targetPage = Math.max(0, Math.min(currentPageNum + direction, maxPage));

      if (targetPage === currentPageNum) return;

      isScrollingRef.current = true;
      container.scrollTo({
        left: targetPage * pageWidth,
        behavior: tokens.scroll.behavior as ScrollBehavior,
      });

      setCurrentPage(targetPage);
      onPageChange?.(targetPage);

      setTimeout(() => {
        isScrollingRef.current = false;
      }, tokens.motion.dur.base + 100);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [enableWheelHijack, onPageChange]);

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboardNav) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const pageWidth = window.innerWidth;
      const maxPage = Math.floor(container.scrollWidth / pageWidth) - 1;
      let targetPage = currentPage;

      switch (e.key) {
        case 'ArrowRight':
          targetPage = Math.min(currentPage + 1, maxPage);
          break;
        case 'ArrowLeft':
          targetPage = Math.max(currentPage - 1, 0);
          break;
        case 'Home':
          targetPage = 0;
          break;
        case 'End':
          targetPage = maxPage;
          break;
        default:
          return;
      }

      if (targetPage !== currentPage) {
        e.preventDefault();
        container.scrollTo({
          left: targetPage * pageWidth,
          behavior: tokens.scroll.behavior as ScrollBehavior,
        });
        setCurrentPage(targetPage);
        onPageChange?.(targetPage);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardNav, currentPage, onPageChange]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Horizontal scroll pages"
      style={{
        position: 'relative',
        overflowX: 'scroll',
        overflowY: 'hidden',
        scrollSnapType: tokens.scroll.snap.type as any,
        scrollBehavior: tokens.scroll.behavior as any,
        display: 'flex',
        flexDirection: 'row',
        width: tokens.page.width,
        height: tokens.page.height,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
      className="horizontal-scroll-container"
    >
      {children}
    </div>
  );
}
```

**CSS (add to globals.css):**
```css
.horizontal-scroll-container::-webkit-scrollbar {
  display: none;
}

.horizontal-scroll-container {
  /* GPU acceleration */
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

---

### Step 2: Create Page Component

```tsx
// src/components/Page.tsx

import tokens from '@/design/tokens.json';

interface PageProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function Page({ children, className = '', style = {} }: PageProps) {
  return (
    <div
      className={`page ${className}`}
      style={{
        scrollSnapAlign: tokens.scroll.snap.align as any,
        scrollSnapStop: tokens.scroll.snap.stop as any,
        minWidth: tokens.page.width,
        width: tokens.page.width,
        height: tokens.page.height,
        flexShrink: 0,
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
```

---

### Step 3: Create TeamMemberPage Component

```tsx
// src/components/TeamMemberPage.tsx

import Page from './Page';
import tokens from '@/design/tokens.json';

interface TeamMemberPageProps {
  name: string;
  title: string;
  bio?: string;
  imageUrl?: string;
  imagePosition?: 'left' | 'right';
}

export default function TeamMemberPage({
  name,
  title,
  bio,
  imageUrl,
  imagePosition = 'left',
}: TeamMemberPageProps) {
  return (
    <Page>
      <div
        style={{
          display: 'flex',
          flexDirection: imagePosition === 'left' ? 'row' : 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          gap: `${tokens.spacing['2xl']}px`,
          padding: `${tokens.spacing['3xl']}px`,
          maxWidth: `${tokens.page.maxWidth}px`,
          margin: '0 auto',
          height: '100%',
        }}
      >
        {/* Image */}
        {imageUrl && (
          <div
            style={{
              flex: '0 0 400px',
              height: '500px',
              borderRadius: `${tokens.radii.lg}px`,
              overflow: 'hidden',
              backgroundColor: tokens.colors.glass.bg,
            }}
          >
            <img
              src={imageUrl}
              alt={name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}

        {/* Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: `${tokens.spacing.md}px`,
          }}
        >
          <h2
            style={{
              fontSize: tokens.typography.size.displayLarge,
              fontWeight: tokens.typography.weight.bold,
              letterSpacing: tokens.typography.letterSpacing.wide,
              textTransform: 'uppercase',
              color: tokens.colors.on.bg,
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {name}
          </h2>

          <p
            style={{
              fontSize: tokens.typography.size.body,
              fontWeight: tokens.typography.weight.light,
              letterSpacing: tokens.typography.letterSpacing.tight,
              color: tokens.colors.on.bgSecondary,
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            {title}
          </p>

          {bio && (
            <p
              style={{
                fontSize: tokens.typography.size.small,
                fontWeight: tokens.typography.weight.regular,
                color: tokens.colors.on.bgSecondary,
                lineHeight: 1.6,
                marginTop: `${tokens.spacing.lg}px`,
              }}
            >
              {bio}
            </p>
          )}
        </div>
      </div>
    </Page>
  );
}
```

---

### Step 4: Update Main Page

```tsx
// src/app/page.tsx

import HorizontalScroll from '@/components/HorizontalScroll';
import Page from '@/components/Page';
import TeamMemberPage from '@/components/TeamMemberPage';
import VideoPlayer from '@/components/VideoPlayer';
import Button from '@/components/Button';

export default function Home() {
  const teamMembers = [
    {
      name: 'John Doe',
      title: 'Founder & CEO',
      bio: 'John has over 20 years of experience in venture capital and private equity...',
      imageUrl: '/team/john.jpg',
    },
    {
      name: 'Jane Smith',
      title: 'Chief Investment Officer',
      bio: 'Jane leads our investment strategy with a focus on sustainable growth...',
      imageUrl: '/team/jane.jpg',
    },
    // Add more team members...
  ];

  return (
    <HorizontalScroll
      onPageChange={(index) => {
        console.log('Page changed to:', index);
        // Update analytics, URL, etc.
      }}
    >
      {/* Hero Page */}
      <Page>
        <VideoPlayer src="/hero-video.mp4" />
        <Button variant="VideoPrimary" iconRight="play">
          Play with sound
        </Button>
      </Page>

      {/* Team Pages */}
      {teamMembers.map((member, i) => (
        <TeamMemberPage key={i} {...member} />
      ))}

      {/* Contact Page */}
      <Page>
        <div style={{ textAlign: 'center' }}>
          <h1>Get in Touch</h1>
          {/* Contact form */}
        </div>
      </Page>
    </HorizontalScroll>
  );
}
```

---

## 📋 Verification Checklist

After implementation:

- [ ] Horizontal scroll works with mouse wheel
- [ ] Pages snap to viewport boundaries
- [ ] Keyboard navigation (←/→/Home/End) works
- [ ] Touch swipe works on mobile/trackpad
- [ ] Scrollbar is hidden
- [ ] Smooth scroll animation (200ms)
- [ ] `prefers-reduced-motion` respected
- [ ] Menu closes when scrolling
- [ ] Video pauses when scrolling away
- [ ] Focus management works correctly
- [ ] Screen reader announces page changes
- [ ] Works in Chrome, Firefox, Safari

---

## 🎨 Design System Compliance

All implementations use tokens from `/design/tokens.json`:

| Element | Token Used | Value |
|---------|-----------|-------|
| Scroll duration | `motion.dur.base` | 200ms |
| Scroll easing | `motion.ease.emphasis` | cubic-bezier(0.2, 0.95, 0.1, 1) |
| Page padding | `spacing.3xl` | 48px |
| Member name size | `typography.size.displayLarge` | 28px |
| Name letter-spacing | `typography.letterSpacing.wide` | 2px |
| Title letter-spacing | `typography.letterSpacing.tight` | 0px |
| Content gap | `spacing.2xl` | 32px |
| Border radius | `radii.lg` | 16px |

**Run verification:**
```bash
npx tsx scripts/verify-design-audit.ts
```

---

## 📚 References

- Implementation guide: `/audit/HORIZONTAL_SCROLL_GUIDE.md`
- Component specs: `/design/components/horizontal-scroll.json`
- Team page spec: `/design/components/team-member-page.json`
- Design tokens: `/design/tokens.json`
- Claude instructions: `/.claude/instructions.md`

---

**Status:** ✅ Ready for implementation
**Next:** Build components following the code above, using design tokens for all values
