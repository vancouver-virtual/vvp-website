# Images Directory

Place your image assets here, organized by type:

## Recommended Structure:
- `logo.png` - Main VVP logo (dark theme)
- `logo-white.png` - Logo for dark backgrounds
- `hero-image.jpg` - Hero section background image (if not using video)
- `team-photos/` - Individual team member photos
- `project-showcases/` - Portfolio/project images
- `social/` - Social media images, Open Graph images

## File Formats:
- **PNG**: For logos, graphics with transparency
- **JPG**: For photos, complex images
- **WebP**: For optimized web images (recommended)
- **SVG**: For scalable icons and simple graphics

## Naming Convention:
- Use kebab-case: `hero-video-thumbnail.jpg`
- Include dimensions for responsive images: `logo-256.png`, `logo-512.png`
- Include theme variants: `logo-dark.png`, `logo-light.png`

## Usage in Code:
```jsx
// Direct path reference (starts with /)
<img src="/images/logo.png" alt="VVP Logo" />

// With Next.js Image component (recommended)
import Image from 'next/image'
<Image src="/images/logo.png" alt="VVP Logo" width={200} height={60} />
```
