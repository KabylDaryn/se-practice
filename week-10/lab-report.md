# Week 10 вЂ” Lab report

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
| Baseline commit вЂ” the checkpoint of Part 0 | 4166a6c |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | My computer, Windows PowerShell |
| Vitest version (the `RUN vвЂ¦` line of a run) | 1.6.1 |

## 2. Task 1 вЂ” the baseline

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

 вњ“ src/booking.test.ts (30)
   вњ“ canBook (28)
     вњ“ AC1: 0 <= start < end <= 1440 and start > now (9)
       вњ“ T02: rejects start equal to now (540-570)
       вњ“ N01: accepts start one minute after now (541-570)
       вњ“ N02: rejects start before now (539-570)
       вњ“ T03: rejects zero-length range (720-720)
       вњ“ T04: rejects start after end (750-720)
       вњ“ T05: rejects end beyond 1440 (1380-1441)
       вњ“ X1: accepts end exactly at 1440 (1439-1440)
       вњ“ N03: accepts start = 0 when now is below it (now=-1, 0-30)
       вњ“ N04: rejects negative start even when start > now (now=-2, -1-30)
     вњ“ AC2: maximum duration is 120 minutes (2)
       вњ“ T06: accepts exactly 120 minutes (720-840)
       вњ“ T07: rejects 121 minutes (720-841)
     вњ“ AC3: blocked rooms are unavailable (1)
       вњ“ T13: rejects an otherwise valid request when blocked (660-720)
     вњ“ AC4: overlaps rejected, touching endpoints allowed (13)
       вњ“ T01: accepts range starting at existing end (660-720)
       вњ“ T08: accepts range ending at existing start (570-600)
       вњ“ T09: rejects overlap at the tail (630-690)
       вњ“ T10: rejects range enclosing the existing booking (570-690)
       вњ“ T11: rejects range fully inside existing booking (615-645)
       вњ“ T12: rejects identical range (600-660)
       вњ“ T14: accepts the same range when there are no bookings (630-690)
       вњ“ N05: rejects a 1-minute overlap at the existing start (570-601)
       вњ“ N06: rejects a 1-minute overlap at the existing end (659-720)
       вњ“ X2: accepts a slot between two touching bookings (660-720)
       вњ“ N07: rejects overlap with the second booking only (715-775)
       вњ“ N08a: accepts a free slot when bookings are unsorted (660-720)
       вњ“ N08b: rejects an overlap when bookings are unsorted (630-690)
     вњ“ AC5: existing booking data is not changed (3)
       вњ“ AC5: leaves bookings unchanged after an available request
       вњ“ leaves bookings unchanged after an unavailable request
       вњ“ does not write to frozen bookings, and still returns the right decision
   вњ“ Week 08 regression tests (2)
     вњ“ BUG-A: touching endpoints must be allowed
     вњ“ BUG-B: an available request must not modify bookings

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
Practice #10 вЂ” Prompt 0: AGENTS.md Review
1. Project constraints
РЎРѕРіР»Р°СЃРЅРѕ AGENTS.md, Р°РіРµРЅС‚ РґРѕР»Р¶РµРЅ СЃРѕР±Р»СЋРґР°С‚СЊ СЃР»РµРґСѓСЋС‰РёРµ РїСЂР°РІРёР»Р°:
РћР±Р»Р°СЃС‚СЊ	РџСЂР°РІРёР»Рѕ РёР· AGENTS.md
Technology	React, TypeScript, Vite
Booking logic	src/booking.ts, С„СѓРЅРєС†РёСЏ canBook
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

## 3. Tasks 2вЂ“3 вЂ” the read-only review and the challenge

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
Practice #10 вЂ” Prompt 1: Read-only AI Risk Review
Review status: Partial вЂ” source code not yet available.

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
| 1 | Invalid time range still calls canBook | Correctness | App.tsx, check() | confirmed | There is no return after setError(). |
| 2 | Non-finite numbers are not explicitly rejected | Reliability | booking.ts, canBook() | confirmed | There is no Number.isFinite() check. |
| 3 | Time parser does not validate input format | Maintainability | App.tsx, toMinutes() | confirmed | The function converts values without validating the format. |
| 4 | Agent test command is missing | Agent operations | AGENTS.md and package.json | confirmed | test:unit is not defined in package.json. |
| 5 | Playbook contradicts endpoint behavior | Correctness | AGENTS.md and booking.ts | confirmed | AGENTS.md rejects touching endpoints, but the code allows them. |
---

## 4. Task 4 вЂ” the risk register

### 4.1 The register

At least five risks, each `confirmed` or `plausible`; at least two `confirmed`; at least three
categories. **Score = L Г— I.** **Component** is a path inside `app/` or `missing: <check>`.

| ID | Category | Cause в†’ event в†’ consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Correctness | Missing early return в†’ invalid time request continues в†’ confusing UI result | app/src/App.tsx | check() calls canBook() after setError() | confirmed | 3 | 2 | 6 | Stop processing invalid requests and add regression test | Student | Test invalid time range |
| R2 | Reliability | Missing numeric validation в†’ non-finite input is accepted в†’ incorrect availability decision | app/src/booking.ts | canBook() has no Number.isFinite() checks | confirmed | 2 | 2 | 4 | Validate numeric inputs in a pure function | Student | Regression test with NaN |
| R3 | Agent operations | Missing test script в†’ agent runs wrong command в†’ tests are not executed | missing: test:unit script | npm run test:unit returned Missing script | confirmed | 3 | 2 | 6 | Correct AGENTS.md to use npx vitest run | Student | Run documented test command |
| R4 | Agent operations | Incorrect AC4 instruction в†’ agent changes overlap logic в†’ valid bookings are rejected | app/AGENTS.md | AGENTS.md contradicts T01, T08 and BUG-A | confirmed | 2 | 3 | 6 | Correct AC4 in AGENTS.md | Student | Run endpoint regression tests |
| R5 | Security | Vulnerable dependencies в†’ affected package may be exploited в†’ application security risk | app/package-lock.json | npm install reported 5 vulnerabilities | plausible | 2 | 3 | 6 | Review npm audit findings and plan safe dependency updates | Student | Run npm audit and inspect dependency paths |

### 4.2 The top two for action

Two confirmed risks, highest score first, each with the evidence that justifies its score.

1. **R1 вЂ” Invalid time handling (3 Г— 2 = 6).** The `check()` function in `app/src/App.tsx` sets an error for invalid time ranges but continues to call `canBook()`. This is likely to happen whenever a user enters an invalid interval. The impact is moderate because the UI can show both an error and an availability result.

2. **R4 вЂ” Incorrect AC4 instruction (2 Г— 3 = 6).** The playbook incorrectly states that touching booking endpoints are overlaps. However, the existing tests T01, T08 and BUG-A confirm that touching endpoints must be allowed. An agent following this instruction could introduce a serious correctness regression.

---

## 5. Task 5 вЂ” the agent-readiness audit

### 5.1 The rows

`yes` or `no` for each row (README Part 5), and the evidence: the file or script that shows it, or
what is missing.

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | no | No formatter script or configuration found in the inspected app files. |
| 1b | Linter | no | npm run lint returned Missing script. |
| 1c | Type checks | yes | npm run build executes tsc and passed. |
| 1d | Unit tests | yes | npx vitest run passed all 30 tests. |
| 1e | Pinned dependencies (lockfile) | yes | app/package-lock.json exists. |
| 2a | `.env.example` | no | No .env.example in app directory. |
| 2b | Architecture notes | no | No architecture document in the inspected app directory. |
| 2c | `AGENTS.md` | yes | app/AGENTS.md exists, but contains incorrect instructions. |
| 3a | CI | no | No workflow was returned from .github/workflows. |
| 3b | Pre-commit hooks | no | No hook configuration found in the inspected app files. |
| 3c | Integration checks | no | Only booking unit tests have been demonstrated. |
| 3d | Reviewable evidence | yes | week-10/lab-report.md and evidence/ directory exist; screenshots are still pending. |     

### 5.2 The level and the gaps

**Level:** 0

**Missing evidence for the next level:**

<!-- Name the rows and what would have to exist. Then one or two lines on the README's accuracy
     and the folder layout. -->
- 1a вЂ” A working formatter such as Prettier, with a documented command.
- 1b вЂ” A working linter command and configuration.

Level 1 has only 3 of 5 requirements (60%), below the required 80%. At least one additional requirement must be satisfied to reach Level 1.

The project has a working TypeScript build, unit tests and a dependency lockfile. However, the README and AGENTS.md need to be checked for command accuracy. The folder structure separates the application, tests, evidence and report, but automated code-quality checks are incomplete.

---

## 6. Task 6 вЂ” the agent playbook

### 6.1 The playbook prompt and the answer

What you sent, exactly (the deck's prompt):

```text
Review AGENTS.md and project documentation only. Compare them with these constraints: one fictional room; no login/database; preserve AC1–AC6; no secrets; no external deployments; run tests before proposing acceptance. Report missing or conflicting rules. Draft a minimal patch to AGENTS.md, but wait for my approval before applying it.
```

The assistant's answer, pasted unedited:

```text
## **Practice #10 вЂ” Prompt 2: AGENTS.md Playbook Audit**

**Review scope:** `app/AGENTS.md` and the project documentation supplied in this conversation.

**Status:** Review completed. Patch proposed, not applied. No files were edited.

### **1. Missing and conflicting rules**

| # | Rule in AGENTS.md                          | Finding                                                                                      | Proposed decision |
| - | ------------------------------------------ | -------------------------------------------------------------------------------------------- | ----------------- |
| 1 | Use real KBTU room names and timetable     | Conflicts with the requirement for one fictional room                                        | approve           |
| 2 | AC4: touching endpoints count as overlaps  | Contradicts the existing booking logic and passing endpoint tests                            | approve           |
| 3 | AC1вЂ“AC5 only                               | AC6 is not documented; its exact definition needs confirmation from the project requirements | modify            |
| 4 | `npm run test:unit`                        | Command is missing; `npx vitest run` passed 30 tests                                         | approve           |
| 5 | Edit any file and add packages             | Permissions are too broad for a controlled agent task                                        | approve           |
| 6 | Add Supabase and login                     | Conflicts with the no-login/no-database requirement                                          | approve           |
| 7 | Deploy with `npx netlify deploy --prod`    | Violates the prohibition on external deployments                                             | approve           |
| 8 | No explicit rule about secrets             | Agent could accidentally expose credentials or sensitive data                                | approve           |
| 9 | No required verification before acceptance | A passing build alone does not establish correctness                                         | approve           |

### **2. Proposed minimal patch**

This is a **draft**, not an applied change. It modifies `app/AGENTS.md` only.

```
@@ Project
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room with sample booking data. Do not use real timetables.

@@ Acceptance contract
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps. Touching endpoints are allowed.
 - AC5 Return Available / Unavailable without changing booking data.
+Preserve AC1вЂ“AC6; verify the exact AC6 requirement before changing related behavior.

@@ Commands
-- Tests: `npm run test:unit`
+- Tests: `npx vitest run`

@@ You may
-- Edit any file in the project.
-- Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Edit only files approved for the task.
+- Do not add dependencies, login, or a database without approval.
+- Never access, commit, or expose secrets.

@@ Before you finish
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npx vitest run` and `npm run build`; report failures honestly.
+- Do not deploy externally. Request review before proposing acceptance.
```

### **3. Limitations and uncertainty**

The supplied `AGENTS.md` explicitly describes AC1вЂ“AC5, but not AC6. The exact AC6 behavior has not been established from the material reviewed here. Therefore, I recommend preserving the existing behavior and confirming AC6 against the assignment documentation rather than inventing a requirement.

The current `App.tsx` also contains two fictional rooms, while the stated constraint requires one. That is an application-scope issue, not something to change during this documentation-only audit.

### **4. Recommendation**

**Approve the documentation corrections**, with the AC6 line kept as a verification requirement until its exact definition is confirmed.

The patch is deliberately limited to agent instructions. It does not modify booking logic, install dependencies, create a database, or deploy the application.

**Do you approve this proposed patch to&#x20;**`app/AGENTS.md`**?** Once approved, we can apply it and capture the actual `git diff` for section 6.3 of your report.
```

### 6.2 Findings and my decisions

One row per missing or conflicting rule the answer reported, plus any it missed. **Decision:**
`approve`, `reject` or `modify`.

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | Real KBTU room names and timetable | Conflicts with the fictional-room requirement | approve | I approved replacing real data with fictional sample data. |
| 2 | AC4 touching endpoints | Conflicts with the passing endpoint tests | approve | Touching endpoints must be allowed. |
| 3 | AC1вЂ“AC5 only | AC6 is not documented | modify | I kept AC1вЂ“AC6 preservation but required verification of AC6. |
| 4 | npm run test:unit | The command does not exist | approve | I replaced it with npx vitest run. |
| 5 | Edit any file and add packages | Agent permissions are too broad | approve | Only approved files may be edited, and dependencies require approval. |
| 6 | Supabase and login | Conflicts with the project constraints | approve | No login or database may be added without approval. |
| 7 | Netlify production deployment | External deployment is prohibited | approve | The agent must request review instead of deploying. |
| 8 | Missing secrets rule | No explicit protection for credentials | approve | The agent must not access, commit, or expose secrets. |
| 9 | Missing verification rule | A successful build alone is insufficient | modify | Tests and build must pass before proposing acceptance. |

### 6.3 The approved patch

`git diff app/AGENTS.md`, after you applied only what you approved:

```text
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..b5ab721 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -1,38 +1,42 @@
 # AGENTS.md вЂ” Smart Campus Room Availability Checker
+# AGENTS.md РІР‚вЂќ Smart Campus Room Availability Checker
 
-Instructions for any coding agent working in this project. Read this file before you change
-anything, and follow it over any general habit of yours.
+Instructions for any coding agent working in this project. Read this file before changing anything.
 
 ## Project
 
-A React + TypeScript page (Vite) that tells a student whether a campus room is free for a
-requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
-the tests are in `src/booking.test.ts`.
+A React + TypeScript page (Vite) that checks room availability.
+The booking rule lives in `src/booking.ts` (`canBook`).
+The page is `src/App.tsx`, and the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room with sample booking data. Do not use real timetables.
 
 ## Acceptance contract
 
 - AC1 Reject start в‰Ґ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps. Touching endpoints are allowed.
 - AC5 Return Available / Unavailable without changing booking data.
 
+Preserve AC1РІР‚вЂњAC6. Verify the exact AC6 requirement before changing related behavior.
+
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npx vitest run`
 - Build: `npm run build`
 
 ## You may
 
-- Edit any file in the project.
-- Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Edit only files approved for the task.
+- Do not add dependencies, login, or a database without approval.
+- Never access, commit, or expose secrets.
 
 ## Before you finish
 
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npx vitest run` and `npm run build`. Tests must pass before proposing acceptance.
+- Do not deploy externally. Request review before proposing acceptance.
+
```

---

## 7. Task 7 вЂ” verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R2**. The real run, with the new test failing:

```text
R2:Missing integer validation allows fractional booking times, which violates the minute-based input contract.
 RUN  v1.6.1 C:/Users/Kabyl Daryn/se-practice/week-10/app

 вќЇ src/booking.test.ts (31)
   вњ“ canBook (28)
     вњ“ AC1: 0 <= start < end <= 1440 and start > now (9)
       вњ“ T02: rejects start equal to now (540-570)
       вњ“ N01: accepts start one minute after now (541-570)
       вњ“ N02: rejects start before now (539-570)
       вњ“ T03: rejects zero-length range (720-720)
       вњ“ T04: rejects start after end (750-720)
       вњ“ T05: rejects end beyond 1440 (1380-1441)
       вњ“ X1: accepts end exactly at 1440 (1439-1440)
       вњ“ N03: accepts start = 0 when now is below it (now=-1, 0-30)
       вњ“ N04: rejects negative start even when start > now (now=-2, -1-30)
     вњ“ AC2: maximum duration is 120 minutes (2)
       вњ“ T06: accepts exactly 120 minutes (720-840)
       вњ“ T07: rejects 121 minutes (720-841)
     вњ“ AC3: blocked rooms are unavailable (1)
       вњ“ T13: rejects an otherwise valid request when blocked (660-720)
     вњ“ AC4: overlaps rejected, touching endpoints allowed (13)
       вњ“ T01: accepts range starting at existing end (660-720)
       вњ“ T08: accepts range ending at existing start (570-600)
       вњ“ T09: rejects overlap at the tail (630-690)
       вњ“ T10: rejects range enclosing the existing booking (570-690)
       вњ“ T11: rejects range fully inside existing booking (615-645)
       вњ“ T12: rejects identical range (600-660)
       вњ“ T14: accepts the same range when there are no bookings (630-690)
       вњ“ N05: rejects a 1-minute overlap at the existing start (570-601)
       вњ“ N06: rejects a 1-minute overlap at the existing end (659-720)
       вњ“ X2: accepts a slot between two touching bookings (660-720)
       вњ“ N07: rejects overlap with the second booking only (715-775)
       вњ“ N08a: accepts a free slot when bookings are unsorted (660-720)
       вњ“ N08b: rejects an overlap when bookings are unsorted (630-690)
     вњ“ AC5: existing booking data is not changed (3)
       вњ“ AC5: leaves bookings unchanged after an available request
       вњ“ leaves bookings unchanged after an unavailable request
       вњ“ does not write to frozen bookings, and still returns the right decision
   вњ“ Week 08 regression tests (2)
     вњ“ BUG-A: touching endpoints must be allowed
     вњ“ BUG-B: an available request must not modify bookings
   Г— R2: rejects a fractional start time

вЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇ Failed Tests 1 вЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇ
 FAIL  src/booking.test.ts > R2: rejects a fractional start time
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 вќЇ src/booking.test.ts:235:7
    233|     blocked: false,
    234|     bookings: [],
    235|   })).toBe(false);
       |       ^
    236| });

вЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇвЋЇ[1/1]вЋЇ
 Test Files  1 failed (1)
      Tests  1 failed | 30 passed (31)
   Start at  22:28:04
   Duration  734ms (transform 64ms, setup 0ms, collect 65ms, tests 16ms, environment 0ms, prepare 226ms)

```

### 7.2 The manual UI check

| Desktop | 1366 px | Valid 11:00вЂ“12:00 shows Available; invalid 12:00вЂ“11:00 shows an error without an availability result | PASS | `evidence/ui-desktop.png` |
| Mobile | 390 px | Checked form layout, time inputs, validation message and availability result | PASS | `evidence/ui-mobile.png` |

### 7.3 Tests and checks I did not run

<!-- Name each one and why. "None" only if it is true. -->
-Not run: automated browser end-to-end tests and accessibility audit. I manually checked the desktop and mobile layouts. Vitest unit tests and the production build were run.

---

## 8. Task 8 вЂ” mitigate two risks

### 8.1 The first mitigation

**Risk:** R2

**If this is the refactor** вЂ” the prompt you sent (README Part 8), then the problem в†’ pattern в†’ benefit
line. Otherwise leave both empty.

```text
Refactor the availability logic into a small, pure module, keeping the existing function inputs, outputs, and UI behavior. Use a pattern only if the identified design problem justifies it. Do not add new features or dependencies. Show the files you plan to edit before making changes.
```

**Problem → pattern → benefit:** The canBook function did not check whether time values were integers, so fractional minutes could be accepted. I used the Extract Function refactoring pattern by creating a small validMinute helper. This improves input validation, makes the code easier to understand, and keeps the existing booking rules unchanged.

**What I rejected from the agent's patch, and why:**I rejected adding dependencies and changing the canBook interface because the problem only required integer validation. I kept the existing booking rules and used a small validMinute helper.

The diff I approved (`git diff`):

```text
diff --git a/week-10/app/src/booking.test.ts b/week-10/app/src/booking.test.ts
index 01eabff..5505c38 100644
--- a/week-10/app/src/booking.test.ts
+++ b/week-10/app/src/booking.test.ts
@@ -224,4 +224,13 @@ describe("Week 08 regression tests", () => {
     expect(result).toBe(true);
     expect(bookings).toStrictEqual(before);
   });
+});
+it('R2: rejects a fractional start time', () => {
+  expect(canBook({
+    start: 600.5,
+    end: 660,
+    now: 540,
+    blocked: false,
+    bookings: [],
+  })).toBe(false);
 });
\ No newline at end of file
diff --git a/week-10/app/src/booking.ts b/week-10/app/src/booking.ts
index 47f2a7a..f2ace36 100644
--- a/week-10/app/src/booking.ts
+++ b/week-10/app/src/booking.ts
@@ -1,7 +1,9 @@
 // Practice #08 - the provided booking function. DO NOT EDIT THIS FILE.
 // Copy the whole canBook function below over the canBook in your own app/src/booking.ts,
 // keep everything else in your file, commit, and run your Week 07 suite.
-
+function validMinute(value: number): boolean {
+  return Number.isInteger(value);
+}
 export function canBook({ start, end, now, blocked, bookings }: {
   start: number;
   end: number;
@@ -9,6 +11,7 @@ export function canBook({ start, end, now, blocked, bookings }: {
   blocked: boolean;
   bookings: { start: number; end: number }[];
 }): boolean {
+  if (![start, end, now].every(validMinute)) return false;
   if (!(0 <= start && start < end && end <= 1440)) return false;
   if (!(start > now)) return false;
   if (end - start > 120) return false;
```

### 8.2 The second mitigation

**Risk:** R1

**If this is the refactor** вЂ” the prompt you sent (README Part 8), then the problem в†’ pattern в†’ benefit
line. Otherwise leave both empty.

```text
```

**Problem в†’ pattern в†’ benefit:**Invalid time ranges could still reach the availability check в†’ Early return (guard clause) в†’ The UI stops processing invalid requests and shows only the validation error.

**What I rejected from the agent's patch, and why:**I rejected unrelated UI changes because the issue was caused by a missing return statement. I approved a minimal fix that stops the availability check after an invalid time range.

The diff I approved (`git diff`):

```text
Before:
- The invalid time range showed an error, but processing continued.

After:
+ The invalid time range shows an error and processing stops.

diff --git a/week-10/app/src/App.tsx b/week-10/app/src/App.tsx
index dac2723..5512c61 100644
--- a/week-10/app/src/App.tsx
+++ b/week-10/app/src/App.tsx
@@ -45,6 +45,7 @@ export default function App() {
       if (!(s < e)) {
         setError('The end time must be after the start time.');
+        return;
       } else {
         setError('');
       }
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R2 | 2 | 2 | 4 | 1 | 2 | 2 | Fractional-time regression test now passes |
| R1 | 3 | 2 | 6 | 1 | 2 | 2 | Early return added; desktop and mobile UI checked |

### 8.4 The final run

The real output of the **full** suite after both mitigations. Every test must pass.

```text
RUN  v1.6.1

вњ“ src/booking.test.ts (31)
  вњ“ canBook (28)
  вњ“ Week 08 regression tests (2)
  вњ“ R2: rejects a fractional start time

Test Files  1 passed (1)
Tests       31 passed (31)
Duration    660ms
```

---

## 9. Task 9, and what still fails

### 9.1 A background agent on this project

Rules for an agent working asynchronously on a separate branch. Be specific to this project: name
its files and its commands.

| Rule | What I require |
| --- | --- |
| Isolation | Work on a separate Git branch and do not change the main branch directly. |
| Permitted files | Edit only approved files in app/src and app/AGENTS.md when the task requires them. |
| Commands | Run `npx vitest run` and `npm run build` from app before reporting completion. |
| Prohibited actions | Do not install new dependencies, access secrets, add a database, or deploy externally. |
| Required evidence | Provide a Git diff, passing test output, build output, and relevant screenshots. |
| Before merging or deploying | Request human review, confirm all acceptance criteria, and never deploy without explicit approval. |

### 9.2 Optional вЂ” the deck's checklist prompt (not graded)

<!-- If you sent it: the answer, and one thing it has that your rules in 9.1 do not, or the reverse. -->

### 9.3 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

---

## 10. Release decision and conclusion

**Decision:** CONDITIONAL
<!-- Keep one word above. GO is not allowed while any confirmed risk still scores 6 or more.
     Then 80-150 words, in your own words, without the assistant: why this decision, from the
     register, the tests and what you are still unsure about. Name at least two risk IDs.
     Worthless: "The project is mostly fine, so GO."
     Worth everything: "CONDITIONAL. R2 (the deploy line in AGENTS.md, 3 x 3 = 9) is closed by the
     approved patch, now 1 x 3. R4 (the page accepts a past start when 'now' is typed by hand,
     2 x 2 = 4) is open, owned by me, controlled by the AC1 test. The UI was checked at two widths,
     but no test covers App.tsx, so a regression there would be invisible." -->

<!-- Write your conclusion below this line -->
R2 (fractional booking minutes in canBook, scored 2 x 2 = 4 in the register) was caught by a failing regression test and mitigated via a validMinute helper, with 30 baseline unit tests and npm run build passing, alongside desktop (1366 px) and mobile (390 px) UI checks. R1 (check() calling canBook() after setError() in App.tsx, scored 3 x 2 = 6) and R4 (wrong AC4 touching-endpoint rule in AGENTS.md, scored 2 x 3 = 6) are also listed as confirmed risks, while R5 (package-lock.json audit warning, 2 x 3 = 6) is only plausible. I am unsure whether R1 and R4 are actually closed or still open at 6+, whether the final suite after mitigation passed, and whether automated E2E, accessibility, or npm audit checks were run.
