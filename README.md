# Debjyoti Chowbey — Research Portfolio

Personal research site for Debjyoti Chowbey — live at **https://debjyoti-chowbey-portfolio.vercel.app/#overview** — Research Associate at IISc Bangalore, covering analog & mixed-signal IC design, analog computing and hardware security.

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and Framer Motion. The page is fully static (prerendered at build time).

## Updating content

**All text lives in [`lib/content.ts`](lib/content.ts).** Every tab, the profile card, the quick-search palette *and* the research terminal read from it, so one edit updates both.

| To add… | Edit in `lib/content.ts` |
|---|---|
| A paper | append to `publications` (status: `Published`, `Accepted`, `Under Review`, `In Preparation`) |
| A job / position | add to the top of `experiences` |
| A project | append to `projects` |
| Project images | put files in `public/projects/<project-id>/` and list them in that project's `images` array — the gallery and lightbox appear automatically |
| Your photo | replace `public/headshot.webp` (square, ~640 px) or set `profile.photo` to `null` |
| An award | append to `honours` |
| A news item | add to the top of `news` (shown on Overview) |
| A referee | add to `references` (shown on the References tab) |
| "Last updated" date | `lastUpdated` |
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

- **Card layout** — a sticky profile card on the side and tabs on top; each tab (Overview, Publications, Experience, Projects, Research Map, Skills, Honours, References, Contact) opens as its own card instead of a long scroll. Every tab has its own link (e.g. `/#publications`) and the browser back button works.
- **Quick search** — `Ctrl K` / `⌘ K` (or `/`) jumps to any tab, paper or project, copies the email, toggles the theme or opens the terminal.
- **Publications** — grouped into peer-reviewed and under review, with abstracts, DOI links and one-click **Cite** (BibTeX).
- **References** — faculty referees with official emails and copy buttons.
- **Animated PCB background** — procedurally routed copper traces, IC footprints and vias with signal pulses travelling along the bus.
- Classic light theme by default (navy and copper on paper), dark "solder-mask" theme on toggle.
- Interactive knowledge graph of research areas (mouse, touch and keyboard).
- Hidden research terminal (bottom-right button): `help`, `ls`, `cd`, `cat`, `tree`, `open <tab>`, Tab completion.
- Auto-generated social preview image, sitemap, robots.txt and structured data for search engines.
- Respects the "reduce motion" accessibility setting; full keyboard support (arrow keys move between tabs).

This repo replaces the older [personal-portfolio](https://github.com/deb7741/personal-portfolio) site; its photo and contact form now live here.
