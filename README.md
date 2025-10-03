# Vancouver Virtual Productions (VVP)

A minimal, production-ready Next.js (App Router) site for showcasing virtual production services and work. This project is configured for static export and ready for deployment to Firebase Hosting.

## Getting Started

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build and Static Export

Build the project and generate static files:

```bash
npm run build
```

This will create an `out/` directory with the static export ready for deployment.

### Preview Static Export

To preview the static export locally:

```bash
npm run start
```

This serves the `out/` directory on [http://localhost:3000](http://localhost:3000).

## Project Structure

- **App Router**: Uses Next.js 15 App Router with TypeScript
- **Static Export**: Configured with `output: 'export'` for static hosting
- **SEO Ready**: Includes metadata, robots.txt, sitemap.xml, and JSON-LD
- **Accessible**: Proper landmarks, keyboard navigation, and color contrast
- **Responsive**: Mobile-first design with CSS custom properties

## Next Steps for Firebase Hosting

1. **Initialize Firebase**: Run `firebase init hosting` in the project root
2. **Configure Public Directory**: Set `public: out` when prompted
3. **Deploy**: Use `firebase deploy` to publish your site
4. **Custom Domain**: Configure your custom domain in Firebase Console
5. **Environment Variables**: Add any required environment variables to Firebase Functions if needed

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: CSS with custom properties (no external CSS framework)
- **Fonts**: Geist Sans and Geist Mono via Google Fonts
- **Deployment**: Static export ready for Firebase Hosting
