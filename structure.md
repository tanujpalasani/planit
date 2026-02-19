# COMPLETE MASTER PROJECT AUDIT — PLANIT FRONTEND

Audit timestamp: 2026-02-19  
Scope audited from code: `planit/` root and `client/` app source/config.  
Method: direct file inspection of all non-generated project files present in workspace tree, plus import/reference tracing.

---

## SECTION 1: PROJECT IDENTITY

### 1.1 Project name
- **Name in codebase metadata:** `client` (from `client/package.json`)
- **Product branding in UI/content:** **PlanIt**
- **Repository root folder:** `planit`

### 1.2 Tech stack versions
From `client/package.json` and lockfile head:

- **React:** `^19.2.0`
- **React DOM:** `^19.2.0`
- **React Router DOM:** `^7.13.0`
- **Vite:** `^7.3.1`
- **@vitejs/plugin-react:** `^5.1.1`
- **Tailwind CSS:** `^3.4.19`
- **PostCSS:** `^8.5.6`
- **Autoprefixer:** `^10.4.24`
- **ESLint:** `^9.39.1`
- **@eslint/js:** `^9.39.1`
- **eslint-plugin-react-hooks:** `^7.0.1`
- **eslint-plugin-react-refresh:** `^0.4.24`
- **globals:** `^16.5.0`
- **@types/react:** `^19.2.7`
- **@types/react-dom:** `^19.2.3`
- **Lockfile version:** `3` (`client/package-lock.json`)

### 1.3 Build system
- **Toolchain:** Vite + plugin-react
- **Scripts:**
  - `dev` → `vite`
  - `build` → `vite build`
  - `lint` → `eslint .`
  - `preview` → `vite preview`
- **Status:** **COMPLETE**

### 1.4 Styling system
- **Primary system:** Tailwind CSS utility classes
- **Global stylesheet:** `client/src/index.css` using Tailwind layers + base `body` apply
- **Theme extension:** custom colors, gradient, typography, shadows, animations in `client/tailwind.config.js`
- **Status:** **COMPLETE**

### 1.5 Icon library
- **Library:** `lucide-react`
- **Usage pattern:** direct icon imports per component
- **Status:** **COMPLETE**

### 1.6 State management approach
- **Global app state:** React Context (`AppContext`) managed by `AppProvider`
- **Cross-cutting UI state:**
  - Toast notifications via `ToastContext/ToastProvider`
  - Global loading overlay via `LoadingContext/LoadingProvider`
- **Local state:** `useState` in page/component-level forms and modal controls
- **Async orchestration:** `useAsyncAction` wrapper hook around `startLoading/stopLoading` and `addToast`
- **Status:** **PARTIAL** (no backend/API integration; several flows are local-memory only)

### 1.7 Routing approach
- **Router:** `BrowserRouter` + nested routes (`Routes`, `Route`)
- **Public routes:** `/`, `/login`, `/signup`
- **Dashboard shell route:** `/dashboard` with nested pages
- **Nested dashboard routes:** index, `projects`, `projects/:projectId`, `tasks`, `team`, `profile`
- **Fallback route:** simple “Page not found” div
- **Status:** **PARTIAL** (protected-route behavior explicitly deferred in comments)

### 1.8 Provider hierarchy (exact nesting from `main.jsx`)
```txt
ReactDOM.createRoot(...).render(
  <React.StrictMode>
    <LoadingProvider>
      <ToastProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </ToastProvider>
    </LoadingProvider>
  </React.StrictMode>
)
```
- **Status:** **COMPLETE**

---

## SECTION 2: FULL FOLDER TREE

> Includes all folders/files discovered in workspace project structure for this app. Generated dependency/build directories are present and flagged.

```txt
planit/
├─ structure.md
└─ client/
   ├─ .gitignore
   ├─ eslint.config.js
   ├─ index.html
   ├─ package-lock.json
   ├─ package.json
   ├─ postcss.config.js
   ├─ README.md
   ├─ tailwind.config.js
   ├─ vite.config.js
   ├─ dist/                        (generated build directory present)
   ├─ node_modules/                (installed dependencies directory present)
   ├─ public/                      (empty)
   └─ src/
      ├─ App.jsx
      ├─ index.css
      ├─ main.jsx
      ├─ assets/
      │  └─ logo/
      │     ├─ logo-dark.svg
      │     ├─ logo-icon.svg
      │     └─ logo-light.svg
      ├─ components/
      │  ├─ dashboard/
      │  │  ├─ layout/
      │  │  │  ├─ Sidebar.jsx
      │  │  │  └─ Topbar.jsx
      │  │  ├─ project/
      │  │  │  ├─ CreateProjectModal.jsx
      │  │  │  └─ ProjectCard.jsx
      │  │  ├─ task/
      │  │  │  ├─ CreateTaskModal.jsx
      │  │  │  ├─ EditTaskModal.jsx
      │  │  │  ├─ KanbanColumn.jsx
      │  │  │  ├─ SubtaskItem.jsx
      │  │  │  ├─ TaskCard.jsx
      │  │  │  ├─ TaskFilters.jsx
      │  │  │  └─ TaskToolbar.jsx
      │  │  └─ team/
      │  │     ├─ AddMemberModal.jsx
      │  │     └─ TeamMemberCard.jsx
      │  ├─ home/
      │  │  ├─ CTA.jsx
      │  │  ├─ Features.jsx
      │  │  ├─ Hero.jsx
      │  │  └─ SocialProof.jsx
      │  ├─ layout/
      │  │  ├─ Footer.jsx
      │  │  └─ LandingNavbar.jsx
      │  └─ ui/
      │     ├─ Badge.jsx
      │     ├─ Button.jsx
      │     ├─ Card.jsx
      │     ├─ GlobalLoader.jsx
      │     ├─ index.js
      │     ├─ Input.jsx
      │     ├─ Modal.jsx
      │     ├─ Toast.jsx
      │     └─ utils.js
      ├─ context/
      │  ├─ AppContext.jsx
      │  ├─ AppProvider.jsx
      │  ├─ LoadingContext.jsx
      │  ├─ LoadingProvider.jsx
      │  ├─ ToastContext.jsx
      │  ├─ ToastProvider.jsx
      │  └─ useAppContext.jsx
      ├─ hooks/
      │  ├─ useAsyncAction.js
      │  ├─ useLoading.js
      │  └─ useToast.js
      ├─ layouts/
      │  └─ DashboardLayout.jsx
      ├─ pages/
      │  ├─ Dashboard/
      │  │  ├─ DashboardHome.jsx
      │  │  ├─ Profile.jsx
      │  │  ├─ ProjectDetails.jsx
      │  │  ├─ Projects.jsx
      │  │  ├─ Tasks.jsx
      │  │  └─ Team.jsx
      │  ├─ Home/
      │  │  └─ Home.jsx
      │  ├─ Login/
      │  │  └─ Login.jsx
      │  └─ Signup/
      │     └─ Signup.jsx
      ├─ routes/
      │  └─ AppRouter.jsx
      ├─ services/                 (empty)
      ├─ styles/                   (empty)
      └─ utils/                    (empty)
```

---

## SECTION 3: GLOBAL ARCHITECTURE MAP

### 3.1 Context layers and responsibilities

1) **LoadingContext / LoadingProvider**
- Holds global `isLoading` boolean
- Exposes `startLoading`, `stopLoading`
- Renders `GlobalLoader` overlay at provider root
- **Status:** **COMPLETE**

2) **ToastContext / ToastProvider**
- Holds list of toasts with enter/exit lifecycle
- Exposes `addToast(message, type)` and `removeToast(id)`
- Auto-dismiss timing + exit animation handling
- Renders `Toast` UI host at provider root
- **Status:** **COMPLETE**

3) **AppContext / AppProvider**
- Holds core domain state in memory:
  - `user`
  - `projects`
  - `tasks`
  - `teamMembers`
- Exposes mutation methods:
  - `addProject`, `deleteProject`
  - `addTask`, `updateTask`, `updateTaskStatus`, `deleteTask`
  - `addTeamMember`, `setTeamMembers`
  - `setUser`, raw state setters
- **Status:** **PARTIAL** (memory-only; no persistence or API adapter)

### 3.2 Data flow between layers

```txt
UI Event (page/component)
   └─> optional useAsyncAction.runAsync(...)
          ├─> LoadingContext.startLoading()
          ├─> execute async callback (often setTimeout + context mutation)
          ├─> ToastContext.addToast(success/error)
          └─> LoadingContext.stopLoading()

State mutation entrypoints
   └─> AppContext methods (add/update/delete)
          └─> React state updates
                └─> subscriber components re-render
```

### 3.3 Async wrapper behavior (`useAsyncAction`)
- Uniform wrapper for async UI actions
- Supports options:
  - `successMessage`
  - `errorMessage`
  - `showSuccessToast` (default true)
  - `showErrorToast` (default true)
- Catches errors, logs to console, shows fallback toast
- Always stops global loader in `finally`
- Returns `undefined` on failure (does not rethrow)
- **Status:** **COMPLETE** (behavior defined and used) / **PARTIAL** (error propagation intentionally swallowed)

### 3.4 UI system integration
- Dashboard components increasingly consume `components/ui` primitives:
  - `Button`, `Card`, `Badge`, `Modal`, `Input`
- Providers also use primitive-style system (`Toast`, `GlobalLoader`)
- Legacy/manual Tailwind forms/buttons remain in multiple pages/modals
- **Status:** **PARTIAL**

### 3.5 Routing structure

```txt
/
├─ /                        -> Home
├─ /login                   -> Login
├─ /signup                  -> Signup
└─ /dashboard               -> DashboardLayout
   ├─ (index)               -> DashboardHome
   ├─ /projects             -> Projects
   ├─ /projects/:projectId  -> ProjectDetails
   ├─ /tasks                -> Tasks
   ├─ /team                 -> Team
   └─ /profile              -> Profile

*                         -> Fallback "Page not found"
```
- **Status:** **PARTIAL** (no auth guard yet)

---

## SECTION 4: FILE-BY-FILE BREAKDOWN

> Status tags: **COMPLETE / PARTIAL / UNUSED / PLACEHOLDER / BROKEN**  
> “Used?” is based on import/reference evidence in code.

### ROOT

#### `structure.md`
- Purpose: project audit documentation file
- Exports: none
- Hooks used: none
- State variables: none
- Functions inside: none
- Dependencies: none
- Used?: manually by developers/AI sessions (documentation artifact)
- Status: **COMPLETE**

### CLIENT ROOT CONFIG / META

#### `client/package.json`
- Purpose: npm metadata, scripts, dependencies
- Exports: JSON object
- Hooks/state/functions: n/a
- Dependencies: Vite/React/Tailwind/ESLint ecosystem
- Used?: yes (`npm` lifecycle)
- Status: **COMPLETE**

#### `client/package-lock.json`
- Purpose: deterministic dependency lock graph
- Exports: JSON lock object
- Hooks/state/functions: n/a
- Dependencies: npm-resolved full graph
- Used?: yes (`npm install`, reproducible builds)
- Status: **COMPLETE**

#### `client/vite.config.js`
- Purpose: Vite config with React plugin
- Exports: default `defineConfig(...)`
- Hooks/state/functions: none
- Dependencies: `vite`, `@vitejs/plugin-react`
- Used?: yes (build/dev runtime)
- Status: **COMPLETE**

#### `client/tailwind.config.js`
- Purpose: Tailwind content paths + theme extensions + animations
- Exports: default Tailwind config object
- Dependencies: Tailwind runtime
- Used?: yes (Tailwind compiler)
- Status: **COMPLETE**

#### `client/postcss.config.js`
- Purpose: PostCSS plugin chain (`tailwindcss`, `autoprefixer`)
- Exports: default config
- Used?: yes
- Status: **COMPLETE**

#### `client/eslint.config.js`
- Purpose: lint configuration
- Exports: `defineConfig([...])`
- Dependencies: eslint ecosystem plugins
- Used?: yes (`npm run lint`)
- Status: **COMPLETE**

#### `client/index.html`
- Purpose: Vite HTML entry, metadata, favicon, mount node
- Exports: none
- Used?: yes (app shell)
- Status: **COMPLETE**

#### `client/README.md`
- Purpose: default Vite template README
- Used?: yes (documentation), but not project-customized
- Status: **PARTIAL**

#### `client/.gitignore`
- Purpose: git ignore patterns
- Used?: yes (source control)
- Status: **COMPLETE**

### DIRECTORY STATUS (NON-FILE)

- `client/public/` — empty; Status: **PLACEHOLDER**
- `client/src/services/` — empty; Status: **PLACEHOLDER**
- `client/src/styles/` — empty; Status: **PLACEHOLDER**
- `client/src/utils/` — empty; Status: **PLACEHOLDER**
- `client/dist/` — generated output directory present; Status: **PARTIAL** (artifact, not source)
- `client/node_modules/` — installed third-party dependencies directory present; Status: **COMPLETE** (dependency installation state)

### SRC ENTRY / ROUTING / LAYOUT

#### `client/src/main.jsx`
- Purpose: app bootstrap + provider nesting
- Exports: none (entrypoint)
- Hooks used: none
- State variables: none
- Functions inside: none
- Dependencies: React, ReactDOM, `App`, `LoadingProvider`, `ToastProvider`, `AppProvider`, `index.css`
- Used?: yes (referenced by `index.html`)
- Status: **COMPLETE**

#### `client/src/App.jsx`
- Purpose: root app component rendering router
- Exports: default `App`
- Hooks used: none
- State variables: none
- Functions inside: `App`
- Dependencies: `AppRouter`
- Used?: yes (imported in `main.jsx`)
- Status: **COMPLETE**

#### `client/src/routes/AppRouter.jsx`
- Purpose: application route declaration
- Exports: default `AppRouter`
- Hooks used: none
- State variables: none
- Functions inside: `AppRouter`
- Dependencies: `react-router-dom`, all page components, `DashboardLayout`
- Used?: yes (imported by `App.jsx`)
- Status: **PARTIAL** (protected routing explicitly deferred)

#### `client/src/layouts/DashboardLayout.jsx`
- Purpose: shell for dashboard routes (sidebar/topbar/content outlet)
- Exports: default `DashboardLayout`
- Hooks used: none
- State variables: none
- Functions: `DashboardLayout`
- Dependencies: `Outlet`, `Sidebar`, `Topbar`
- Used?: yes (router)
- Status: **COMPLETE**

#### `client/src/index.css`
- Purpose: Tailwind includes + body defaults + animation utility overrides
- Exports: none
- Used?: yes (imported in `main.jsx`)
- Status: **COMPLETE**

### CONTEXT LAYER

#### `client/src/context/AppContext.jsx`
- Purpose: create `AppContext`
- Exports: default `AppContext`
- Hooks/state/functions: none
- Dependencies: `createContext`
- Used?: yes (`AppProvider`, `useAppContext`)
- Status: **COMPLETE**

#### `client/src/context/AppProvider.jsx`
- Purpose: in-memory domain data store and mutations
- Exports: default `AppProvider`
- Hooks used: `useState`
- State variables: `user`, `teamMembers`, `projects`, `tasks`
- Functions inside: `addProject`, `addTask`, `addTeamMember`, `updateTaskStatus`, `deleteTask`, `deleteProject`, `updateTask`
- Dependencies: `AppContext`
- Used?: yes (provider in `main.jsx`)
- Status: **PARTIAL** (no persistence; IDs from `Date.now()`; no API boundary)

#### `client/src/context/useAppContext.jsx`
- Purpose: typed-safe context consumer helper with provider guard
- Exports: named `useAppContext`
- Hooks used: `useContext`
- Functions: `useAppContext`
- Dependencies: `AppContext`
- Used?: yes (multiple dashboard files)
- Status: **COMPLETE**

#### `client/src/context/ToastContext.jsx`
- Purpose: create toast context
- Exports: default `ToastContext`
- Dependencies: `createContext`
- Used?: yes (`ToastProvider`, `useToast`)
- Status: **COMPLETE**

#### `client/src/context/ToastProvider.jsx`
- Purpose: toast lifecycle host and context provider
- Exports: default `ToastProvider`
- Hooks used: `useState`, `useRef`, `useEffect`, `useCallback`, `useMemo`
- State variables: `toasts`, `closingIds`
- Functions inside: `removeToast`, `addToast`
- Dependencies: `Toast`, `ToastContext`
- Used?: yes (`main.jsx`)
- Status: **COMPLETE**

#### `client/src/context/LoadingContext.jsx`
- Purpose: create loading context
- Exports: default `LoadingContext`
- Dependencies: `createContext`
- Used?: yes (`LoadingProvider`, `useLoading`)
- Status: **COMPLETE**

#### `client/src/context/LoadingProvider.jsx`
- Purpose: global loading state + overlay host
- Exports: default `LoadingProvider`
- Hooks used: `useState`, `useCallback`, `useMemo`
- State variables: `isLoading`
- Functions inside: `startLoading`, `stopLoading`
- Dependencies: `GlobalLoader`, `LoadingContext`
- Used?: yes (`main.jsx`)
- Status: **COMPLETE**

### HOOKS

#### `client/src/hooks/useLoading.js`
- Purpose: LoadingContext consumer hook with provider guard
- Exports: named `useLoading`
- Hooks used: `useContext`
- Dependencies: `LoadingContext`
- Used?: yes (`useAsyncAction`)
- Status: **COMPLETE**

#### `client/src/hooks/useToast.js`
- Purpose: ToastContext consumer hook with provider guard
- Exports: named `useToast`
- Hooks used: `useContext`
- Dependencies: `ToastContext`
- Used?: yes (cards + async wrapper)
- Status: **COMPLETE**

#### `client/src/hooks/useAsyncAction.js`
- Purpose: shared async wrapper with loading + toast policies
- Exports: default `useAsyncAction`
- Hooks used: `useCallback`, `useLoading`, `useToast`
- State variables: none (uses contexts)
- Functions inside: `runAsync`
- Dependencies: loading/toast hooks
- Used?: yes (`Projects`, `ProjectDetails`, `Tasks`, `Team`)
- Status: **COMPLETE**

### UI PRIMITIVES

#### `client/src/components/ui/utils.js`
- Purpose: className join helper `cn`
- Exports: named `cn`
- Hooks/state: none
- Dependencies: none
- Used?: yes (`Badge`, `Button`, `Card`, `Input`, `Modal`, `Toast`, `GlobalLoader`)
- Status: **COMPLETE**

#### `client/src/components/ui/index.js`
- Purpose: barrel exports for primitives
- Exports: `Button`, `Card`, `Modal`, `Input`, `Badge`
- Hooks/state/functions: none
- Used?: yes (dashboard components importing from `../../ui`)
- Status: **COMPLETE**

#### `client/src/components/ui/Button.jsx`
- Purpose: design-system button component with variants/sizes/loading state
- Exports: default `Button`
- Hooks used: none
- State variables: none
- Functions inside: `Button`
- Dependencies: `cn`
- Used?: yes
- Status: **COMPLETE**

#### `client/src/components/ui/Card.jsx`
- Purpose: reusable card container with hover/padding options
- Exports: default `Card`
- Hooks/state: none
- Functions: `Card`
- Dependencies: `cn`
- Used?: yes
- Status: **COMPLETE**

#### `client/src/components/ui/Badge.jsx`
- Purpose: semantic badge variants
- Exports: default `Badge`
- Hooks/state: none
- Functions: `Badge`
- Dependencies: `cn`
- Used?: yes
- Status: **COMPLETE**

#### `client/src/components/ui/Input.jsx`
- Purpose: reusable input with labels/icons/errors and ref forwarding
- Exports: default `Input`
- Hooks used: `useId` (`forwardRef` wrapper)
- State variables: none
- Functions: `Input`
- Dependencies: `cn`
- Used?: yes
- Status: **COMPLETE**

#### `client/src/components/ui/Modal.jsx`
- Purpose: reusable modal with portal, esc handling, body scroll lock
- Exports: default `Modal`
- Hooks used: `useEffect`, `useId`
- State variables: none
- Functions: `Modal`, `handleOverlayClick`, `handleEsc`
- Dependencies: `createPortal`, `cn`
- Used?: yes (project/task/team cards and create project modal)
- Status: **COMPLETE**

#### `client/src/components/ui/Toast.jsx`
- Purpose: toast stack renderer with close action and exit animation states
- Exports: default `Toast`
- Hooks/state: none (presentational)
- Dependencies: `X` icon, `cn`
- Used?: yes (`ToastProvider`)
- Status: **COMPLETE**

#### `client/src/components/ui/GlobalLoader.jsx`
- Purpose: full-screen loading overlay spinner
- Exports: default `GlobalLoader`
- Hooks/state: none (presentational)
- Dependencies: `cn`
- Used?: yes (`LoadingProvider`)
- Status: **COMPLETE**

### DASHBOARD LAYOUT COMPONENTS

#### `client/src/components/dashboard/layout/Sidebar.jsx`
- Purpose: dashboard navigation + logout UI
- Exports: default `Sidebar`
- Hooks used: `useNavigate`
- State variables: none
- Functions: `handleLogout`
- Dependencies: `NavLink`, `useNavigate`, logo asset, Lucide icons
- Used?: yes (`DashboardLayout`)
- Status: **PARTIAL** (logout is navigation-only; auth clearing marked future)

#### `client/src/components/dashboard/layout/Topbar.jsx`
- Purpose: route-based title and top search bar/user display
- Exports: default `Topbar`
- Hooks used: `useLocation`
- State variables: none
- Functions: `getTitle`
- Dependencies: `Search` icon
- Used?: yes (`DashboardLayout`)
- Status: **PARTIAL** (search input has no behavior)

### PROJECT COMPONENTS

#### `client/src/components/dashboard/project/CreateProjectModal.jsx`
- Purpose: modal form for project creation
- Exports: default `CreateProjectModal`
- Hooks used: `useState`
- State variables: `formData`
- Functions: `handleChange`, `handleSubmit`
- Dependencies: `Modal`, `Input`, `Button` (UI primitives)
- Used?: yes (`Projects` page)
- Status: **COMPLETE**

#### `client/src/components/dashboard/project/ProjectCard.jsx`
- Purpose: project summary card + open action + delete confirmation modal
- Exports: default `ProjectCard`
- Hooks used: `useState`, `useNavigate`, `useAppContext`, `useToast`
- State variables: `isConfirmOpen`
- Functions: `handleOpenProject`, `handleDeleteProject`, `handleConfirmDelete`
- Dependencies: context, toast hook, UI primitives, Lucide icons
- Used?: yes (`Projects` page)
- Status: **COMPLETE**

### TASK COMPONENTS

#### `client/src/components/dashboard/task/CreateTaskModal.jsx`
- Purpose: task creation modal with project/assignee/subtask inputs
- Exports: default `CreateTaskModal`
- Hooks used: `useState`, `useAppContext`
- State variables: `title`, `priority`, `status`, `projectId`, `assigneeId`, `subtaskInput`, `subtasks`
- Functions: `handleAddSubtask`, `handleRemoveSubtask`, `handleSubmit`
- Dependencies: `createPortal`, app context, Lucide icons
- Used?: yes (`Tasks`, `ProjectDetails`)
- Status: **PARTIAL** (uses `alert` validation and custom modal instead of shared primitive)

#### `client/src/components/dashboard/task/EditTaskModal.jsx`
- Purpose: edit existing task fields/subtasks
- Exports: default `EditTaskModal`
- Hooks used: `useState`, `useAppContext`
- State variables: title/priority/status/projectId/assigneeId/subtaskInput/subtasks
- Functions: subtask add/remove, `handleSubmit`
- Dependencies: `createPortal`, app context, Lucide icons
- Used?: yes (`TaskCard`)
- Status: **PARTIAL** (custom modal + `alert` validation; bypasses async wrapper)

#### `client/src/components/dashboard/task/SubtaskItem.jsx`
- Purpose: subtask row with toggle/remove actions
- Exports: default `SubtaskItem`
- Hooks used: none
- State variables: none
- Functions: component render callbacks for `onToggle`, `onDelete`
- Dependencies: `Check` icon
- Used?: yes (`TaskCard`)
- Status: **COMPLETE**

#### `client/src/components/dashboard/task/TaskCard.jsx`
- Purpose: task display card with status/priority badges, edit/delete, subtasks
- Exports: default `TaskCard`
- Hooks used: `useState`, `useAppContext`, `useToast`
- State variables: `isEditOpen`, `isConfirmOpen`
- Functions: `handleToggleSubtask`, `handleDeleteSubtask`, `formatStatusLabel`, `handleStatusChange`, delete handlers
- Dependencies: `SubtaskItem`, `EditTaskModal`, UI primitives, context, toast
- Used?: yes (`DashboardHome`, `Tasks`, `ProjectDetails`, `KanbanColumn`)
- Status: **COMPLETE**

#### `client/src/components/dashboard/task/KanbanColumn.jsx`
- Purpose: per-status kanban column rendering task cards
- Exports: default `KanbanColumn`
- Hooks used: none
- State variables: none
- Functions: `KanbanColumn`
- Dependencies: `TaskCard`, `Card`, `Badge`
- Used?: yes (`Tasks`)
- Status: **COMPLETE**

#### `client/src/components/dashboard/task/TaskFilters.jsx`
- Purpose: status/priority/project/search filters
- Exports: default `TaskFilters`
- Hooks used: none
- State variables: controlled by parent props
- Functions: `TaskFilters`
- Dependencies: `Input`, `Search` icon
- Used?: yes (`Tasks`)
- Status: **COMPLETE**

#### `client/src/components/dashboard/task/TaskToolbar.jsx`
- Purpose: tasks page header + list/kanban toggle + create button
- Exports: default `TaskToolbar`
- Hooks used: none
- State variables: controlled by parent props
- Functions: `TaskToolbar`
- Dependencies: `Button`, `Plus` icon
- Used?: yes (`Tasks`)
- Status: **COMPLETE**

### TEAM COMPONENTS

#### `client/src/components/dashboard/team/AddMemberModal.jsx`
- Purpose: add member modal/form
- Exports: default `AddMemberModal`
- Hooks used: `useState`, `useAppContext`
- State variables: `formData`
- Functions: `handleChange`, `handleSubmit`
- Dependencies: `createPortal`, context, `X` icon
- Used?: yes (`Team`)
- Status: **BROKEN** (ignores passed `onAddMember` prop from parent and writes directly to context, causing parent async flow mismatch)

#### `client/src/components/dashboard/team/TeamMemberCard.jsx`
- Purpose: member display with remove confirmation
- Exports: default `TeamMemberCard`
- Hooks used: `useState`, `useToast`
- State variables: `isConfirmOpen`
- Functions: `getInitial`, delete handlers
- Dependencies: `Modal`, `Button`, `Trash2`
- Used?: yes (`Team`)
- Status: **COMPLETE**

### HOME/LANDING COMPONENTS

#### `client/src/components/home/Hero.jsx`
- Purpose: landing hero section with CTA and stat visuals
- Exports: default `Hero`
- Hooks used: none
- State variables: none
- Functions: `Hero`, internal `Stat`
- Dependencies: `Link`
- Used?: yes (`Home`)
- Status: **COMPLETE**

#### `client/src/components/home/Features.jsx`
- Purpose: marketing feature grid
- Exports: default `Features`
- Hooks used: none
- State variables: static `features` array
- Functions: `Features`
- Dependencies: Lucide icons
- Used?: yes (`Home`)
- Status: **COMPLETE**

#### `client/src/components/home/CTA.jsx`
- Purpose: marketing conversion CTA section
- Exports: default `CTA`
- Hooks used: none
- State variables: none
- Functions: `CTA`
- Dependencies: `Link`, `ArrowRight`
- Used?: yes (`Home`)
- Status: **COMPLETE**

#### `client/src/components/home/SocialProof.jsx`
- Purpose: social proof stats section (legacy style implementation)
- Exports: default `SocialProof`
- Hooks used: none
- State variables: local `stats` const
- Functions: `SocialProof`
- Dependencies: none
- Used?: **no import references found**
- Status: **UNUSED**

### SHARED LAYOUT COMPONENTS

#### `client/src/components/layout/LandingNavbar.jsx`
- Purpose: top navigation for landing/public pages
- Exports: default `LandingNavbar`
- Hooks used: none
- State variables: none
- Functions: `LandingNavbar`
- Dependencies: `Link`, logo asset
- Used?: yes (`Home`)
- Status: **COMPLETE**

#### `client/src/components/layout/Footer.jsx`
- Purpose: landing footer with links/social icons
- Exports: default `Footer`
- Hooks used: none
- State variables: none
- Functions: `Footer`
- Dependencies: `Link`, logo asset, Lucide icons
- Used?: yes (`Home`)
- Status: **COMPLETE**

### PAGES

#### `client/src/pages/Home/Home.jsx`
- Purpose: composition page for landing sections
- Exports: default `Home`
- Hooks used: none
- State variables: none
- Functions: `Home`
- Dependencies: `LandingNavbar`, `Hero`, `Features`, `CTA`, `Footer`
- Used?: yes (router `/`)
- Status: **COMPLETE**

#### `client/src/pages/Login/Login.jsx`
- Purpose: login UI page
- Exports: default `Login`
- Hooks used: none
- State variables: none (uncontrolled form)
- Functions: `Login`
- Dependencies: `Link`, logo, Lucide icons
- Used?: yes (router `/login`)
- Status: **PARTIAL** (no submit logic/auth integration)

#### `client/src/pages/Signup/Signup.jsx`
- Purpose: signup UI page
- Exports: default `Signup`
- Hooks used: none
- State variables: none (uncontrolled form)
- Functions: `Signup`
- Dependencies: `Link`, logo, Lucide icons
- Used?: yes (router `/signup`)
- Status: **PARTIAL** (no submit logic/auth integration)

#### `client/src/pages/Dashboard/DashboardHome.jsx`
- Purpose: dashboard overview with computed stats and recent items
- Exports: default `DashboardHome`
- Hooks used: `useAppContext`
- State variables: none local
- Functions: `DashboardHome`
- Dependencies: app context, Lucide icons, `TaskCard`
- Used?: yes (dashboard index route)
- Status: **COMPLETE**

#### `client/src/pages/Dashboard/Projects.jsx`
- Purpose: projects listing and create flow
- Exports: default `Projects`
- Hooks used: `useState`, `useNavigate`, `useAppContext`, `useAsyncAction`
- State variables: `isModalOpen`
- Functions: `handleCreateProject`, `handleOpenProject`
- Dependencies: context, async hook, `ProjectCard`, `CreateProjectModal`
- Used?: yes (router)
- Status: **COMPLETE**

#### `client/src/pages/Dashboard/ProjectDetails.jsx`
- Purpose: single project detail + project task list/create
- Exports: default `ProjectDetails`
- Hooks used: `useParams`, `useState`, `useAppContext`, `useAsyncAction`
- State variables: `isModalOpen`
- Functions: create/status/delete handlers + project resolution
- Dependencies: context, async hook, `TaskCard`, `CreateTaskModal`
- Used?: yes (router)
- Status: **COMPLETE**

#### `client/src/pages/Dashboard/Tasks.jsx`
- Purpose: all tasks management page with filters/list/kanban
- Exports: default `Tasks`
- Hooks used: `useState`, `useMemo`, `useAppContext`, `useAsyncAction`
- State variables: modal/view/filter/search state
- Functions: create/status/delete handlers, `getProjectName`, filtered memo
- Dependencies: context, async hook, task components
- Used?: yes (router)
- Status: **COMPLETE**

#### `client/src/pages/Dashboard/Team.jsx`
- Purpose: team listing/add/remove flow
- Exports: default `Team`
- Hooks used: `useState`, `useEffect`, `useRef`, `useAppContext`, `useAsyncAction`
- State variables: `isModalOpen`, refs for member counts/timeouts
- Functions: open/close modal handlers, add/delete handlers, cleanup effect
- Dependencies: context, async hook, `TeamMemberCard`, `AddMemberModal`
- Used?: yes (router)
- Status: **BROKEN** (duplicate/misaligned async success flow due child modal not using passed callback)

#### `client/src/pages/Dashboard/Profile.jsx`
- Purpose: profile display/edit UI card
- Exports: default `Profile`
- Hooks used: `useState`
- State variables: `isEditing`, local `user`
- Functions: `handleChange`, `handleSave`
- Dependencies: Lucide icons
- Used?: yes (router)
- Status: **PARTIAL** (local-only profile data, hardcoded stats, no context/backend integration)

### ASSETS

#### `client/src/assets/logo/logo-light.svg`
- Purpose: primary logo used across landing/auth/dashboard sidebar
- Exports: asset file
- Used?: yes (multiple imports)
- Status: **COMPLETE**

#### `client/src/assets/logo/logo-icon.svg`
- Purpose: favicon/icon asset
- Used?: yes (referenced by `client/index.html`)
- Status: **COMPLETE**

#### `client/src/assets/logo/logo-dark.svg`
- Purpose: alternate logo variant
- Used?: no code references found
- Status: **UNUSED**

---

## SECTION 5: FEATURE MATRIX

### 5.1 Project CRUD
- Description: create/list/open/delete projects; delete cascades project tasks in context
- Related files:
  - `pages/Dashboard/Projects.jsx`
  - `pages/Dashboard/ProjectDetails.jsx`
  - `components/dashboard/project/CreateProjectModal.jsx`
  - `components/dashboard/project/ProjectCard.jsx`
  - `context/AppProvider.jsx`
- UI complete?: yes
- Functional?: yes (in-memory)
- Async-enabled?: create = yes (`useAsyncAction`), delete = no wrapper
- Toast feedback?: create + delete yes
- Confirmation protection?: delete yes
- Status: **PARTIAL** (not persisted/API-backed)

### 5.2 Task CRUD
- Description: create/list/filter/edit/delete tasks + per-task status updates and subtasks
- Related files:
  - `pages/Dashboard/Tasks.jsx`
  - `pages/Dashboard/ProjectDetails.jsx`
  - `components/dashboard/task/*`
  - `context/AppProvider.jsx`
- UI complete?: yes
- Functional?: yes (in-memory)
- Async-enabled?: create yes; edit/delete/status mostly direct context updates (no wrapper)
- Toast feedback?: status + delete yes; create yes; edit no success toast
- Confirmation protection?: delete yes
- Status: **PARTIAL** (mixed async policy + no persistence)

### 5.3 Kanban view
- Description: status columns Todo/In Progress/Completed
- Related files: `Tasks.jsx`, `KanbanColumn.jsx`, `TaskCard.jsx`
- UI complete?: yes
- Functional?: yes
- Async-enabled?: status changes immediate (no async wrapper)
- Toast feedback?: yes (from `TaskCard` status handler)
- Confirmation protection?: n/a
- Status: **COMPLETE**

### 5.4 Filtering/searching tasks
- Description: filters by status, priority, project + title search
- Related files: `Tasks.jsx`, `TaskFilters.jsx`
- UI complete?: yes
- Functional?: yes (`useMemo` filtering)
- Async-enabled?: n/a
- Toast feedback?: n/a
- Confirmation protection?: n/a
- Status: **COMPLETE**

### 5.5 Team management
- Description: add/remove team members and list cards
- Related files: `Team.jsx`, `AddMemberModal.jsx`, `TeamMemberCard.jsx`, `AppProvider.jsx`
- UI complete?: mostly yes
- Functional?: add/remove works in context
- Async-enabled?: intended yes in parent, but child bypasses callback
- Toast feedback?: remove yes; add has duplicated/misaligned flow
- Confirmation protection?: remove yes
- Status: **BROKEN** (callback contract mismatch between `Team` and `AddMemberModal`)

### 5.6 Profile edit
- Description: inline edit/save of profile fields
- Related files: `Profile.jsx`
- UI complete?: partial
- Functional?: local-state only
- Async-enabled?: no
- Toast feedback?: no
- Confirmation protection?: no
- Status: **PARTIAL**

### 5.7 Landing marketing site
- Description: navbar, hero, features, CTA, footer
- Related files: `Home.jsx`, `components/home/*`, `components/layout/*`
- UI complete?: yes
- Functional?: navigation links work
- Async-enabled?: n/a
- Toast feedback?: n/a
- Confirmation protection?: n/a
- Status: **COMPLETE**

### 5.8 Toast system
- Description: global toast queue with auto-dismiss and exit animation
- Related files: `ToastContext.jsx`, `ToastProvider.jsx`, `useToast.js`, `components/ui/Toast.jsx`
- UI complete?: yes
- Functional?: yes
- Async-enabled?: integrated with `useAsyncAction` and direct calls
- Toast feedback?: self-system
- Confirmation protection?: n/a
- Status: **COMPLETE**

### 5.9 Loading system
- Description: global loading overlay controlled via context
- Related files: `LoadingContext.jsx`, `LoadingProvider.jsx`, `useLoading.js`, `GlobalLoader.jsx`
- UI complete?: yes
- Functional?: yes
- Async-enabled?: yes via `useAsyncAction`
- Toast feedback?: n/a
- Confirmation protection?: n/a
- Status: **COMPLETE**

### 5.10 Async wrapper
- Description: standardized async runner around loading + toasts
- Related files: `hooks/useAsyncAction.js`
- UI complete?: n/a
- Functional?: yes
- Async-enabled?: yes
- Toast feedback?: configurable success/error
- Confirmation protection?: n/a
- Status: **COMPLETE**

### 5.11 Confirmation modals
- Description: confirms destructive deletion for tasks/projects/team members
- Related files: `ProjectCard.jsx`, `TaskCard.jsx`, `TeamMemberCard.jsx`, `ui/Modal.jsx`
- UI complete?: yes
- Functional?: yes
- Async-enabled?: no (mostly synchronous context mutation)
- Toast feedback?: yes after confirm
- Confirmation protection?: yes
- Status: **COMPLETE**

---

## SECTION 6: UI SYSTEM ANALYSIS

### 6.1 Components using new UI primitives
- `CreateProjectModal` → `Modal`, `Input`, `Button`
- `ProjectCard` → `Card`, `Button`, `Badge`, `Modal`
- `TaskCard` → `Card`, `Badge`, `Button`, `Modal`
- `KanbanColumn` → `Card`, `Badge`
- `TaskFilters` → `Input`
- `TaskToolbar` → `Button`
- `TeamMemberCard` → `Modal`, `Button`
- Global providers:
  - `LoadingProvider` uses `GlobalLoader`
  - `ToastProvider` uses `Toast`

### 6.2 Components still using legacy/manual styling
- `Login.jsx` and `Signup.jsx` use native `<input>` and `<button>` directly
- `Profile.jsx` uses direct buttons/inputs and hardcoded card blocks
- `CreateTaskModal.jsx`, `EditTaskModal.jsx`, `AddMemberModal.jsx` use custom portal/modals instead of shared `ui/Modal`
- `Topbar.jsx` search input uses raw `<input>`
- `SocialProof.jsx` uses inline `style` props (legacy pattern)

### 6.3 Modal consistency
- **Consistent/modern:** `ui/Modal` consumers (`CreateProjectModal`, delete confirmations)
- **Inconsistent:** three custom modal implementations (`CreateTaskModal`, `EditTaskModal`, `AddMemberModal`)
- Status: **PARTIAL**

### 6.4 Badge usage consistency
- Used consistently in task/project cards and kanban counts
- Variant mapping present in `TaskCard`
- Status: **COMPLETE**

### 6.5 Button usage consistency
- Strong in dashboard areas with `ui/Button`
- Inconsistent in auth pages and custom modals
- Status: **PARTIAL**

### 6.6 Design system adherence
- Dashboard mostly aligns with shared primitive layer
- Marketing/auth pages mostly Tailwind-manual but visually aligned
- One legacy outlier (`SocialProof`) not aligned and unused
- Status: **PARTIAL**

---

## SECTION 7: ASYNC & LOADING ANALYSIS

### 7.1 Files using `useAsyncAction`
- `pages/Dashboard/Projects.jsx`
- `pages/Dashboard/ProjectDetails.jsx`
- `pages/Dashboard/Tasks.jsx`
- `pages/Dashboard/Team.jsx`

### 7.2 Manual loading still left
- Many mutations bypass async wrapper entirely:
  - task status updates
  - task edit
  - task delete
  - project delete
  - team member delete
- Result: loader not shown for these operations
- Status: **PARTIAL**

### 7.3 Duplicated async logic
- Multiple handlers still include `await new Promise(setTimeout...)` directly in pages
- `Team.jsx` contains both add-flow async wrapper and close-time async wrapper toasts for same user action
- Status: **PARTIAL**

### 7.4 Potential race conditions
- Global loading is a single boolean (`isLoading`), so overlapping `runAsync` calls can flicker or prematurely stop loader when one finishes first
- Toast IDs derived from `Date.now() + random` reduce but do not mathematically eliminate collision risk
- Team modal add-close sequence uses timeout/ref logic that can emit duplicate success toasts
- Status: **PARTIAL**

### 7.5 Error handling coverage
- `useAsyncAction` has default catch path and optional custom message
- Context mutations mostly do not throw; input guards use `console.error` or `alert`
- Form-level validation uses native checks or manual alerts in some modals
- Status: **PARTIAL**

---

## SECTION 8: UX CONSISTENCY CHECK

### 8.1 Where toast is used
- `ProjectCard` delete success
- `TaskCard` status change info and delete success
- `TeamMemberCard` delete success
- `useAsyncAction` success/error in:
  - `Projects` create
  - `ProjectDetails` create task
  - `Tasks` create task
  - `Team` add member flow (plus close handler duplication)

### 8.2 Where toast is missing
- `Profile` save action has no feedback
- Task edit (`EditTaskModal`) save has no toast
- Login/signup submit paths have no feedback (no logic implemented)

### 8.3 Where confirmation is missing
- Destructive actions are confirmed for task/project/member delete (good)
- No confirmation on profile save (not destructive)
- No confirmation on status updates (likely acceptable for lightweight action)

### 8.4 Where loading is missing
- Direct synchronous mutations (edit/delete/status updates) do not show loader
- Auth/profile forms have no async/loading pathway

Status overall UX consistency: **PARTIAL**

---

## SECTION 9: PERFORMANCE & TECH DEBT

### 9.1 Large components (line-count hotspots)
- `TaskCard.jsx` (~262)
- `EditTaskModal.jsx` (~235)
- `CreateTaskModal.jsx` (~229)
- `AddMemberModal.jsx` (~218)
- `Signup.jsx` (~218)
- `Profile.jsx` (~203)
- `DashboardHome.jsx` (~198)

### 9.2 Re-render risks
- Context providers store broad mutable arrays; consumers can re-render frequently when unrelated context slices update
- `AppProvider` exposes raw setters and full value object each render (not memoized)
- `Tasks` filters memoized (good), but many child components remain un-memoized (acceptable for current scale)

### 9.3 Inline styles
- `SocialProof.jsx` uses inline style objects (legacy + unused)
- `DashboardHome.jsx` uses inline `style` for gradient glow map

### 9.4 Hardcoded values
- Simulated latency (`700ms`) repeated in async handlers
- Hardcoded user labels in `Topbar` (`T`, `Tanu`, `Developer`)
- Profile stats hardcoded numeric cards (`3`, `12`, `5`)
- Footer year/content static text

### 9.5 Dead code / unused files
- `components/home/SocialProof.jsx` not imported
- `assets/logo/logo-dark.svg` not referenced

### 9.6 Unused/placeholder directories
- `src/services/` empty
- `src/styles/` empty
- `src/utils/` empty
- `public/` empty

### 9.7 Explicit broken item
- Team add-member callback contract mismatch:
  - Parent passes `onAddMember`
  - Child ignores prop and writes context directly
  - Parent async close logic attempts success handling independently

Tech debt status: **PARTIAL**

---

## SECTION 10: FRONTEND EXPANSION READINESS

### 10.1 Is architecture stable for more features?
- Base structure (routes, contexts, reusable UI primitives) is organized and extensible
- Current mixed patterns (primitive vs custom modal/forms) reduce consistency as scale grows
- Verdict: **PARTIAL stability**

### 10.2 Is async layer ready for API?
- `useAsyncAction` is a good abstraction for API wrapping
- Missing request cancellation, concurrent loading accounting, typed error model
- Verdict: **PARTIAL readiness**

### 10.3 Is UI system stable?
- Primitive set is usable and already adopted by dashboard features
- Adoption incomplete across auth/profile/custom modals
- Verdict: **PARTIAL readiness**

### 10.4 Are state boundaries clear?
- App domain state vs toast/loading cross-cutting state is clearly separated
- Still central context-heavy with no domain slicing or selectors
- Verdict: **PARTIAL clarity**

### 10.5 Scalability level
- **Scalability level:** **Moderate**
- Rationale from code:
  - Positive: clear route/layout separation, context providers, reusable UI base, async wrapper
  - Limiting: local-memory data only, mixed UI patterns, some broken callback contract, coarse loading model

---

## SECTION 11: SINGLE MOST IMPORTANT NEXT FRONTEND FEATURE

## Recommendation: **Offline Persistence Layer for App State (Projects/Tasks/Team/Profile) via localStorage adapter**

### Why this is highest value without backend
- Current app state is fully in-memory (`AppProvider`), so all user-created data is lost on refresh
- This directly limits product usefulness more than visual/UI refinements
- Persistence can be implemented entirely frontend-side without backend integration

### What this feature should include (frontend-only)
- Hydrate `projects`, `tasks`, `teamMembers`, `user` from localStorage on app start
- Persist state updates on every create/update/delete mutation
- Versioned storage key for future schema migration
- Optional lightweight reset action for dev/testing

### Expected impact
- Converts app from demo-session behavior to persistent utility behavior
- Makes all existing CRUD/kanban/team/profile workflows materially more valuable immediately
- Provides a migration-friendly boundary for later backend sync implementation

### Status if implemented currently
- Would move core data layer from **PARTIAL** toward **COMPLETE** for non-backend operation.

---

## STATUS SUMMARY SNAPSHOT

- **COMPLETE:** core routing skeleton, UI primitives, toast/loading providers, task/project/team display and basic operations, landing pages
- **PARTIAL:** auth flows, profile persistence, protected routes, UI consistency, async coverage consistency
- **UNUSED:** `SocialProof.jsx`, `logo-dark.svg`
- **PLACEHOLDER:** `public/`, `src/services/`, `src/styles/`, `src/utils/`
- **BROKEN:** team add-member callback contract between `Team.jsx` and `AddMemberModal.jsx`
