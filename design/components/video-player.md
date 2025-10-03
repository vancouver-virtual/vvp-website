# Video Player

## Overview
The Video Player component provides a background hero video that automatically plays muted and loops inline, with the ability to escalate to fullscreen with audio. It integrates with the menu system for cross-feature interactions. The video is decorative and doesn't contain essential content. See `/design/tokens.json` for referenced values.

## Anatomy
- **Video Element**: HTML5 video with cover object-fit for background display
- **Close Chip**: Persistent close button in fullscreen mode (glassmorphism style)
- **Scrim**: Semi-transparent overlay for fullscreen mode

### Token Mapping
| Element | Token Reference | Description |
|---------|----------------|-------------|
| Background | `colors.bg.base` | Dark background color |
| Z-index | `z.videoBg` | Background layer (0) |
| Fullscreen controls | `z.fsControls` | Above video layer (40) |
| Close chip background | `colors.glass.bg` | Semi-transparent glass |
| Close chip border | `colors.glass.border` | Subtle border |
| Close chip blur | `blur.glass` | Backdrop filter effect |

## Variants

### Default
**When to use**: Background hero video for landing pages or immersive experiences
- Autoplay, muted, looped, plays inline
- Covers full viewport with object-fit: cover
- Escalates to fullscreen with audio on user interaction
- **Do**: Use for immersive background experiences
- **Don't**: Use for content videos with essential information

## States & Interactions

| State | Description | Behavior |
|-------|-------------|----------|
| MutedInlineLoop | Autoplay, muted, looped, inline | Default state, menu closed |
| FSWithSound | Fullscreen with audio enabled | Close chip visible, ESC/close exits |
| InlineMenuOpen | Background continues, menu open | Menu panel visible, video muted |

## Accessibility
- **Role**: `presentation` (decorative content)
- **ARIA**: `aria-hidden="true"` since no essential content
- **Keyboard**: ESC key exits fullscreen mode
- **Focus**: Close chip is focusable in fullscreen
- **Screen readers**: Video is ignored as decorative content
- **Motion**: Respects reduced motion preferences

## Behavior & Events

| Event | Current State | Target State | Actions |
|-------|---------------|--------------|---------|
| PLAY_WITH_SOUND | MutedInlineLoop | FSWithSound | Unmute + enter fullscreen |
| PLAY_WITH_SOUND | InlineMenuOpen | FSWithSound | Close menu + unmute + fullscreen |
| CLOSE_FS | FSWithSound | MutedInlineLoop | Exit fullscreen + mute |
| ESC_KEY | FSWithSound | MutedInlineLoop | Exit fullscreen + mute |
| OPEN_MENU | MutedInlineLoop | InlineMenuOpen | Open menu panel |
| CLOSE_MENU | InlineMenuOpen | MutedInlineLoop | Close menu panel |

### State Machine Integration
Based on the FSM from `/INTERACTION_MODEL.json`:
- **Initial State**: MutedInlineLoop
- **Transitions**: Follow the defined state machine
- **Actions**: Unmute, mute, enter fullscreen, exit fullscreen, menu operations

## Implementation Notes

### Platform Considerations
- **iOS Safari**: Use `playsInline` attribute for inline playback
- **Fullscreen API**: Implement both standard and webkit prefixes
- **Mobile**: Ensure touch events work for close chip
- **Performance**: Preload video metadata, optimize file sizes

### Technical Details
- Use `object-fit: cover` for proper aspect ratio handling
- Implement proper fullscreen API with fallbacks
- Handle orientation changes in fullscreen mode
- Reserve aspect ratio space to prevent layout shift
- Use intersection observer for performance optimization

### Cross-Feature Integration
- Menu system can trigger video state changes
- Close chip uses glassmorphism styling from design tokens
- Focus management coordinates with menu focus trap

## QA Checklist
- [ ] Video autoplays muted and loops inline
- [ ] Fullscreen escalation works on all browsers
- [ ] Close chip is visible and functional in fullscreen
- [ ] ESC key exits fullscreen mode
- [ ] Audio unmutes correctly in fullscreen
- [ ] Menu integration works (closes menu before fullscreen)
- [ ] Touch gestures work on mobile devices
- [ ] Video covers full viewport without distortion
- [ ] Performance is smooth on various devices
- [ ] Reduced motion preferences respected
- [ ] Screen readers ignore decorative video
- [ ] Focus management works with close chip

## Examples

```jsx
// Basic hero video
<VideoPlayer 
  src="/hero-video.mp4"
  poster="/hero-poster.jpg"
  loop={true}
  playsInline={true}
  initialMuted={true}
/>

// With close chip in fullscreen
<VideoPlayer src="/hero-video.mp4">
  <CloseChip 
    onClose={() => exitFullscreen()}
    aria-label="Close video and return"
  />
</VideoPlayer>

// Integrated with menu system
<VideoPlayer 
  src="/hero-video.mp4"
  onPlayWithSound={() => {
    if (isMenuOpen) {
      closeMenu();
    }
    enterFullscreen();
  }}
/>
```

### Close Chip Component
The close chip appears in fullscreen mode with glassmorphism styling:

```jsx
<CloseChip 
  style={{
    position: 'absolute',
    top: 'spacing.lg',
    right: 'spacing.lg',
    backgroundColor: 'colors.glass.bg',
    border: '1px solid colors.glass.border',
    backdropFilter: 'blur(blur.glass) saturate(120%)',
    borderRadius: 'radii.pill',
    padding: 'spacing.sm spacing.md',
    boxShadow: 'elevation.e1',
    zIndex: 'z.fsControls'
  }}
>
  × Close
</CloseChip>
```
