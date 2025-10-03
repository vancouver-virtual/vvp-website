# Horizontal Scroll Implementation Guide
## Based on Bienville Capital Analysis

**Goal:** Replicate the seamless horizontal scroll behavior observed on Bienville Capital's website where mouse wheel scrolling moves between full-width pages horizontally.

---

## Overview

Bienville Capital uses a **JavaScript-controlled horizontal scroll** implementation that:
1. Intercepts vertical mouse wheel events
2. Converts them to smooth horizontal scroll movements
3. Snaps to full-page sections
4. Creates seamless page-to-page transitions

---

## Implementation Strategy

### Option 1: CSS Scroll Snap (Recommended)
**Pros:** Native, performant, accessible, no JavaScript required for basic functionality
**Cons:** Less control over easing and transition timing

```css
/* VVP Implementation using design tokens */

.horizontal-scroll-container {
  /* Core horizontal scroll */
  overflow-x: scroll;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;

  /* Layout */
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;

  /* Hide scrollbar */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.horizontal-scroll-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.page {
  /* Snap points */
  scroll-snap-align: start;
  scroll-snap-stop: always;

  /* Full viewport pages */
  min-width: 100vw;
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;

  /* Content layout */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl); /* tokens.spacing.3xl: 48px */
}
```

### Option 2: Scroll Snap + Wheel Hijacking (Enhanced)
**Pros:** Full control over scroll behavior, can customize easing
**Cons:** Requires JavaScript, potential accessibility concerns

```typescript
// Enhanced scroll with wheel event conversion

import { useEffect, useRef } from 'react';

interface HorizontalScrollOptions {
  duration?: number; // ms
  easing?: string;
  threshold?: number; // wheel delta threshold
}

export function useHorizontalScroll(options: HorizontalScrollOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  const {
    duration = 200, // tokens.motion.dur.base
    easing = 'cubic-bezier(0.2, 0.95, 0.1, 1)', // tokens.motion.ease.emphasis
    threshold = 50,
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent default vertical scroll
      e.preventDefault();

      // Skip if already scrolling
      if (isScrolling.current) return;

      // Detect scroll direction from wheel delta
      const delta = e.deltaY || e.deltaX;
      if (Math.abs(delta) < threshold) return;

      // Calculate target scroll position (snap to page width)
      const pageWidth = window.innerWidth;
      const currentPage = Math.round(container.scrollLeft / pageWidth);
      const direction = delta > 0 ? 1 : -1;
      const targetPage = Math.max(0, Math.min(
        currentPage + direction,
        container.scrollWidth / pageWidth - 1
      ));
      const targetScroll = targetPage * pageWidth;

      // Smooth scroll to target
      isScrolling.current = true;
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });

      // Reset scrolling flag after duration
      setTimeout(() => {
        isScrolling.current = false;
      }, duration + 100);
    };

    // Attach wheel listener with passive: false to allow preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [duration, threshold]);

  return containerRef;
}

// Usage in component
export function HorizontalScrollLayout({ children }: { children: React.ReactNode }) {
  const scrollRef = useHorizontalScroll({
    duration: 200, // tokens.motion.dur.base
    easing: 'cubic-bezier(0.2, 0.95, 0.1, 1)', // tokens.motion.ease.emphasis
  });

  return (
    <div
      ref={scrollRef}
      className="horizontal-scroll-container"
      style={{
        overflowX: 'scroll',
        overflowY: 'hidden',
        scrollSnapType: 'x mandatory',
        scrollBehavior: 'smooth',
        display: 'flex',
        width: '100vw',
        height: '100vh',
      }}
    >
      {children}
    </div>
  );
}
```

---

## Team Page Layout Structure

Based on audit of Bienville's `/team` page:

### Layout Specifications

```typescript
// Team page layout tokens
{
  layout: {
    type: 'flex', // Horizontal flex container
    direction: 'row',
    gap: '0', // Pages are full-width, no gap
  },

  teamMember: {
    // Each member is a full page
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'row', // Image left, content right
    alignItems: 'center',
    padding: tokens.spacing['3xl'], // 48px
  },

  typography: {
    name: {
      fontFamily: 'termina, sans-serif', // Or system fallback
      fontSize: '28px',
      fontWeight: 700,
      letterSpacing: tokens.typography.letterSpacing.wide, // 2px for display text
      textTransform: 'uppercase',
    },
    title: {
      fontFamily: '"Benton Sans Bk"', // Or system fallback
      fontSize: '16px',
      fontWeight: 300,
      letterSpacing: tokens.typography.letterSpacing.tight, // 0px
    },
  },
}
```

### Component Structure

```tsx
// Example team member layout (full-page card)

interface TeamMember {
  name: string;
  title: string;
  bio?: string;
  imageUrl?: string;
}

function TeamMemberPage({ member }: { member: TeamMember }) {
  return (
    <div className="page team-member-page">
      {/* Full-width page container */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: tokens.spacing['2xl'], // 32px
        padding: tokens.spacing['3xl'], // 48px
        maxWidth: '1200px',
        margin: '0 auto',
      }}>

        {/* Image/Photo */}
        {member.imageUrl && (
          <div style={{
            flex: '0 0 400px',
            height: '500px',
            borderRadius: tokens.radii.lg, // 16px
            overflow: 'hidden',
            backgroundColor: tokens.colors.glass.bg,
          }}>
            <img
              src={member.imageUrl}
              alt={member.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}

        {/* Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing.md, // 12px
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 700,
            letterSpacing: tokens.typography.letterSpacing.wide, // 2px
            textTransform: 'uppercase',
            color: tokens.colors.on.bg,
          }}>
            {member.name}
          </h2>

          <p style={{
            fontSize: '16px',
            fontWeight: 300,
            letterSpacing: tokens.typography.letterSpacing.tight, // 0px
            color: tokens.colors.on.bgSecondary,
          }}>
            {member.title}
          </p>

          {member.bio && (
            <p style={{
              fontSize: '14px',
              lineHeight: 1.6,
              color: tokens.colors.on.bgSecondary,
              marginTop: tokens.spacing.lg, // 16px
            }}>
              {member.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## VVP Implementation Plan

### 1. Add Scroll Tokens to Design System

```json
// design/tokens.json - ADD THIS

{
  "scroll": {
    "snap": {
      "type": "x mandatory",
      "align": "start",
      "stop": "always"
    },
    "behavior": "smooth",
    "threshold": 50
  },
  "page": {
    "width": "100vw",
    "height": "100vh",
    "padding": "spacing.3xl"
  }
}
```

### 2. Create Horizontal Scroll Component Spec

```json
// design/components/horizontal-scroll.json

{
  "component": "HorizontalScroll",
  "version": "1.0.0",
  "description": "Full-page horizontal scroll container with snap points",
  "tokens": "References to /design/tokens.json",
  "props": {
    "pages": {
      "type": "array",
      "description": "Array of page components to render"
    },
    "enableWheelHijack": {
      "type": "boolean",
      "default": true,
      "description": "Convert vertical wheel to horizontal scroll"
    }
  },
  "variants": {
    "default": {
      "description": "Standard horizontal scroll with snap points",
      "styles": {
        "overflowX": "scroll",
        "overflowY": "hidden",
        "scrollSnapType": "scroll.snap.type",
        "scrollBehavior": "scroll.behavior",
        "display": "flex",
        "flexDirection": "row",
        "width": "page.width",
        "height": "page.height",
        "scrollbarWidth": "none"
      }
    }
  },
  "behavior": {
    "events": ["WHEEL", "SCROLL", "KEYDOWN"],
    "reductions": "Wheel events are converted to horizontal scroll. Each scroll snap moves exactly one page. Arrow keys navigate pages. Smooth scrolling uses motion.dur.base and motion.ease.emphasis."
  },
  "a11y": {
    "keyboard": {
      "arrowLeft": "Previous page",
      "arrowRight": "Next page",
      "home": "First page",
      "end": "Last page"
    },
    "aria": {
      "role": "region",
      "label": "Horizontal scroll pages"
    }
  }
}
```

### 3. Page Structure

```tsx
// Example: app/page.tsx

import HorizontalScroll from '@/components/HorizontalScroll';
import TeamMemberPage from '@/components/TeamMemberPage';

export default function Home() {
  const teamMembers = [
    { name: 'John Doe', title: 'Founder', imageUrl: '/team/john.jpg' },
    { name: 'Jane Smith', title: 'CTO', imageUrl: '/team/jane.jpg' },
    // ...
  ];

  return (
    <HorizontalScroll>
      {/* Hero page */}
      <div className="page hero-page">
        <VideoPlayer src="/hero-video.mp4" />
        <Button variant="VideoPrimary">Play with sound</Button>
      </div>

      {/* Team pages - one per member */}
      {teamMembers.map((member, i) => (
        <TeamMemberPage key={i} member={member} />
      ))}

      {/* Contact page */}
      <div className="page contact-page">
        <h1>Get in Touch</h1>
        {/* Contact form */}
      </div>
    </HorizontalScroll>
  );
}
```

---

## Performance Considerations

### 1. Lazy Load Pages
```tsx
// Only render pages in viewport or adjacent
const visiblePages = pages.filter((_, i) =>
  Math.abs(i - currentPage) <= 1
);
```

### 2. Use `will-change` Sparingly
```css
.page {
  /* Only add will-change when actually scrolling */
  will-change: transform;
}
```

### 3. GPU Acceleration
```css
.horizontal-scroll-container {
  /* Force GPU layer for smooth scrolling */
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

---

## Accessibility

### Keyboard Navigation
```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowRight':
      scrollToPage(currentPage + 1);
      break;
    case 'ArrowLeft':
      scrollToPage(currentPage - 1);
      break;
    case 'Home':
      scrollToPage(0);
      break;
    case 'End':
      scrollToPage(pageCount - 1);
      break;
  }
};
```

### Reduced Motion
```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // Use instant scroll instead of smooth
  container.scrollTo({ left: targetScroll, behavior: 'auto' });
}
```

---

## Testing Checklist

- [ ] Smooth horizontal scroll with mouse wheel
- [ ] Snap to page boundaries
- [ ] Keyboard navigation (arrows, home, end)
- [ ] Touch swipe on mobile/trackpad
- [ ] Reduced motion preference respected
- [ ] No layout shift during scroll
- [ ] Works with focus trap (menu open)
- [ ] Browser back/forward buttons work
- [ ] Deep linking to specific pages

---

**Next Steps:**
1. Implement `HorizontalScroll` component using design tokens
2. Create `Page` wrapper component with snap points
3. Build `TeamMemberPage` component matching Bienville layout
4. Add keyboard navigation and accessibility
5. Test across browsers (especially Safari for smooth scroll)

**Key Design Tokens Used:**
- `motion.dur.base` (200ms) - Scroll duration
- `motion.ease.emphasis` - Scroll easing
- `spacing.3xl` (48px) - Page padding
- `typography.letterSpacing.wide` (2px) - Name/heading tracking
- `colors.on.bg` / `colors.on.bgSecondary` - Text colors
