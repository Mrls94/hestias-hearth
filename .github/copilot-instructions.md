# Copilot instructions for Hestia's Hearth

This file gives concise, repository-specific guidance for automated coding assistants (Copilot sessions) working in this repository.

## Quick commands
- Install dependencies: npm install
- Dev server (local): npm run dev
- Start dev server on fixed port 5173: npm run start:dev
- Rebuild dependencies (clean install + rebuild): npm run rebuild-deps
- Start dev server on fixed port 5173: npm run start:dev
- Check for deprecated third-party CSS imports: npm run check:css-imports
- Build production bundle: npm run build
- Preview built site: npm run preview
- Lint whole project: npm run lint
- Lint a single file: npm run lint -- <path/to/file>

Notes: No test scripts are included in package.json; there is no built-in test runner in this repository.

## High-level architecture
- Frontend single-page app (React + Vite) located at the repository root (this package):
  - Entry: src/main.jsx — mounts <App /> with BrowserRouter.
  - Router + pages: src/App.jsx defines Routes; pages live under src/pages (Recipes, Shopping, Planner).
  - Reusable UI: src/components holds form and card components (e.g., RecipeForm, RecipeCard).
  - Styling: TailwindCSS via PostCSS; index.css applies Tailwind layers.
  - State & persistence: LocalStorage is the primary persistence layer (see Recipes.jsx), no backend required.
  - Utilities: src/utils.js contains helper functions (e.g., mergeIngredients).

- Infrastructure: hestias-hearth-infra/ — Terraform configuration (deploy.tf, providers.tf). Treat infra separately; changes require cloud credentials and terraform workflow.

- Build output: dist/ is the production artifact produced by `npm run build`.

## Key repository conventions & patterns
- Data shape: Recipe objects are stored in localStorage under key "recipes" and follow the shape:
  {
    id: <number>,           // Date.now() is used currently
    title: <string>,
    ingredients: <array>,   // components parse comma-separated strings into arrays
    steps: <string>,        // Markdown string (edited with MDEditor)
    difficulty: <string>    // 'Mortal' | 'Heroic' | 'Divine'
  }

- Ingredient handling: Ingredients are often provided as comma-separated strings in forms; mergeIngredients(list) accepts strings or objects and returns aggregated {name, quantity} entries.

- IDs: Components currently generate numeric IDs via Date.now(). Avoid refactoring ID generation without updating all places that rely on numeric IDs.

- Markdown: Recipe steps use @uiw/react-md-editor; stored/served as raw markdown strings. Components render markdown previews (MDEditor + ReactMarkdown patterns in components).

- Routing: App.jsx defines three top-level routes: `/` (Recipes), `/shopping` (Pantry), `/planner` (Planner). When adding new pages, register routes here.

- Linting: ESLint config is at eslint.config.js and the project uses `npm run lint`. To lint a single file, pass the path after `--` (e.g., `npm run lint -- src/pages/Recipes.jsx`).

- No tests: There are no automated tests by default. Adding a test runner (Vitest/Jest/Playwright) should include scripts in package.json and CI workflow updates.

## Files to read first when exploring
- src/App.jsx — app routing and high-level layout
- src/pages/Recipes.jsx — data model, localStorage usage, add/delete flows
- src/components/RecipeForm.jsx — how recipes are created and the markdown editor is used
- src/utils.js — helper functions (mergeIngredients)

## Existing AI / assistant config files
- No Copilot/Claude/Cursor/other assistant rules files were found in the repository; this file is the canonical guidance for Copilot sessions.

## Planning
Alwasy plan and let me know the plan before editing.
Please let me know if you have any questions before making the plan!

---

If you need this file expanded to cover CI details, Terraform deployment steps, or guidance for migrating to a backend or adding tests, ask and it will be added.
