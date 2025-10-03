# Videos Directory

Place your video assets here for the video player component.

## Recommended Files:
- `hero-video.mp4` - Main background video (muted, looped)
- `hero-video.webm` - WebM version for better compression
- `hero-poster.jpg` - Thumbnail/poster image for video
- `demo-videos/` - Additional demo or showcase videos

## Video Specifications:
### Hero Video:
- **Format**: MP4 (H.264) + WebM for compatibility
- **Resolution**: 1920x1080 (Full HD) minimum
- **Duration**: 10-30 seconds (loops seamlessly)
- **File Size**: Keep under 10MB for web performance
- **Audio**: Should work well when unmuted (though starts muted)

### Optimization Tips:
- Use video compression tools (HandBrake, FFmpeg)
- Create multiple formats: MP4, WebM, MOV
- Generate poster images from video frames
- Consider using CDN for large video files

## Usage in Code:
```jsx
// VideoPlayer component
<VideoPlayer 
  src="/videos/hero-video.mp4"
  poster="/videos/hero-poster.jpg"
/>

// Direct video element
<video 
  src="/videos/hero-video.mp4"
  poster="/videos/hero-poster.jpg"
  autoPlay
  muted
  loop
  playsInline
/>
```

## Performance Considerations:
- Preload video metadata: `<video preload="metadata">`
- Use `playsInline` for mobile devices
- Implement lazy loading for videos below the fold
- Consider using video streaming for very large files
