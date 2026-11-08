Room-booking failure diagnosis
8 failed / 30 tests
 22 passed / 30 tests


Conclusion: The implementation contains two confirmed root-cause defects:
1. The overlap condition incorrectly treats touching endpoints as overlapping.
2. The function modifies the original bookings array by adding a new booking.
Both defects violate the acceptance criteria and explain all eight reported failures.
1. Defect analysis
DEFECT A — Incorrect overlap detection
defect: Touching booking endpoints are incorrectly rejected.

evidence:
- T01: Booking starts at an existing booking's end — expected true, received false.
- T08: Booking ends at an existing booking's start — expected true, received false.
- X2: A free slot between two touching bookings is rejected.
- N08a: A free slot with unsorted bookings is rejected.
- BUG-A: Regression test also fails.
root cause:

The implementation uses:
if (start <= b.end && end >= b.start) return false;


The <= and >= operators treat equality as an overlap.

However, AC4 explicitly allows touching endpoints. Two intervals overlap only when they share some actual time, not merely a boundary.

For example:
Allowed: touching endpoints
09:00–10:00

10:00–11:00


Accepted

Not allowed: actual overlap
09:00–10:00

09:30–10:30


Rejected

fix: Use strict inequalities for overlap detection:
if (start < b.end && end > b.start) return false;


This preserves rejection of actual overlaps while allowing touching endpoints.

test:
- Verify that a booking starting exactly at an existing booking's end is accepted.
- Verify that a booking ending exactly at an existing booking's start is accepted.
- Verify that a one-minute overlap is rejected.
- Verify that a free slot between two touching bookings is accepted.
- Repeat the tests with unsorted existing bookings.
DEFECT B — Mutation of existing booking data
defect: The function modifies the original bookings array even though it should only determine availability.

evidence:
- BUG-B: The original array gains { start: 720, end: 780 }.
- AC5: The available-request immutability test fails.
- AC5: The frozen-array test fails.
- The test report shows the original array contains an additional booking after calling the function.
root cause:

The following statement modifies the input array:
bookings.push({ start, end });


push() changes the original array instead of creating an independent result.

This violates AC5, which requires existing booking data to remain unchanged.

It also makes the function unsuitable as a pure availability-checking operation.

fix: Remove the bookings.push() statement entirely.

The function should:
- Return false when a booking is unavailable.
- Return true when a booking is available.
- Never add, remove, or modify existing bookings.
test:
- Save a copy of the bookings array before calling canBook.
- Call the function with an available request.
- Verify that the returned result is true.
- Verify that the original array remains unchanged.
- Verify that existing booking object references remain identical.
- Repeat using Object.freeze() to ensure the function does not attempt to modify the array.
2. Failed test mapping
Failed test	Acceptance criterion	Root cause
T01	AC4	Incorrect overlap condition
T08	AC4	Incorrect overlap condition
X2	AC4	Incorrect overlap condition
N08a	AC4	Incorrect overlap condition
AC5 available request	AC5	Array mutation
AC5 frozen array	AC5	Array mutation
BUG-A	AC4	Incorrect overlap condition
BUG-B	AC5	Array mutation

All eight failures are explained by these two defects.
3. Acceptance criteria review
Criterion	Result	Explanation
AC1	Pass	Validates time boundaries and future start
AC2	Pass	Rejects durations exceeding 120 minutes
AC3	Pass	Rejects blocked rooms
AC4	Fail	Rejects valid touching endpoints
AC5	Fail	Modifies the original bookings array

The existing tests confirm that AC1, AC2 and AC3 behave correctly for their tested cases.
4. Recommended minimal changes
Only two changes are necessary:
Location	Current implementation	Recommended change
Overlap detection	start <= b.end && end >= b.start	start < b.end && end > b.start
Array mutation	bookings.push({ start, end })	Remove the statement

The rest of the validation logic can remain unchanged.
5. Regression testing plan
After applying the two changes, run the complete test suite again.

Expected results:
Test group	Expected
AC1 – Time validation	Pass
AC2 – Duration validation	Pass
AC3 – Blocked rooms	Pass
AC4 – Overlap detection	Pass
AC5 – Immutability	Pass
Week 08 regression tests	Pass

Target: 30/30 tests passing
This is the expected result, not a claim that the tests have already been rerun.

Final diagnosis
The room-booking function has two independent implementation errors. The first is a boundary-condition error in interval comparison, while the second is an unintended side effect caused by modifying the input array.

Both can be fixed with minimal changes without redesigning the function.

Recommendation: Keep canBook as a read-only availability checker. Booking creation should be handled separately by the application after availability has been confirmed.