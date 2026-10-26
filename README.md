# Travel Hub

A mobile-first journey-planning concept for Vietnam, written in **Python and JavaScript**. This is still **Phase 1 only**: the application shell and Home/Search interface. All transport locations are simulated. There are no route calculations, live provider integrations, bookings, payments, or GPS tracking.

## What changed

- **JavaScript + React:** the existing interface, mobile navigation, search inputs, and confirmation dialog. TypeScript has been removed.
- **Python + FastAPI:** the demo location catalogue and server-side search validation.
- **CSS + Tailwind:** the existing responsive design and original landscape illustrations.

The browser asks the Python API for locations. When you submit the form, Python checks the endpoints and timing, then returns a confirmation. It does not find journeys yet. Loading, retry, and error states make backend failures visible without discarding your form.

## First-time setup

Install **Node.js 24**, **Python 3.12**, and [uv](https://docs.astral.sh/uv/getting-started/installation/) (a Python dependency manager). Then open a terminal in the project folder:

```bash
npm ci
uv sync --project backend --locked
```

The two lockfiles (`package-lock.json` and `backend/uv.lock`) record exact dependency versions for the team. Stop running servers before reinstalling dependencies.

In this cloud machine the project folder is `/workspace/demo`. On your computer it is wherever you cloned this repository.

The cloud filesystem restricts the default dependency caches. In each cloud terminal, run `export UV_CACHE_DIR=/tmp/travel-hub-uv-cache` before Python-related commands, and use `npm ci --cache /tmp/travel-hub-npm-cache` when installing. These cache overrides are not required on your own computer.

## Run the development app

Use **two terminals**, both in the project folder.

Terminal 1 — Python API:

```bash
npm run dev:api
```

Terminal 2 — JavaScript frontend:

```bash
npm run dev -- --port 5173 --strictPort
```

On your own computer, open the local address printed by Vite (port **5173**). The frontend proxies `/api` requests to Python on port **8000**, so no CORS setup or secret keys are needed. Both servers reload when their source files change. Stop them with Ctrl+C.

**Codex cloud access:** publishing a cloud environment saves its setup and filesystem; it does not publish a website. This onboarding interface has no browser-accessible live preview. Cloud `localhost` and internal network IPs cannot be opened from your computer. Clone this repository and run the commands locally to interact with the app. Editors that independently offer port forwarding can forward port 5173.

## Run the built app with one server

```bash
npm run build
npm start
```

Python serves both `dist/` and the API on port **8000**. Open the address on your own computer. Restart Python after rebuilding. The frontend needs the Python API, so GitHub Pages alone cannot host this version. A deployment would need a Python-capable host; deployment is not part of this rewrite.

## Try Phase 1

1. Start on Explore. The origin defaults to District 1, Ho Chi Minh City.
2. Choose `Vung Tau City` from the destination suggestions, or select an inspiration card. Six demo locations are supported.
3. Try swapping the endpoints.
4. Keep Leave now, or select Depart at / Arrive by and enter a date and time. These capture your local wall-clock preference only; no timetable or timezone conversion is performed.
5. Select Find my journey. The Python API validates the inputs and the confirmation dialog shows its response. Escape or the close button dismisses it and returns keyboard focus to Search.
6. Saved trips and History are future-feature placeholders. The personalization switch is session-only UI state and resets on refresh. Rule-based recommendations arrive in Phase 3; this is not machine learning.

If the location catalogue fails to load, check the Python terminal and select Retry. If submitting fails, your inputs remain in the form so you can retry.

## Project map

| File or folder                                | Purpose                                                                   |
| --------------------------------------------- | ------------------------------------------------------------------------- |
| `src/main.jsx`                                | Mounts React and loads the stylesheet.                                    |
| `src/App.jsx`                                 | Application shell, navigation, form state, and search-preview dialog.     |
| `src/api.js`                                  | Browser-to-Python requests and network error handling.                    |
| `src/components/Icon.jsx`                     | Shared Lucide icon wrapper.                                               |
| `src/data/inspiration.js`                     | Demo destination-card content.                                            |
| `src/styles.css`                              | Responsive design and illustrations.                                      |
| `backend/app/main.py`                         | FastAPI endpoints, input validation, and optional built-frontend serving. |
| `backend/app/data/locations.json`             | The single source of truth for supported demo locations.                  |
| `backend/pyproject.toml` / `backend/uv.lock`  | Python dependencies and locked versions.                                  |
| `backend/tests/test_api.py` / `pytest.ini`    | API tests and test discovery settings.                                    |
| `tests/home.spec.js` / `playwright.config.js` | Desktop/mobile end-to-end tests; automatically start both servers.        |
| `vite.config.js`                              | React, Tailwind, and the development API proxy.                           |
| `eslint.config.js`                            | JavaScript and React Hooks checks.                                        |
| `package.json` / `package-lock.json`          | Frontend dependencies and project commands.                               |
| `.github/workflows/ci.yml`                    | Runs checks for pushes and pull requests.                                 |
| `CONTRIBUTING.md`                             | The branch → change → test → review workflow.                             |

React describes what appears on screen. State tracks the user's selections. The API is the small HTTP bridge between JavaScript and Python. FastAPI checks requests on the server as well as the browser, so validation still applies when someone calls the API directly.

## API

- `GET /api/health` — readiness, simulated-data flag, and current phase.
- `GET /api/locations` — the six demo locations, explicitly labelled simulated.
- `POST /api/search-preview` — validates endpoints and optional timing; returns only the confirmed form values, `simulated: true`, and `phase: 1`. Invalid input returns HTTP 422. No journeys or bookings are generated or stored.
- `/docs` — FastAPI's interactive API reference on the Python server.

Example request body:

```json
{
  "origin": "District 1, Ho Chi Minh City",
  "destination": "Vung Tau City",
  "timing": "depart",
  "date": "2026-12-01T10:30"
}
```

## Verify changes

```bash
npm run lint
npm run lint:api
uv run --project backend --locked ruff format --check backend
npm run test:api
npm run build
```

For browser tests on your own computer, install Chromium once:

```bash
npx playwright install chromium
npm test -- --workers=2
```

In this cloud machine, Chromium is already installed:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test -- --workers=2
```

There are **19 Python tests** and **18 browser tests** (nine scenarios at desktop and mobile sizes). Browser tests start both services automatically. They cover the preserved Phase 1 behavior, real frontend/API communication, and retrying service failures. The Python tests also verify server-side rejection and serving the built frontend. GitHub Actions runs the same checks; its result must be checked on GitHub after pushing.

## Roadmap

- **Phase 1:** shell and Home/Search — implemented; Python/JavaScript rewrite preserves this scope.
- **Phase 2:** simulated public-bus, ride-hailing, coach/shuttle, and combined journey results — awaiting your review.
- **Phase 3:** Cheapest, Fastest, Balanced, and explainable rule-based personalization using simulated history. Keep all valid alternatives and allow disabling personalization.
- **Phase 4:** route visualization, timelines, transfers, and explanations.
- **Phase 5:** simulated delays, missed-connection recovery, saved journeys, history, and preferences.
- **Phase 6:** stable demo and handoff for seven students.

Use the existing checkout. Add one reviewed stage at a time and create a Git checkpoint after its checks pass.
