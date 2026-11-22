# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) | ChatGPT |
| Assistant model | GPT-6 |
| Starting point | starter |
| Baseline commit | 30b1a27 |
| Language (ts or js) | TypeScript |
| Vitest version | 3.2.7 |
| Where I ran the tests | Local Windows, VS Code PowerShell |

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

```text
PS C:\Users\Kabyl Daryn\se-practice\sis-04\app> npx vitest run

RUN  v3.2.7 C:/Users/Kabyl Daryn/se-practice/sis-04/app

No test files found, exiting with code 1

include: **/*.{test,spec}.?(c|m)[jt]s?(x)*
exclude: **/node_modules/**, **/dist/**, **/cypress/**, **/.{idea,git,cache,output,temp}/**, **/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
sis-04/
  app/
    src/
      App.tsx       - React UI, room data, booking validation
      main.tsx      - React entry point
      index.css     - Application styles
    package.json    - Dependencies and npm scripts
  diagrams/         - Before and after architecture diagrams
  evidence/         - Screenshots of application behavior
  tests/            - SIS checker and validation scripts
  report.md         - Project analysis and evidence
  AI_USAGE.md       - AI usage disclosure
  submission.yml    - Submission declaration
```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

```text
I am working on SIS #04 using the unchanged TypeScript
Starter application. Baseline commit: 30b1a27.

Repository map:
- src/App.tsx: room data, booking rules and UI.
- src/main.tsx: React entry point.
- src/index.css: application styling.
- package.json: dependencies and scripts.

Preserve AC1-AC6:
AC1: Validate booking times and boundaries.
AC2: Maximum booking duration is 120 minutes.
AC3: Blocked rooms must be unavailable.
AC4: Overlapping bookings are rejected; touching is allowed.
AC5: Existing booking data must not be mutated.
AC6: Provide clear and responsive UI feedback.

Implement F1-F5:
F1: Capacity must be >= attendees.
F2: Rooms must have ALL selected equipment.
F3: Blocked rooms are never available.
F4: Display a clear empty state when no rooms match.
F5: Changing the selected room refreshes availability
and uses that room's own bookings.

Constraints:
- Fictional room data only.
- No login or authentication.
- No payments.
- No live APIs.
- No database.
- Keep the original booking rules.
- Separate rooms, booking, filter and UI.
- Use TypeScript, React and Vitest.
- Add tests with the required IDs.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | Business logic mixed with UI | src/App.tsx, check() | Time validation, duration limit, blocked status and booking overlap checks are implemented inside the React component. | High  |
| 2 | Room data mixed with presentation | src/App.tsx, ROOMS | The room catalog is declared inside the UI file and contains only two rooms without capacity or equipment. | High  |
| 3 | Blocked status inconsistency | src/App.tsx, check() | The Room type contains blocked, but check() uses a separate checkbox state instead of room.blocked. | High |
| 4 | Old result remains after switching rooms | src/App.tsx, setRoomId | Changing the selected room does not reset the previous availability result. | Medium |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

1. Create rooms.ts with the Room type and at least four fictional rooms.
2. Move booking validation into booking.ts using canBook, and implement checkRoom.
3. Create filter.ts with filterRooms for capacity and equipment filtering.
4. Update App.tsx to import these modules instead of containing business rules.
5. Add attendee and equipment filters, room selection, and an empty-state message.
6. Reset or refresh the availability result when the selected room changes.
7. Add Vitest tests for AC1-AC5, F1-F5, B1-B6 and INT.
8. Create before and after PlantUML diagrams.
9. Capture five screenshots and collect actual quality measurements.



### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Keep the separate "Room blocked" checkbox as the source of availability status. | Rejected | F3 requires availability to depend on the selected room's actual blocked property. The separate checkbox in App.tsx can disagree with the catalog. checkRoom should use the selected room's blocked status and bookings. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

I added a room catalog with four fictional rooms: A-101, B-204, C-305, and D-410. Each room has an ID, name, capacity, equipment, blocked status, and its own bookings.

The available equipment includes Projector, Whiteboard, Computers, and Microphone.

I added two filters to the page. Users can enter the number of attendees and select the equipment they need. The application only shows rooms with enough capacity and ALL selected equipment.

If no rooms match the filters, the application displays "No rooms match your filters."

I also separated the code into three modules: `rooms.ts` stores room data, `filter.ts` handles filtering, and `booking.ts` checks availability.

When the user selects another room, the previous availability result is cleared. The next check uses the newly selected room's blocked status and bookings. This prevents showing outdated results from another room.

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Attendees = 30, Projector and Computers selected. Only Room B-204 matches the filters. Availability is shown as Available for 11:00–12:00. |
| `evidence/filter-empty.png` | Attendees = 100, no equipment selected. The application displays "No rooms match your filters." |
| `evidence/switch-a.png` | Room A-101 selected, current time 09:00, booking 10:00–11:00. The result is Unavailable because the room already has a booking. |
| `evidence/switch-b.png` | Room B-204 selected with the same times, 10:00–11:00. The result is Available because the room has no conflicting bookings. |
| `evidence/narrow.png` | Application displayed in a narrow portrait viewport, showing the room filters and booking form on a mobile-sized screen. |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | Defines the Room and Interval types and stores the catalog of four fictional rooms. |
| `src/booking.ts` | Implements canBook for booking validation and checkRoom for checking the selected room. |
| `src/filter.ts` | Implements filterRooms to select rooms by capacity and all requested equipment. |
| `src/App.tsx` | Displays the interface, handles user input, calls the imported functions and shows availability results. |
| `src/main.tsx` | Initializes React and renders the application. |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Separate booking validation from the React UI | Keep the check() function and all booking rules inside App.tsx. | Risk R1 showed that UI and booking logic were mixed. Moving the rules into booking.ts allows AC1–AC5 to be tested without React and keeps the UI simpler. |
| Store room information in a separate catalog | Keep the ROOMS array directly inside App.tsx. | Risk R2 showed that room data was mixed with presentation. A separate rooms.ts makes the catalog easier to update and supports F1–F5 without duplicating room definitions. |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| src/App.tsx, check(): booking validation was embedded in the UI and would need to be repeated for separate room checks. | src/booking.ts, canBook() and checkRoom(): one shared implementation of booking rules is used for every room. |
| src/App.tsx, ROOMS: room data was maintained alongside presentation code. | src/rooms.ts, ROOMS: one central catalog imported by the UI. |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | AC1 rejects invalid time boundaries | `start=-1`, `end=1500`, or `start=500` with `now=540` → false |
| AC2 | AC2 rejects bookings longer than 120 minutes | `start=660`, `end=781` → false |
| AC3 | AC3 rejects blocked rooms | `blocked=true` → false |
| AC4 | AC4 rejects overlapping bookings | `start=650`, existing booking 600–660 → false |
| AC5 | AC5 does not mutate existing bookings | Call `canBook()` → bookings remain unchanged |
| F1 | F1 filters by room capacity | `attendees=30` → only room B |
| F2 | F2 requires ALL selected equipment | Projector + Computers → only room B |
| F3 | F3 rejects a blocked room | `checkRoom()` for blocked room C → false |
| F4 | F4 returns an empty list when no rooms match | `attendees=100` → empty array |
| F5 | F5 uses the selected rooms own bookings | Room A → false; Room B → true |
| B1 | B1 accepts exactly 120 minutes | `660–780` → true |
| B2 | B2 rejects 121 minutes | `660–781` → false |
| B3 | B3 accepts touching bookings | Existing 600–660, requested 660–720 → true |
| B4 | B4 rejects overlapping bookings | Existing 600–660, requested 659–720 → false |
| B5 | B5 includes room when capacity equals attendees | Room A capacity 20, attendees 20 → included |
| B6 | B6 excludes room when capacity is one below attendees | Room A capacity 20, attendees 21 → excluded |
| INT | INT filters rooms and checks the returned room | Filter for 30 attendees and Computers → room B; availability → true |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text

npx tsc --noEmit
npm run build
npx vitest run

```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text

RUN  v3.2.7 C:/Users/Kabyl Daryn/se-practice/sis-04/app

✓ src/booking.test.ts (17 tests) 15ms
  ✓ Original acceptance criteria > AC1 rejects invalid time boundaries
  ✓ Original acceptance criteria > AC2 rejects bookings longer than 120 minutes
  ✓ Original acceptance criteria > AC3 rejects blocked rooms
  ✓ Original acceptance criteria > AC4 rejects overlapping bookings
  ✓ Original acceptance criteria > AC5 does not mutate existing bookings
  ✓ Feature requirements > F1 filters by room capacity
  ✓ Feature requirements > F2 requires ALL selected equipment
  ✓ Feature requirements > F3 rejects a blocked room
  ✓ Feature requirements > F4 returns an empty list when no rooms match
  ✓ Feature requirements > F5 uses the selected rooms own bookings
  ✓ Boundary tests > B1 accepts exactly 120 minutes
  ✓ Boundary tests > B2 rejects 121 minutes
  ✓ Boundary tests > B3 accepts touching bookings
  ✓ Boundary tests > B4 rejects overlapping bookings
  ✓ Boundary tests > B5 includes room when capacity equals attendees
  ✓ Boundary tests > B6 excludes room when capacity is one below attendees
  ✓ Integration > INT filters rooms and checks the returned room

Test Files  1 passed (1)
     Tests  17 passed (17)
  Start at  20:02:57
  Duration  1.00s (transform 89ms, setup 0ms, collect 108ms, tests 15ms, environment 0ms, prepare 318ms)

```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 0/0 | 17/17 | Compared the original Vitest run in section 1.1 with the final run in section 6.3. |
| Duplicated logic locations removed | 0 | 0 | Inspected the baseline `App.tsx` and the final modules. No identical duplicated booking implementation existed originally. One booking-rule implementation was extracted into `booking.ts` to prevent future duplication. |
| Code structure: modules and their responsibilities | 1 combined module (`App.tsx`) | 4 separated modules (`App.tsx`, `rooms.ts`, `filter.ts`, `booking.ts`) | Compared the original source files with the final files and responsibilities listed in section 5.1. |
| Remaining limitation | No persistent storage | No persistent storage | Inspected the room catalog and application code. Room data remains fictional and stored in memory, and bookings are not saved to a database. |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** ChatGPT, GPT-6
**Date:** 22.11.2026
**Purpose:** Analyze the original project and identify maintainability problems.

**Prompt:**

```text
Help me complete SIS #04. Analyze the Smart Campus Room Availability Checker starter project, identify maintainability risks, and prepare a refactoring plan before changing the code.
```

**Output used:**

```text
The original App.tsx contains room data, booking validation,
and UI logic in one component. The blocked checkbox is separate
from the selected room's blocked property. Switching between
rooms can leave an old availability result on the screen.

The project should separate room data, filtering, and booking
validation into independent modules. This will make the code
easier to understand, maintain, and test.
```

**Problems found:**  The original application mixed UI and business logic. Room data and blocked status were not properly separated.
**Changes made:** Documented four maintainability risks and created a nine-step improvement plan before editing the application.
**Verified by:**  Inspected the original App.tsx and created analysis commit 25cf609 after baseline commit 30b1a27.

### 8.2 Exchange 2

**Tool and model:** ChatGPT, GPT-6
**Date:** 22.11.2026
**Purpose:** Implement the room catalog, filtering, and booking refactoring.

**Prompt:**

```text
Continue the implementation of SIS #04 after the analysis and improvement plan. Create a room catalog with at least four rooms, add capacity and equipment filters, and move the booking validation into separate TypeScript modules. Keep the original AC1–AC5 rules working and update the React interface to use the new modules.
```

**Output used:**

```text
Create rooms.ts with four fictional rooms. Each room needs
an ID, name, capacity, equipment, blocked status, and bookings.

Create filter.ts with filterRooms to check capacity and require
all selected equipment.

Move booking validation into booking.ts. Keep canBook for the
original acceptance criteria and add checkRoom to use the
selected room's blocked status and bookings.

Update App.tsx to use the imported modules and clear previous
results when the selected room changes.
```

**Problems found:** The original application had no equipment or capacity filters, and booking rules were inside the UI.
**Changes made:** Created rooms.ts, filter.ts, and booking.ts. Updated App.tsx to use these modules and added room filtering.
**Verified by:** Ran npm run build successfully. The checker passed A1–A6, confirming the required modules and rules.

### 8.3 Exchange 3

**Tool and model:** ChatGPT, GPT-6
**Date:** 22.11.2026
**Purpose:** Create automated tests for original requirements and new features.

**Prompt:**

```text
The application builds successfully, but Vitest reports "No test files found". Help me add automated tests for the existing booking rules AC1–AC5, new feature requirements F1–F5, boundary cases B1–B6, and integration behavior. Use the real functions without mocks and make sure all tests pass.

```

**Output used:**

```text
Create booking.test.ts with Vitest tests for AC1–AC5,
F1–F5, B1–B6, and INT.

Test invalid time boundaries, maximum booking duration,
blocked rooms, overlapping bookings, and immutability.

Also test capacity filtering, equipment requirements,
empty results, selected-room bookings, boundary values,
and integration between filtering and availability checking.

Use real modules without mocks.
```

**Problems found:** The original project had no automated tests, so changes could break existing booking rules without being detected.
**Changes made:** Created src/booking.test.ts with 17 automated tests covering all required categories.
**Verified by:** Ran npx vitest run. All 17 tests passed. The SIS checker also passed S1–S7.

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

For SIS #04, I gave the AI assistant the Smart Campus starting code, requirements AC1–AC6 and F1–F5, project constraints (fictional data only, no login, payments, live APIs, or database), and the required `app/src` structure (`rooms.ts`, `filter.ts`, `booking.ts`, and UI components).
Suggestions for separating catalog data, filtering, booking checks, and UI rendering into clean modules were useful for keeping business rules out of the interface. However, some suggestions were flawed—such as matching any selected equipment instead of requiring all selected items, overlooking edge cases, or risking changes to existing booking behavior.
I personally verified every change against AC1–AC6 and F1–F5, confirmed that `canBook` and booking immutability stayed intact, checked the `filterRooms` and `checkRoom` behavior on real test data, and ran the full test suite after each change rather than trusting generated code on sight.
Tests strongly guided my engineering decisions. Testing boundaries like 120- versus 121-minute durations, touching versus overlapping intervals, capacity thresholds, and `filterRooms` combined with `checkRoom` caught potential logic slips early and encouraged keeping filtering and availability checks pure, predictable, and easy to inspect.
Next time, I would improve by specifying strict boundary rules and negative cases upfront in my prompt, requesting small focused edits one at a time, and verifying each change with tests before moving on.
