# Expense Manager Frontend

A responsive, minimal-yet-vibrant expense management interface inspired by the provided product brief and mockups. The application is built with React, Vite, Tailwind CSS, and Radix UI primitives (Shadcn-inspired) using plain JavaScript.

## ✨ Highlights

- **Role-specific workspaces** for Admins, Managers, and Employees with dedicated navigation and layouts.
- **Polished UI components** (buttons, cards, tabs, selects, toasts, etc.) implemented in JavaScript for easy reuse.
- **Responsive design** with a comfy, rounded aesthetic that adapts beautifully from mobile to desktop.
- **Toast notifications** powered by both Radix and Sonner for flexible feedback patterns.
- **Opinionated routing structure** with nested layouts and path aliases via `@` for maintainability.

## 🚀 Getting Started

> **Prerequisite:** Ensure Node.js ≥ 18 is installed and available on your PATH.

```powershell
cd "c:\OdooHackathon\New folder\frontend"
npm install
npm run dev
```

The development server defaults to `http://localhost:5173`.

## 🧪 Quality Checks

```powershell
npm run build      # Production bundle
npm run preview    # Preview the production build
npm run lint       # Lint source files
```

> If `npm` is not recognised, install [Node.js](https://nodejs.org/) or add it to your environment variables before running the commands above.

## 📁 Project Structure

```
frontend/
├─ public/                 # Static assets
├─ src/
│  ├─ components/
│  │  ├─ layout/          # Shared shells for each workspace
│  │  └─ ui/              # Reusable UI primitives
│  ├─ hooks/              # Custom hooks (toast manager, etc.)
│  ├─ pages/
│  │  ├─ admin/           # Admin screens (dashboard, users, rules, expenses)
│  │  ├─ employee/        # Employee screens (dashboard, submit, history)
│  │  └─ manager/         # Manager screens (dashboard, team expenses)
│  ├─ App.jsx             # Router with nested layouts
│  ├─ index.css           # Tailwind theme tokens & utility layers
│  └─ main.jsx            # Application bootstrap
├─ package.json
├─ tailwind.config.js
└─ vite.config.js
```

## ⚙️ Configuration Notes

- Tailwind is themed with white/black primaries and accent greens, reds, and blues per the brief.
- Path aliases are configured through `vite.config.js` and `jsconfig.json` (use `@/` to reference `src/`).
- Toast logic mirrors the TypeScript reference repo but rewritten in JavaScript.
