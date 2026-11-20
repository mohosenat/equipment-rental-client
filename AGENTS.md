<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# RENTRO — Equipment Rental Marketplace

## Project

RENTRO is an equipment rental marketplace built with Next.js 16 (App Router), TypeScript and Tailwind CSS v4. The existing shadcn components (Base UI primitives) and installed libraries must be preserved.

## Design Direction

Premium, modern, editorial and professional.

- **Light theme:** white background, dark text, black primary actions, subtle gray surfaces.
- **Dark theme:** `#171A1C` background, `#202428` surfaces, `#343A40` secondary, readable white text.
- Use the existing RENTRO color tokens and theme variables in `src/app/globals.css`. Do not hardcode colors that duplicate a token.
- Fully responsive across mobile, tablet and desktop.
- Refined typography, consistent spacing and subtle animations.
- High-quality equipment imagery.
- Avoid generic layouts, excessive gradients, excessive rounding and unnecessary decoration.

## Development Rules

- Inspect only the files relevant to the current task.
- Before implementing any Next.js feature, read the relevant guide in `node_modules/next/dist/docs/`. This Next.js version has breaking changes; do not rely on prior knowledge.
- Preserve existing components, dependencies, configuration and working code.
- Use existing libraries and UI primitives whenever possible.
- Do not install packages without approval.
- Do not invent backend endpoints or response structures. If an API contract is unclear, ask.
- Keep code straightforward, maintainable and beginner-friendly.
- Avoid unnecessary abstractions and repeated full-project scans.
- Complete one requested milestone at a time.
- Do not modify unrelated files.
- After each task, provide a concise summary of modified files and key decisions.

## Existing Setup to Respect

- App Router source lives in `src/app`; path alias is `@/*` → `src/*`.
- UI primitives live in `src/components/ui` and are built on `@base-ui/react` (not Radix).
- `cn` is available via `@/lib/utils`; some components import it directly from `"cn"`. Follow the surrounding file's convention.
- Theme tokens, dark mode variant and base styles are defined in `src/app/globals.css`.
- `components.json` configures shadcn with the `base-nova` style and lucide icons.
- The theme provider lives in `src/providers/theme-provider.tsx`.
- Do not replace or restructure the existing component library, Tailwind setup, or Next.js configuration without explicit approval.
