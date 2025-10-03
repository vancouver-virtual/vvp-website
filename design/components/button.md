# Button

## Overview
The Button component provides interactive elements with multiple visual variants for different use cases. It supports accessibility features, keyboard navigation, and integrates with the design token system. See `/design/tokens.json` for referenced values.

## Anatomy
- **Container**: Button wrapper with padding, border-radius, and background
- **Label**: Text content with typography styling
- **IconRight**: Optional icon positioned to the right of text

### Token Mapping
| Element | Token Reference | Description |
|---------|----------------|-------------|
| Container padding | `spacing.sm`, `spacing.md` | Horizontal and vertical spacing |
| Border radius | `radii.pill` | Rounded corners |
| Text color | `colors.on.bg` | Primary text color |
| Focus ring | `colors.focus.ring` | Keyboard focus indicator |
| Hover background | `colors.glass.highlight` | Subtle hover state |
| Motion | `motion.dur.base`, `motion.ease.emphasis` | Transition timing |

## Variants

### VideoPrimary
**When to use**: Primary call-to-action buttons, especially for video playback
- Uppercase text with bold weight (800)
- Link-like appearance with optional underline on hover
- Supports right-aligned icons (e.g., play button)
- **Do**: Use for main actions like "Play with sound"
- **Don't**: Use for secondary actions or destructive operations

### IconGhost
**When to use**: Icon-only buttons for close, menu toggle, or other UI controls
- Circular shape (44x44px minimum for accessibility)
- Transparent background with glass border
- Glass highlight on hover
- **Do**: Use for close buttons, menu toggles, or icon-only actions
- **Don't**: Use when text labels are needed

### Ghost
**When to use**: Secondary actions that need subtle presence
- Pill-shaped with transparent background
- Subtle border and hover effects
- **Do**: Use for secondary navigation or menu items
- **Don't**: Use for primary actions

## States & Interactions

| State | Visual Changes | Behavior |
|-------|----------------|----------|
| Default | Base styling applied | Ready for interaction |
| Hover | Background highlight, underline (VideoPrimary) | Cursor changes to pointer |
| Active | Slightly darker background | Visual feedback on click |
| Focus | Focus ring appears | Keyboard navigation indicator |
| Disabled | Reduced opacity, no interactions | All events disabled |

## Accessibility
- **Role**: `button` (implicit or explicit)
- **ARIA**: `aria-disabled` for disabled state
- **Keyboard**: Tab navigation, Enter/Space activation
- **Focus ring**: 2px solid focus ring using `colors.focus.ring`
- **Target size**: Minimum 44x44px for touch targets
- **Screen readers**: Descriptive labels for icon-only buttons

## Behavior & Events

| Event | Action | Result |
|-------|--------|---------|
| CLICK | Button press | Triggers onClick handler |
| HOVER | Mouse enter/leave | Visual state changes |
| FOCUS/BLUR | Keyboard navigation | Focus ring appears/disappears |
| ESC_KEY | Escape key press | Closes modals/menus if applicable |
| PLAY_WITH_SOUND | VideoPrimary variant | Escalates video to fullscreen |
| OPEN_MENU | Menu button | Opens right-side menu panel |

## Implementation Notes
- Use CSS custom properties for token references
- Ensure proper contrast ratios for all states
- Support reduced motion preferences
- Implement proper focus management for keyboard users
- Handle touch events for mobile devices

## QA Checklist
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Focus ring is visible and properly styled
- [ ] Hover states work on desktop
- [ ] Touch targets meet 44x44px minimum
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader announces button purpose
- [ ] Disabled state prevents all interactions
- [ ] Reduced motion preferences respected

## Examples

```jsx
// VideoPrimary with icon
<Button variant="VideoPrimary" iconRight="play">
  Play with sound
</Button>

// IconGhost for close button
<Button 
  variant="IconGhost" 
  iconRight="close" 
  aria-label="Close video"
/>

// Ghost for menu toggle
<Button variant="Ghost">
  Menu
</Button>

// Disabled state
<Button variant="VideoPrimary" disabled>
  Loading...
</Button>
```
