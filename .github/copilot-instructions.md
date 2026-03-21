# Project Guidelines

## Code Style
- Use standalone Angular components (no NgModules) and keep `imports: []` updated in each component.
- Component selectors must use the `app-` prefix and kebab-case (Angular prefix is `app`).
- Prefer inline templates and styles; schematics are configured for inline usage.
- Use Angular signals for state and the new control-flow syntax (`@if`, `@for`) in templates.
- TypeScript is strict; avoid `any` and add explicit member accessibility.

## Architecture
- Routes are defined in `src/app/app.routes.ts` using lazy `import()` components.
- SSR is enabled; keep `src/app/app.config.ts`, `src/app/app.config.server.ts`, `src/app/app.routes.server.ts`, and `src/server.ts` in sync.
- App layout and global styles live in `src/app/app.ts` and `src/styles.css`.

## Build and Test
- Dev server: `npm start` (Angular CLI `ng serve`, default port 4200).
- Build: `npm run build` (production) or `npm run watch` (dev watch).
- Tests: `npm test` (Karma) and `npm run lint` (ESLint).
- SSR runtime: `npm run serve:ssr:wichu-home` (after build).
- Deploy to GitHub Pages: `npm run deploy`.

## Conventions
- Keep component and model files under `src/app/components/` and `src/app/models/`.
- Initial bundle budgets are enforced; watch `angular.json` production budgets if adding large assets.
