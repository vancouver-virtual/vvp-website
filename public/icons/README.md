# Icons Directory

Place custom icon assets here (if not using an icon library like Lucide, Heroicons, etc.).

## Recommended Icons for VVP:
- `play.svg` - Play button icon
- `pause.svg` - Pause button icon
- `close.svg` - Close/X icon
- `menu.svg` - Hamburger menu icon
- `sound-on.svg` - Sound enabled icon
- `sound-off.svg` - Sound muted icon
- `fullscreen.svg` - Fullscreen icon
- `external-link.svg` - External link icon

## File Format:
- **SVG**: Preferred for scalability and small file size
- **PNG**: Fallback for complex icons (24x24, 32x32, 48x48)

## Icon Specifications:
- **Size**: 24x24px base size (SVG can scale)
- **Style**: Outline style for consistency
- **Color**: Use currentColor for theme compatibility
- **Stroke Width**: 1.5-2px for visibility

## Usage in Code:
```jsx
// Direct SVG import
<img src="/icons/play.svg" alt="Play" className="w-6 h-6" />

// With Next.js Image component
import Image from 'next/image'
<Image src="/icons/play.svg" alt="Play" width={24} height={24} />

// As background image in CSS
.play-icon {
  background-image: url('/icons/play.svg');
  background-size: contain;
  background-repeat: no-repeat;
}
```

## Alternative: Icon Libraries
Consider using icon libraries instead of custom SVGs:
- **Lucide React**: `<Play className="w-6 h-6" />`
- **Heroicons**: `<PlayIcon className="w-6 h-6" />`
- **React Icons**: `<FaPlay />`

This reduces bundle size and provides consistent styling.
