# PlanIt - Project Structure Documentation

## SECTION 1: PROJECT OVERVIEW

### Project Name
**PlanIt** - A modern project management and task tracking platform built with React and Tailwind CSS.

### Tech Stack
- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **Styling**: Tailwind CSS 3.4.19
- **Routing**: React Router DOM 7.13.0
- **Icon Library**: lucide-react 0.564.0
- **CSS Preprocessor**: PostCSS 8.5.6 with Autoprefixer 10.4.24
- **Linting**: ESLint 9.39.1
- **Type Checking**: TypeScript types (@types/react, @types/react-dom)

### Package.json Dependencies
```json
{
  "dependencies": {
    "lucide-react": "^0.564.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.13.0"
  }
}
```

### Dev Dependencies
- @vitejs/plugin-react (5.1.1)
- tailwindcss (3.4.19)
- postcss (8.5.6)
- autoprefixer (10.4.24)
- eslint (9.39.1)
- eslint-plugin-react-hooks (7.0.1)
- eslint-plugin-react-refresh (0.4.24)

### State Management
**No centralized state management tool** - Uses local component state with React's `useState` hook. Each component manages its own state independently.

### Routing System
**React Router DOM v7** - Browser Router pattern with nested routing structure. Dashboard routes are nested under `/dashboard` layout.

### Styling System
**Tailwind CSS** with custom theme configuration:
- Custom color palette (primary, secondary, tertiary, text colors)
- Gradient backgrounds (multi-color: blue → indigo → purple → magenta → pink → orange)
- Custom animations (fadeIn, fade-up with delay variants, float, blob, glow)
- Responsive design with mobile-first approach
- Backdrop blur effects and glass-morphism styling

### Folder Architecture Pattern
```
client/
├── src/
│   ├── pages/         (Page components - routed)
│   ├── components/    (Reusable UI components)
│   │   ├── dashboard/ (Dashboard-specific components)
│   │   ├── home/      (Landing page sections)
│   │   └── layout/    (Shared layout components)
│   ├── layouts/       (Layout wrappers)
│   ├── routes/        (Routing configuration)
│   ├── assets/        (Static assets - logos)
│   ├── hooks/         (Custom React hooks - empty)
│   ├── services/      (API services - empty)
│   ├── utils/         (Utility functions - empty)
│   ├── styles/        (Global styles - empty)
│   ├── context/       (Context API - empty)
│   ├── App.jsx        (Root component)
│   ├── main.jsx       (Entry point)
│   └── index.css      (Global Tailwind directives)
├── public/            (Public assets)
├── package.json
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
├── eslint.config.js
├── index.html
└── README.md
```

---

## SECTION 2: COMPLETE FILE STRUCTURE

```
planit/
├── structure.md
│
└── client/
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── README.md
    ├── tailwind.config.js
    ├── vite.config.js
    │
    ├── public/
    │
    ├── src/
    │   ├── App.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   │
    │   ├── assets/
    │   │   └── logo/
    │   │       ├── logo-dark.svg
    │   │       ├── logo-icon.svg
    │   │       └── logo-light.svg
    │   │
    │   ├── components/
    │   │   ├── dashboard/
    │   │   │   ├── layout/
    │   │   │   │   ├── Sidebar.jsx
    │   │   │   │   └── Topbar.jsx
    │   │   │   ├── project/
    │   │   │   │   ├── CreateProjectModal.jsx
    │   │   │   │   └── ProjectCard.jsx
    │   │   │   └── task/
    │   │   │       ├── CreateTaskModal.jsx
    │   │   │       ├── SubtaskItem.jsx
    │   │   │       └── TaskCard.jsx
    │   │   ├── home/
    │   │   │   ├── CTA.jsx
    │   │   │   ├── Features.jsx
    │   │   │   ├── Hero.jsx
    │   │   │   └── SocialProof.jsx
    │   │   └── layout/
    │   │       ├── Footer.jsx
    │   │       └── LandingNavbar.jsx
    │   ├── context/ (empty)
    │   ├── hooks/ (empty)
    │   ├── layouts/
    │   │   └── DashboardLayout.jsx
    │   ├── pages/
    │   │   ├── Dashboard/
    │   │   │   ├── DashboardHome.jsx
    │   │   │   ├── Profile.jsx
    │   │   │   ├── ProjectDetails.jsx
    │   │   │   ├── Projects.jsx
    │   │   │   └── Tasks.jsx
    │   │   ├── Home/
    │   │   │   └── Home.jsx
    │   │   ├── Login/
    │   │   │   └── Login.jsx
    │   │   └── Signup/
    │   │       └── Signup.jsx
    │   ├── routes/
    │   │   └── AppRouter.jsx
    │   ├── services/ (empty)
    │   ├── styles/ (empty)
    │   └── utils/ (empty)
```

---

## SECTION 3: FILE-BY-FILE ANALYSIS

### Core Application Files

**src/App.jsx**
- Purpose: Root component wrapper
- Imports: AppRouter
- Exports: App component (default)
- Functionality: Returns AppRouter component

**src/main.jsx**
- Purpose: React application entry point
- Imports: React, ReactDOM, App.jsx, index.css
- Creates React root and renders App in StrictMode

**src/index.css**
- Purpose: Global styles and Tailwind CSS directives
- Content: @tailwind base, components, utilities; body styling

**src/routes/AppRouter.jsx**
- Purpose: Central routing configuration
- Routes: 8 routes total (/ /login /signup /dashboard and nested routes)
- Imports: BrowserRouter, Routes, Route; all page and layout components
- Exports: AppRouter component

---

### Layout Components

**src/layouts/DashboardLayout.jsx**
- Purpose: Main dashboard layout wrapper with Sidebar and Topbar
- Imports: Outlet, Sidebar, Topbar
- Structure: Fixed Sidebar (w-64), Main area with Topbar (h-16) + Outlet
- Background: Glow effects (purple/pink gradients)

**src/components/dashboard/layout/Sidebar.jsx**
- Purpose: Fixed left sidebar navigation
- Imports: NavLink, useNavigate; Logo SVG; lucide-react icons
- Features: 4 nav items (Dashboard, Projects, Tasks, Profile), Logout button
- Active state detection via NavLink
- Fixed position: left-0, w-64, h-screen

**src/components/dashboard/layout/Topbar.jsx**
- Purpose: Top navigation bar with dynamic title and user section
- Imports: useLocation; Search icon
- Dynamic title based on route pathname
- User profile section with avatar and role
- Search input (hidden on mobile)

---

### Page Components - Public

**src/pages/Home/Home.jsx**
- Purpose: Landing page composition
- Components: LandingNavbar, Hero, Features, CTA, Footer
- Layout: Vertical sections with animations

**src/pages/Login/Login.jsx**
- Purpose: User login form
- Form fields: Email, Password
- Features: Animated blob background; Login/Signup links
- State: None (form data not managed)

**src/pages/Signup/Signup.jsx**
- Purpose: User registration form
- Form fields: Name, Email, Password, Confirm Password, Terms checkbox
- Features: Animated blob background; Login link
- State: None (form data not managed)

---

### Page Components - Dashboard

**src/pages/Dashboard/DashboardHome.jsx**
- Purpose: Dashboard landing with stats and recent items
- State: stats[], recentTasks[], recentProjects[] (all hardcoded)
- Features: 4 stat cards (Projects, Tasks, Completed, In Progress); Recent tasks/projects list
- Components used: TaskCard

**src/pages/Dashboard/Projects.jsx**
- Purpose: Projects listing with grid layout
- State: isModalOpen, projects[] (3 hardcoded)
- Features: Project grid, Create Project button/modal, ProjectCard components
- Handlers: handleCreateProject, handleOpenProject
- Components used: ProjectCard, CreateProjectModal

**src/pages/Dashboard/ProjectDetails.jsx**
- Purpose: Single project view with task management
- Params: projectId (from URL)
- State: isModalOpen, tasks[] (2 hardcoded for project)
- Features: Project header, Task management, Create Task button/modal
- Handlers: handleCreateTask, handleStatusChange, handleDeleteTask
- Components used: TaskCard, CreateTaskModal

**src/pages/Dashboard/Tasks.jsx**
- Purpose: Global tasks listing
- State: isModalOpen, tasks[] (3 hardcoded across projects)
- Features: Task grid, Create Task button/modal, TaskCard components
- Handlers: handleCreateTask, handleStatusChange, handleDeleteTask
- Components used: TaskCard, CreateTaskModal

**src/pages/Dashboard/Profile.jsx**
- Purpose: User profile management
- State: isEditing, user {} (name, email, role)
- Features: User info display/edit, Stats display (projects, tasks, completed)
- Handlers: handleChange, handleSave
- Edit/Save button toggle for inline editing

---

### Dashboard Component - Project

**src/components/dashboard/project/ProjectCard.jsx**
- Purpose: Reusable project card for listing
- Props: project {id, name, description, tasksCount/tasks, membersCount/members, status, color}, onClick (optional)
- Features: Project info, status badge, gradient background, task/member icons, hover effects
- Click handler: Uses onClick if provided, else navigates to project details
- Used in: Projects.jsx, DashboardHome.jsx

**src/components/dashboard/project/CreateProjectModal.jsx**
- Purpose: Modal for creating new projects
- Props: isOpen, onClose, onCreate
- State: formData {name, description}
- Form fields: Project name (required), Description
- Features: Modal overlay, form validation, animated entrance
- Used in: Projects.jsx

---

### Dashboard Component - Task

**src/components/dashboard/task/TaskCard.jsx**
- Purpose: Task display card with status/priority
- Props: task {id, title, status, priority, assignees[], subtasks[]}, onStatusChange, onDelete
- Features: Completion status, Priority badge (Low/Medium/High), Status dropdown, Delete button, Subtasks list, Assignees
- Priority colors: Low (green), Medium (yellow), High (red)
- Used in: Tasks.jsx, ProjectDetails.jsx, DashboardHome.jsx

**src/components/dashboard/task/SubtaskItem.jsx**
- Purpose: Individual subtask renderer
- Props: subtask {text, completed}, index, onToggle, onDelete
- Features: Checkbox toggle, strikethrough on completion, Delete button
- Styling: bg-white/5 border, hover effects, completed styling
- Used in: TaskCard.jsx

**src/components/dashboard/task/CreateTaskModal.jsx**
- Purpose: Modal for creating tasks with subtasks
- Props: isOpen, onClose, onCreate
- State: title, priority, status, assignee, subtaskInput, subtasks[]
- Form fields: Title (required), Priority select, Status select, Assignee, Subtask list
- Features: Subtask add/remove, form validation, animated entrance
- Used in: Tasks.jsx, ProjectDetails.jsx

---

### Home/Landing Components

**src/components/home/Hero.jsx**
- Purpose: Hero section with main CTA
- Heading: "Plan smarter. Deliver faster." (animated gradient)
- Subtext: Platform description
- Buttons: Get Started (→ /signup), Login (→ /login)
- Stats: 10,000+ tasks, 2,000+ projects, 500+ users
- Animations: animate-float, animate-float-delayed, animate-fade-up variants

**src/components/home/Features.jsx**
- Purpose: Features showcase with 4 cards
- Features:
  1. Task Management (CheckSquare icon)
  2. Project Tracking (BarChart3 icon)
  3. Team Collaboration (Users icon)
  4. Analytics Dashboard (Zap icon)
- Layout: Responsive grid (1→2→4 columns)
- Styling: Cards with hover effects, icons with backgrounds

**src/components/home/CTA.jsx**
- Purpose: Call-to-action section
- Heading: "Ready to manage projects smarter?"
- Subtext: Platform benefits
- Buttons: Get Started (primary), Login (secondary)
- Features: Card layout, hover effects, ArrowRight icon animation

**src/components/home/SocialProof.jsx**
- Purpose: Statistics section (not used currently)
- Stats: 10,000+ Tasks, 2,000+ Projects, 500+ Users
- Styling: Inline CSS, flexbox centered layout

---

### Layout Components - Landing

**src/components/layout/LandingNavbar.jsx**
- Purpose: Fixed top navbar for landing pages
- Logo: Link to home with scale effects
- Navigation: Login (with underline animation), Get Started (gradient button)
- Fixed position: top-0 left-0 z-50
- Features: Backdrop blur, gradient glow line

**src/components/layout/Footer.jsx**
- Purpose: Footer with navigation and social links
- Sections: Brand (logo + description), Product links, Company links, Social icons (Github, LinkedIn, Twitter)
- Layout: Responsive grid (2→3 columns)
- Features: Hover transitions, gradient background glow

---

### Configuration Files

**tailwind.config.js**
- Color theme: primary (#0B0F17), secondary, tertiary, textPrimary, textSecondary
- Gradient: Multi-color (blue→indigo→purple→magenta→pink→orange)
- Animations: fadeIn, fade-up (4 delays), float, blob (2 variants), glow
- Keyframes: Defined for all animations
- Font: Inter with fallbacks

**vite.config.js**
- Build tool configuration
- Plugin: @vitejs/plugin-react (Fast Refresh)

**postcss.config.js**
- Plugins: tailwindcss, autoprefixer

**eslint.config.js**
- Code quality and linting configuration

**index.html**
- Entry point HTML
- Meta tags: charset, viewport, theme-color, favicon
- Title: "PlanIt | Project Management Tool"
- Google Fonts: Inter (300-700 weights)
- Root: `<div id="root"></div>`

**package.json**
- Scripts: dev, build, lint, preview
- Dependencies: React, React-DOM, React Router DOM, lucide-react
- Dev Dependencies: Vite, Tailwind, ESLint, TypeScript types

---

## SECTION 4: ROUTING MAP

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Home.jsx | Landing page |
| `/login` | Login.jsx | User login |
| `/signup` | Signup.jsx | User registration |
| `/dashboard` | DashboardLayout + DashboardHome | Dashboard home |
| `/dashboard/projects` | Projects.jsx | Projects list |
| `/dashboard/projects/:projectId` | ProjectDetails.jsx | Project details |
| `/dashboard/tasks` | Tasks.jsx | Tasks list |
| `/dashboard/profile` | Profile.jsx | User profile |
| `*` | 404 fallback | Not found |

---

## SECTION 5: COMPONENT DEPENDENCY MAP

```
App
└── AppRouter
    ├── Home
    │   ├── LandingNavbar
    │   ├── Hero
    │   ├── Features
    │   ├── CTA
    │   └── Footer
    ├── Login
    ├── Signup
    └── DashboardLayout
        ├── Sidebar
        ├── Topbar
        └── Outlet
            ├── DashboardHome
            │   └── TaskCard
            ├── Projects
            │   ├── ProjectCard
            │   └── CreateProjectModal
            ├── ProjectDetails
            │   ├── TaskCard
            │   └── CreateTaskModal
            ├── Tasks
            │   ├── TaskCard
            │   └── CreateTaskModal
            └── Profile
```

---

## SECTION 6: STATE MANAGEMENT ANALYSIS

### Local Component State

| Component | State Variables | Purpose |
|-----------|-----------------|---------|
| Projects.jsx | isModalOpen, projects[] | Modal control, project list |
| ProjectDetails.jsx | isModalOpen, tasks[] | Modal control, project tasks |
| Tasks.jsx | isModalOpen, tasks[] | Modal control, task list |
| DashboardHome.jsx | stats[], recentTasks[], recentProjects[] | Dashboard data |
| Profile.jsx | isEditing, user {} | Edit mode, user data |
| CreateProjectModal.jsx | formData {} | Form fields |
| CreateTaskModal.jsx | title, priority, status, assignee, subtasks[] | Form fields |

### Global State
**None** - No centralized state management (Redux, Context API, etc.)

---

## SECTION 7: EMPTY / UNUSED FOLDERS

1. **src/hooks/** - Custom React hooks (empty)
2. **src/services/** - API service functions (empty)
3. **src/styles/** - Scoped CSS files (empty)
4. **src/utils/** - Utility functions (empty)
5. **src/context/** - React Context API (empty)

---

## SECTION 8: SUMMARY

### Statistics

- **Total Components**: 20
  - Page components: 8
  - Layout components: 2
  - Reusable components: 10

- **Total Pages**: 8
  - Public: 3 (Home, Login, Signup)
  - Dashboard: 5 (DashboardHome, Projects, ProjectDetails, Tasks, Profile)

- **Total Routes**: 8
  - Public: 3
  - Dashboard: 5

- **Total Config Files**: 5
  - Script files: package.json
  - Build: vite.config.js
  - CSS: tailwind.config.js, postcss.config.js
  - Lint: eslint.config.js

### Tech Stack Summary

- **Frontend**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **Styling**: Tailwind CSS 3.4.19
- **Routing**: React Router DOM 7.13.0
- **Icons**: lucide-react 0.564.0

### Architecture

- Component-based modular architecture
- Feature-based folder organization
- Local state management with hooks
- Responsive design with Tailwind
- Nested routing for dashboard

### Development Status

- ✓ Frontend UI complete
- ✓ Routing implemented
- ✓ Styling and animations configured
- ⚠️ Mock/hardcoded data only
- ✗ No backend integration
- ✗ No real authentication
- ✗ No data persistence

---

## SECTION 9: NEXT STEPS FOR PRODUCTION

1. Implement backend API (Node.js, Python, etc.)
2. Connect authentication (JWT, sessions)
3. Add global state management (Redux, Context, Zustand)
4. Create service layer for API calls
5. Implement form validation and error handling
6. Add environment variables
7. Setup real database connections
8. Add error boundaries and loading states

---

**Last Updated**: February 17, 2026

**Project Root**: `planit/`

**Status**: Frontend prototype complete, backend integration pending
