# Sakila Admin SSR — User Stories with Linked Tasks
_Generated: 2025-09-01_

Format: Each **User Story (US-xx)** includes Priority, Story Points, Sprint, **Acceptance Criteria**, and a linked **Tasks** checklist you can track.

Epics:
- **EP-01 Admin Actor Management**
- **EP-02 Foundation & Architecture (Enablers)**
- **EP-03 Usability, Validation & Errors**
- **EP-04 Testing, Docs & Evidence**
- **EP-05 Optional Extensions**

---

## EP-01 — Admin Actor Management

### US-01 — View & search actors (list with pagination)
**As an** Admin  
**I want** to view a paginated list of actors and search by first/last name  
**So that** I can quickly find and manage entries  
**Priority:** P0/MUST · **SP:** 5 · **Sprint:** Sprint 1

**Acceptance Criteria**
- When I open `/actors`, I see a table of actors with columns: ID, First, Last, Updated, Actions.
- I can search by first/last name via `?q=`; results are filtered accordingly.
- Pagination controls appear when results exceed the page size; current page is highlighted.
- Inputs are validated; invalid `page` falls back to 1; empty `q` returns all.
- Performance: list queries use LIMIT/OFFSET.

**Tasks**
- [ ] Route: `GET /actors` (reads `page`, `q`).
- [ ] Controller: `index` (try/catch + `next(err)`).
- [ ] Service: `list` returns `items,total,page,pages,q`.
- [ ] Repository: `findAll(search,limit,offset)` with parameterized query.
- [ ] Repository: `count(search)` to compute `pages`.
- [ ] View: `views/actors/index.ejs` with search form + pagination, responsive table.
- [ ] Validation: sanitize `page`, trim `q`.
- [ ] Manual tests: empty search, specific name, high page number, huge q, UTF-8 input.
- [ ] Evidence: screenshots (search + pagination), code snippets (repo/service).

---

### US-02 — Create actor
**As an** Admin  
**I want** to create a new actor with first/last name  
**So that** I can add missing records  
**Priority:** P0/MUST · **SP:** 3 · **Sprint:** Sprint 1

**Acceptance Criteria**
- From `/actors/new`, I can submit first/last name (1–45 chars each).
- On success, I’m redirected to the new actor’s details page.
- On validation failure, I see messages and my input is preserved.
- `last_update` is set automatically.

**Tasks**
- [ ] Route: `GET /actors/new` (form).
- [ ] Route: `POST /actors` (submit).
- [ ] Controller: `newForm`, `create` with validationResult checks.
- [ ] Service: `create` (trims input).
- [ ] Repository: `create` (INSERT, NOW()), return insertId.
- [ ] View: `views/actors/new.ejs` + error display + max length attrs.
- [ ] Validation: `first_name`, `last_name` 1–45 chars (NL messages).
- [ ] Manual tests: empty, too long, leading/trailing spaces, success path.
- [ ] Evidence: screenshot (error + success), snippet of validator.

---

### US-03 — View actor details
**As an** Admin  
**I want** to view an actor’s details  
**So that** I can verify and decide next actions  
**Priority:** P1/SHOULD · **SP:** 2 · **Sprint:** Sprint 1

**Acceptance Criteria**
- `/actors/:id` shows ID, First, Last, Last update with action buttons (Edit, Delete, Back).
- Invalid/nonexistent id yields 404 page.

**Tasks**
- [ ] Route: `GET /actors/:id` with id validator.
- [ ] Controller: `show` returns 404 if not found.
- [ ] Repository: `findById` returns row or null.
- [ ] View: `views/actors/show.ejs` (definition list + buttons).
- [ ] Tests: valid id, missing id, non-existent id.
- [ ] Evidence: screenshots (existing + 404).

---

### US-04 — Edit actor
**As an** Admin  
**I want** to edit an actor’s first/last name  
**So that** I can correct or update data  
**Priority:** P0/MUST · **SP:** 3 · **Sprint:** Sprint 1

**Acceptance Criteria**
- `/actors/:id/edit` loads existing values.
- Submitting invalid data shows messages and preserves input.
- Success redirects to the same actor’s details page and updates `last_update`.

**Tasks**
- [ ] Route: `GET /actors/:id/edit` with id validator.
- [ ] Route: `POST /actors/:id/update` with id + body validators.
- [ ] Controller: `editForm`, `update` with validationResult.
- [ ] Service: `update` (trims input).
- [ ] Repository: `update` (returns affected boolean).
- [ ] View: `views/actors/edit.ejs` (prefill + errors).
- [ ] Tests: invalid id, invalid name, success.
- [ ] Evidence: before/after screenshots; code for repo update.

---

### US-05 — Delete actor (with confirmation)
**As an** Admin  
**I want** to delete an actor after confirmation  
**So that** I can remove incorrect entries  
**Priority:** P0/MUST · **SP:** 2 · **Sprint:** Sprint 1

**Acceptance Criteria**
- From list/detail, I can delete with a confirmation dialog.
- If the id does not exist, I get a 404 page.
- On success, I return to the list page.

**Tasks**
- [ ] Route: `POST /actors/:id/delete` with id validator.
- [ ] Controller: `destroy` returns 404 if not found.
- [ ] Repository: `remove` (returns affected boolean).
- [ ] Views: form with confirm dialog (onSubmit confirm).
- [ ] Tests: delete existing, delete missing, cancel confirm.
- [ ] Evidence: screenshots; code for repo remove.

---

## EP-02 — Foundation & Architecture (Enablers)

### US-06 — SSR shell & layout
**As a** User (any role)  
**I want** a consistent SSR layout with navbar and responsive container  
**So that** I can navigate and use the app on any device  
**Priority:** P1/SHOULD · **SP:** 3 · **Sprint:** Sprint 1

**Acceptance Criteria**
- EJS view engine configured; header/footer partials.
- Bootstrap via CDN; navbar with brand and links.
- Mobile: tables scroll, nav collapses.

**Tasks**
- [ ] Configure EJS and views path.
- [ ] Add Bootstrap CDN and verify responsive grid.
- [ ] Create `partials/header.ejs` & `partials/footer.ejs` with navbar.
- [ ] Evidence: screenshots desktop + mobile width.

---

### US-07 — Layered architecture & logging
**As a** Developer (enabler)  
**I want** a layered structure and request logging  
**So that** code is maintainable and diagnosable  
**Priority:** P1/SHOULD · **SP:** 5 · **Sprint:** Sprint 1

**Acceptance Criteria**
- Folders: routes, controllers, services, repositories, config, views, public, middleware.
- No direct route→repository calls; services mediate.
- `morgan('dev')` enabled; central error handler and 404 page.

**Tasks**
- [ ] Create folder skeleton.
- [ ] Add morgan logging.
- [ ] Implement 404 handler and error middleware.
- [ ] Evidence: tree screenshot; code snippets.

---

### US-08 — Environment & DB connectivity
**As a** Developer (enabler)  
**I want** a working MySQL Sakila setup and DB pool  
**So that** the app can query data reliably  
**Priority:** P0/MUST · **SP:** 3 · **Sprint:** Sprint 1

**Acceptance Criteria**
- Node 18+ installed; MySQL reachable locally.
- `sakila` schema + data loaded.
- `.env` configured; `.env` not in git.
- DB pool connects; sample query passes.

**Tasks**
- [ ] Install Node, MySQL.
- [ ] Import Sakila.
- [ ] Create `.env` and `.gitignore` excludes secrets.
- [ ] Verify connectivity via home page query.
- [ ] Evidence: terminal + homepage screenshots.

---

### US-09 — Home page sample dataset
**As a** User (any role)  
**I want** to see a sample dataset on the home page  
**So that** I know the system is connected and responsive  
**Priority:** P1/SHOULD · **SP:** 2 · **Sprint:** Sprint 1

**Acceptance Criteria**
- `/` shows a table of 20 films with Title, Language, Year (JOIN language).
- Query uses LIMIT/OFFSET and ORDER BY title.

**Tasks**
- [ ] Route: `GET /` executes films query.
- [ ] View: `views/home.ejs` renders table responsively.
- [ ] Evidence: screenshot of homepage.

---

## EP-03 — Usability, Validation & Errors

### US-10 — Server-side validation & NL messages
**As a** User  
**I want** clear validation messages in Dutch  
**So that** I can correct input mistakes quickly  
**Priority:** P1/SHOULD · **SP:** 3 · **Sprint:** Sprint 1

**Acceptance Criteria**
- Names 1–45 chars enforced server-side.
- Invalid ID → 400 on submit pages; 404 on not found.
- Messages are concise and in NL.

**Tasks**
- [ ] Implement `express-validator` rules (names, ids).
- [ ] Render error list in new/edit templates.
- [ ] Tests: invalid inputs produce friendly messages.
- [ ] Evidence: screenshots of errors.

---

### US-11 — Error pages (404/500)
**As a** User  
**I want** clear error pages  
**So that** I understand what went wrong and where to go next  
**Priority:** P1/SHOULD · **SP:** 2 · **Sprint:** Sprint 1

**Acceptance Criteria**
- 404 for unknown routes and missing actors.
- 500 handler renders friendly message (no stack in production).

**Tasks**
- [ ] Implement 404 route after routers.
- [ ] Implement error middleware with environment-aware stack.
- [ ] Evidence: screenshots 404 + 500.

---

### US-12 — Accessibility & responsive baseline
**As a** User  
**I want** accessible forms and responsive tables  
**So that** I can use the app across devices and inputs  
**Priority:** P1/SHOULD · **SP:** 3 · **Sprint:** Sprint 1

**Acceptance Criteria**
- Labels associated to inputs; buttons have meaningful text.
- Mobile: horizontal scroll for tables; nav collapses.
- Delete uses a confirmation to avoid accidental actions.

**Tasks**
- [ ] Add `label for` & `id` attributes to forms.
- [ ] Ensure navbar collapse and table overflow.
- [ ] Add delete confirmation.
- [ ] Evidence: mobile screenshots; quick a11y notes.

---

## EP-04 — Testing, Docs & Evidence

### US-13 — Manual test plan & execution
**As a** Developer  
**I want** a lightweight manual test plan  
**So that** I can verify CRUD, errors, and pagination reliably  
**Priority:** P1/SHOULD · **SP:** 3 · **Sprint:** Sprint 1

**Acceptance Criteria**
- Test checklist covers happy/edge paths.
- Results recorded with screenshots for error paths.

**Tasks**
- [ ] Author checklist.
- [ ] Execute and record results.
- [ ] Capture 400/404/500 screenshots.
- [ ] Evidence: test doc + images.

---

### US-14 — Documentation & grading evidence
**As an** Instructor/Reviewer  
**I want** a clear README, architecture notes, and a short demo  
**So that** I can grade quickly and fairly  
**Priority:** P1/SHOULD · **SP:** 3 · **Sprint:** Sprint 1

**Acceptance Criteria**
- README: run/test instructions, Weektaken mapping.
- Architecture section: layered, DRY, SSR choices.
- 1–2 minute demo video showing list→create→edit→delete→errors.

**Tasks**
- [ ] Update README run/test.
- [ ] Write architecture explanation.
- [ ] Record short demo video.
- [ ] Evidence: README diff, video link, screenshots.

---

## EP-05 — Optional Extensions (Backlog)

### US-15 — Link actor to films on detail page
**Priority:** P1/SHOULD · **SP:** 3 · **Sprint:** Backlog  
**Acceptance:** Actor detail lists films via `film_actor` join.

**Tasks**
- [ ] Repository: get films for actor.
- [ ] Controller/View: render films list on `/actors/:id`.
- [ ] Evidence: screenshot.

---

### US-16 — Sort toggle on actors list
**Priority:** P2/COULD · **SP:** 2 · **Sprint:** Backlog  
**Acceptance:** List can sort by last name ASC/DESC via validated param.

**Tasks**
- [ ] Validate `sort` param; default safe value.
- [ ] Apply ORDER BY dynamically (whitelist).

---

### US-17 — Security headers (helmet)
**Priority:** P2/COULD · **SP:** 1 · **Sprint:** Backlog  
**Acceptance:** Common security headers applied if allowed by scope.

**Tasks**
- [ ] Add helmet and test headers.

---

### US-18 — Rate-limit write routes
**Priority:** P2/COULD · **SP:** 2 · **Sprint:** Backlog  
**Acceptance:** Simple rate limit on POST update/delete.

**Tasks**
- [ ] Add rate limiter middleware; verify behavior.

---

### US-19 — Docker dev compose
**Priority:** P2/COULD · **SP:** 2 · **Sprint:** Backlog  
**Acceptance:** `docker-compose up` runs MySQL + app for onboarding.

**Tasks**
- [ ] Write compose; update README.

---

### US-20 — Automated smoke script
**Priority:** P2/COULD · **SP:** 2 · **Sprint:** Backlog  
**Acceptance:** One command hits `/, /actors` and basic CRUD to verify health.

**Tasks**
- [ ] Write script; add to npm scripts.

---

### US-21 — Basic authentication (if permitted)
**Priority:** P2/COULD · **SP:** 3 · **Sprint:** Backlog  
**Acceptance:** Admin-only access to actor routes.

**Tasks**
- [ ] Add session-based login; guard routes.

---

### US-22 — Error page UX polish
**Priority:** P2/COULD · **SP:** 1 · **Sprint:** Backlog  
**Acceptance:** Friendlier error templates with guidance/back links.

**Tasks**
- [ ] Improve `views/error.ejs` content.

---

### US-23 — i18n messages centralization
**Priority:** P2/COULD · **SP:** 1 · **Sprint:** Backlog  
**Acceptance:** User-facing strings centralized for clarity.

**Tasks**
- [ ] Extract strings to module; use consistently.

---

### US-24 — Data sanity checks
**Priority:** P2/COULD · **SP:** 1 · **Sprint:** Backlog  
**Acceptance:** Script validates lengths/anomalies.

**Tasks**
- [ ] Write check script; run against sample inputs.

---

### US-25 — Changelog & feedback
**Priority:** P2/COULD · **SP:** 1 · **Sprint:** Backlog  
**Acceptance:** `CHANGELOG.md` tracks changes; feedback addressed.

**Tasks**
- [ ] Create changelog; log resolutions.

---

## Notes
- Keep all SQL **parameterized**.  
- Stay inside constraints: **JavaScript + MySQL**, **SSR**, **Bootstrap**.  
- Maintain **layered** architecture and **DRY** principles.  
