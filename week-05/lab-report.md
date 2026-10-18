# Week 05 — Lab report

**Name:**Kabyl Daryn
**Group:**monday 16:00-19:00
**Date:**26-10-11

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | ChatGPT |
| **Exact** model name |gpt-4o |
| Language and version | Python 3.10 |
| Path | A  |
| My Week 04 declaration for touching bookings | allowed  |

<!-- If your Week 04 model said touching bookings are NOT allowed: AC4 now says they are.
     One sentence here on what that changes in your Week 04 diagrams. This is a finding, not a penalty. -->

---

## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

```text
1. Check if the room is blocked (AC3). If blocked, return False.
2. Validate timing constraints (AC1): ensure 0 <= start <= end <= 1440 and start > now.
3. Validate duration constraints (AC2): ensure the duration (end - start) is at most 120 minutes.
4. Check for overlapping bookings (AC4): iterate through existing bookings, ensuring no overlap while allowing touching endpoints.
5. Return True if all checks pass, otherwise return False (AC5).
```

**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 |The plan checked all requirements strictly in order according to AC1-AC5. |The contract specifies parameters can_book(start, end, now, blocked, existing). |Kept all steps as they strictly follow AC1–AC5.|

**Boundary cases the assistant suggested that I kept as tests:**

-start == end (zero duration)

-start > end (reversed times)

-end > 1440 (exceeding day bounds)

---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.<ext>`, exactly as the assistant returned it: yes / no

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | `if blocked:` | AC3 | Correct as written. |
| 2 | `if not (0 <= start <= end <= 1440):` | AC1 | Not correct as written: allows `start == end` (zero duration). |
| 3 | `if start <= now:` | AC1 | Correct as written. |
| 4 | `if (end - start) > 120:` | AC2 | Correct as written. |
| 5 | `if max(start, ex_start) < min(end, ex_end):` | AC4 | Correct as written (allows touching endpoints). |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

-None 

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | test_touching | (660, 720) | None (base input) | True | AC4 | PASS | PASS |
| 2 | test_exactly_two_hours | (720, 840) | Request time | True | AC2 | PASS | PASS |
| 3 | test_overlap | (630, 690) | Request time | False | AC4 | PASS | PASS |
| 4 | test_over_two_hours | (720, 841) | Request time | False | AC2 | PASS | PASS |
| 5 | test_blocked | (660, 720) | blocked=True | False | AC3 | PASS | PASS |
| 6 | test_starts_now | (540, 570) | start=now | False | AC1 | PASS | PASS |
| 7 | test_zero_length | (660, 660) | start == end | False | AC1 | FAIL | PASS |
| 8 | test_reversed_times | (720, 660) | start > end | False | AC1 | PASS | PASS |
| 9 | test_day_bounds_exceeded | (1400, 1600) | end > 1440 | False | AC1 | PASS | PASS |
| 10 | test_empty_existing_bookings | (600, 660) | existing=[] | True | AC4 | PASS | PASS |
| 11 | test_multiple_existing_bookings | (600, 660) | Multiple bookings | True | AC4 | PASS | PASS |
| 12 | test_enclosing_existing_booking | (600, 660) | Encompassing booking | False | AC4 | PASS | PASS |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `can_book(700, 700, 540, False, [(600, 660)])` | False | True | `if not (0 <= start <= end <= 1440):` allowed `start == end`. | Changed `<= end` to `< end` in the range check. | Student / Checker (F2) |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```1. Line `if blocked:` correctly implements AC3.
2. Line `if not (0 <= start < end <= 1440):` correctly enforces AC1 including non-zero duration bounds.
3. Line `if start <= now:` correctly ensures the start is strictly in the future (AC1).
4. Line `if (end - start) > 120:` properly handles the maximum 120-minute duration limit (AC2).
5. Line `if max(start, ex_start) < min(end, ex_end):` correctly prevents overlap while permitting touching endpoints (AC4).```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | Ensure AC3 check comes first | accept | Correctly optimizes early exit for blocked rooms (AC3) | PASS |
| 2 | Keep strict less-than for end interval | accept | Fulfills AC1 and fixes zero-length edge case (`start == end`) | PASS |
---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | `if not (0 <= start <= end <= 1440):` → `if not (0 <= start < end <= 1440):` | To reject zero-length bookings (`start == end`) required by AC1 and tested by F2. | F2 check passed, S2 test suite became fully green. |
---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.
```test_blocked (test_booking.TestCanBook.test_blocked) ... ok
test_complete_enclosure_of_existing (test_booking.TestCanBook.test_complete_enclosure_of_existing) ... ok
test_day_bounds_exceeded (test_booking.TestCanBook.test_day_bounds_exceeded) ... ok
test_empty_existing_bookings (test_booking.TestCanBook.test_empty_existing_bookings) ... ok
test_exactly_two_hours (test_booking.TestCanBook.test_exactly_two_hours) ... ok
test_inputs_not_mutated (test_booking.TestCanBook.test_inputs_not_mutated) ... ok
test_left_partial_overlap (test_booking.TestCanBook.test_left_partial_overlap) ... ok
test_multiple_existing_bookings (test_booking.TestCanBook.test_multiple_existing_bookings) ... ok
test_negative_start_and_end (test_booking.TestCanBook.test_negative_start_and_end) ... ok
test_over_two_hours (test_booking.TestCanBook.test_over_two_hours) ... ok
test_overlap (test_booking.TestCanBook.test_overlap) ... ok
test_reversed_times (test_booking.TestCanBook.test_reversed_times) ... ok
test_right_partial_overlap (test_booking.TestCanBook.test_right_partial_overlap) ... ok
test_start_before_zero (test_booking.TestCanBook.test_start_before_zero) ... ok
test_starts_now (test_booking.TestCanBook.test_starts_now) ... ok
test_strict_boolean_identity (test_booking.TestCanBook.test_strict_boolean_identity) ... ok
test_touching (test_booking.TestCanBook.test_touching) ... ok
test_zero_length (test_booking.TestCanBook.test_zero_length) ... ok

----------------------------------------------------------------------
Ran 18 tests in 0.010s

OK
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
(paste here)
```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

The three failing runs (Path A students leave this block empty):

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| M2 | Our test suite did not trigger the specific AC1 fault variant injected by mutation M2. |
| M7 | Our test suite did not catch the specific overlapping logic mutation in M7. |
| M10 | Our test suite did not catch the alternate return mutation in M10. |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

-If a non-integer like 600.5 or a string is passed, Python's comparison operators will either evaluate it or raise a type error. Our function relies on standard Python numeric comparison, but strictly speaking, explicit type checks are omitted as the contract specifies integer minutes.

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

-The upper bound end <= 1440 can never be the sole reason for rejection if AC2 (duration <= 120 minutes) is enforced, because max start is 1440, and a valid booking near the end of the day would be caught by duration limits or day bounds concurrently.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Explain the overlap condition in your final code — why those two comparisons, and why
         they let touching bookings through.
     (b) Which fault did your tests miss the longest, and what did the missing test have in common
         with the ones you already had?
     (c) What did you have to decide that neither the contract nor the assistant decided for you?
     Worthless: "the AI made a mistake and I fixed it."
     Worth everything: "F7 failed on can_book(570, 600, ...): v1 compared with <= on the start
     side, so a booking that ends exactly when another begins was rejected." -->

<!-- Write your conclusion below this line -->
The overlap condition in the final code uses the formula max(start, ex_start) < min(end, ex_end) to accurately detect any interval intersection. This mathematical approach works because two time intervals overlap if and only if the latest start time is strictly less than the earliest end time. Because it uses a strict less-than operator (<), touching endpoints (where one booking ends exactly when another begins) do not satisfy the condition, allowing them to pass successfully as mandated by AC4.

The fault our tests missed the longest was the zero-length booking case (start == end), which triggered failure F2. The missing test had in common that it tested boundary conditions where numeric values were equal rather than strictly ordered, similar to how we tested normal ranges.

We had to independently decide how to handle edge cases like exact boundary limits and Python type handling for interval overlaps without explicit assistant intervention, ensuring robust validation against all acceptance criteria.
