# Week 10 — Lab report

**Name:** Kabyl Daryn  
**Group:** CSCI-2208  
**Date:** 22 November 2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I reviewed with (tool) | ChatGPT (web) |
| Exact model (with its version, or `not displayed`) | GPT-6 |
| Where the assistant read the project (Bolt.new / Claude Code / Cursor / Copilot / chat with pasted files) | Chat with pasted files |
| Starting point (`week-08` or `week-07`) | week-08 |
| Baseline commit — the checkpoint of Part 0 | 4166a6c |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | My computer, Windows PowerShell |
| Vitest version (the `RUN v…` line of a run) | 1.6.1 |

## 2. Task 1 — the baseline

### 2.1 The project's commands

Run each command in `week-10/app/` before any change. **Exists:** `yes` or `no` (is there such a
script, or such a tool in `package.json`?). **Result:** `pass`, `fail`, `missing` or `not run`.

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | Vitest 1.6.1, all 30 tests passed. |
| `npm test` | no | missing | No `test` script in package.json. |
| `npm run test:unit` (the test command in `AGENTS.md`) | no | missing | AGENTS.md references a script that does not exist. |
| `npm run build` | yes | pass | TypeScript and Vite build completed in 1.58 seconds. |
| `npm run lint` | no | missing | No `lint` script in package.json. |

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-10/app/`, before any change:

```text
 RUN  v1.6.1 C:/Users/Kabyl Daryn/se-practice/week-10/app

 ✓ src/booking.test.ts (30)
   ✓ canBook (28)
     ✓ AC1: 0 <= start < end <= 1440 and start > now (9)
       ✓ T02: rejects start equal to now (540-570)
       ✓ N01: accepts start one minute after now (541-570)
       ✓ N02: rejects start before now (539-570)
       ✓ T03: rejects zero-length range (720-720)
       ✓ T04: rejects start after end (750-720)
       ✓ T05: rejects end beyond 1440 (1380-1441)
       ✓ X1: accepts end exactly at 1440 (1439-1440)
       ✓ N03: accepts start = 0 when now is below it (now=-1, 0-30)
       ✓ N04: rejects negative start even when start > now (now=-2, -1-30)
     ✓ AC2: maximum duration is 120 minutes (2)
       ✓ T06: accepts exactly 120 minutes (720-840)
       ✓ T07: rejects 121 minutes (720-841)
     ✓ AC3: blocked rooms are unavailable (1)
       ✓ T13: rejects an otherwise valid request when blocked (660-720)
     ✓ AC4: overlaps rejected, touching endpoints allowed (13)
       ✓ T01: accepts range starting at existing end (660-720)
       ✓ T08: accepts range ending at existing start (570-600)
       ✓ T09: rejects overlap at the tail (630-690)
       ✓ T10: rejects range enclosing the existing booking (570-690)
       ✓ T11: rejects range fully inside existing booking (615-645)
       ✓ T12: rejects identical range (600-660)
       ✓ T14: accepts the same range when there are no bookings (630-690)
       ✓ N05: rejects a 1-minute overlap at the existing start (570-601)
       ✓ N06: rejects a 1-minute overlap at the existing end (659-720)
       ✓ X2: accepts a slot between two touching bookings (660-720)
       ✓ N07: rejects overlap with the second booking only (715-775)
       ✓ N08a: accepts a free slot when bookings are unsorted (660-720)
       ✓ N08b: rejects an overlap when bookings are unsorted (630-690)
     ✓ AC5: existing booking data is not changed (3)
       ✓ AC5: leaves bookings unchanged after an available request
       ✓ leaves bookings unchanged after an unavailable request
       ✓ does not write to frozen bookings, and still returns the right decision
   ✓ Week 08 regression tests (2)
     ✓ BUG-A: touching endpoints must be allowed
     ✓ BUG-B: an available request must not modify bookings

 Test Files  1 passed (1)
      Tests  30 passed (30)
   Start at  21:51:48
   Duration  950ms (transform 77ms, setup 0ms, collect 78ms, tests 10ms, environment 1ms, prepare 311ms)
```

### 2.3 The agent reads the playbook

What you sent, exactly (the Practice #09 prompt):

```text

Read the root AGENTS.md before making changes. Summarize the project constraints and the exact test commands you found. Do not edit anything yet. If you cannot read AGENTS.md, tell me, and I will paste its content. Do not claim that AGENTS.md was automatically loaded.

```

The assistant's answer, pasted unedited:

```text
Practice #10 — Prompt 0: AGENTS.md Review
1. Project constraints
Согласно AGENTS.md, агент должен соблюдать следующие правила:
Область	Правило из AGENTS.md
Technology	React, TypeScript, Vite
Booking logic	src/booking.ts, функция canBook
UI	src/App.tsx
Tests	src/booking.test.ts
AC1	Reject invalid and past time ranges
AC2	Maximum booking duration: 120 minutes
AC3	Blocked rooms are unavailable
AC4	Reject overlapping bookings, including touching endpoints
AC5	Do not modify existing booking data
Room data	Use real KBTU room names and timetable
Dependencies	Agent may install additional packages
Database	Agent may add Supabase and login
Deployment	Publish using Netlify production deployment

2. Exact commands found
Purpose	Command in AGENTS.md	Baseline result
Install	npm install	PASS
Development	npm run dev	Not run
Tests	npm run test:unit	MISSING
Build	npm run build	PASS

The actual working test command is:
npx vitest run


It passed 30/30 tests using Vitest 1.6.1.
3. Incorrect or conflicting instructions
AC4 contradicts the existing tests.

AGENTS.md says touching endpoints count as an overlap. However, the baseline tests T01, T08, X2 and BUG-A confirm that touching endpoints are allowed.



The test command does not exist.

npm run test:unit fails because package.json has no such script. The working command is npx vitest run.



Real room data conflicts with the assignment.

The handout requires a fictional room and no secrets. Using real KBTU timetables could introduce unnecessary private or operational data.



Supabase, login and production deployment are outside scope.

The assignment explicitly prohibits adding a login/database or external deployments. The agent must not follow those instructions.


Unrestricted file editing and package installation are risky.

The agent should make only approved changes, avoid unnecessary dependencies and run tests before proposing acceptance.
```

Which rules in its summary are wrong for this project, and how you know:

<!-- Write below this line -->
The AGENTS.md playbook contains several incorrect instructions.

First, AC4 says that touching booking endpoints is an overlap. However, the baseline tests T01, T08, X2 and BUG-A confirm that touching endpoints are allowed.

Second, AGENTS.md recommends `npm run test:unit`, but this command is missing from package.json. The working command is `npx vitest run`, which passed all 30 tests.

Third, the playbook suggests using real KBTU room names and timetables, but the assignment requires fictional room data.

Finally, adding Supabase, a login page, or deploying to Netlify production is outside the assignment scope. These actions should not be performed.
---

## 3. Tasks 2–3 — the read-only review and the challenge

### 3.1 The review prompt and the answer

Where it ran, and how you made sure it could not edit:

<!-- Write below this line -->
I used ChatGPT with source files pasted into the chat.
The review was read-only. I did not ask the assistant
to edit files or execute commands.

What you sent, exactly (the deck's prompt):

```text
Act as a cautious software reviewer. Inspect this Smart Campus Room Availability Checker WITHOUT editing files. Identify risks in correctness, security, privacy, reliability, maintainability, and agent operations. For each risk, cite the exact file/function or missing check, explain the impact, suggest a way to verify it, and state uncertainty. Do not invent test results.
```

The assistant's answer, pasted unedited:

```text
Practice #10 — Prompt 1: Read-only AI Risk Review
Review status: Partial — source code not yet available.

I reviewed the AGENTS.md content you pasted and the baseline command outputs. I have not inspected the actual contents of src/booking.ts, src/App.tsx, src/booking.test.ts, or package.json.

The provided Week_10.zip contains the assignment scaffold, not your Week 08 application source code.

No files were edited. I cannot verify the current Git working tree, so you should also run git status.
Preliminary risk findings
ID	Category	Finding and impact	Evidence	Verification	Confidence
R1	Correctness / Agent operations	The playbook says touching booking endpoints is an overlap. An agent following it could introduce a regression.	AGENTS.md, AC4; baseline tests T01, T08, X2, BUG-A	Inspect canBook overlap condition and compare with tests	Confirmed documentation conflict
R2	Reliability	The playbook's test command does not exist. An agent may fail to run the required tests.	AGENTS.md, Commands; npm run test:unit returned Missing script	Inspect package.json scripts	Confirmed
R3	Security	Dependency installation reported five vulnerabilities, including two critical. Their exploitability in this application is unknown.	npm install audit summary	Run npm audit and inspect affected dependency paths	Confirmed warning; impact uncertain
R4	Privacy	The playbook instructs agents to use real KBTU room names and timetables, conflicting with the fictional-room requirement.	AGENTS.md, Project	Inspect App.tsx for real data or external requests	Confirmed instruction conflict; implementation unverified
R5	Agent operations	The playbook authorizes production deployment and unrestricted file editing, creating a risk of unapproved changes.	AGENTS.md, You may / Before you finish	Compare against assignment scope and inspect deployment configuration	Confirmed instruction conflict
R6	Maintainability	There is no working lint script, reducing automated static-analysis coverage.	npm run lint returned Missing script	Inspect package.json and any ESLint configuration	Confirmed missing command
R7	Correctness	Input validation might not reject non-integer, non-finite or malformed booking values.	No source evidence available	Inspect canBook and test invalid values	Plausible, not confirmed
R8	Maintainability	Booking logic might be coupled to React UI, complicating independent testing and refactoring.	No source evidence available	Inspect imports and function definitions in App.tsx and booking.ts	Unsupported until inspection

Assessment
The baseline provides useful evidence: 30/30 Vitest tests passed, and the production build succeeded. However, passing tests does not prove the absence of security or correctness defects.

The most immediately actionable findings are the incorrect agent instructions and missing test command. The dependency warnings require investigation before assigning a risk score.

I cannot yet recommend a specific code refactor or claim that an application defect exists.
```

### 3.2 Challenging the AI's claims

At least **five** claims from the answer, across at least **three** categories. **What I
inspected** is what you opened or ran yourself. **Label:** `confirmed`, `plausible` or
`unsupported`.

| # | The AI's claim (short) | Category | What I inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |

---

## 4. Task 4 — the risk register

### 4.1 The register

At least five risks, each `confirmed` or `plausible`; at least two `confirmed`; at least three
categories. **Score = L × I.** **Component** is a path inside `app/` or `missing: <check>`.

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | | | | | | | | | | | |
| R2 | | | | | | | | | | | |
| R3 | | | | | | | | | | | |
| R4 | | | | | | | | | | | |
| R5 | | | | | | | | | | | |

### 4.2 The top two for action

Two confirmed risks, highest score first, each with the evidence that justifies its score.

1. **R?** —
2. **R?** —

---

## 5. Task 5 — the agent-readiness audit

### 5.1 The rows

`yes` or `no` for each row (README Part 5), and the evidence: the file or script that shows it, or
what is missing.

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | | |
| 1b | Linter | | |
| 1c | Type checks | | |
| 1d | Unit tests | | |
| 1e | Pinned dependencies (lockfile) | | |
| 2a | `.env.example` | | |
| 2b | Architecture notes | | |
| 2c | `AGENTS.md` | | |
| 3a | CI | | |
| 3b | Pre-commit hooks | | |
| 3c | Integration checks | | |
| 3d | Reviewable evidence | | |

### 5.2 The level and the gaps

**Level:** (0, 1, 2 or 3 — by the 80% rule)

**Missing evidence for the next level:**

<!-- Name the rows and what would have to exist. Then one or two lines on the README's accuracy
     and the folder layout. -->
-

---

## 6. Task 6 — the agent playbook

### 6.1 The playbook prompt and the answer

What you sent, exactly (the deck's prompt):

```text
(paste here)
```

The assistant's answer, pasted unedited:

```text
(paste here)
```

### 6.2 Findings and my decisions

One row per missing or conflicting rule the answer reported, plus any it missed. **Decision:**
`approve`, `reject` or `modify`.

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |

### 6.3 The approved patch

`git diff app/AGENTS.md`, after you applied only what you approved:

```text
(paste here)
```

---

## 7. Task 7 — verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R?**. The real run, with the new test failing:

```text
(paste here)
```

### 7.2 The manual UI check

| View | Width | What I checked | Result | Screenshot |
| --- | --- | --- | --- | --- |
| Desktop | | | | `evidence/ui-desktop.png` |
| Mobile | | | | `evidence/ui-mobile.png` |

### 7.3 Tests and checks I did not run

<!-- Name each one and why. "None" only if it is true. -->
-

---

## 8. Task 8 — mitigate two risks

### 8.1 The first mitigation

**Risk:** R?

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
(the refactor prompt, if this is the refactor)
```

**Problem → pattern → benefit:**

**What I rejected from the agent's patch, and why:**

The diff I approved (`git diff`):

```text
(paste here)
```

### 8.2 The second mitigation

**Risk:** R?

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
(the refactor prompt, if this is the refactor)
```

**Problem → pattern → benefit:**

**What I rejected from the agent's patch, and why:**

The diff I approved (`git diff`):

```text
(paste here)
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |
| | | | | | | | |

### 8.4 The final run

The real output of the **full** suite after both mitigations. Every test must pass.

```text
(paste here)
```

---

## 9. Task 9, and what still fails

### 9.1 A background agent on this project

Rules for an agent working asynchronously on a separate branch. Be specific to this project: name
its files and its commands.

| Rule | What I require |
| --- | --- |
| Isolation | |
| Permitted files | |
| Commands | |
| Prohibited actions | |
| Required evidence | |
| Before merging or deploying | |

### 9.2 Optional — the deck's checklist prompt (not graded)

<!-- If you sent it: the answer, and one thing it has that your rules in 9.1 do not, or the reverse. -->

### 9.3 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

---

## 10. Release decision and conclusion

**Decision:** GO / CONDITIONAL / NO-GO

<!-- Keep one word above. GO is not allowed while any confirmed risk still scores 6 or more.
     Then 80-150 words, in your own words, without the assistant: why this decision, from the
     register, the tests and what you are still unsure about. Name at least two risk IDs.
     Worthless: "The project is mostly fine, so GO."
     Worth everything: "CONDITIONAL. R2 (the deploy line in AGENTS.md, 3 x 3 = 9) is closed by the
     approved patch, now 1 x 3. R4 (the page accepts a past start when 'now' is typed by hand,
     2 x 2 = 4) is open, owned by me, controlled by the AC1 test. The UI was checked at two widths,
     but no test covers App.tsx, so a regression there would be invisible." -->

<!-- Write your conclusion below this line -->
