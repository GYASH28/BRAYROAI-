# BRAYROAI Project Context

## Verified identity
- GitHub account: `GYASH28`
- Repository: `GYASH28/BRAYROAI-`
- Default branch: `main`
- Latest commit: `b7ffe78a0ca143d49bfc84bc7c53f9035a8fe2c5` — Export production build in QA artifact for preview deploys
- Local checkout status: Connected to `origin/main` at the expected repository with admin access. The worktree was clean before this report was added.
- Open pull requests: `#2` — Verify BRAYROAI production launch (`production-verification` → `main`)
- Open issues: None
- GitHub Actions: Quality Gate and Production Smoke are active; the latest runs for `main` succeeded.

## Live deployment
- Vercel account/team: `gyash28` / `gyash28's projects`
- Vercel project: `brayroai`
- Production URL: `https://brayroai.vercel.app`
- Latest production deployment: `https://brayroai-o8987bsx2-gyash28s-projects.vercel.app` — Ready
- Latest preview deployment: `https://brayroai-2mpp1iggv-gyash28s-projects.vercel.app` — Ready
- Connected branch: `main` (confirmed by the production Git-branch alias)
- Domain status: The `brayroai.vercel.app` alias maps to the Ready production deployment. No custom domains are configured in the team.
- Environment variables: None configured for the `brayroai` project.

## Build and codebase
- Framework: Vite with semantic HTML, CSS, and vanilla JavaScript
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: `.`
- Install command: `npm install`
- Node.js version: `24.x`
- Test commands: `npm run test:syntax`, `npm run test:integrity`, `npm run build`, `npm run test:browser`, `npm run test:stress`
- Key files: `index.html`, `public/app.js`, `public/styles.css`, `public/experience.css`, `public/site-fixes.css`, `vercel.json`, and `tests/`
- Existing routes: `/`, `/plans`, `/plans.html`, `/case-studies/fakhrimart`, and `/case-studies/fakhrimart.html`; commercial routes redirect to homepage anchors.
- Existing runtime: Frozen `LockedHeroController`, centralized navigation and RAF scheduling, pointer interactions, FakhriMart work scene, system tabs, and IntersectionObserver reveals.

## Asset inventory
- Brand assets: `public/favicon.svg`, `public/site.webmanifest`, Google-hosted Space Grotesk, Manrope, and DM Mono, `hero-background.webp`, and the BRAYROAI wordmark treatment rendered in HTML/CSS.
- Founder assets: `yash-cutout.webp` and `about-yash.webp`.
- Client proof: Real FakhriMart desktop and mobile captures plus `https://fakhriyarns.vercel.app/`.
- Private outbound demos: `public/outbound-fresh/` contains BRAYROAI sales concepts. The upgraded concepts use `noindex,nofollow` and identify themselves as independent concepts rather than official client websites.
- Missing assets: Additional real client case studies, approved client logos, project footage, before/after material, a formal brand SVG system, and professionally exported social/OG artwork. No missing item blocks the CSS/canvas-led cinematic rebuild.

## Existing commercial offer
- The prior public build tiers and their runtime promotion behavior were identified as content to retire during the rebuild.
- Current care plans: Launch ₹2,499/mo, Grow ₹3,999/mo, and Pro ₹5,999+/mo
- Existing contact flows: `mailto:` links to `yashganesh.work@gmail.com` from navigation, plan CTAs, care CTAs, studio, and final contact.

## Required changes for next implementation
- Pricing migration: Replace every prior public build-tier reference across markup, runtime behavior, accessible labels, email subjects, and tests.
- Static sections to rebuild: Immediate plans grid, flat value contrast, static service rows/system tabs, FakhriMart proof staging, founder section, and final contact resolution.
- Existing systems to preserve: Opening loader, frozen hero visuals and typography, native scrolling, one passive scroll listener, one RAF scheduler, semantic content, public anchors/routes, mobile navigation, reduced-motion support, real FakhriMart proof, and contact email.
- Risks / blockers: Pinned storytelling must not reintroduce the fragile historical long-scroll architecture, hide content without JavaScript, trap scrolling, create horizontal overflow, degrade mobile, or overrun current Lighthouse budgets.
