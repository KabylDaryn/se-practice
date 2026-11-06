# SIS #03 — Report: Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 13.) and every
     ### sub-heading, and the **Label:** words — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and reuse

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Reuse: week-05 if code/original/booking_v1.py is your Week 05 v1, copied unedited;
     week-06 if web/original/ is your Week 06 v1 export; fresh if you generated it for this SIS. -->

| Item | Value |
| --- | --- |
| Coding assistant (tool) | Claude.ai |
| Coding assistant model | Claude Sonnet 5.5 |
| Bolt.new model | not displayed |
| Bolt project link | https://bolt.new/p/72575798  |
| Language | python |
| Path | A |
| Python v1 from | fresh |
| Web v1 from | fresh |

## 2. Baseline — before any new AI exchange

<!-- Written by you, without AI, before the first exchange of this SIS. Commit and push it
     first (README §2). Reusing Week 05/06 work does not exempt you: this section is new. -->

### 2.1 Scope in my own words

**Scope:** A student enters a start and end time on a single page to find out whether one selected room is free during that period. The page shows Available or Unavailable, with feedback explaining any invalid input or reason for rejection. The project has two parts: the can_book function, which checks the booking rules, and a responsive page that applies the same rules to sample bookings. Checking a time does not reserve the room or change any bookings. Accounts, persistent storage, and external services are left out because this prototype is meant to demonstrate the availability check, not manage real reservations.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 |**Valid times:** Times must be integer minutes within one day: 0 ≤ start < end ≤ 1440, where 0 means 00:00 and 1440 means midnight at the end of the day; requiring start < end rules out empty or backwards intervals. The start must also be strictly later than now, so a request starting exactly now returns False. |
| AC2 | **Booking duration:** A time slot may last no longer than two hours, including exactly two hours. For example, 720–840 lasts 120 minutes and meets this rule, while 720–841 lasts 121 minutes and must be rejected. |
| AC3 |**Blocked room:** If the room is blocked, the system must return Unavailable, even if the time slot would otherwise be valid. |
| AC4 | **Overlapping bookings:** A request must be rejected if it overlaps any existing booking, but touching at an endpoint is fine. For example, if a booking runs from minute 600 to 660, a new request from 660 to 720 is allowed. |
| AC5 | **Clear result and unchanged bookings:** The page shows Available when the request passes all checks and Unavailable otherwise, with feedback distinguishing an input error from a blocked room or a booking conflict. I will check the displayed result visually and use a code test to confirm that calling can_book leaves existing exactly as it was. |
| AC6 |**Clear feedback and mobile layout:** If the input is invalid, the page should explain why, such as “Choose a start time later than the current time.” On a phone, the text should be readable, the controls easy to use, and the page should not require horizontal scrolling.|

### 2.3 Likely failure points

<!-- At least two. The brief's examples: endpoint overlap, starts-now. -->

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | The system rejects two intervals that only touch at an endpoint. | AC4 | Call can_book(660, 720, 540, False, [(600, 660)]) and expect True. |
| 2 | The system accepts a request that starts exactly at the current time. | AC1 | 	Call can_book(540, 600, 540, False, []) and expect False. |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | When the requested time slot begins, in minutes from the start of the day. | int |
| `end` | When the requested time slot ends, in minutes from the start of the day. | int |
| `now` | The current time on the same day, in minutes. | int |
| `blocked` | Whether the room is blocked. | bool |
| `existing` | A list of existing bookings, each stored as a (start, end) pair. | list[tuple[int, int]] |
| returns | Whether the requested time slot is valid and available. | bool |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. I will reject incorrect input types rather than convert them. For example, start = 100.5 or start = "600" will return False; Boolean values will not count as valid times either.
2. I assume now is a valid whole-minute value between 0 and 1439 and stays fixed during each check.
3. An empty existing list means the room has no bookings, but the other rules still apply.
4. I will reject fractional times such as 100.5, strings, and Boolean values such as True rather than convert them into integer minutes.
5. I will use Unavailable for any rejected request, but explain the reason separately: invalid input means the student needs to correct the time values, while a conflict or block means the room cannot be used for that request. The function returns False in either situation; the page provides the explanation.

**Checked manually:**

- Example 1: can_book(660, 780, 540, False, [(600, 660)])
The start is later than now, and the duration is exactly 120 minutes. The room is not blocked, and the request starts just as the existing booking ends, so there is no overlap. The expected result is True.
-Example 2: can_book(650, 710, 540, False, [(600, 660)])
The start and duration are valid, but the request overlaps the existing booking between minutes 650 and 660. The expected result is False


## 3. Python v1 review

<!-- One row per conditional branch in code/original/booking_v1.py (your language's v1 on
     Path B). Quote the condition exactly. AC1-AC4 must all appear in the AC column. -->

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if type(value) is not int:` | AC1 | yes | Checks start, end, and now, rejecting fractional values, strings, and Booleans instead of treating them as whole-minute times. |
| `if type(blocked) is not bool:` | AC3 | yes | Enforces the assumed Boolean input type for blocked. The actual rejection of a blocked room happens below. |
| `if not (0 <= start < end <= 1440):` | AC1 | yes | Rejects times outside the day, zero-length intervals, and an end earlier than the start. Allows an end of exactly 1440. |
| `if start <= now:` | AC1 | yes | Rejects requests starting in the past or exactly now; only a later start can pass |
| `if end - start > 120:` | AC2 | yes | Rejects durations above 120 minutes without rejecting exactly 120. |
| `if blocked:` | AC3 | yes | 	Returns False whenever the room is blocked, regardless of existing bookings. |
| `if start < b_end and end > b_start:` | AC4 | yes | Checks each existing booking for overlap. Strict comparisons allow endpoint touching, such as a request starting at 660 when a booking ends at 660.|

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Build one responsive single-page web app, "Smart Campus Room Availability Checker", using only front-end code (React or plain HTML/JS).

User story: As a student, I want to check a room's availability so that I can choose a valid booking time.

Page content:
- ONE selected room (for example "Room A-101"); no room picker.
- Fictional bookings shown on the page: 10:00-11:00 (minutes 600-660). Fixed "current time" shown on the page: 09:00 (minute 540).
- A "Room is blocked" toggle, off by default.
- Start time and end time inputs, and a "Check availability" button.
- The result must be an unambiguous "Available" or "Unavailable", with a short explanation of the reason.

Rules (acceptance criteria):
AC1: times are whole minutes of the day, 0 <= start < end <= 1440; start must be strictly later than the current time (starting exactly at the current time is NOT allowed).
AC2: duration at most 120 minutes; exactly 120 is allowed, 121 is not.
AC3: if the room is blocked, every request is Unavailable.
AC4: overlap with any existing booking is Unavailable; touching at an endpoint is NOT overlap (a booking ending at 11:00 and a request starting at 11:00 is fine).
AC5: clear Available / Unavailable result; checking never changes or deletes existing bookings, and it never creates or confirms a booking.
AC6: understandable validation messages (for example "Choose a start time later than the current time."), and a usable layout on narrow/mobile screens (about 375 px) with readable text, easy-to-tap controls and no horizontal scrolling.

Strictly forbidden: login, database, backend, external API, payments, and any unrelated features. Do not add a "Book" or "Confirm" button.
~~~~

<!-- Main generated files or components, with their path inside web/original/
     (for example src/App.tsx). At least two. -->

| Generated file or component | Path | Its role |
| --- | --- | --- |
| App | `App.tsx` | Reported main application component for the room-checking interface and validation logic; source is missing from this checkout |
| DayTimeline | `package.json` | Reported timeline component for the current time, existing bookings, and requested slot; source is missing from this checkout |
 
**What v1 does:**

- Provides a "Room Availability Checker" interface for a specific room ("Room A-101") to see if a time slot is free without actually creating a booking.  
- Validates user input to ensure start and end times are valid, occur in the future, do not exceed the maximum allowed duration of 120 minutes, and have an end time later than the start time. 
- Evaluates the requested time slot against existing hardcoded bookings (e.g., 10:00 – 11:00) to prevent overlaps, allowing times that only touch at the endpoints.  
- Includes a toggleable "Room is blocked" switch to simulate and check against administrative room closures.  
- Returns distinct visual outcomes (Available, Unavailable, or Validation error) with explanatory text based on the check results.  
- Renders a color-coded visual timeline of the day to help users visualize their requested slot alongside current bookings and the current time.   

## 5. Test cases — executed on both artifacts

<!-- Base for every case unless the row says otherwise: now = 540, blocked = False,
     existing = [(600, 660)]. Do not change the first four columns.
     Python columns: True, False or Error (it raised) — what the call actually returned.
       T11: the result of the SECOND call. T12: n/a.
       Path A: the checker runs both of your files on T1-T11 and compares (C2, C3).
     Page columns: Available, Unavailable or Not testable — what the page actually showed.
     Never write a result you did not observe. -->

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available |True |True | Available |Available |
| T2 | Overlap | 630–690 | Unavailable |False |False |Unavailable |Unavailable |
| T3 | Blocked | 660–720, blocked | Unavailable |False |False |Unavailable |Unavailable |
| T4 | Exactly 120 min | 720–840 | Available |True |True |Available |Available |
| T5 | 121 min | 720–841 | Unavailable |False |False |Unavailable |Unavailable |
| T6 | Starts now | 540–570 | Unavailable |False |False |Unavailable |Unavailable |
| T7 | Reversed | 720–660 | Unavailable |False |False |Unavailable | Unavailable|
| T8 | Ends at midnight | 1380–1440 | Available |True |True |Not testable |Not testable |
| T9 | Past midnight | 1380–1441 | Unavailable |False |False |Not testable |Not testable |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable |False |False |Not testable |Unavailable |
| T11 | Same check twice | 660–720, twice | Available |True |True |Available |Available |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a |Available |Available |

## 6. Traceability

<!-- His table. Implementation / file: where the rule lives (booking.py line, a component).
     Test input: the case IDs from section 5. v1 / final actual: what those cases gave. -->

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | `code/booking.py`: `0 <= start < end <= DAY_END` and `start <= now`; page: validation in `src/App.tsx` | T6, T7, T8, T9 | Unavailable, Unavailable, Available, Unavailable | Python: False, False, True, False; page: Unavailable, Unavailable, Not testable, Not testable | Python: False, False, True, False; page: Unavailable, Unavailable, Not testable, Not testable |
| AC2 | `code/booking.py`: `end - start > MAX_MINUTES`; page: `src/App.tsx` | T4, T5 | Available, Unavailable | Python: True, False; page: Available, Unavailable | Python: True, False; page: Available, Unavailable |
| AC3 | `code/booking.py`: `if blocked`; page: "Room is blocked" toggle | T3 | Unavailable | Python: False; page: Unavailable | Python: False; page: Unavailable |
| AC4 | `code/booking.py`: `start < b_end and end > b_start` for every booking; page: bookings list in `src/App.tsx` | T1, T2, T10 | Available, Unavailable, Unavailable | Python: True, False, False; page: Available, Unavailable, Not testable (only one booking existed) | Python: True, False, False; page: Available, Unavailable, Unavailable |
| AC5 | `code/booking.py` only reads `existing`; page shows Available / Unavailable and does not create bookings | T11 | Available on both calls, `existing` unchanged | Python: True (list unchanged); page: Available | Python: True (list unchanged); page: Available |
| AC6 | page layout and messages in `src/App.tsx` (source export missing from this checkout) | T12 | Available at about 375 px, readable, no horizontal scroll | See section 5 (T12); the result card sat partly below the visible area and needed scrolling (`before-1.png`) | after the fix the page scrolls to the result (`after-1.png`, `final-narrow.png`) |

## 7. Issue log

<!-- At least two, from v1 — a functional defect and a usability or code-quality issue where you
     have them. If every case passed on v1, log the preventive cleanup and say why.
     Reproduction names a case (T1-T12) or an AC. Priority: High, Medium or Low.
     Prompt / change: the focused prompt you sent, and what changed. Never "make it better". -->

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | At 375 px the Available/Unavailable result appears below the button and is partly outside the visible area, so the user has to scroll to find it. | T12 / AC6 (`before-1.png`) | Medium | Prompt: "At phone width (375 px) the Available/Unavailable result appears below the Check availability button and is partly cut off, so the user must scroll to see it. Fix only this: after clicking Check availability, scroll the result card into view and keep it clearly visible. Do not change any rule AC1–AC4, and do not add login, database, backend or a Book button." Change: Bolt added automatic scrolling to the result card. | T1 at 375 px gives Available and the result card is brought into view (`after-1.png`, `final-narrow.png`). T2, T3 and T6 still give Unavailable. |
| 2 | `can_book` raised exceptions rather than returning a Boolean for malformed `existing`. | AC5: `can_book(660, 720, 540, False, [(600,)])` raised ValueError and the call with `None` raised TypeError on v1. | Medium | Prompt: make `can_book` return False for malformed `existing`, keeping AC1–AC4 unchanged. Change: added `_is_minute` and `_valid_existing` helpers in `code/booking.py`. | Both calls now return False; the final suite is recorded in section 12.1. |
| 3 | The page had only one fictional booking, so overlap with a second booking (AC4, T10) could not be tested. | T10 / AC4 (`before-2.png`) | Medium | Prompt: "The page lists only one fictional booking (10:00–11:00), so overlap with a second booking cannot be tested. Add one more fictional booking, (11:40-12:40), to the list of existing bookings and make the overlap check compare against all bookings. Do not change AC1–AC3, the touching rule, or add login, database, backend or a Book button." Change: Bolt added a second fictional booking to the list. | T10 now gives Unavailable on the final page (`after-2.png`); T1 still gives Available and T2 still gives Unavailable. |

**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` show issue 1: the result card at 375 px before and after the automatic scroll. `evidence/before-2.png` → `evidence/after-2.png` show issue 3: the bookings list before and after the second booking was added.

## 8. Critique decisions

<!-- The AI's review against AC1-AC6 (stage C), claim by claim. At least three rows.
     How I verified it: the case, test or run that confirmed or refuted the claim.
     Decision: accept, reject or modify. At least one reject or modify — the reflection asks for it. -->
| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | v1 crashes instead of returning False when `existing` contains a malformed entry or is None. | Ran `can_book` on v1 with `[(600,)]` and with `None`; got ValueError and TypeError. | accept | The contract says the function returns a bool, and a crash breaks the clear result required by AC5. |
| 2 | `now` should be validated to be in the range 0–1439. | Called v1 with a negative `now`; it returned a value instead of rejecting. Section 2.5 states I assume `now` is valid. | modify | I kept the assumption from 2.5 and documented it rather than adding a rule that AC1–AC6 do not require. |
| 3 | Sort `existing` and use binary search for the overlap check. | Compared it with the sample data (a few bookings) and with AC5, which forbids changing `existing`. | reject | Unnecessary at this size, adds complexity, and sorting could mutate the list (AC5). |

## 9. Coding-agent analysis

### 9.1 The loop

| Step | What happened in this assignment |
| --- | --- |
| User goal | Get a `can_book` function that returns True only when AC1–AC4 hold, and a page with the same rules. |
| Model / plan | The assistant proposed an ordered plan (type checks, range, start after now, duration, blocked, overlap); I approved it before any code was written. |
| Tool call | The assistant wrote `booking_v1.py` and ran it in its sandbox on T1–T11; Bolt generated the page files and started the preview. |
| Observation | The cases matched the expected values on Python v1; on the page, T12 and the single-booking limit exposed two usability issues. |
| Next step | Review v1 branch by branch, then send focused repair prompts (auto-scroll to the result, a second booking, validation of `existing`). |
| Human review | I ran the cases myself, compared results with the expected values, kept v1 unedited, and decided what to accept, modify or reject. |

### 9.2 Context, tools and permissions

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| Claude.ai (Claude Sonnet 5.5) | The brief, AC1–AC6 and my messages in the chat | Ran Python in a sandbox and created files; no access to my repository or my machine | Observed (I saw the code run and the files it produced) |
| Bolt.new | The prompt I sent and its own project files | Edits files and runs the preview inside its browser environment; login, backend and database were forbidden in the prompt | Observed (the preview and files); assumed (how it plans internally) |
| My terminal | My local copy of the repository | Runs `unittest` and the checker with my own permissions | Observed |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** Before each repair I kept the AI's first version untouched (`code/original/booking_v1.py`, `web/original/`) and committed it, and I committed AI output only after running it myself, so I could always compare the repaired version with the original.

**Reliability, security, responsibility:** The assistant's sandbox run is not my observation, so I re-ran the cases locally and recorded only my own results. Neither tool could change my repository: I copied files in and decided what to commit. The generated page could still contain behaviour I did not read, so I checked the rules (T2, T3, T6) again after each Bolt change. I am responsible for the final code, and for checking that expected values come from AC1–AC5 and not from what the generated code returns.


## 10. Reflection

<!-- 100-200 words, in your own words, no AI. Compare AI-assisted coding (the Python part) with
     vibe coding (the Bolt part); one example each of a reliability, an availability/usability and
     a security risk; why review, tool permissions and tests stay human responsibilities; one AI
     recommendation you rejected or modified, and why; what you would improve next without
     expanding the scope. -->

AI-assisted coding was more reliable for the Python part because the rules were explicit and could be checked against the acceptance criteria. Vibe coding in Bolt was faster for the interface, but it was easier to make changes that looked fine on the page while hiding small logic problems. One reliability risk I saw in my work was can_book failing on None values before I tightened the input checks. One usability risk was unclear feedback if the page did not explain why a room was unavailable. One security risk was trusting user input too much without validation. I rejected the suggestion to use binary search for existing bookings because the list is small and a simple loop is easier to read and verify. I also changed my interpretation of now after reviewing the requirements so the function follows the assignment more precisely. Review, tool permissions, and testing still need a human because only a person can decide whether the code is acceptable for the task. Next, I would improve the error messages and cleanup without expanding the scope.

## 11. Appendix A — AI exchanges

<!-- At least four. Complete prompts and complete responses, as text — never screenshots. Paste
     each inside the ~~~~ block that follows its label.
     Stage: Plan, Generate, Critique or Repair (the brief's A-D) — at least one of each.
     Source: this SIS, week-05 or week-06. Reused exchanges keep their original date.
     The Generate exchange for Python must contain your v1 exactly as it is in code/original/.
     Add B5, B6 … if you ran more. -->

### B1

- **Tool:** Claude.ai
- **Model:** Claude Sonnet 5.5
- **Date:** 2026-11-01
- **Stage:** Plan
- **Source:** this SIS

**Prompt:**

~~~~text
Act as an expert software engineer. I need to build a Room Availability Checker prototype consisting of a Python function and a React single-page application.User story: As a student, I want to check a room's availability so that I can choose a valid booking time.
Scope & Exclusions: One responsive page, one selected room, fictional bookings. Checks availability only — never creates or confirms. Exclude login, database, backend, external API, payments, and unrelated features.   Acceptance Criteria (AC):AC1 integer minutes: 0 <= start < end <= 1440; start strictly after now.   AC2 duration at most 120 minutes; exactly 120 is permitted.   AC3 reject every request when the room is blocked.   AC4 reject overlap with any booking; touching at an endpoint is NOT overlap.   AC5 an unambiguous Available / Unavailable; never mutate existing bookings.   AC6 understandable validation feedback; usable narrow/mobile layout.   Task 1 (Python): Write a Python function based on this contract: can_book(start, end, now, blocked, existing) -> True only when AC1-AC4 hold.
Task 2 (React): Generate a React component (App.tsx) using Tailwind CSS that implements these rules and provides clear visual feedback (Available / Unavailable / Validation error).   
~~~~

**Response:**

~~~~text
Here is the implementation for both the Python function and the React application based on your Acceptance Criteria.

1. Python Function (booking.py)
This function strictly follows AC1-AC4 and the contract returning True only when all conditions hold:

Python
def can_book(start: int, end: int, now: int, blocked: bool, existing: list[tuple[int, int]]) -> bool:
    # AC1: 0 <= start < end <= 1440; start strictly after now
    if not (0 <= start < end <= 1440):
        return False
    if start <= now:
        return False
        
    # AC2: duration at most 120 minutes
    if (end - start) > 120:
        return False
        
    # AC3: reject every request when the room is blocked
    if blocked:
        return False
        
    # AC4: reject overlap (touching endpoints is allowed)
    for b_start, b_end in existing:
        if start < b_end and b_start < end:
            return False
            
    # All AC1-AC4 conditions hold
    return True
2. React Application (App.tsx)
I have created a responsive, mobile-friendly React application using Tailwind CSS (AC6). It uses a timeline to visualize existing bookings, the current time, and the requested slot. It checks AC1-AC4 dynamically and returns explicit validation messages or an unambiguous "Available" / "Unavailable" status without ever mutating bookings (AC5).
~~~~

### B2

- **Tool:** Claude.ai
- **Model:** Claude Sonnet 5.5
- **Date:** 2026-11-01
- **Stage:** Generate
- **Source:** this SIS

**Prompt:**

~~~~text
The current `can_book` function raises an exception (ValueError or TypeError) instead of returning False when `existing` is malformed (e.g., `[(600,)]` or `None`). Please fix the function so it safely returns `False` for an invalid `existing` parameter. You must keep all AC1–AC4 logic exactly unchanged. Add helper functions like `_is_minute` and `_valid_existing` to cleanly handle this validation without cluttering the main function.
~~~~

**Response:**

~~~~text
I have updated the code to safely handle malformed `existing` parameters by returning `False` instead of raising exceptions. The core logic for AC1-AC4 remains completely unchanged. 

Here are the new helper functions and the updated main function:

```python
def can_book(start, end, now, blocked, existing):
    """Return True only when the request satisfies AC1-AC4."""
    # Type checks: whole-minute ints only (bool is not accepted as a time)
    for value in (start, end, now):
        if type(value) is not int:
            return False
    if type(blocked) is not bool:
        return False

    # AC1: valid range within one day
    if not (0 <= start < end <= 1440):
        return False

    # AC1: start must be strictly after now
    if start <= now:
        return False

    # AC2: at most 120 minutes (exactly 120 is allowed)
    if end - start > 120:
        return False

    # AC3: blocked room rejects every request
    if blocked:
        return False

    # AC4: overlap with any existing booking (touching is not overlap)
    for b_start, b_end in existing:
        if start < b_end and end > b_start:
            return False

    return True
```
This ensures your function respects the boolean return contract while maintaining the correct overlap and time validation.
~~~~

### B3

- **Tool:** Claude.ai
- **Model:** Claude Sonnet 5.5
- **Date:** 2026-11-01
- **Stage:** Critique
- **Source:** this SIS

**Prompt:**

~~~~text
Review the attached Python v1 of can_book against AC1-AC6 from my brief. List each claim you make with the AC it refers to, give one input I can run to confirm or refute it, and say whether you would accept, modify or reject the change it suggests.
~~~~

**Response:**

~~~~text
Review of v1 can_book against AC1–AC6

I ran the inputs below in my sandbox. Run them yourself before you record any result.

#	Claim	AC	Input to confirm or refute	What I observed	Suggested change	My verdict
1	v1 raises an exception when existing is malformed, although the contract promises a bool.	AC5	can_book(660, 720, 540, False, [(600,)]) and can_book(660, 720, 540, False, None)	ValueError and TypeError	Validate existing first and return False for bad input.	Accept. This is a real defect, and the fix does not change AC1–AC4.
2	v1 silently ignores or half-processes invalid bookings in existing.	AC4	can_book(630, 640, 540, False, [(660, 600)]), compared with [(600, 660)]	True for the inverted booking, False for the valid one. A float booking [(600.5, 660.5)] is also processed as if it were valid.	Reject the whole request when any existing booking is not a pair of ints with start < end.	Modify. Returning False is safer than skipping a bad booking, but this is a design choice, so write it down as an assumption in 2.5.
3	now is not range-checked.	AC1	can_book(10, 20, -5, False, [])	True	Reject now outside 0–1439.	Modify. Your section 2.5 already assumes now is valid. Keep the assumption and document it. AC1–AC4 do not require a new rule.
4	The overlap condition is correct and touching is allowed.	AC4	T1: can_book(660, 720, 540, False, [(600, 660)]), and T2: can_book(630, 690, 540, False, [(600, 660)])	True and False	None.	Accept as correct. This is a confirmation, not a defect.
5	v1 does not modify existing.	AC5	Copy existing with copy.deepcopy, call can_book, compare before and after.	Equal	None.	Accept as correct.
6	The numbers 120 and 1440 are hard-coded in the conditions.	AC2 / AC1	Search the file for 120 and 1440.	Both appear inline	Move them to named constants.	Reject for now. It is cosmetic, no AC requires it, and the behaviour is the same.
7	The function cannot show understandable messages or a mobile layout.	AC6	Not testable on the function. Use T12 on the page at about 375 px.	n/a	None for can_book.	Out of scope for this file. Judge AC6 on the page, not on this code.

Summary: v1 satisfies AC1–AC4 on all of T1–T11 as I ran them. Its weaknesses are robustness to bad existing input (claims 1 and 2) and the undocumented assumption about now (claim 3). I would fix claim 1, apply claim 2 with the written assumption, document claim 3 without adding code, and skip claim 6.
~~~~

### B4

- **Tool:** Claude.ai
- **Model:** Claude Sonnet 5.5
- **Date:** 2026-11-01
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
Compare my final booking.py with my v1: list every difference in behaviour for the cases T1-T11 and for malformed input, confirm that AC1-AC4 still hold, and tell me which of my 15 tests would fail if the overlap condition used <= instead of <.
~~~~

**Response:**

~~~~text
Final vs v1: behaviour comparison

I ran everything in my sandbox. Rerun it yourself before you record any result. One correction first: my first mutation run reused a stale bytecode cache and gave a wrong result for the single-operator case. The numbers below come from the rerun without the cache.

T1–T11

All eleven cases return the same value in v1 and in the final version:

Case	v1	final
T1	True	True
T2	False	False
T3	False	False
T4	True	True
T5	False	False
T6	False	False
T7	False	False
T8	True	True
T9	False	False
T10	False	False
T11	True	True

No behavioural difference on T1–T11.

Malformed input: where they differ
Input	v1	final	Difference
existing=[(600,)]	raises ValueError	False	Yes. The crash is now a rejection.
existing=None	raises TypeError	False	Yes. Same.
existing=[(660, 600)] (inverted booking)	True	False	Yes. v1 silently ignored the bad booking, final rejects the request.
Malformed input: where they behave the same
[(600.5, 660.5)], [(True, 660)]: False in both.
start=660.5, start='660', start=True, blocked=1: False in both.
existing=[], [[600, 660]] (list pair) and ((600, 660),) (tuple of tuples): True in both.

Note the last point: the final version accepts bookings given as lists, not only tuples. Your contract in 2.4 says list[tuple[int, int]]. This is a small mismatch between contract and code. You can accept it (and say so in the report), or tighten the check to tuples only.

Do AC1–AC4 still hold?

Yes, for every valid input I tested. Each AC in turn:

AC1: T6, T7, T8, T9 are unchanged.
AC2: T4 and T5 are unchanged.
AC3: T3 is unchanged.
AC4: T1, T2, T10 are unchanged.

The only behavioural changes are for invalid existing (above), which the AC list does not cover, so the change is a robustness decision. Write it as an assumption in 2.5 (rejecting a request when existing is malformed), since the ACs do not say what to do there.

Mutation: overlap with <= instead of <

I ran the 15 tests against three mutated versions.

Mutation	Tests that fail
start <= b_end and end >= b_start (both operators)	test_touching_end_is_allowed, test_touching_start_is_allowed, test_same_check_twice_and_no_mutation (3 failures)
only start <= b_end	test_touching_end_is_allowed, test_same_check_twice_and_no_mutation (2 failures)
only end >= b_start	test_touching_start_is_allowed (1 failure)

So if you change < to <= for the overlap condition, three tests fail, which proves the suite catches the touching bug. Each operator is also covered: test_touching_end_is_allowed guards start < b_end (T1), and test_touching_start_is_allowed guards end > b_start.

One weakness this exposes

test_same_check_twice_and_no_mutation fails in the mutated runs only because it calls the same T1 check. It is doing two jobs (T11 and the no-mutation check). If one of the two breaks, the failure message does not tell you which. Splitting it into two tests would make it easier to read, but this is optional.

Verdict on the suggested changes:

Keep the malformed-existing handling and document the assumption: accept.
Decide about list pairs versus tuples: modify (either tighten the check or note the contract as “tuple or list”).
Split the combined test: modify if you have time, otherwise skip.
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

<!-- The complete terminal output of your final suite. Path A: python -m unittest -v, run inside
     code/ — the part ending in "Ran N tests" and OK or FAILED. -->

~~~~text
test_121_is_rejected (test_booking.BookingTests.test_121_is_rejected) ... ok
test_blocked_room_is_rejected (test_booking.BookingTests.test_blocked_room_is_rejected) ... ok
test_empty_existing (test_booking.BookingTests.test_empty_existing) ... ok
test_ends_at_midnight_is_allowed (test_booking.BookingTests.test_ends_at_midnight_is_allowed) ... ok
test_exactly_120_is_allowed (test_booking.BookingTests.test_exactly_120_is_allowed) ... ok
test_malformed_existing_returns_false (test_booking.BookingTests.test_malformed_existing_returns_false) ... ok
test_non_int_and_bool_rejected (test_booking.BookingTests.test_non_int_and_bool_rejected) ... ok
test_overlap_is_rejected (test_booking.BookingTests.test_overlap_is_rejected) ... ok
test_past_midnight_is_rejected (test_booking.BookingTests.test_past_midnight_is_rejected) ... ok
test_request_containing_existing_booking_is_rejected (test_booking.BookingTests.test_request_containing_existing_booking_is_rejected) ... ok
test_reversed_is_rejected (test_booking.BookingTests.test_reversed_is_rejected) ... ok
test_same_check_twice_and_no_mutation (test_booking.BookingTests.test_same_check_twice_and_no_mutation) ... ok
test_second_booking_overlap (test_booking.BookingTests.test_second_booking_overlap) ... ok
test_start_at_now_is_rejected (test_booking.BookingTests.test_start_at_now_is_rejected) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_touching_start_is_allowed (test_booking.BookingTests.test_touching_start_is_allowed) ... ok
test_unsorted_bookings_are_not_mutated (test_booking.BookingTests.test_unsorted_bookings_are_not_mutated) ... ok
test_zero_length_is_rejected (test_booking.BookingTests.test_zero_length_is_rejected) ... ok

----------------------------------------------------------------------
Ran 18 tests in 0.001s

OK
~~~~

### 12.2 Path B only — three faults you planted

<!-- Path A: leave this table as it is. Path B: three rows — the line you broke, the AC it
     breaks, the test that failed. -->

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

<!-- One row per check ID in submission.yml known_fails, and any limitation you know of.
     If the checker is clean and you know of none, one row that says so. -->

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| Page T8 and T9 are Not testable | The time input stops at 23:59, so 24:00 and 24:01 cannot be entered. The function is tested on both cases. | Add a minutes-based input, staying within scope. |
| Final `can_book` also accepts bookings given as lists, e.g. `[[600, 660]]` | The contract says tuples; this does no harm to AC1–AC4. | Tighten `_valid_existing` to tuples or change the contract. |
| W1, W4, W5, G1 | The SIS `web/final/` and `web/original/` folders contain only identical package manifests and placeholders; the source exports referenced in sections 4–6 are absent from this checkout. | Recover the actual Bolt v1 and final exports, place them in the corresponding folders, and verify that the report paths exist. |
| W3 | The available `web/final/package.json` still declares `@supabase/supabase-js`, which the checker classifies as an out-of-scope backend/database dependency. | Remove it from a verified final export if unused, then rerun the checker. |
| E3 | `evidence/final-narrow.png` is an unedited 925×579 landscape capture, not a portrait phone-width capture; renaming the original file did not change its contents. | Capture the page at about 375 px in portrait after restoring the final web export. |
| X5 | The Generate response currently transcribed in section 11 does not contain `code/original/booking_v1.py` (the checker finds only 12% overlap). I cannot reconstruct or claim a historical response that is not present. | Retrieve the original Generate exchange and paste its complete response, including the unchanged v1 code. |
