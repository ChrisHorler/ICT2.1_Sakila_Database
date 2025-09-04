# Sakila Admin SSR — Jira Backlog (Markdown)
_Generated: 2025-09-01_

Legend: **P0/MUST** = critical this iteration · **P1/SHOULD** = important but deferrable · **P2/COULD** = nice-to-have  
Notation: `(SP: n)` = Story Points estimate

---

## Sprint 1 (front-loaded)

- [ ] **P0/MUST** (SP: 2) **Project bootstrap**
  - [ ] Initialize git and `.gitignore` (Node ignores; first commit)
  - [ ] Author README (goals, run, Sakila, mapping to Weektaken)
  - [ ] Dev convenience: nodemon (`npm run dev`)

- [ ] **P0/MUST** (SP: 3) **Environment & DB ready**
  - [ ] Install Node 18+ and npm (verify versions)
  - [ ] Install MySQL server / access (local user with rights)
  - [ ] Load Sakila schema and data (`sakila` DB exists)
  - [ ] Create `.env` and exclude from git (DB creds set)
  - [ ] Verify DB pool connectivity (home page renders films)

- [ ] **P1/SHOULD** (SP: 3) **SSR shell & layout**
  - [ ] EJS configuration (views path + engine)
  - [ ] Bootstrap via CDN (responsive grid verified)
  - [ ] Navbar + header/footer partials (brand, nav links, container)

- [ ] **P1/SHOULD** (SP: 5) **Layered architecture skeleton**
  - [ ] Folder structure (`routes/`, `controllers/`, `services/`, `repositories/`, `config/`, `views/`, `public/`, `middleware/`)
  - [ ] Request logging (morgan('dev'))
  - [ ] Central error handler + 404 route

- [ ] **P1/SHOULD** (SP: 2) **Home page: sample dataset**
  - [ ] Films query (JOIN `language`) limited 20, ordered by title
  - [ ] Render responsive table (ID, Title, Language, Year)

- [ ] **P0/MUST** (SP: 5) **Actor repository implemented**
  - [ ] `findAll` with search & paginate (ORDER BY last, first; LIMIT/OFFSET; parameterized)
  - [ ] `count` with optional search
  - [ ] `findById` returns row or null
  - [ ] `create` (NOW() in `last_update`, returns insertId)
  - [ ] `update` (returns affected boolean)
  - [ ] `delete` (returns affected boolean)

- [ ] **P1/SHOULD** (SP: 3) **Actor service implemented**
  - [ ] `list` with metadata (`items,total,page,pages,q`)
  - [ ] `create/update` trims input
  - [ ] `remove` delegates and handles missing/invalid id

- [ ] **P0/MUST** (SP: 5) **Actors routes & controllers wired**
  - [ ] Define routes: `GET /actors`, `GET /actors/new`, `POST /actors`, `GET /actors/:id`, `GET /actors/:id/edit`, `POST /actors/:id/update`, `POST /actors/:id/delete`
  - [ ] Controllers: index/new/create/show/edit/update/destroy with try/catch and `next(err)`
  - [ ] Validators: `express-validator` for ids and names (1–45 chars)

- [ ] **P1/SHOULD** (SP: 5) **Actors SSR views complete**
  - [ ] Index with search + pagination (preserve `q`)
  - [ ] New form + validation errors (preserve values)
  - [ ] Edit form + validation errors (preserve values)
  - [ ] Show page (definition list + action buttons)

- [ ] **P1/SHOULD** (SP: 3) **Validation & error handling**
  - [ ] User-friendly validation messages (NL)
  - [ ] 404 paths (missing actor & unknown routes)
  - [ ] 500 middleware (friendly message, hide stack in prod)

- [ ] **P1/SHOULD** (SP: 3) **Usability & accessibility baseline**
  - [ ] Responsive tables (mobile overflow scroll)
  - [ ] Delete confirmation dialog
  - [ ] Proper form labels / aria attributes

- [ ] **P1/SHOULD** (SP: 3) **Testing & QA**
  - [ ] Test checklist (happy/edge paths for CRUD, search, pagination)
  - [ ] Run tests manually; record results
  - [ ] Capture error states (screenshots of 400/404/500)

- [ ] **P1/SHOULD** (SP: 3) **Documentation & grading evidence**
  - [ ] README run/test instructions updated
  - [ ] Architecture explanation (layers; NF-01 layered, NF-02 DRY)
  - [ ] Evidence bundle (screens + 1–2 min demo video)

---

## Backlog (unassigned)

- [ ] **P1/SHOULD** (SP: 3) **Link actor to films on show page**
  - [ ] JOIN `film_actor` → list films (film_id, title) per actor

- [ ] **P2/COULD** (SP: 2) **Sort toggle on actors list**
  - [ ] Allow sort by last name (ASC/DESC) with validated param

- [ ] **P2/COULD** (SP: 1) **Security headers (helmet)**
  - [ ] Add helmet if allowed by scope

- [ ] **P2/COULD** (SP: 2) **Rate limit write routes**
  - [ ] Lightweight rate limiting for POST update/delete

- [ ] **P2/COULD** (SP: 1) **ADR documentation**
  - [ ] Short ADRs for SSR, layered, MySQL, Bootstrap (no SPA)

- [ ] **P2/COULD** (SP: 2) **Docker dev compose**
  - [ ] docker-compose for MySQL + app (if allowed)

- [ ] **P2/COULD** (SP: 2) **Automated smoke script**
  - [ ] Script hitting `/, /actors`, and CRUD endpoints for health

- [ ] **P2/COULD** (SP: 2) **Accessibility pass**
  - [ ] Run axe/Lighthouse; fix labels/contrast/focus issues

- [ ] **P2/COULD** (SP: 1) **DB pool tuning**
  - [ ] Review `connectionLimit` and pagination performance

- [ ] **P2/COULD** (SP: 3) **Basic authentication**
  - [ ] Simple admin session for protected routes (if permitted)

- [ ] **P2/COULD** (SP: 1) **Error page UX polish**
  - [ ] Friendlier error templates with guidance and back links

- [ ] **P2/COULD** (SP: 1) **i18n messages centralization**
  - [ ] Centralize user-facing strings (NL) in one module

- [ ] **P2/COULD** (SP: 1) **Data sanity checks**
  - [ ] Script to validate input lengths and detect anomalies

- [ ] **P2/COULD** (SP: 1) **Changelog & feedback**
  - [ ] Track changes after reviews; maintain `CHANGELOG.md`

- [ ] **P2/COULD** (SP: 1) **Demo rehearsal + backup assets**
  - [ ] Timebox rehearsal; keep screenshots/video in repo

---

## Notes
- All DB access must use **parameterized queries** (security).  
- Keep to **SSR EJS + Bootstrap** (no SPA) to satisfy constraints.  
- Preserve **layered architecture**: routes → controllers → services → repositories.  
- Collect evidence (screens/video) as you complete items to match the rubric.

