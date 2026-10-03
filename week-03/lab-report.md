# Lab Report - Practice #03: Requirements Engineering with AI

**Student Name:** Kabyl Daryn  
**Assistant:** Google Gemini  
**Exact Model Name:** Gemini 2.5 Pro  

---

## Section 1: Decisions on Open Questions
1. **Rule R3 (Overlap):** A booking that ends exactly when another begins (e.g., 14:00–16:00 and 16:00–18:00) is **NOT** considered an overlap.
2. **Rule R2 (Duration):** A booking duration of **exactly two hours** is allowed.

---

## Section 2: Generation Evidence (Raw Unedited Output)

### Prompt 1 Verbatim
> You are a requirements analyst. For the Smart Campus study room booking system, identify Student and Administrator goals. Write 6 to 8 user stories using: As a [role], I want [goal], so that [reason]. Add a priority and one assumption to each story. Stay within the supplied scenario.

### Original Raw Output
**Stakeholder Goals**
* **Student Goal:** Easily find, reserve, and manage study room bookings to support individual and group study sessions without scheduling conflicts.
* **Administrator Goal:** Maintain library room availability, manage room statuses, and analyze usage patterns to keep facilities operational and efficiently utilized.

**User Stories**
1. **User Story 1:** As a Student, I want to view available study rooms and their time slots, so that I can find an open room for my study session.  
   *Priority:* High | *Assumption:* Room availability data updates in real time.
2. **User Story 2:** As a Student, I want to book a free study room for a specific time slot, so that I have a guaranteed place to study.  
   *Priority:* High | *Assumption:* The student is logged in with valid KBTU credentials.
3. **User Story 3:** As a Student, I want to cancel my existing room reservation, so that the room becomes available for other students if my plans change.  
   *Priority:* Medium | *Assumption:* Cancellations can be made at any time prior to or during the booking window.
4. **User Story 4:** As an Administrator, I want to block a study room from being booked, so that students cannot reserve rooms that are out of service.  
   *Priority:* High | *Assumption:* Blocking a room immediately overrides any existing pending reservations.
5. **User Story 5:** As an Administrator, I want to unblock a study room, so that it becomes available for student reservations again once service is restored.  
   *Priority:* Medium | *Assumption:* Unblocking a room restores its default available status for future time slots.
6. **User Story 6:** As an Administrator, I want to review room usage statistics over a specific period, so that I can understand peak usage hours and library demand.  
   *Priority:* Medium | *Assumption:* Historical booking logs are stored and accessible for administrative reporting.
7. **User Story 7:** As a Student, I want to receive an automated booking confirmation, so that I have proof of my reservation details.  
   *Priority:* Low | *Assumption:* The system dispatches confirmations automatically via email or system notification upon booking creation.
8. **User Story 8:** As a Student, I want to check in using a QR code at the study room door, so that my attendance is recorded and my reservation is activated.  
   *Priority:* Low | *Assumption:* Each study room is equipped with a digital scanner or QR code display.

---

### Prompt 2 Verbatim (Acceptance Criteria)
> For each selected story, write 3 to 5 acceptance criteria in Given, When, Then form. Include successful behavior, validation, and an error or alternative case. Apply these rules: bookings must be in the future, maximum duration is two hours, rooms cannot overlap, and blocked rooms cannot be booked. List assumptions before the criteria.

---

### Prompt 3 Verbatim (PlantUML Diagram)
> Create PlantUML code for a UML use-case diagram of the Smart Campus study room booking system. Place Student and Administrator outside the system boundary. Include View availability, Book room, Cancel booking, Block or unblock room, Review usage, and Send confirmation. Show only justified actor associations. Use include or extend only when the relationship is clear. Do not model screens, databases, or internal classes.

---

## Section 3: Review & Critique Findings

### Defect 1: Scope Creep in Authentication (US-02)
* **Target:** US-02 (Book Room)
* **Issue:** The AI assumed the user is logged in with valid KBTU credentials.
* **Reasoning:** "Account registration, passwords or authentication" are explicitly marked as **Out of Scope** in Section 1.
* **Action:** Removed authentication requirements; modified assumption to focus on room status and future time slots.

### Defect 2: Scope Creep in External Notifications (US-07)
* **Target:** US-07 (Send Confirmation)
* **Issue:** The AI proposed sending confirmations via "email or system notification".
* **Reasoning:** "SMS, push or reminder notifications of any kind beyond UC-06" are explicitly **Out of Scope**.
* **Action:** Rewrote the story so confirmations are strictly displayed within the web interface upon action completion.

### Defect 3: Invalid Feature Inclusion (US-08)
* **Target:** US-08 (Check-in via QR code)
* **Issue:** The AI generated a user story for QR code attendance check-in.
* **Reasoning:** "check-in, attendance or QR codes" are explicitly listed under **Out of Scope**.
* **Action:** Completely deleted US-08.

---

## Section 4: Acceptance Criteria Review
* Acceptance criteria were verified against business rules R1–R4.
* Happy path, boundary conditions (exact 2 hours), and invalid cases (overlapping, past dates, blocked rooms) are all tested.

---

## Section 5: Diagram & Architecture Review
* **Actor Boundary Check:** Student and Administrator sit outside the system boundary.
* **Actor Association Check:** No actor is connected directly to `UC-06 Send confirmation` as it is an automated system response triggered via `<<include>>` from booking/cancellation.
* **Scope Check:** No screens, tables, databases, or internal components are modeled.

---

## Section 6: Traceability Analysis
* `UC-01` to `UC-03` and `UC-06` are fully traced to User Stories and Acceptance Criteria.
* **Gaps Identified:**
  - `UC-04` (Block or unblock room) has User Stories (US-04, US-05) but no Acceptance Criteria were written in Part 3 due to the prompt limiting selection to 3 stories.
  - `UC-05` (Review usage) is backed by US-06 but lacks Acceptance Criteria.

---

## Section 7: Checker Results
Ran local checkers using Python 3:
* `python tests/check_requirements.py`: **23 PASS / 0 FAIL / 0 ERROR**
* `python tests/validate_submission.py`: **18 PASS / 0 FAIL / 0 ERROR**