# Copilot Instructions for onlinegames12

## Project Overview
- **Type:** Full-stack Expo/React Native web app for hosting and launching online games via iframes and static assets.
- **Major Directories:**
  - `app/`: Main Expo app, routing, layout, and game logic
  - `components/`: Shared UI components (e.g., `Game.tsx`, header buttons)
  - `assets/`: Game icons, images, fonts
  - `public/`: Static game files and HTML/JS assets for iframe embedding
  - `settings/`: Config files for Wasmer deployment

## Architecture & Data Flow
- **Game Launch:**
  - Home page (`app/index.tsx`) lists games by category, each launches via Expo Router to `/game/[slug]`.
  - Game pages (`app/package/[slug].tsx`) map slugs to URLs in `public/` or external sites, then embed via `<iframe>`.
  - Analytics events are logged on game launch using Firebase (`app/firebaseConfig.ts`).
  - UUIDs are mapped to slugs in `app/uuids.ts`.
- **Remote Notices & Changelog:**
  - Notices and changelog are fetched from remote markdown files on GitHub and rendered in the UI.
- **Header Buttons:**
  - Custom header buttons (`SparxButton`, `TeamsButton`) are injected via Expo Router layout (`app/_layout.tsx`).

## Developer Workflows
- **Local Development:**
  - Start: `npm run start` (runs Expo)
  - Platform targets: `npm run android`, `npm run ios`, `npm run web`
  - Lint: `npm run lint`
  - Test: `npm run test` (Jest)
- **Deployment:**
  - Multi-platform deploy: `npm run deploy` (Render, Wasmer, Vercel)
  - Static export: `npm run predeploy` (exports web build to `dist/`)
- **Wasmer Integration:**
  - Configured via `wasmer.toml` and `app.yaml`, serves static files from `dist/` and `settings/`.

## Project-Specific Patterns
- **Game Routing:**
  - Slug-to-URL mapping is centralized in `app/package/[slug].tsx`.
  - Add new games by updating the `games` object and placing assets in `public/`.
- **Remote Data:**
  - Notices and changelog are parsed from markdown with custom YAML-like frontmatter.
- **Security:**
  - Follow security checklist in `CONTRIBUTING.md` (no secrets in frontend, input validation, HTTPS, CSRF, etc).
- **Changelog:**
  - Update `CHANGELOG.md` for every release and contribution.

## Conventions & Tips
- Use Expo Router for navigation and screen management.
- UI components should be placed in `components/` and reused via imports.
- Game icons are referenced from `assets/images/GameIcons.ts`.
- For analytics, use the exported `logEvent` from `app/firebaseConfig.ts`.
- When adding new games, ensure slugs are unique and match the mapping in `[slug].tsx`.
- For Wasmer deployment, static files must be in `dist/` and config in `settings/`.

## Key Files
- `app/index.tsx`: Home page, game list, notices, changelog
- `app/package/[slug].tsx`: Game launch logic, slug mapping
- `app/_layout.tsx`: Header and navigation layout
- `app/firebaseConfig.ts`: Firebase analytics setup
- `wasmer.toml`, `app.yaml`: Wasmer deployment config
- `CONTRIBUTING.md`: Security and contribution standards
- `CHANGELOG.md`: Release history

---
For questions or unclear patterns, check the above files or ask for clarification. Please suggest improvements if you find missing or outdated instructions.
