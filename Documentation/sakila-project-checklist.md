# Sakila Project Massive Checklist
_Generated: 2025-09-01_

Legend: **MUST** = P0, **SHOULD** = P1, **COULD** = P2

## Project setup & version control
- [ ] **MUST** — **Initialize git repository**  
  _DoD:_ Repo created; .gitignore for Node; initial commit.  
  _Evidence:_ Screenshot of repo; git log; .gitignore contents
- [ ] **MUST** — **Create README with project overview**  
  _DoD:_ Explains goal, architecture, how to run locally; includes Weektaken mapping.  
  _Evidence:_ README snippet; commit ref
- [ ] **SHOULD** — **Set up Git branching model**  
  _DoD:_ Decide simple flow (main + feature branches); document in README.  
  _Evidence:_ Branch list; README section
- [ ] **COULD** — **Add pre-commit checks (lint/type format)**  
  _DoD:_ Run prettier/eslint on staged files (optional, stays within JS constraint).  
  _Evidence:_ package.json scripts; sample run

## Environment & Database
- [ ] **MUST** — **Install Node 18+**  
  _DoD:_ node -v prints >=18; npm -v works.  
  _Evidence:_ Terminal screenshot
- [ ] **MUST** — **Install MySQL server / access**  
  _DoD:_ mysql client connects; user with rights; port open locally.  
  _Evidence:_ Terminal screenshot of `mysql -u ...`
- [ ] **MUST** — **Load Sakila schema and data**  
  _DoD:_ Database `sakila` exists with tables and rows.  
  _Evidence:_ Screenshot of `SHOW TABLES;` and count from actor/film
- [ ] **MUST** — **Create .env from template**  
  _DoD:_ PORT, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE set; not committed.  
  _Evidence:_ Screenshot of `.env` keys (no secrets)
- [ ] **MUST** — **Verify DB pool connectivity**  
  _DoD:_ App boots; simple query succeeds; logs show success.  
  _Evidence:_ App console + home page renders films

## Architecture & Dependencies
- [ ] **MUST** — **Install core dependencies**  
  _DoD:_ express, ejs, dotenv, mysql2, express-validator, morgan installed.  
  _Evidence:_ package.json; npm ls
- [ ] **MUST** — **Adopt layered structure**  
  _DoD:_ Folders: routes/, controllers/, services/, repositories/, config/, views/, public/, middleware/.  
  _Evidence:_ Tree screenshot; code references show no layer skipping
- [ ] **SHOULD** — **Document architecture decisions (ADR)**  
  _DoD:_ Short ADR noting SSR, layered, MySQL, Bootstrap, no SPA.  
  _Evidence:_ ADR file or README section
- [ ] **SHOULD** — **Set up nodemon for dev**  
  _DoD:_ `npm run dev` restarts on file changes.  
  _Evidence:_ package.json scripts

## Wireframes & UX
- [ ] **MUST** — **Create low-fi wireframes for all pages**  
  _DoD:_ Wireframes for Home, Actors list, New, Show, Edit, Error states; no colors; focus on hierarchy.  
  _Evidence:_ PNG/PDF exports or photos
- [ ] **SHOULD** — **Annotate wireframes with interactions**  
  _DoD:_ Describe form validation messages, pagination, delete confirm.  
  _Evidence:_ Annotated image or short doc
- [ ] **COULD** — **Peer review with classmates/instructor**  
  _DoD:_ Collect 2–3 comments; note changes.  
  _Evidence:_ Feedback notes

## Data access (Repositories)
- [ ] **MUST** — **Create DB pool module**  
  _DoD:_ config/db.js exports mysql2/promise pool using .env; handles connection limits.  
  _Evidence:_ Code snippet
- [ ] **MUST** — **Actor repository: list/search/paginate**  
  _DoD:_ findAll(limit,offset,search) with parameterized queries; ORDER BY last/first.  
  _Evidence:_ Repo code; sample query logs
- [ ] **MUST** — **Actor repository: count, byId**  
  _DoD:_ count(search) returns total; findById(id) returns row or null.  
  _Evidence:_ Repo code; unit test or manual proof
- [ ] **MUST** — **Actor repository: create/update/delete**  
  _DoD:_ create returns insertId; update/delete return success boolean; update last_update=NOW().  
  _Evidence:_ Repo code; demo proof
- [ ] **SHOULD** — **Error handling at repo layer**  
  _DoD:_ Catch and rethrow DB errors with friendly messages upstream.  
  _Evidence:_ Code; sample error path

## Services
- [ ] **MUST** — **Actor service: list with pagination metadata**  
  _DoD:_ Returns items,total,page,pages,q; enforces pageSize.  
  _Evidence:_ Service code; controller usage
- [ ] **MUST** — **Actor service: create/update trim inputs**  
  _DoD:_ Trims strings; delegates to repo; returns id/boolean.  
  _Evidence:_ Service code
- [ ] **MUST** — **Actor service: remove**  
  _DoD:_ Delegates to repo; returns boolean; handles missing id case.  
  _Evidence:_ Service code

## Controllers & Routes
- [ ] **MUST** — **Define routes for actors CRUD**  
  _DoD:_ GET /actors, GET /actors/new, POST /actors, GET /actors/:id, GET /actors/:id/edit, POST /actors/:id/update, POST /actors/:id/delete.  
  _Evidence:_ routes/actors.js code
- [ ] **MUST** — **Controller actions with try/catch and next(err)**  
  _DoD:_ Proper error propagation to middleware; 404 handling for missing actor.  
  _Evidence:_ controllers/actorController.js
- [ ] **MUST** — **Validation via express-validator**  
  _DoD:_ body/param validators for ids and names (1–45 chars).  
  _Evidence:_ routes code; failing case screenshot
- [ ] **SHOULD** — **Log requests with morgan**  
  _DoD:_ morgan('dev') enabled; visible logs during dev.  
  _Evidence:_ App logs screenshot

## Views (SSR/EJS)
- [ ] **MUST** — **Layout partials (header/footer)**  
  _DoD:_ partials/header.ejs + footer.ejs with Bootstrap CDN; navbar and container present.  
  _Evidence:_ Screenshots of pages with shared header/footer
- [ ] **MUST** — **Home page renders film table**  
  _DoD:_ Query 20 films and display with titles/language/year.  
  _Evidence:_ Home screenshot
- [ ] **MUST** — **Actors index with search + pagination**  
  _DoD:_ Table with actions; pagination UI; preserves query string.  
  _Evidence:_ Actors list screenshot
- [ ] **MUST** — **New/Edit forms with preserved values on validation errors**  
  _DoD:_ On invalid submit, show messages and keep inputs.  
  _Evidence:_ Error state screenshot
- [ ] **MUST** — **Show page for single actor**  
  _DoD:_ Definition list fields; buttons to Edit/Delete/Back.  
  _Evidence:_ Show page screenshot
- [ ] **SHOULD** — **Accessible labels and aria attributes**  
  _DoD:_ Form labels associated; buttons have accessible text; navbar toggle works.  
  _Evidence:_ Lighthouse/axe notes

## Validation & Errors
- [ ] **MUST** — **Server-side input validation**  
  _DoD:_ Reject empty/too long names; reject invalid ids; render error page with 400.  
  _Evidence:_ Error screenshots; code
- [ ] **MUST** — **404 handling**  
  _DoD:_ Custom 404 page for unknown routes and missing resources.  
  _Evidence:_ 404 screenshot
- [ ] **MUST** — **500 error middleware**  
  _DoD:_ Centralized handler renders friendly message; stack hidden in production.  
  _Evidence:_ 500 screenshot
- [ ] **SHOULD** — **User-friendly validation messages (NL)**  
  _DoD:_ Clear, concise Dutch messages for forms and errors.  
  _Evidence:_ Screenshots

## Security
- [ ] **MUST** — **Use parameterized queries only**  
  _DoD:_ All DB calls use placeholders; no string concatenation.  
  _Evidence:_ Code review evidence
- [ ] **MUST** — **Do not log secrets**  
  _DoD:_ .env excluded from git; credentials never printed.  
  _Evidence:_ .gitignore; code scan
- [ ] **SHOULD** — **Basic rate limit for write routes (optional)**  
  _DoD:_ Lightweight express middleware (if allowed by scope)  
  _Evidence:_ Middleware code
- [ ] **COULD** — **Helmet security headers**  
  _DoD:_ Set common security headers if not conflicting with coursework constraints.  
  _Evidence:_ Middleware config

## Performance
- [ ] **SHOULD** — **Pagination in lists**  
  _DoD:_ Limit/offset implemented; pages count computed in service.  
  _Evidence:_ List UI screenshot
- [ ] **SHOULD** — **DB connection pool tuned**  
  _DoD:_ Reasonable connectionLimit; no leaks; graceful shutdown.  
  _Evidence:_ Config + notes

## Usability & Accessibility
- [ ] **MUST** — **Responsive layout with Bootstrap grid**  
  _DoD:_ Tables scroll on small screens; forms stack.  
  _Evidence:_ Screenshots at mobile width
- [ ] **SHOULD** — **Keyboard navigation**  
  _DoD:_ Tab order sensible; buttons reachable; focus visible.  
  _Evidence:_ Manual test notes
- [ ] **SHOULD** — **Delete confirmation**  
  _DoD:_ Confirm dialog prevents accidental deletion.  
  _Evidence:_ Screenshot

## Testing & QA
- [ ] **MUST** — **Manual test plan**  
  _DoD:_ Define cases for CRUD happy/edge paths, errors, pagination, search.  
  _Evidence:_ Test checklist doc
- [ ] **SHOULD** — **Automated smoke script (optional)**  
  _DoD:_ Simple node script/curl sequence to hit main routes.  
  _Evidence:_ Script or bash log
- [ ] **SHOULD** — **Sample data sanity checks**  
  _DoD:_ Ensure actor names within length; invalid inputs handled.  
  _Evidence:_ Screenshots

## Documentation & Evidence
- [ ] **MUST** — **Update README with run/test instructions**  
  _DoD:_ Includes screenshots/gifs; cites which Weektaken each feature satisfies.  
  _Evidence:_ README diff; images folder
- [ ] **MUST** — **Architecture explanation**  
  _DoD:_ Section describing layers and how NF-01/NF-02 are met.  
  _Evidence:_ README section
- [ ] **MUST** — **Collect grading evidence bundle**  
  _DoD:_ Screenshots of each required feature; short demo video (1–2 min).  
  _Evidence:_ Folder with media; links
- [ ] **SHOULD** — **Changelog of changes after feedback**  
  _DoD:_ List points from teacher/peer review and resolutions.  
  _Evidence:_ CHANGELOG.md

## Optional Extensions
- [ ] **COULD** — **Link actor to films on show page**  
  _DoD:_ JOIN film_actor → list films for actor.  
  _Evidence:_ Show page screenshot with films list
- [ ] **COULD** — **Sort actors by last name with toggle**  
  _DoD:_ Query ORDER BY dynamic (validated).  
  _Evidence:_ List with sort UI
- [ ] **COULD** — **Basic authentication (if allowed)**  
  _DoD:_ Simple session for admin area; not required if out of scope.  
  _Evidence:_ Login flow
- [ ] **COULD** — **Docker dev compose (if allowed)**  
  _DoD:_ docker-compose for MySQL + app; README instructions.  
  _Evidence:_ compose file; run logs

## Demo & Interview Prep
- [ ] **MUST** — **Prepare a 2-minute guided demo script**  
  _DoD:_ Narrative: open app → show dataset → CRUD flow → errors → architecture → NF compliance.  
  _Evidence:_ Demo script text
- [ ] **MUST** — **Rehearse with timer**  
  _DoD:_ Stay under time; anticipate questions about layers/DRY/security.  
  _Evidence:_ Self-review notes
- [ ] **SHOULD** — **Backup plan if DB fails**  
  _DoD:_ Have fallback screenshots/video to prove functionality.  
  _Evidence:_ Folder with assets
