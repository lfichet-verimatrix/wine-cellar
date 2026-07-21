# Wine Cellar Management — Implementation Plan

This implementation plan breaks the design into discrete coding tasks. Each task builds incrementally on the previous one. All context documents (requirements, design) should be available during implementation.

---

## 1. Backend: Wine Model and Database Setup

- [ ] **1.1 Create the Wine Mongoose model**
  - Create `src/models/Wine.js` with the schema defined in the design document (name, producer, vintage, type, grape, region, country, quantity, price, rating, notes, status, timestamps).
  - Add indexes: `{ type: 1 }`, `{ status: 1 }`, `{ name: 'text', producer: 'text' }`.
  - Export the model.
  - *Ref: Requirement 1.1 (field definitions), Requirement 4.3 (server-side validation)*

- [ ] **1.2 Update database config**
  - In `src/config/index.js`, change the default `mongoUri` database name from `tasks-mern` to `wine-cellar`.
  - *Ref: Design — Data Models*

## 2. Backend: Validation Schemas

- [ ] **2.1 Create Zod validation schemas for wine endpoints**
  - Create `src/routes/wines.schema.js` with schemas:
    - `createWineBody` — validates all required and optional fields per Requirement 1.1 acceptance criteria (name required max 200, producer required max 200, vintage optional 1900–currentYear+1, type enum required, grape optional max 200, region optional max 200, country optional max 100, quantity int ≥ 0 default 1, price ≥ 0 optional, rating int 1–5 optional, notes max 2000 optional, status enum default "In Cellar").
    - `updateWineBody` — partial version of create (all fields optional).
    - `getWinesQuery` — optional `type` (enum), `status` (enum), `search` (string max 200).
    - `wineIdParam` — validates MongoDB ObjectId format.
    - Compose into `getWinesSchema`, `getWineByIdSchema`, `createWineSchema`, `updateWineSchema`, `deleteWineSchema` objects for the validate middleware.
  - *Ref: Requirement 3.1 (validation on create/update), Requirement 4.3 (server-side validation)*

## 3. Backend: Service Layer

- [ ] **3.1 Create the wines service**
  - Create `src/services/wines.service.js` with functions:
    - `getAllWines(filter)` — builds a MongoDB query from optional `type`, `status`, and `search` params. For `search`: use `$text` operator for terms ≥ 3 chars, regex fallback for shorter terms (case-insensitive match on name or producer). Sort by `createdAt` descending.
    - `getWineById(id)` — find by ID, throw `NotFoundError` if not found.
    - `createWine(data)` — create and save a new Wine document.
    - `updateWine(id, data)` — findByIdAndUpdate with `{ new: true, runValidators: true }`, throw `NotFoundError` if not found.
    - `deleteWine(id)` — findByIdAndDelete, throw `NotFoundError` if not found.
  - *Ref: Requirement 1.1–1.5 (CRUD), Requirement 1.3 (filtering/search), Requirement 3.1 (API behavior)*

## 4. Backend: Controller and Routes

- [ ] **4.1 Create the wines controller**
  - Create `src/controllers/wines.controller.js` with thin handler functions:
    - `getAll` — extract validated query params, call service, respond with `{ success: true, data }`.
    - `getById` — extract `req.params.id`, call service, respond.
    - `create` — extract `req.body`, call service, respond with 201.
    - `update` — extract `req.params.id` and `req.body`, call service, respond.
    - `remove` — extract `req.params.id`, call service, respond with `{ success: true, data: null }`.
  - *Ref: Requirement 3.1 (response format)*

- [ ] **4.2 Create the wines routes**
  - Create `src/routes/wines.routes.js` using `express.Router()`.
  - Wire up: `GET /` → validate(getWinesSchema) → getAll, `GET /:id` → validate(getWineByIdSchema) → getById, `POST /` → validate(createWineSchema) → create, `PUT /:id` → validate(updateWineSchema) → update, `DELETE /:id` → validate(deleteWineSchema) → remove.
  - *Ref: Requirement 3.1 (endpoints)*

- [ ] **4.3 Mount wine routes and remove task routes**
  - In `src/routes/index.js`: remove the `/tasks` import and mount; add `router.use('/wines', winesRoutes)`.
  - Delete the task-related backend files: `src/routes/tasks.routes.js`, `src/routes/tasks.schema.js`, `src/controllers/tasks.controller.js`, `src/services/tasks.service.js`, `src/models/Task.js`.
  - *Ref: Design — Summary of Changes*

## 5. Backend: Seed Script

- [ ] **5.1 Create wine seed data and update seed script**
  - Create `wines.json` at project root with 8–10 sample wines spanning different types, statuses, vintages, and regions.
  - Update `scripts/seed.js` to import the Wine model and read from `wines.json` instead of the `taks` file.
  - Delete the old `taks` file.
  - *Ref: Design — Seed Data*

## 6. Backend: Verification

- [ ] **6.1 Manually verify the API works**
  - Start the server (`npm run dev`) and test with curl or fetch:
    - `POST /wines` with valid data → 201
    - `GET /wines` → returns the created wine
    - `GET /wines?type=Red` → filters correctly
    - `GET /wines?search=chateau` → search works
    - `PUT /wines/:id` with partial data → 200
    - `DELETE /wines/:id` → 200
    - `POST /wines` with missing required field → 400 with validation error
    - `GET /wines/invalidid` → 400 (invalid format)
    - `GET /wines/507f1f77bcf86cd799439011` → 404 (not found)
  - Fix any issues before proceeding to frontend.
  - *Ref: Requirement 3.1 (all acceptance criteria)*

## 7. Frontend: API Service and Select Component

- [ ] **7.1 Create the wines API service**
  - Create `client/src/services/winesApi.js` with functions: `fetchWines(filters)`, `fetchWineById(id)`, `createWine(data)`, `updateWine(id, data)`, `deleteWine(id)`.
  - Build query params from filters object for `fetchWines`. Handle errors consistently (throw Error with server message).
  - Delete `client/src/services/tasksApi.js`.
  - *Ref: Requirement 3.1, Design — Frontend API Service*

- [ ] **7.2 Create the Select UI component**
  - Create `client/src/components/ui/Select.jsx` and `Select.module.css`.
  - Props: `label`, `error`, `id`, `options` (array of `{ value, label }`), `placeholder`, plus spread props.
  - Style consistently with the existing Input component. Include accessible label, error state, and `aria-invalid`/`aria-describedby`.
  - *Ref: Design — Select component, Requirement 4.1 (accessible form controls)*

## 8. Frontend: Wine Components

- [ ] **8.1 Create the WineForm component**
  - Create `client/src/components/wines/WineForm.jsx` and `WineForm.module.css`.
  - Handle both create and edit modes (pre-populate when `wine` prop is provided).
  - Include all fields from Requirement 1.1: name, producer, vintage, type (Select), grape, region, country, quantity, price, rating, notes, status (Select).
  - Implement client-side validation matching the Zod rules. Show inline errors per field.
  - Use `useTransition` for async submission with loading state on submit button.
  - Catch submission errors and display as form-level error.
  - *Ref: Requirement 1.1 (fields + validation), Requirement 1.4 (edit pre-population), Requirement 4.1 (accessible forms), Requirement 4.3 (client-side validation)*

- [ ] **8.2 Create the WineCard component**
  - Create `client/src/components/wines/WineCard.jsx` and `WineCard.module.css`.
  - Display: name, producer, vintage, type (colored badge), quantity, rating (as stars or number/5), status badge.
  - Include Edit and Delete action buttons. Delete triggers `window.confirm` before calling `onDelete`.
  - *Ref: Requirement 1.2 (display fields), Requirement 1.5 (delete confirmation)*

- [ ] **8.3 Create the FilterBar component**
  - Create `client/src/components/wines/FilterBar.jsx` and `FilterBar.module.css`.
  - Render: type dropdown (Select), status dropdown (Select), search text input.
  - Emit changes via `onFilterChange` callback. Include a "Clear filters" button when any filter is active.
  - *Ref: Requirement 1.3 (filter by type, status, search; clear filters)*

- [ ] **8.4 Create the StatsPanel component**
  - Create `client/src/components/wines/StatsPanel.jsx` and `StatsPanel.module.css`.
  - Compute from the wine list:
    - Total bottles in cellar (sum of quantities where status = "In Cellar").
    - Estimated cellar value (sum of quantity × price where status = "In Cellar" and price is set).
    - Breakdown by type (count of bottles per type for "In Cellar" wines).
  - Display in stat cards consistent with the existing dashboard design.
  - *Ref: Requirement 2.1 (all acceptance criteria)*

## 9. Frontend: Wine Map Component

- [ ] **9.1 Create the region data mapping module**
  - Create `client/src/components/wines/regionData.js` with:
    - `FRENCH_WINE_REGIONS` object mapping 14 major regions (Bordeaux, Bourgogne, Champagne, Alsace, Loire, Vallée du Rhône, Beaujolais, Languedoc, Roussillon, Provence, Sud-Ouest, Jura, Savoie, Corse) to arrays of their sub-regions/appellations.
    - `findParentRegion(regionName)` — case-insensitive lookup returning the parent region key or null.
    - `getRegionFilterValues(regionKey)` — returns `[regionKey, ...subRegions]` for filtering.
    - `getActiveRegions(wines)` — returns a Set of region keys that have at least one wine.
  - *Ref: Requirement 1.6 (region mapping, sub-region matching)*

- [ ] **9.2 Create the FranceRegionsSVG component**
  - Create `client/src/components/wines/FranceRegionsSVG.jsx` with geographically accurate SVG paths for each wine region (generated from French départements GeoJSON data).
  - Each region is a clickable `<path>` with a `data-region` attribute and dynamic className based on active/selected state.
  - Include region labels as `<text>` elements and a France outline as background.
  - *Ref: Requirement 1.6 (interactive map, highlighting)*

- [ ] **9.3 Create the WineMap wrapper component**
  - Create `client/src/components/wines/WineMap.jsx` and `WineMap.module.css`.
  - Accept props: `wines` (unfiltered list), `selectedRegion`, `onRegionSelect`.
  - Compute active regions with `useMemo` and pass to `FranceRegionsSVG`.
  - Implement toggle behavior: clicking same region deselects.
  - Display a clear button showing the selected region name, and a legend.
  - Style regions: gray (inactive), wine-red (active/has wines), purple (selected/filtering).
  - *Ref: Requirement 1.6 (click to filter, click again to clear, legend)*

## 10. Frontend: Dashboard Page

- [ ] **10.1 Create the WineDashboard page**
  - Create `client/src/pages/WineDashboard.jsx` and `WineDashboard.module.css`.
  - Manage state: wines list, loading, error, filters, selectedRegion, create modal, edit modal.
  - On mount and when filters change: fetch wines via `winesApi.fetchWines(filters)`.
  - Render: header with title + "Add Wine" button, `StatsPanel`, `WineMap`, `FilterBar`, wine list (map over wines → `WineCard`), empty/loading/error states.
  - Apply region filter client-side: when `selectedRegion` is set, filter `wines` to only those whose region matches the selected region or its sub-regions (using `getRegionFilterValues`). Use `useMemo` for performance.
  - Wire up create flow: open modal → `WineForm` → on submit call `createWine` → close modal → refresh list.
  - Wire up edit flow: `WineCard` onEdit → open modal with wine data → `WineForm` → on submit call `updateWine` → close modal → refresh list.
  - Wire up delete flow: `WineCard` onDelete → call `deleteWine` → refresh list.
  - Handle empty state: show friendly message with prompt to add first wine when no wines exist.
  - Handle filtered empty state: show "No wines match your filters" message.
  - *Ref: Requirement 1.1–1.6 (all CRUD flows + region map), Requirement 1.2 (empty state), Requirement 1.3 (filtering), Requirement 2.1 (stats update on changes), Requirement 4.1 (loading/error feedback), Requirement 4.2 (loading indicator)*

- [ ] **10.2 Update App.jsx and Vite config**
  - In `client/src/App.jsx`: replace `TaskDashboard` import with `WineDashboard`.
  - In `client/vite.config.js`: replace the `/tasks` proxy with `/wines`.
  - Delete the old task frontend files: `client/src/pages/TaskDashboard.jsx`, `TaskDashboard.module.css`, `client/src/components/tasks/` directory.
  - *Ref: Design — Vite Proxy Configuration, Summary of Changes*

## 11. Frontend: Internationalization (i18n)

- [ ] **11.1 Create the i18n infrastructure**
  - Create `client/src/i18n/en.js` with all English translation strings organized by category (app, actions, stats, types, statuses, filters, form fields, placeholders, validation errors, empty states, map).
  - Create `client/src/i18n/fr.js` with matching French translations.
  - Create `client/src/i18n/index.jsx` with `I18nProvider` (React context), `useI18n` hook, `t(key, params)` function with template replacement, localStorage persistence, and browser language auto-detection.
  - Wrap `App.jsx` with `I18nProvider`.
  - *Ref: Requirement 1.7 (all acceptance criteria)*

- [ ] **11.2 Extract all hardcoded strings to translation keys**
  - Update all components (WineDashboard, StatsPanel, WineCard, FilterBar, WineForm, WineMap) to use `useI18n()` and `t()` for every user-facing string.
  - Replace hardcoded type/status labels with `t('type.Red')`, `t('status.In Cellar')` etc.
  - Replace validation error messages with translated equivalents using parameterized keys where needed.
  - *Ref: Requirement 1.7 (acceptance criteria 3)*

- [ ] **11.3 Create the LanguageSwitcher component**
  - Create `client/src/components/ui/LanguageSwitcher.jsx` and `LanguageSwitcher.module.css`.
  - Render toggle buttons for each available locale (🇬🇧 EN / 🇫🇷 FR).
  - Use `aria-pressed` for accessibility.
  - Place in the dashboard header.
  - *Ref: Requirement 1.7 (acceptance criteria 2)*

- [ ] **11.4 Update document title on language change**
  - In `I18nProvider`, set `document.title` to the current locale's `appTitle` on init and on locale change.
  - Also set `document.documentElement.lang` to the current locale.
  - *Ref: Requirement 1.7 (acceptance criteria 6, 7)*

## 12. Frontend: Styling and Polish

- [ ] **12.1 Update global styles and design tokens**
  - In `client/src/styles/global.css`: update the page title/meta (if any inline comments reference "tasks"). Optionally add wine-themed color tokens (e.g., `--color-wine-red`, `--color-wine-white`) for type badges.
  - Ensure all new components use the existing design system variables (spacing, shadows, radii, typography).
  - *Ref: Requirement 4.1 (responsive, 375px–1920px), Design — CSS Modules*

- [ ] **12.2 Ensure responsive layout**
  - Verify `WineDashboard` layout works from 375px to 1920px. Use CSS grid/flexbox with appropriate breakpoints.
  - WineCard grid: 1 column on mobile, 2 on tablet, 3 on desktop.
  - Form fields: stack vertically on mobile, 2-column grid on wider screens for shorter fields (vintage, quantity, price, rating).
  - *Ref: Requirement 4.1 (responsive 375px–1920px)*

## 13. End-to-End Verification

- [ ] **13.1 Run the full app and verify all flows**
  - Start MongoDB, run `npm run seed` to populate sample data, start backend (`npm run dev`), start frontend (`cd client && npm run dev`).
  - Verify in browser:
    - Dashboard loads with wines and correct stats.
    - Region map highlights regions that have wines.
    - Clicking a region filters the wine list to that region and its sub-regions.
    - Clicking the same region or the clear button removes the filter.
    - Region filter works in combination with type, status, and search filters.
    - Language switcher toggles between English and French.
    - All labels, buttons, placeholders, and validation messages update on language change.
    - Browser tab title updates on language change.
    - Selected language persists after page reload.
    - Filtering by type, status, and search works (AND logic).
    - Clearing filters restores full list.
    - Add wine: form validates, creates, appears in list, stats update.
    - Edit wine: form pre-populates, updates, changes reflected immediately.
    - Delete wine: confirmation dialog, removal, stats update.
    - Empty state shown when all wines are deleted.
    - Responsive layout at 375px and 1920px.
  - Fix any issues discovered.
  - *Ref: All requirements (end-to-end validation)*

## 14. Testing Setup and Tests

- [ ] **14.1 Set up backend testing infrastructure**
  - Install dev dependencies: `jest`, `supertest`, `mongodb-memory-server`.
  - Add jest config to `package.json` (or `jest.config.js`). Configure test environment for Node.
  - Add `"test": "jest"` script to `package.json`.
  - Create a test helper (`tests/setup.js`) that connects/disconnects from in-memory MongoDB before/after all tests.
  - *Ref: Design — Testing Strategy*

- [ ] **14.2 Write backend integration tests**
  - Create `tests/wines.test.js` (or `tests/routes/wines.test.js`).
  - Tests:
    - `POST /wines` — creates wine with valid data (201), rejects missing required fields (400), rejects invalid types (400).
    - `GET /wines` — returns all wines, filters by type, filters by status, searches by name/producer, combines filters.
    - `GET /wines/:id` — returns wine (200), returns 404 for non-existent ID, returns 400 for invalid ID format.
    - `PUT /wines/:id` — updates wine (200), partial update works, rejects invalid data (400), returns 404 for missing ID.
    - `DELETE /wines/:id` — deletes wine (200), returns 404 for missing ID.
  - *Ref: Requirement 3.1 (all API acceptance criteria), Design — Testing Strategy*

- [ ] **14.3 Set up frontend testing infrastructure**
  - Install dev dependencies in client: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`.
  - Add vitest config (in `vite.config.js` or `vitest.config.js`). Set test environment to `jsdom`.
  - Add `"test": "vitest"` script to `client/package.json`.
  - *Ref: Design — Testing Strategy*

- [ ] **14.4 Write frontend component tests**
  - Create tests for key components:
    - `WineForm.test.jsx` — validates required fields, submits valid data, pre-populates in edit mode, shows submission errors.
    - `WineCard.test.jsx` — renders wine info, calls onEdit/onDelete.
    - `FilterBar.test.jsx` — emits filter changes, clears filters.
    - `StatsPanel.test.jsx` — computes correct stats, handles empty list.
  - *Ref: Design — Frontend Tests, Requirement 4.3 (client-side validation)*
