# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Kabyl Daryn |
| Group | SE-2301 |
| AI assistant | ChatGPT |
| Exact model | GPT-4o |
| Renderer | VS Code extension |
| Behaviour diagram | sequence |
| Stories used | the reference set from Week-03 |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
Generate a PlantUML Use Case diagram for a Smart Campus Study Room Booking system based on the approved user stories (US-01 through US-07). Include actors Student and Administrator, with use cases for browsing, booking, cancelling, blocking rooms, and viewing usage reports.

```

### 2.2 Task 2 — class prompt

```text
Generate a PlantUML Class diagram representing the domain model for the Study Room Booking system. Include Student, Room, Booking, Administrator, UsageReport, and relevant Enums (RoomStatus, BookingStatus). Show relationships with multiplicities and attributes.

```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate a PlantUML Sequence diagram for the 'Book Room' interaction. Include Student, BookingService, and BookingRepository. Use an alt block to represent successful booking creation versus rule violation failures (R1-R4).

```

### 2.4 Focused correction prompts (if you sent any)

```text
Fix the syntax in PlantUML sequence diagram: ensure notes are placed properly, lifelines are activated and deactivated correctly, and alt branches handle failure responses without saving data.

```

### 2.5 Critique prompt

```text
Act as a senior software architect. Critique the generated PlantUML models for the Study Room Booking system. Identify potential design flaws, missing boundary checks, or violations of requirements R1-R4.

```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:**

* Student is authenticated before performing any action.
* Administrator has full permissions over all rooms and reports.

At least **two** findings. A finding names the element, the problem and the rule or story that
proves it is a problem.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Student → View Usage Reports | AI associated Student directly with viewing global usage reports | US-06 / Administrator scope | Removed association; restricted report viewing to Administrator actor. |
| 2 | Room Blocking Use Case | Missing explicit connection to system notification on room blockage | US-05 / R3 | Added inclusion/extension link to notify students with active bookings. |

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

One row per association in your **revised** class diagram.

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | One student creates zero or more bookings | Each booking belongs to exactly one student | 1 / 0..* |
| Room — Booking | One room is reserved in zero or more bookings | Each booking is reserved in exactly one room | 1 / 0..* |
| Administrator — Room | One administrator manages zero or more rooms | Each room is managed by one administrator | 1 / 0..* |
| Administrator — UsageReport | One administrator reviews zero or more usage reports | Each report is reviewed by one administrator | 1 / 0..* |

### 4.2 Constraints the multiplicities cannot show

* R2: Stated in note right of Booking — Max duration is 2 hours (<= 120 mins).
* R3: Stated in note right of Booking — Active bookings for the same room cannot overlap. Boundary rule: End time equal to next Start time is NOT an overlap.

### 4.3 Assumptions

- A1: Blocking a room automatically cancels or flags all pending active bookings for that room.
- A2: End time equal to the next start time is allowed and not considered an interval overlap.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | BookingRepository | AI included an infrastructure data access class inside the domain model | Clean Architecture / Domain Model separation | Removed BookingRepository from class.puml and documented it as a design component in §5. |
| 2 | RoomStatus Enum | Initial AI response missed BLOCKED status in room state enumeration | R3 / US-05 | Added BLOCKED explicitly to RoomStatus enum. |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3A sequence — chosen because it explicitly models synchronous call sequences, message parameters, and conditional branching logic across layers.

**Design components added beyond the domain model:**

* `BookingService`: Coordinates application logic, enforces validation rules, and handles responses.
* `BookingRepository`: Technical data access component that handles database persistence and query operations for booking overlaps.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Failure branch in alt block | AI called saveBooking() even within the rule violation path | R1-R3 integrity | Moved saveBooking() exclusively inside the success branch of the alt block. |

---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | Add BookingRepository to domain class diagram | Class Diagram | reject | Domain class diagrams should only represent core domain entities, not persistence abstractions. |
| 2 | Use explicit alt block for validation failures | Sequence Diagram | accept | Improves clarity on error handling and prevents unintended persistence on invalid input. |
| 3 | Add boundary condition note for contiguous bookings | Class / Sequence Diagram | accept | Disambiguates whether touching time boundaries (e.g. 14:00-15:00 and 15:00-16:00) count as overlaps. |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book room | Student, Booking | Guard check: startTime in future & duration <= 120 mins |
| R2 | Book room | Room, Booking, note | Query existing bookings to check interval overlap |
| R3 | Block / unblock room | Room, RoomStatus | Guard check: room.status == AVAILABLE |
| R4 | Book room | Student, Booking | Return message: Booking confirmed & displayed |
| US-01 | View availability | Student, Room | Check availability (roomId, startTime, endTime) |
| US-02 | Book room | Student, Booking, Room | saveBooking(studentId, roomId, startTime, endTime) |
| US-03 | Cancel booking | Student, Booking | cancel() message |
| US-04 | View my bookings | Student, Booking | Query user bookings list |
| US-05 | Block / unblock room | Administrator, Room | block() message |
| US-06 | Review usage | Administrator, UsageReport | reviewUsage(startDate, endDate) |
---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | Use Case | Included admin reports in Student scope | Restricted reporting use cases to Administrator actor | Violation of US-06 permission boundary |
| 2 | Class | Contained technical layer BookingRepository class | Removed BookingRepository, leaving pure domain entities and rule notes | CL6 domain model purity requirement |
| 3 | Sequence | Saved booking on both success and failure branches | Restructured alt block to invoke saveBooking() only on valid branch | SQ4 data persistence integrity rule |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
PS C:\Users\Kabyl Daryn\se-practice\week-04> python tests/check_models.py
CL1 PASS class diagram exists and is valid PlantUML
CL2 PASS required domain classes present
CL3 PASS required enums present
CL4 PASS relationships and multiplicities present
CL5 PASS no technical or UI class(es) in a domain model
CL6 PASS design or UI class(es) in a domain model: none
CL7 PASS attributes needed by R1-R3 are present
CL8 PASS a note states R2 (no overlapping active bookings)
SQ1 PASS Student, BookingService and BookingRepository lifelines present
SQ2 PASS alt block with a guard on every branch (2 branches)
SQ3 PASS validation happens before creation
SQ4 PASS failure branch does not create/save booking
SQ5 PASS every message is labelled
SQ6 PASS R1 (time range) is visible - checked or stated as a precondition
SQ7 PASS R3 (blocked room) is visible
FI1 PASS the AI's original output is kept for every diagram
FI2 PASS a rendered image for every diagram
LR1 PASS §1 filled
LR2 PASS §2 filled
LR3 PASS §3 filled
LR4 PASS §4 filled
LR5 PASS §5 filled
LR6 PASS §6 filled
LR7 PASS §8 filled
CS1 PASS 7 approved stories
CS2 PASS §7 filled for R1-R4 and use cases
CS3 PASS every use case traces to an approved story
CS4 PASS every lifeline is a domain class or an explained design component

SUMMARY pass=25 fail=0 error=0

```

**FAILs I am keeping, and why:** none

---

## 10. Conclusion (120–180 words)

The AI struggled most with maintaining architectural boundaries in the domain class diagram. Specifically, ChatGPT placed `BookingRepository` directly inside the domain model alongside entities like `Student` and `Room`. Had this error gone unreviewed, infrastructure persistence logic would have leaked into core business domain models, violating clean architecture principles. Furthermore, in the sequence diagram draft, the AI included a `saveBooking()` call even on rule validation failure branches, which would have persisted invalid bookings directly to the database.

During the critique phase, the AI insightfully pointed out the need to use an explicit `alt` block to handle alternative execution paths cleanly. However, it falsely claimed that `BookingRepository` should remain in the domain class diagram. Reviewing these generated diagrams proved that AI can quickly construct syntactical templates, but human oversight is crucial to enforce strict domain boundaries, boundary logic constraints, and failure-path state safety.
