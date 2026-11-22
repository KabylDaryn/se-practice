# AI Usage Disclosure — SIS #04

Required by the course academic policy (Generative AI use level **D — AI-integrated**).

You are responsible for the accuracy, testing and integrity of everything you submit, including anything an AI tool produced.

| Tool | Exact model / plan | Date | Used for | Which files it touched |
| --- | --- | --- | --- | --- |
| ChatGPT (web) | GPT-6 / Plus | 22 November 2026 | Codebase analysis (Task 1) | `report.md`, `app/src/App.tsx` (reviewed) |
| ChatGPT (web) | GPT-6 / Plus | 22 November 2026 | Improvement plan | `report.md` |
| ChatGPT (web) | GPT-6 / Plus | 22 November 2026 | Feature extension (Task 2) | `app/src/rooms.ts`, `app/src/filter.ts`, `app/src/App.tsx` |
| ChatGPT (web) | GPT-6 / Plus | 22 November 2026 | Refactoring (Task 3) | `app/src/booking.ts`, `app/src/App.tsx`, `diagrams/before.puml`, `diagrams/after.puml` |
| ChatGPT (web) | GPT-6 / Plus | 22 November 2026 | Tests (Task 4) | `app/src/booking.test.ts` |
| ChatGPT (web) | GPT-6 / Plus | 22 November 2026 | Report and documentation assistance | `report.md`, `app/README.md`, `submission.yml`, `AI_USAGE.md` |

**The assistant wrote, or helped write, tests in `app/`:** yes

ChatGPT helped create 17 tests in `app/src/booking.test.ts`, covering AC1–AC5, F1–F5, B1–B6 and INT. I checked the expected results against the assignment requirements, including the 120-minute limit, blocked rooms, overlapping bookings, capacity and equipment filtering. I ran `npx vitest run`, and all 17 tests passed.

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** yes

**Every number in report.md section 7 was measured the way its row says:** yes

**I shared no credentials, keys or private data with any tool:** yes

**Everything I submitted, I can explain and defend in class — including filterRooms, checkRoom and why each module exists:** yes

**Anything I accepted from the AI without fully understanding it:** None identified after reviewing the implementation and running the tests.

Signed: Kabyl Daryn

Date: 22.11.2026