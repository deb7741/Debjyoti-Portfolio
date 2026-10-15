# Debjyoti Chowbey — Research Portfolio

Personal research site for Debjyoti Chowbey — live at **https://debjyotiportfolio.vercel.app** — Research Associate at IISc Bangalore, covering analog & mixed-signal IC design, analog computing and hardware security.

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and Framer Motion. The page is fully static (prerendered at build time).

## Updating content

**All text lives in [`lib/content.ts`](lib/content.ts).** The page sections *and* the interactive research terminal read from it, so one edit updates both.

| To add… | Edit in `lib/content.ts` |
|---|---|
| A paper | append to `publications` (status: `Published`, `Accepted`, `Under Review`, `In Preparation`) |
| A job / position | add to the top of `experiences` |
| A project | append to `projects` |
| Project images | put files in `public/projects/<project-id>/` and list them in that project's `images` array — the gallery and lightbox appear automatically |
| Your photo | replace `public/headshot.webp` (square, ~640 px) or set `profile.photo` to `null` |
| An award | append to `honours` |
| The "Seeking PhD positions" badge | edit or set `profile.status` to `null` |
| A skill | add to the right group in `skillCategories` |

The research-map graph (`components/sections/research-graph.tsx`) has its own node list because it needs x/y positions.

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck    # TypeScript check
pnpm build        # production build (type errors fail the build)
```

Requires Node.js 20.9+.

## Deployment

Hosted on Vercel, connected to this GitHub repo: **every push to `main` redeploys the live site automatically** (about a minute). To update the site, edit `lib/content.ts`, commit and push to `main`. Vercel Analytics is enabled in production. The canonical URL used for SEO, the sitemap and social preview cards is taken from `NEXT_PUBLIC_SITE_URL` if set, otherwise from Vercel's production domain automatically. If you add a custom domain, set:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Features

- Light theme by default, with a dark-mode toggle
- Interactive knowledge graph of research areas (mouse, touch and keyboard)
- Hidden research terminal (bottom-right button): `help`, `ls`, `cd`, `cat`, `tree`, `open <section>`, Tab completion
- Auto-generated social preview image, sitemap, robots.txt and structured data for search engines
- Respects the "reduce motion" accessibility setting

This repo replaces the older [personal-portfolio](https://github.com/deb7741/personal-portfolio) site; its photo and contact form now live here.
