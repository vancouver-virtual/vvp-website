# Menu

## Overview
The Menu component is a right-docked glassmorphism panel that slides in from the right edge of the screen. It provides navigation options with focus management and scroll locking. Integrates with the video player for cross-feature interactions. See `/design/tokens.json` for referenced values.

## Anatomy
- **Panel**: Glassmorphism container with backdrop blur and glass styling
- **Header**: Fixed height header area (72px) for branding or close button
- **Content**: Scrollable area containing navigation sections and items
- **Scrim**: Semi-transparent overlay behind the panel when open

### Token Mapping
| Element | Token Reference | Description |
|---------|----------------|-------------|
| Panel width | `menu.width` | Fixed width of 420px |
| Header height | `menu.headerHeight` | Fixed height of 72px |
| Background | `colors.glass.bg` | Semi-transparent glass background |
| Border | `colors.glass.border` | Subtle left border |
| Backdrop blur | `blur.glass` | 18px blur effect |
| Shadow | `elevation.e2` | Drop shadow for depth |
| Z-index | `z.menu` | Layer stacking order |
| Motion | `motion.dur.base`, `motion.ease.emphasis` | Slide animation timing |

## Variants

### Default
**When to use**: Standard navigation menu for site links and sections
- Right-docked glassmorphism panel
- Slides in from +32px offset with emphasis easing
- Contains organized sections (Explore, Contact)
- **Do**: Use for primary site navigation
- **Don't**: Use for dropdown menus or inline content

## States & Interactions

| State | Visual Changes | Behavior |
|-------|----------------|----------|
| Closed | Panel off-screen (translateX(100%)) | No interaction |
| Opening | Slides in from right (+32px offset) | Focus trap activates, scroll locks |
| Open | Panel fully visible | Focus trapped, scroll locked |
| Closing | Slides out to right | Focus returns, scroll unlocks |

### Menu Item Interactions
- Menu item links use **opacity shift or color change** on hover (no underline)
- Uppercase navigation items use **1px letter-spacing** for improved readability
- Hover transitions use `motion.dur.base` (200ms) with smooth easing

## Accessibility
- **Role**: `dialog` with `aria-modal="true"`
- **ARIA**: `aria-label="Site menu"` for screen readers
- **Focus trap**: Prevents tab navigation outside menu
- **Return focus**: Returns focus to toggle button when closed
- **Keyboard**: ESC key closes menu, Tab cycles through items
- **Screen readers**: Announces menu open/close state

## Behavior & Events

| Event | Action | Result |
|-------|--------|---------|
| OPEN_MENU | Menu button clicked | Panel slides in, focus trapped, scroll locked |
| CLOSE_MENU | Close button/backdrop clicked | Panel slides out, focus returns, scroll unlocked |
| ESC_KEY | Escape key pressed | Menu closes and focus returns to toggle |
| PLAY_WITH_SOUND | Video button clicked while menu open | Menu closes first, then video escalates to fullscreen |

### Cross-Feature Integration
When `PLAY_WITH_SOUND` event occurs while menu is open:
1. Menu closes immediately
2. Focus returns to video button
3. Video escalates to fullscreen with sound

## Implementation Notes
- Use `position: fixed` for proper layering
- Implement `backdrop-filter` for glassmorphism effect
- Lock body scroll when open to prevent background scrolling
- Use `inert` attribute or focus trap library for accessibility
- Handle iOS Safari viewport issues with fixed positioning
- Ensure proper z-index stacking with video player

## QA Checklist
- [ ] Panel slides in smoothly from right edge
- [ ] Focus trap prevents tab navigation outside menu
- [ ] ESC key closes menu and returns focus
- [ ] Body scroll is locked when open
- [ ] Glassmorphism effect renders correctly
- [ ] Menu closes when backdrop is clicked
- [ ] Cross-feature integration with video player works
- [ ] Screen reader announces menu state changes
- [ ] Touch gestures work on mobile devices
- [ ] Reduced motion preferences respected

## Examples

```jsx
// Basic menu with items
<Menu 
  isOpen={isMenuOpen}
  items={[
    { label: "Approach", href: "/approach", section: "Explore" },
    { label: "Team", href: "/team", section: "Explore" },
    { label: "Email", href: "mailto:hello@vvp.com", section: "Contact" }
  ]}
/>

// Menu toggle button
<Button 
  variant="Ghost" 
  onClick={() => setIsMenuOpen(!isMenuOpen)}
  aria-controls="menu-panel"
  aria-expanded={isMenuOpen}
>
  Menu
</Button>

// Menu with custom sections
<Menu 
  isOpen={true}
  items={[
    { label: "Services", href: "/services", section: "Explore" },
    { label: "Portfolio", href: "/portfolio", section: "Explore" },
    { label: "Investor Relations", href: "/investors", section: "Explore" },
    { label: "Call", href: "tel:+1234567890", section: "Contact" }
  ]}
/>
```
