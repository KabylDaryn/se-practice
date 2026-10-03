# User Stories - Smart Campus Study Room Booking

## US-01: View Availability
* **Story:** As a Student, I want to view available study rooms and their time slots, so that I can find an open room for my study session.
* **Priority:** High
* **Assumption:** The library system displays the current status of all rooms in real time.

## US-02: Book Room
* **Story:** As a Student, I want to book a free study room for a specific time slot, so that I have a guaranteed place to study.
* **Priority:** High
* **Assumption:** The requested room is unblocked and the selected time slot starts in the future.

## US-03: Cancel Booking
* **Story:** As a Student, I want to cancel my existing room reservation, so that the room becomes available for other students if my plans change.
* **Priority:** Medium
* **Assumption:** A student can only cancel a booking that they previously created.

## US-04: Block Room
* **Story:** As an Administrator, I want to block a study room, so that students cannot reserve rooms that are out of service.
* **Priority:** High
* **Assumption:** Blocking a room prevents any new bookings from being created for that room.

## US-05: Unblock Room
* **Story:** As an Administrator, I want to unblock a study room, so that it becomes available for student reservations again once service is restored.
* **Priority:** Medium
* **Assumption:** Unblocking a room restores its availability for future time slots.

## US-06: Review Usage
* **Story:** As an Administrator, I want to review room usage statistics over a specific period, so that I can understand peak usage hours and library demand.
* **Priority:** Medium
* **Assumption:** System logs record all completed and cancelled bookings for administrative reporting.

## US-07: Send Confirmation
* **Story:** As a Student, I want to receive an immediate system confirmation upon booking or cancellation, so that I have proof of my transaction status.
* **Priority:** Low
* **Assumption:** Confirmation details are displayed within the web application interface immediately following the action.