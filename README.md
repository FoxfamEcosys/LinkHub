# LinkHub

Veri's personal website redesign for verivt.stream.

GitHub repository: `FoxfamEcosys/LinkHub`, confirmed by the user. Local `origin` points to `https://github.com/FoxfamEcosys/LinkHub.git`. The initial build is checked in on GitHub; no live deployment has been made.

## Confirmed design

- Splash: option 1 from the first concept set, retaining its dark charcoal/periwinkle composition and typography.
- Add only the supplied Tenko seal at top-left, restrained lace and bows, and a small gothic cross. Do not use the later shrine-garden redesigns.
- Main site after splash: PostHog-inspired central rounded content window with persistent side navigation; sections should have shareable URLs and working browser history.
- Use `public/images/veri-splash-original.png` for the splash artwork, unchanged except display crop/resize. Do not substitute generated character art or apply filters, recoloring, retouching, or background removal.
- Original supplied PNG: 2174 × 3041, alpha channel present. Copied byte-for-byte and verified against the upload. SHA-256: `e03f1cc53deb59685d066b6f57cf0ed3e4839e2c30bcb4f56e2efe17469d47be`.

## Requested functionality

- Owner-authenticated editing directly on the site, with preview and publish.
- Editable splash image, crop/position, About, Links, Credits and stream rules.
- Add, reorder, hide and update links.
- Prominent top access to stream rules and merch.
- Fourthwall merch integration after receiving and testing the actual storefront URL; iframe compatibility is unverified.
- Updates with dated posts, a pinned announcement, and an archive.
- Responsive mobile navigation, keyboard access, visible focus, reduced-motion support, and SEO metadata.
- Persist published content and uploads; retain original uploaded assets. Enforce authorization and validate external data on the server.

## Pending inputs

- Fourthwall storefront URL.
- Hosting and persistent content/auth service configuration before live publishing.

A local React prototype now includes the splash, section navigation, and browser-only draft editor. Owner authentication, persistent media storage, and publishing have local implementation code but remain unconnected and unverified against a live Supabase project. Nothing has been deployed.

## Local development

Use Node.js 24 and pnpm. Run `pnpm install --frozen-lockfile`, then `pnpm dev`.

Validation: `pnpm typecheck`, `pnpm test`, and `pnpm build`.
The build produces `dist/client`, `dist/server/index.js`, and `dist/.openai/hosting.json` for a later Sites handoff.

## Current editing boundary

The owner studio currently saves text drafts only in this browser. Image files can be previewed without modifying their bytes. Publish remains disabled until owner authentication, persistent content storage, and media storage are connected and tested. Do not treat browser drafts as backups or published changes.

See [Supabase setup and live acceptance](supabase/SETUP.md) for the optional backend. When public environment configuration is absent, the site remains in local preview mode.
