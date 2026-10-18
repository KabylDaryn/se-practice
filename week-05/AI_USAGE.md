# AI Usage Disclosure — Week 05

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT | gpt-4o | the plan (Task 1) | lab-report.md |
| ChatGPT | gpt-4o | the first version, v1 (Task 2) | code/original/booking_v1.py, code/booking.py |
| ChatGPT | gpt-4o | structure of test cases and code review critique | code/test_booking.py, lab-report.md |

**The assistant wrote, or helped write, my tests in `code/`:** yes
<!-- Either answer is allowed. If "yes": say which tests, and how you checked that their EXPECTED
     values come from AC1–AC5 and not from what the generated code happens to return. -->
*Note: The assistant helped structure the test suite covering the 6 table cases and additional edge cases (such as zero-length and day bounds). All expected values were manually derived and verified exclusively against Acceptance Criteria AC1–AC5, independent of execution results.*

**`code/original/` holds the assistant's first answer exactly as returned:** yes

**Everything I submitted, I can explain and defend in class — including the overlap condition:** yes

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the line. An honest entry here costs far less than a blank one that turns out to be untrue. -->
None. All interval logic and bug fixes (such as handling `start == end`) were reviewed and verified.

Signed: Daryn Kabyl
Date: 2026-10-12