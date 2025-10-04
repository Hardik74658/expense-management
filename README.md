<div align="center">

# FlowTrack – Expense Intelligence Platform

Beautiful, responsive expense management experience crafted for the Odoo Hackathon. Built with React, Vite, Tailwind, and a comfort-first design language to support Admin, Manager, and Employee journeys.

</div>

## ✨ Highlights

- Rounded, glassmorphic aesthetic with vibrant gradients and soft shadows
- Dedicated portals for admins, managers, and employees with tailored navigation
- Conditional approval builder that reflects hybrid rules (sequence, consensus, named approvers)
- OCR-friendly submission flow with live currency conversion preview
- Manager insights, escalation radar, and team transparency dashboards
- Landing page storytelling the platform and linking directly into the workspaces

## 🗂️ Structure

```
frontend/
├── index.html               # Vite entry point + font loading
├── package.json             # React / Tailwind / tooling dependencies
├── postcss.config.js
├── tailwind.config.js       # Design tokens and theme extensions
├── vite.config.js
└── src/
	├── main.jsx             # App bootstrap with React Query + Router
	├── index.css            # Tailwind layers + global styles
	├── layouts/             # Root shell + role-specific dashboard layouts
	├── components/          # Reusable UI primitives, layout pieces, visuals
	├── pages/               # Landing + role pages (admin, manager, employee)
	├── router/              # Route definitions
	├── hooks/               # Exchange-rate helper hook
	└── utils/               # Navigation config + mock data sets
```

## 🚀 Getting started

> **Prerequisites:** Node.js 18+ (installs `npm`), since only JavaScript (no TypeScript) is used.

```powershell
cd frontend
npm install
npm run dev
```

The development server opens on http://localhost:5173 and hot reloads. Build with `npm run build` and preview via `npm run preview`.

## 🧭 Key routes

| Route              | Description |
| ------------------ | ----------- |
| `/`                | Marketing-style landing page with product story |
| `/admin`           | Admin command center dashboard |
| `/admin/rules`     | Visual approval rule composer |
| `/manager`         | Manager inbox prioritised by SLA |
| `/manager/insights`| Spend trajectory + AI insights |
| `/employee`        | OCR-friendly expense submission flow |

All dashboards are responsive (desktop, tablet, mobile) with mobile nav bottom bar.

## 🔗 External services

- **Exchange rates:** `https://api.exchangerate-api.com/v4/latest/{BASE}` fetched via React Query
- **Country & currency metadata:** Ready for integration (`https://restcountries.com/v3.1/all?fields=name,currencies`)

## ✅ Status & next steps

- [x] Tailwind + Vite scaffolding (JS only)
- [x] Shared UI components (buttons, cards, timeline, charts)
- [x] Admin / Manager / Employee workspaces
- [x] Responsive layouts & mobile navigation
- [ ] Wire actual backend APIs for users, expenses, approvals
- [ ] Connect OCR service + upload storage

Enjoy building on FlowTrack! 🎉
