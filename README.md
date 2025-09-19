# Sakila Video (Admin)

A small MVC web app for the **Sakila** sample database. It focuses on the **Admin viewpoint** (manage films & actors) and follows the course constraints (no ORM, SSR, callbacks, Bootstrap-like styling).

---

## Features

* **Actors**: full CRUD, search + pagination, detail page shows films for the actor.
* **Films**: list + filter (title, category); **CRUD** with actor linking, price/rating/year; safe delete (removes links then film).
* **Auth guards**: admin-only actions; buttons hidden for anonymous users.
* **Friendly empty states** and robust **pager** partial (EJS include).
* **Posters**: simple mapping from title → `/public/posters/FOO_BAR.png` with graceful fallback.
* **Cypress smoke tests**: UI presence, navigation, and basic flows.
* **CI/CD**: GitHub Actions → GHCR → SSH deploy.

---

## Tech

* **Runtime:** Node.js 22
* **Web:** Express 4 + EJS (SSR)
* **DB:** **MariaDB** (no ORM) via `mysql2`
* **CSS:** Bootstrap (dark theme, custom tokens in `/public/css/styles.css`)
* **Tests:** Cypress 13 (E2E, smoke level)
* **CI/CD:** GitHub Actions, GHCR, Docker, docker compose

> **Course constraints (Randvoorwaarden)**
>
> * SSR (no SPA)
> * Bootstrap/like framework
> * **No ORM** (SQL written by hand)
> * Callbacks (no async/await/Promises in course baseline)
> * Open-source tooling

---

## ️ Architecture

Layered (no cross-layer calls):

```
Routes → Controllers → Services → Repositories → MariaDB
                         ↓
                       Views (EJS)
```

* Repositories only do SQL + mapping.
* Services handle domain logic (paging, validation, delete safeguards).
* Controllers adapt req/res and render EJS.

---

## Project structure

```
server/
  app.js                 # Express bootstrap
  config/                # db pool + helpers (mysql2 → MariaDB)
  controllers/           # actorController, filmController, rentalController
  repositories/          # actorRepository, filmRepository, … (SQL only)
  services/              # actorService, filmService, …
  middlewares/           # auth, error handler
  views/                 # EJS (partials/, actors/, films/)
  public/                # css, posters, client js
  cypress/               # e2e tests, config
sakila-db/               # helper scripts / SQL for Sakila (MariaDB compatible)
```

---

## Prerequisites

* **Node 22+**
* **MariaDB 10.4+** running locally (or a connection string to your instance)
* (Optional) **Docker** for production/deploy

---

## ️ Database (MariaDB)

1. Create DB/user (example):

   ```sql
   CREATE DATABASE sakila CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'sakila'@'%' IDENTIFIED BY 'sakila';
   GRANT ALL PRIVILEGES ON sakila.* TO 'sakila'@'%';
   FLUSH PRIVILEGES;
   ```
2. Load Sakila schema/data (MariaDB-compatible dumps). If you don’t have them, you can use MySQL dumps; MariaDB accepts them in most cases:

   ```bash
   mysql -h 127.0.0.1 -u sakila -p sakila < sakila-schema.sql
   mysql -h 127.0.0.1 -u sakila -p sakila < sakila-data.sql
   ```

> We do **not** use an ORM. All queries are hand-written in the repositories.

---

## ️ Configuration

Create **`server/.env`**:

```ini
PORT=3000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=sakila
DB_PASS=sakila
DB_NAME=sakila

SESSION_SECRET=change-me

# Admin credentials for the simple form-based login
ADMIN_USER=admin
ADMIN_PASS=SuperSafePass!

# Cypress (optional; local runs only)
CYPRESS_BASE_URL=http://localhost:3000
```

> MariaDB’s default port is `3306` (same as MySQL). Use your actual port if different.

---

## ️ Run locally

```bash
cd server
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Login: **admin / SuperSafePass!** (or from `.env`).

---

## Cypress (smoke tests)

Install once:

```bash
cd server
npm run cypress:install   # if you separated install; otherwise npm ci already handled
```

Run locally (app must be running on `CYPRESS_BASE_URL`):

```bash
npm run cypress:open   # interactive
# or
npm run cypress:run    # headless
```

Smoke specs live in `server/cypress/e2e/*` and intentionally avoid auth-coupled flows.

---

## UI notes

* **Pager partial** `views/partials/pager.ejs` expects:

  * `pager = { page, pages, hasPrev, hasNext, prev, next, items? }`
  * `pageUrlTemplate = '/route?page=__p__'` *(or)* `pageUrl(p)` function
* **Date display** via locals helper (`formatDateTime`) to avoid raw GMT noise.
* **Posters** are derived from UPPERCASE title with `_` and `.png` fallback to placeholder.

---

## CI/CD (prod)

* **Build** server image on GitHub Actions and push to **GHCR**.
* **Deploy** via SSH to your host and run `docker compose` with `pull_policy: always`.

### Required GitHub Secrets

* `PROD_HOST`, `PROD_USER`, `PROD_SSH_KEY`, `PROD_DIR`, `PROD_PORT` (optional)
* `GHCR_PAT` (if you need PAT for registry pulls)

### Server prerequisites

* Docker + docker compose v2
* `compose.prod.yml` present in `$PROD_DIR` and referencing image `ghcr.io/<you>/sakila-server:latest`
* `.env.production` for production configuration (DB creds to **MariaDB**, session secret, etc.)

---

## Environment variables (summary)

| Key                                                   | Purpose                       |
| ----------------------------------------------------- | ----------------------------- |
| `PORT`                                                | Express port                  |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` | **MariaDB** connection        |
| `SESSION_SECRET`                                      | Cookie session secret         |
| `ADMIN_USER`, `ADMIN_PASS`                            | Simple form-based admin login |

---

## Troubleshooting

* **Cannot connect to DB** → verify MariaDB is reachable, firewall, and that the user has rights on `DB_NAME`. Try `mariadb -h HOST -P PORT -u USER -p`.
* **Delete film fails** → ensure cascade/unlink logic runs (service deletes film\_actor rows first).

---

## Live deployment

* **URL:** [https://app.0xsammt.com](https://app.0xsammt.com)
* **Login for testing:** use the admin account.
  * Username: `admin`
  * Password: `SuperSafePass!`
* This account exists purely for acceptance testing so you can try the full CRUD flows (Actors and Films) without creating a user first.

## Run locally (development)

> Prereqs: Docker (for MariaDB), Node 22+, npm.

1. **Clone & install**

   ```bash
   git clone <your-fork-or-this-repo>
   cd server
   npm ci
   ```
2. **Create `.env` for the server**

   ```bash
   cp .env.example .env   # if the example exists
   # or add the required keys yourself
   # Database
   DB_HOST=127.0.0.1
   DB_PORT=3306   # or the port from sakila-db/deploy.dev.yml
   DB_USER=sakila
   DB_PASS=sakila
   DB_NAME=sakila
   # Admin login used by the app
   ADMIN_USER=admin
   ADMIN_PASS=SuperSafePass!
   SESSION_SECRET=dev-secret
   ```
3. **Start MariaDB (development)**
   From the **repo root** (where `sakila-db/` lives):

   ```bash
   docker compose -f sakila-db/deploy.dev.yml up -d
   ```

   This brings up MariaDB with the Sakila schema.
4. **(Optional but recommended) Load the class database dump**
   You will provide a dump that reflects the latest schema/content. Save it as, for example, `./documentation/db-dumps/sakila_dump.sql` and import it:

   ```bash
   # If you can reach the DB on localhost (adjust port from deploy.dev.yml)
   mariadb -h 127.0.0.1 -P 3306 -u sakila -psakila sakila < documentation/db-dumps/sakila_dumps.sql
   ```

   You can also `docker exec` into the DB container and run `mysql` from there.
5. **Run the web app**

   ```bash
   cd server
   npm run dev
   ```

   The server boots on [http://localhost:3000](http://localhost:3000).

## Testing

### Quick manual test guide (local)

1. Open [http://localhost:3000/films](http://localhost:3000/films) and [http://localhost:3000/actors](http://localhost:3000/actors).
2. Use **Login** (top-right) with `admin / SuperSafePass!`.
3. **Actors CRUD**

   * Create an actor, validate form errors, edit it, then delete it.
   * Search by last name; check pagination shows multiple pages and works.
4. **Films CRUD + actor link**

   * Create a film (title, description, language, category, rating, release year, rental rate) and pick a couple of actors.
   * Verify the film row renders with price badge and the actor badges on the show page.
   * Edit fields; delete the film and confirm cascading deletes from `film_actor` succeed.
5. **Auth guards**

   * Log out and confirm **Edit/Delete** buttons are hidden on list and detail pages.

### Cypress smoke tests (UI)

We include a small suite designed to be fast and stable.
* **Run locally against your dev server:**

  ```bash
  cd server
  npm run cypress:open    # interactive
  # or
  npm run cypress:run     # headless
  ```
  If you want to point Cypress at your local server, set `CYPRESS_BASE_URL=http://localhost:3000` when running the commands above.
