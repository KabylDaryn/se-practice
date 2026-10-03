# AI Usage Disclosure - Practice #03

## Tool and Model Details
* **AI Tool:** Google Gemini
* **Exact Model Name:** Gemini 2.5 Pro
* **Usage Period:** Frozen across the entire lab experiment (Week 03)

---

## Summary of AI Interactions

1. **Part 1 & 2 (User Stories Generation):**
   * **Prompt Used:** Verbatim prompt provided in Section 3 of Practice #03 handout.
   * **Role of AI:** Generated 8 initial user stories with priorities and assumptions.
   * **Human Intervention:** Reviewed output against scenario constraints, caught 3 Out-of-Scope defects (authentication, email notifications, QR code check-in), edited US-02 and US-07, and removed US-08.

2. **Part 3 (Acceptance Criteria Generation):**
   * **Prompt Used:** Verbatim prompt provided in Section 4 of Practice #03 handout.
   * **Role of AI:** Generated Given/When/Then criteria for 3 selected stories (US-01, US-02, US-03).
   * **Human Intervention:** Ensured criteria included negative tests, boundary cases (2 hours duration), and overlap checks.

3. **Part 4 & 5 (PlantUML Diagram Generation):**
   * **Prompt Used:** Verbatim prompt provided in Section 5 of Practice #03 handout.
   * **Role of AI:** Created PlantUML code for the UML use-case diagram.
   * **Human Intervention:** Verified actor placement, removed direct actor triggers from automated `UC-06 Send confirmation`, and confirmed system boundary isolation.

---

## Reflection on AI Utility
The AI was effective at rapidly generating structured user story templates and Given/When/Then scenarios. However, human review was essential because the AI introduced classic scope creep (adding QR codes, login requirements, and email channels) that directly violated the provided project domain rules.