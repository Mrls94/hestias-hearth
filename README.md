# 🔥 Hestia’s Hearth: The Kitchen Companion

A mythology-themed cooking and household dashboard that blends **practical kitchen tools** with a playful, immersive design. Inspired by **Hestia**, the Greek goddess of the hearth, this app helps you manage recipes, shopping lists, cooking timers, and meal planning — while making the kitchen feel like a divine ritual.

---

## ✨ Features (MVP)
- 📖 **Recipe Manager** – Add, view, and organize recipes with ingredients and steps.
- ⏱️ **Cooking Timer** – Start and manage timers for your dishes (themed as “Hestia’s Flame”).
- 🧭 **Simple Navigation** – Switch between Recipes and Timers with ease.
- 💾 **Local Storage** – All data is saved in your browser, no backend required.

---

## 🚀 Roadmap
Planned expansions include:
- 🛒 **Smart Shopping List** – Auto-generate lists from recipes, track pantry items.
- 📅 **Meal Planner** – Drag-and-drop recipes into a weekly calendar.
- 🏛️ **Mythology Gamification** – Unlock blessings from Hestia, Dionysus Mode for party recipes, and an Ambrosia Meter to track your divine meals.
- ☁️ **Cloud Sync** – Multi-device support with Firebase or Supabase.

---

## 🛠️ Tech Stack
- **Frontend**: React + Vite
- **Styling**: TailwindCSS
- **State Management**: React hooks (`useState`, `useReducer`) for MVP
- **Storage**: LocalStorage (expandable to Firebase/Supabase later)

---

## ⚡ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/hestias-hearth.git
cd hestias-hearth
```
### 2. Install Dependencies
```bash
npm install
```

### 3. Run the dev server
```bash
npm run dev
```

If you need a fixed port (5173) use:
```bash
npm run start:dev
```

### 4. Rebuild dependencies (if native modules or node_modules are corrupted)
```bash
npm run rebuild-deps
```

### 5. Check for deprecated CSS imports (helpful for third-party CSS path changes)
```bash
npm run check:css-imports
```

### 6. Build for production
```bash
npm run build
```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
