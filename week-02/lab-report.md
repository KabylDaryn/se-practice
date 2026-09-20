# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:** Kabyl Daryn
**Group:** Software Engineering
**Date:** September 20, 2026



## 1. The frozen experiment


AI assistant | Gemini 
Exact model name | Gemini 2.5 Flash 
Implementation language | Python 
Date of the runs | 2026-09-20 

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can be checked:
**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes
- No follow-up questions were asked before Part 7: yes
- Every output was saved **before** any editing: yes


## 2. Prompt A — minimal

**Prompt sent**:Write Python code to analyze student marks.

**Assumptions the AI made that I never gave it**:

1. Assumed function signature `analyze_marks(marks)` without `pass_mark=50` default parameter.
2. Assumed dictionary output key `'avg'` instead of `'average'`.
3. Assumed returning `None` instead of raising `ValueError` on empty input.

**Questions it should have asked and did not**:

1. What exact return shape and dictionary keys are required?
2. What are the validation and exception rules for invalid inputs?

**Is the function named `analyze_marks` with the required signature?** no — missing `pass_mark` default parameter.

**First impression before testing**: Will fail execution immediately due to incorrect function signature.


## 3. Prompt B — structured context

**Prompt sent**:You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100; raise ValueError for an empty list, non-numeric values, or out-of-range values. Use no external libraries. Return code plus a short explanation.

**What B fixed compared to A**:

1. Added `pass_mark=50` parameter.
2. Standardized key names in return dictionary.
3. Added `ValueError` checks for invalid inputs.

**What B still leaves open**:

1. Float precision/rounding rule for `pass_rate`.


## 4. Prompt C — examples and tests

**What I appended to Prompt B**:Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40, pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,text value, and marks below 0 or above 100. State any remaining assumptions before the code.


**Tests the AI wrote for itself**:

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | Yes |
| decimals | Yes |
| custom pass_mark | Yes |
| empty list | Yes |
| text value | Yes |
| below 0 / above 100 | Yes |

**Do the AI's own tests pass against the AI's own code?** yes

**Do they agree with the harness in section 6?** yes

**Assumptions C stated explicitly before the code:** Float values should be rounded to 2 decimal places to match the worked example.


## 5. Prompt D — my combined prompt

**The complete prompt I wrote**:
You are a Python developer. Implement analyze_marks(marks, pass_mark=50).

Return a dictionary with exact keys: "average", "highest", "lowest", and "pass_rate".
A mark passes when mark >= pass_mark.
Round numeric float values (average, pass_rate) to 2 decimal places (e.g. 66.67).
Do NOT round highest/lowest if they are original integers, or preserve exact float values matching input.

Validation rules (must raise ValueError deliberately):

Raise ValueError if marks is empty or not a list.

Raise ValueError if any item in marks is not a number (int or float, note: booleans are invalid).

Raise ValueError if any mark is strictly < 0 or > 100.

Do not use external libraries. Return only the python function implementation.

**What I deliberately added that A, B and C did not have**:

1. Explicit 2-decimal rounding requirement (`round(val, 2)`).
2. Explicit `mark >= pass_mark` pass criteria.
3. Strict boolean type exclusion (`isinstance(m, bool)`).

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**
The specification implied `pass_rate` should be formatted as `66.67` without explicitly stating a rounding rule. Unrounded division yields `66.66666666666667`. I resolved this by explicitly requiring 2-decimal rounding.


## 6. Test results — the evidence

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | FAIL | PASS | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | PASS | PASS | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | PASS | PASS | PASS |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| | **Totals** | | 0/6 | 5/6 | 6/6 | 6/6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| Prompt A | 1-6 | Raised `TypeError: analyze_marks() takes 1 positional argument but 2 were given` |
| Prompt B | 1 | Returned `pass_rate=66.66666666666666` instead of `66.67` |

### Pasted terminal output — all four runs

Prompt A
========================================================================
analyze_marks harness — week-02/code/prompt_a.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  ERROR  analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : raised TypeError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
case 2  ERROR  analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : raised TypeError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
case 3  ERROR  analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : raised TypeError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
case 4  ERROR  analyze_marks([], 50)
          expect: ValueError
          got   : raised TypeError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
case 5  ERROR  analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised TypeError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
case 6  ERROR  analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised TypeError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
RESULT  0 PASS · 0 FAIL · 6 ERROR   (week-02/code/prompt_a.py)
========================================================================
Prompt B

Plaintext
========================================================================
analyze_marks harness — week-02/code/prompt_b.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  FAIL   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : pass_rate=66.66666666666666 expected 66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: List of marks cannot be empty.
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: Invalid mark value: 60. All marks must be numeric.
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Mark out of range: -1. Marks must be between 0 and 100.
------------------------------------------------------------------------
RESULT  5 PASS · 1 FAIL · 0 ERROR   (week-02/code/prompt_b.py)
========================================================================
Prompt C

Plaintext
========================================================================
analyze_marks harness — week-02/code/prompt_c.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: Marks list cannot be empty.
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: All marks must be integers or floats.
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: All marks must be in the range [0, 100].
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (week-02/code/prompt_c.py)
========================================================================
Prompt D

Plaintext
========================================================================
analyze_marks harness — week-02/code/prompt_d.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: Input 'marks' must be a non-empty list.
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: Invalid element '60': all marks must be numeric (int/float).
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Mark -1 out of bounds: marks must be between 0 and 100 inclusive.
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (week-02/code/prompt_d.py)
========================================================================

Criterion,A,B,C,D
Correctness (cases passed),0,1,2,2
Requirement coverage,0,2,2,2
Verifiability (tests),0,0,2,2
Assumptions stated,0,0,2,2
Noise (2 = none),1,2,2,2
Total / 10,1,5,10,10

Prompt length, in words: A 8 · B 44 · C 75 · D 96

Words added per point gained:

B over A: (44 - 8) / (5 - 1) = 9.0 words per point.

C over B: (75 - 44) / (10 - 5) = 6.2 words per point.

8. Conclusion
Prompt C and Prompt D scored highest at 10/10, passing all six harness test cases. In a real software engineering workflow, I would choose Prompt D because it embeds clear validation specifications directly into the prompt without forcing the AI to generate superfluous inline unit tests.
The single addition that bought the most correctness was adding the worked example pass_rate 66.67 in Prompt C. In Prompt B, Case 1 resulted in a FAIL verdict because pass_rate returned 66.(6). Supplying the concrete example in Prompt C triggered the AI to round floating-point calculations to two decimal places, turning Case 1 into a PASS.
Prompt C introduced minor noise by appending test code blocks inside the output solution file.
The key ambiguity in the task was float rounding for rates. Prompt D resolved this by specifying explicit 2-decimal rounding rules (round(val, 2)).

