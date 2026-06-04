Developer setup and helpful scripts

This file documents useful scripts and commands for local development.

Scripts (npm run <script>):
- dev: start Vite dev server (default behavior, auto-selects free port)
- start:dev: start Vite on port 5173 (useful if you want a fixed port)
- rebuild-deps: run `npm ci && npm rebuild` to fully reinstall and rebuild native modules
- check:css-imports: scan src/ for deprecated CSS imports from third-party packages and fail if any are found
- build: build production bundle (vite build)
- preview: preview the built site (vite preview)
- lint: run ESLint across the project

Troubleshooting
- Port conflicts: if port 5173 is in use, start the dev server on another port with `npm run dev` (Vite auto-selects) or change the port in start:dev.
- CSS import errors: run `npm run check:css-imports` to detect deprecated import paths; fix imports to use package-exported CSS paths (examples: `@uiw/react-md-editor/markdown-editor.css`, `@uiw/react-markdown-preview/markdown.css`).
