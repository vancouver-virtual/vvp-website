# Horizontal Scroll + Pinned Animations Architecture

## Overview
This document explains the scroll architecture used to create a seamless horizontal scroll experience (Landing → Services → Vision) with pinned, in-place animations for the Vision section, similar to https://www.bienvillecapital.com/vision.

## Architecture Pattern

### The Core Concept
1. **Single Pinned Container**: One parent ScrollTrigger pins the entire viewport
2. **Horizontal Translation**: GSAP translates sections horizontally via `transform: translateX()`
3. **Extended Scroll Distance**: Total scroll length = horizontal movement + extra space for pinned animations
4. **Stationary Background**: Fixed background layer creates the illusion of a static screen
5. **Progress-Based Animations**: Child sections read parent's progress and animate accordingly

## File Structure

```
src/
├── app/
│   └── page.tsx                 # Parent container with master ScrollTrigger
├── components/
│   ├── LandingSection.tsx       # First section (100vw)
│   ├── ServicesSection.tsx      # Second section (overflowing content)
│   └── VisionSection.tsx        # Third section (100vw with pinned animations)
└── design/
    └── tokens.json              # Design tokens
```

## Implementation Details

### 1. Parent Container (page.tsx)

#### Key Responsibilities
- Calculate total scroll distance
- Create single pinned ScrollTrigger
- Translate sections horizontally
- Provide extended scroll space for Vision animations
- Set progress window data attributes for child sections

#### Critical Calculations

```typescript
// Section widths
const landingSectionWidth = window.innerWidth;  // 100vw
const servicesContentWidth = /* calculated based on cards grid */;
const visionSectionWidth = window.innerWidth;  // 100vw

// Total container width (all sections side by side)
const totalContainerWidth = landingSectionWidth + servicesContentWidth + visionSectionWidth;

// Horizontal scroll distance (to bring Vision fully into view)
const horizontalScrollDistance = landingSectionWidth + servicesContentWidth;

// Extra scroll space for Vision animations
const visionAnimationScrollHeight = window.innerHeight * 2;  // 2vh for 3 statements

// Total scroll distance
const totalScrollDistance = horizontalScrollDistance + visionAnimationScrollHeight;
```

#### Master Timeline Structure

```typescript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: container,
    start: 'top top',
    end: () => `+=${totalScrollDistance}`,  // Extended for Vision animations
    scrub: 1,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    snap: {
      snapTo: snapPoints,  // [0, landingEnd, servicesEnd, 1]
      duration: { min: 0.2, max: 0.5 },
      ease: 'power1.inOut',
    },
  },
});

// Horizontal movement (first part of scroll)
tl.to(sections, {
  x: () => -horizontalScrollDistance,
  ease: 'none',
}, 0)
// Hold position (during Vision animations)
.to(sections, {
  x: () => -horizontalScrollDistance,  // Same position, no movement
  ease: 'none',
}, horizontalScrollDistance / totalScrollDistance);
```

#### Progress Window Calculation

```typescript
// Vision animations start AFTER horizontal scroll completes
const visionStartProgress = horizontalScrollDistance / totalScrollDistance;
const visionEndProgress = 1.0;

// Pass to child via data attributes
visionElement.dataset.progressStart = visionStartProgress.toString();
visionElement.dataset.progressEnd = visionEndProgress.toString();
```

### 2. Child Section with Pinned Animations (VisionSection.tsx)

#### Key Principles
- **NO independent ScrollTrigger with pin: true** (conflicts with parent)
- Read parent's ScrollTrigger progress
- Use `gsap.ticker` for synchronized updates
- Respect `data-progress-start` and `data-progress-end` from parent

#### Animation Structure

```typescript
useEffect(() => {
  // Find parent's pinned ScrollTrigger
  const parentScrollTrigger = ScrollTrigger.getAll().find(t => t.vars.pin === true);
  if (!parentScrollTrigger) return;

  // Read progress window from data attributes
  const visionStart = parseFloat(container.dataset.progressStart || '0.66');
  const visionEnd = parseFloat(container.dataset.progressEnd || '1.0');
  const visionRange = visionEnd - visionStart;

  // Sync with parent using GSAP ticker
  const tickerFunc = () => {
    const parentProgress = parentScrollTrigger.progress;

    if (parentProgress >= visionStart && parentProgress <= visionEnd) {
      // Map parent progress to local progress (0-1)
      const localProgress = (parentProgress - visionStart) / visionRange;

      // Animate statements based on localProgress
      animateStatements(localProgress);
    }
  };

  gsap.ticker.add(tickerFunc);

  return () => {
    gsap.ticker.remove(tickerFunc);
  };
}, []);
```

#### Statement Animation Timing

Each statement gets 1/3 of the Vision progress window:

```typescript
const progressPerStatement = 1 / 3;

// Statement 1: 0.0 → 0.33
// Statement 2: 0.33 → 0.66
// Statement 3: 0.66 → 1.0

// Within each statement's window:
const statementStart = index * progressPerStatement;
const fadeInEnd = statementStart + (progressPerStatement * 0.3);    // 30% fade in
const holdEnd = statementStart + (progressPerStatement * 0.7);      // 40% hold
const statementEnd = (index + 1) * progressPerStatement;            // 30% fade out
```

### 3. Stationary Background Effect

#### The Problem
When using `transform: translateX()` on a parent, `background-attachment: fixed` breaks because the transform creates a new coordinate system.

#### The Solution
Add a fixed background layer **inside the pinned container** but **outside the translating content**:

```tsx
<div ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
  {/* Fixed background - stays in place */}
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: tokens.colors.bg.base,
    zIndex: 0,
  }} />

  {/* Translating content */}
  <div ref={sectionsRef} style={{ display: 'flex', willChange: 'transform' }}>
    <LandingSection />
    <ServicesSection />
    <VisionSection />
  </div>
</div>
```

## CSS/Styling Requirements

### 1. Parent Container
```css
{
  overflow: 'hidden',      /* Hide horizontal overflow */
  height: '100vh',         /* Full viewport height */
  width: '100vw',          /* Full viewport width */
  position: 'relative',    /* For absolute background layer */
}
```

### 2. Sections Container
```css
{
  display: 'flex',                    /* Horizontal layout */
  width: '${widthInVw}vw',           /* Calculated total width */
  height: '100vh',                   /* Full height */
  willChange: 'transform',           /* Optimize for transforms */
}
```

### 3. Individual Sections
```css
{
  position: 'relative',    /* For internal positioning */
  minWidth: '100vw',      /* At least full viewport width */
  height: '100vh',        /* Full viewport height */
  flexShrink: 0,          /* Prevent shrinking */
}
```

### 4. Vision Section Statements (Stacked Panels)
```css
{
  position: 'absolute',    /* Stack on top of each other */
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',   /* Prevent interaction */
}
```

## Animation Transitions

### Fade In/Out with Scale and Y-movement

```typescript
// Initial state (before fade in)
gsap.set(spans, { opacity: 0, scale: 0.8, y: 30 });

// Fade in (0% → 30%)
gsap.set(span, {
  opacity: phaseProgress,                    // 0 → 1
  scale: 0.8 + (phaseProgress * 0.2),       // 0.8 → 1.0
  y: 30 - (phaseProgress * 30)              // 30 → 0
});

// Hold (30% → 70%)
gsap.set(span, { opacity: 1, scale: 1, y: 0 });

// Fade out (70% → 100%)
gsap.set(span, {
  opacity: 1 - phaseProgress,                // 1 → 0
  scale: 1 + (phaseProgress * 0.1),         // 1.0 → 1.1
  y: -(phaseProgress * 20)                  // 0 → -20
});
```

## Accessibility

### Reduced Motion Support

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Disable snap
  snap: false

  // Show only middle statement, no animations
  statements.forEach((statement, index) => {
    const spans = statement.querySelectorAll('span');
    gsap.set(spans, { opacity: index === 1 ? 1 : 0, scale: 1, y: 0 });
  });
  return;
}
```

### Responsive Typography

```css
fontSize: 'clamp(48px, 5vw, 64px)'  /* Scales between 48px and 64px */
```

## Snap Points

```typescript
// Define snap points as progress values (0-1)
const snapPoints = [
  0,                                      // Landing start
  landingEnd / horizontalScrollDistance,  // Landing → Services
  servicesEnd / horizontalScrollDistance, // Services → Vision
  1,                                      // Vision end
];
```

## Common Pitfalls & Solutions

### ❌ Problem: Vision section not visible
**Cause**: Container width doesn't include all sections
**Solution**: `totalContainerWidth = landing + services + vision`

### ❌ Problem: Animations start too early
**Cause**: Vision progress window starts when Vision begins sliding in
**Solution**: Set `visionStartProgress = horizontalScrollDistance / totalScrollDistance`

### ❌ Problem: Conflicting ScrollTriggers
**Cause**: Child creates its own pinned ScrollTrigger
**Solution**: Use parent's progress via `gsap.ticker`, not a separate pin

### ❌ Problem: Background scrolls with content
**Cause**: Using `background-attachment: fixed` on transformed element
**Solution**: Add fixed `position: absolute` background layer in parent

### ❌ Problem: Animations not smooth
**Cause**: Using `requestAnimationFrame` instead of GSAP's ticker
**Solution**: Use `gsap.ticker.add()` for synchronized updates

### ❌ Problem: Memory leaks on navigation
**Cause**: ScrollTriggers not cleaned up
**Solution**:
```typescript
useEffect(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  return () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
}, []);
```

## Performance Optimizations

1. **willChange: 'transform'** - Hints browser to optimize transforms
2. **gsap.ticker** - Syncs with GSAP's render loop (60fps)
3. **scrub: 1** - Smooths scroll with 1-second delay
4. **invalidateOnRefresh: true** - Recalculates on window resize
5. **anticipatePin: 1** - Prevents layout shifts when pinning

## URL Hash Updates

```typescript
onUpdate: (self) => {
  const progress = self.progress;
  let newSection = '';

  if (progress < servicesThreshold) {
    newSection = '';  // Landing
  } else if (progress < visionThreshold) {
    newSection = 'services';
  } else {
    newSection = 'vision';
  }

  if (newSection !== currentSection) {
    currentSection = newSection;
    window.history.replaceState(null, '', newSection ? `/#${newSection}` : '/');
  }
}
```

## Testing Checklist

- [ ] All three sections visible in order
- [ ] Smooth horizontal scroll through Landing → Services
- [ ] Vision section stops horizontally when fully in view
- [ ] Vision header visible immediately
- [ ] Statements fade in one at a time (not simultaneously)
- [ ] Statements only animate after Vision is fully visible
- [ ] Background appears stationary throughout
- [ ] Snap points work at section boundaries
- [ ] Reduced motion shows middle statement only
- [ ] No ScrollTrigger conflicts or warnings in console
- [ ] No layout shifts when pinning/unpinning
- [ ] Smooth performance at 60fps
- [ ] Works on window resize

## Example Values

For a typical setup:
- **Landing**: 100vw (1920px on 1920px screen)
- **Services**: ~2200px total width
- **Vision**: 100vw (1920px)
- **Horizontal scroll distance**: 1920 + 2200 = 4120px
- **Vision animation scroll**: 2vh = 3840px
- **Total scroll distance**: 4120 + 3840 = 7960px
- **Vision start progress**: 4120 / 7960 ≈ 0.52
- **Vision end progress**: 1.0

## Key Takeaways

1. **One pin to rule them all**: Parent controls everything via a single pinned ScrollTrigger
2. **No nested pins**: Children read parent's progress, never create their own pins
3. **Extended scroll space**: Add extra scroll distance for pinned animations
4. **Fixed background trick**: Absolute positioned layer inside pinned container
5. **Data attributes**: Parent calculates and passes progress windows to children
6. **gsap.ticker sync**: Children use ticker, not requestAnimationFrame
7. **Timeline holds**: Use duplicate `.to()` calls to hold position during animations

This architecture creates the Bienville-style experience: horizontal scroll through sections, then vertical scroll animates content in place while maintaining a stationary background.
