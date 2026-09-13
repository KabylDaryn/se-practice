# Week 01 — Manual vs AI: Comparison

**Name:Kabyl Daryn **
**Date:13.09.2026**

---

## 1. Facts

| | Manual (Part 1) | Rocket (Part 2) |
| --- | --- | --- |
| Language / stack used | python | next.js+Typescript |
| Time to first version that ran | 10min | ~30 sec-1 minute |
| Time to all 4 test cases passing | 18min | ~30sec-1minute|
| Number of attempts / prompts needed |4attemts | 1 prompts(2 extra question from ai) |
| Lines of code you actually wrote | 30 | |
| Did it handle invalid marks (case B)? |yes | yes|
| Did it handle an empty list (case D)? |yes | yes |
| Did it use the ≥ 50 pass threshold? |yes | yes |
| Output format matches the spec? | float | |
| Can you explain every line of it? |yes | no  |

## 2. Test results

| Case | Input | Manual output | Rocket output | Spec says | Match? |
| --- | --- | --- | --- | --- | --- |
| A | `85, 23, 45, 90, 92` | | | avg 67.00 · high 92 · low 23 · pass 60.0% | passed |
| B | `88, 47, -5, 101, abc, 73, 50, , 100` | | | avg 71.60 · high 100 · low 47 · pass 80.0% | passed |
| C | `10, 20, 30` | | | avg 20.00 · high 30 · low 10 · pass 0.0% | passed |
| D | `abc, , xyz` | | | clear message, no crash | |

## 3. What the AI added that I never asked for

<!-- Tech stack, UI, extra features, a pass threshold it invented, styling, etc. -->

-Extra statistics never requested: median and standard deviation
-A grade-distribution bar chart and a sortable scores table with grade badges and per-student pass/fail status
-Chose the tech stack itself (Next.js + TypeScript) and a bulk paste/upload input method, neither of which were specified

## 4. What the AI got wrong or silently skipped

<!-- Be concrete: input, expected, actual. -->

Input: Case B [88, 47, -5, 101, "abc", 73, 50, "", 100] & Case D ["abc", "", "xyz"]

Expected: Strictly ignore invalid values (-5, 101, "abc", "") without throwing errors or breaking calculations; return a clear "No valid marks found" warning for Case D.

Actual: Rocket silently skipped customizable boundary validation on the initial prompt attempt and automatically set a default pass threshold slider (50%) instead of letting the program handle raw unformatted arrays directly. Additionally, it calculated extra metrics like Standard Deviation and Median that were not requested in the original specification.

## 5. The defect I asked Rocket to fix

**Prompt I used:**

**Result:** (fixed / partly fixed / broke something else)

**What this tells me:**

---

## 6. Reflection (200–300 words)

Answer all four, in your own words:

1. Which parts of the work did the AI genuinely speed up?
2. Where did the AI cost you time, or give you something that looked right but was not?
3. Which of these two artefacts would you be willing to put your name on, and why?
4. What must a human engineer still be responsible for after this experiment?

<!-- Write your reflection below this line -->
1.The AI drastically speed up the frontend development and UI design. Generating a fully functional web interface with input forms, statistical cards, and error indicators took less than a minute.
2.Going through the multi-step prompt refinement process added extra time before getting the code. Additionally, the AI included extraneous metrics (like Standard Deviation) that were not specified in the assignment requirements.
3.I would put my name on the manual python script.There are i have a full understanding of logic and its data validation.
4.A human engineer remains strictly responsible for defining exact requirements, verifying edge-case handling, testing business logic for correctness, and ensuring overall application security and maintainability. AI tools can build features quickly, but only a human can validate their true correctness.