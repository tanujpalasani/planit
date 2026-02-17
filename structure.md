# PlanIt Project Structure

This file reflects the current filesystem as of February 17, 2026.

Notes:
- All files and folders are listed at file level.
- Dependency and VCS directories are excluded: `node_modules`, `.git`.

## Tree

```
.
├─ client/
│  ├─ .gitignore
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package.json
│  ├─ package-lock.json
│  ├─ postcss.config.js
│  ├─ README.md
│  ├─ tailwind.config.js
│  ├─ vite.config.js
│  ├─ public/ (empty)
│  └─ src/
│     ├─ App.jsx
│     ├─ index.css
│     ├─ main.jsx
│     ├─ assets/
│     │  └─ logo/
│     │     ├─ logo-dark.svg
│     │     ├─ logo-icon.svg
│     │     └─ logo-light.svg
│     ├─ components/
│     │  ├─ dashboard/
│     │  │  ├─ CreateProjectModal.jsx
│     │  │  ├─ CreateTaskModal.jsx
│     │  │  ├─ Sidebar.jsx
│     │  │  └─ Topbar.jsx
│     │  ├─ home/
│     │  │  ├─ CTA.jsx
│     │  │  ├─ Features.jsx
│     │  │  ├─ Hero.jsx
│     │  │  └─ SocialProof.jsx
│     │  └─ layout/
│     │     ├─ Footer.jsx
│     │     └─ LandingNavbar.jsx
│     ├─ hooks/ (empty)
│     ├─ layouts/
│     │  └─ DashboardLayout.jsx
│     ├─ pages/
│     │  ├─ Dashboard/
│     │  │  ├─ DashboardHome.jsx
│     │  │  ├─ ProjectDetails.jsx
│     │  │  └─ Projects.jsx
│     │  ├─ Home/
│     │  │  └─ Home.jsx
│     │  ├─ Login/
│     │  │  └─ Login.jsx
│     │  └─ Signup/
│     │     └─ Signup.jsx
│     ├─ routes/
│     │  └─ AppRouter.jsx
│     ├─ services/ (empty)
│     ├─ store/ (empty)
│     ├─ styles/ (empty)
│     └─ utils/ (empty)
└─ structure.md
```
