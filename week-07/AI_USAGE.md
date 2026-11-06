# AI Usage Disclosure — Week 07

Required by the course academic policy (Generative AI use level **D — AI-integrated**).

I am responsible for the accuracy, testing and integrity of everything submitted, including AI-generated content.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT | not displayed | Generating the first test suite (Task 3), including test cases and expected results | `suites/first/booking.test.ts`, `app/src/booking.test.ts` |
| ChatGPT | not displayed | Reviewing the first suite, identifying missing boundary cases, and improving the tests (Task 5) | `app/src/booking.test.ts` |
| ChatGPT | GPT-6 | Explaining test results, mutation testing, report requirements, validation errors, and assisting with documentation | `lab-report.md`, `submission.yml`, `AI_USAGE.md` |

**I used an assistant to extract `canBook` (Task 1), or to fix a defect in it:** yes

ChatGPT assisted with extracting the booking decision logic from `app/src/App.tsx` into `app/src/booking.ts`. The original conditions were preserved, and `App.tsx` was updated to import and call `canBook`. I checked the behavior using Vitest (28 tests passed), a successful production build, and manual UI checks.

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** yes

I used ChatGPT (GPT-6) in another conversation to help explain checker failures and draft or revise parts of `lab-report.md`, including the setup, test comparison, mutation analysis, and UI observations.

**`suites/first/` holds the assistant's first test file exactly as it generated it:** yes

**Every terminal output in lab-report.md was pasted from a real run, unedited:** no

Some terminal output was reformatted or shortened when added to the report. The test results were based on actual executions.

**I can explain every test in my final suite — its input, its expected result and the AC behind it — without the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**

The AI suggested additional boundary cases and data-preservation checks in `app/src/booking.test.ts`. I reviewed the expected results against AC1–AC5, but some implementation details of the generated tests required additional explanation.

Signed: Kabyl Daryn
Date: 2026-11-06