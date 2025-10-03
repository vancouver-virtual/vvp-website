This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Design System

**⚠️ IMPORTANT:** This project enforces a strict design system. All UI code must use tokens from `/design/tokens.json`.

- **Design tokens:** [/design/tokens.json](design/tokens.json)
- **Component specs:** [/design/components/](design/components/)
- **Audit report:** [/audit/report.md](audit/report.md)
- **Claude Code rules:** [/.claude/instructions.md](.claude/instructions.md)

### Quick Rules
- ✅ Use token references (e.g., `tokens.colors.on.bg`)
- ✅ 1px letter-spacing on ALL uppercase text
- ✅ Opacity/color hover effects (NOT underlines)
- ✅ Motion timing from `motion.dur.*` tokens
- ❌ No hard-coded colors, spacing, or timing
- ❌ No underline hover effects
- ❌ No arbitrary z-index values

### Validation
```bash
npx tsx scripts/verify-design-audit.ts
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
