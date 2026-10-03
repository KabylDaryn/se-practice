# Acceptance Criteria - Smart Campus Study Room Booking

## Assumptions
* A booking ending exactly when another begins is not considered an overlap under Rule R3.
* A booking duration of exactly two hours is allowed under Rule R2.

---

## US-01: View Availability

### AC-01: Successful viewing of free time slots
* **Given** a student opens the room availability schedule for a selected date,
* **When** the page renders,
* **Then** the system displays all unblocked rooms alongside their available future time slots.

### AC-02: Blocked rooms display as unavailable
* **Given** a room has been blocked by an administrator,
* **When** a student views room availability,
* **Then** the system displays the blocked room as unavailable for booking across all time slots.

### AC-03: Prevention of past date selection
* **Given** a student is on the availability viewing page,
* **When** the student attempts to select a past date,
* **Then** the system displays a validation error stating that availability can only be viewed for current or future dates.

---

## US-02: Book Room

### AC-04: Successful room booking (Happy path)
* **Given** a study room is unblocked and free from 14:00 to 16:00 tomorrow,
* **When** a student submits a reservation request for that room for tomorrow from 14:00 to 16:00 (exactly 2 hours),
* **Then** the reservation is saved, and the time slot is marked as booked.

### AC-05: Rejection of overlapping time slot (Rule R3)
* **Given** a study room is already reserved tomorrow from 14:00 to 16:00,
* **When** another student attempts to book the same room tomorrow from 15:00 to 17:00,
* **Then** the system rejects the booking request and displays an overlap error message.

### AC-06: Rejection of booking exceeding two hours (Rule R2)
* **Given** a study room is available all day tomorrow,
* **When** a student submits a booking request for 3 hours (e.g., 10:00 to 13:00),
* **Then** the system prevents the booking and notifies the user that maximum duration is two hours.

### AC-07: Rejection of booking for blocked rooms or past times (Rules R1 & R4)
* **Given** a study room is marked as blocked by the library administration,
* **When** a student attempts to book a time slot for that room,
* **Then** the system denies the request, stating that blocked rooms cannot be booked.

---

## US-03: Cancel Booking

### AC-08: Successful cancellation of a future booking
* **Given** a student has an active booking scheduled for tomorrow at 14:00,
* **When** the student selects "Cancel Booking" for this reservation,
* **Then** the reservation is cancelled, and the time slot becomes immediately available for other students.

### AC-09: Rejection of past booking cancellation
* **Given** a booking's scheduled time slot has already passed,
* **When** a student attempts to cancel the reservation,
* **Then** the system denies the cancellation with an error stating that past bookings cannot be cancelled.

### AC-10: Confirmation of cancellation
* **Given** a student completes a valid cancellation request,
* **When** the system updates the reservation status,
* **Then** an immediate confirmation message is displayed on screen confirming the release of the booking.