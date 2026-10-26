# Travel Hub

A mobile-first journey-planning concept for Vietnam. **Phase 1 only:** the application shell and Home/Search interface. All locations are local demo data. There are no live provider integrations, route calculations, bookings, payments, or GPS tracking.

## Run it

Use Node.js 22 or newer (verified here with Node 24) and npm.

```bash
cd /workspace/demo
npm ci --cache /tmp/travel-hub-npm-cache
npm run dev -- --port 5173
```

Stop any running development server before reinstalling dependencies with `npm ci`, then start it again. This prevents stale dependency caches.

The development server runs on port **5173** and listens on all interfaces for development previews. In an editor that supports forwarded ports, forward port 5173 and open its browser preview. When running on your own computer, open the local address printed by Vite. Stop the server with Ctrl+C.

If this cloud interface does not offer a port preview, clone the repository on your computer, open a terminal in its folder, and run `npm ci` followed by `npm run dev` instead. The `/workspace/demo` path applies only to this cloud machine. Changes committed here remain local until you push them to GitHub.

## Try the first version

1. Start on Explore. The origin defaults to District 1, Ho Chi Minh City.
2. Enter a supported destination, such as `Vung Tau City`, or select an inspiration card. The input suggestions list all six supported demo locations.
3. Use the swap button to reverse the endpoints.
4. Keep Leave now, or select Depart at / Arrive by and enter a date and time. These capture a planning preference only; timetable calculations are not implemented yet.
5. Select Find my journey. A confirmation shows the chosen locations and timing. Escape or the close button dismisses it. No journey results are generated in Phase 1.
6. Explore Saved trips, History, and Preferences. Saved trips and History are explicit future-feature placeholders. The personalization switch is a session-only UI preference; recommendation rules and simulated history arrive in Phase 3. Refreshing resets the switch.

## How the code fits together

| File                                 | Purpose                                                                                             |
| ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `index.html`                         | The HTML entry point, page title, and mobile viewport settings.                                     |
| `src/main.tsx`                       | Mounts the React application and loads the stylesheet.                                              |
| `src/App.tsx`                        | Application shell, navigation, search form state, validation, and accessible search-preview dialog. |
| `src/components/Icon.tsx`            | Small shared wrapper around Lucide icons.                                                           |
| `src/data/locations.ts`              | Structured mock locations and destination inspiration; no network calls.                            |
| `src/styles.css`                     | Tailwind entry plus responsive layouts, component styles, and original landscape illustrations.     |
| `vite.config.ts`                     | Connects Vite with React and Tailwind.                                                              |
| `tsconfig.json`                      | TypeScript checking configuration.                                                                  |
| `package.json` / `package-lock.json` | Commands and reproducible dependency versions.                                                      |
| `playwright.config.ts`               | Desktop/mobile browser test settings and automatic development-server startup.                      |
| `tests/home.spec.ts`                 | Search, validation, timing, swapping, navigation, and layout tests.                                 |

React components describe the interface. State holds what a visitor types or selects. TypeScript helps catch mistakes before running the app. Vite runs the development server and packages production files. The stylesheet controls how the same interface adapts to different screen sizes.

## Verify changes

```bash
npm run build
```

This checks TypeScript and creates the production site in `dist/`.

For browser tests in this cloud machine, use its preinstalled Chromium:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test -- --workers=2
```

On your own computer, install Playwright's browser once, then run the tests:

```bash
npx playwright install chromium
npm test
```

There are six scenarios run at both desktop and mobile sizes, for **12 tests**. The tests do not validate route planning, because that belongs to a later phase. Playwright starts the development server automatically if one is not already running.

## Incremental roadmap

- **Phase 1:** shell and Home/Search — implemented.
- **Phase 2:** simulated public-bus, ride-hailing, coach/shuttle, and combined journey results — awaiting review.
- **Phase 3:** Cheapest, Fastest, Balanced, and explainable rule-based personalization using simulated history. Keep every valid alternative; allow disabling personalization. This is not machine learning.
- **Phase 4:** route visualization, timelines, transfer details, and explanations.
- **Phase 5:** simulated delays, recovery, saved journeys, history, and preferences.
- **Phase 6:** stable demo and handoff documentation for seven students.

Use the existing checkout for development. Add one reviewed stage at a time and create a Git checkpoint after its checks pass.
