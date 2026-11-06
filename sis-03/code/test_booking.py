import unittest
from booking import can_book

NOW = 540
EX = [(600, 660)]


class BookingTests(unittest.TestCase):
    def test_touching_end_is_allowed(self):          # T1
        self.assertIs(can_book(660, 720, NOW, False, EX), True)

    def test_overlap_is_rejected(self):              # T2
        self.assertIs(can_book(630, 690, NOW, False, EX), False)

    def test_blocked_room_is_rejected(self):         # T3
        self.assertIs(can_book(660, 720, NOW, True, EX), False)

    def test_exactly_120_is_allowed(self):           # T4
        self.assertIs(can_book(720, 840, NOW, False, EX), True)

    def test_121_is_rejected(self):                  # T5
        self.assertIs(can_book(720, 841, NOW, False, EX), False)

    def test_start_at_now_is_rejected(self):         # T6
        self.assertIs(can_book(540, 570, NOW, False, EX), False)

    def test_reversed_is_rejected(self):             # T7
        self.assertIs(can_book(720, 660, NOW, False, EX), False)

    def test_zero_length_is_rejected(self):
        self.assertIs(can_book(600, 600, NOW, False, EX), False)

    def test_ends_at_midnight_is_allowed(self):      # T8
        self.assertIs(can_book(1380, 1440, NOW, False, EX), True)

    def test_past_midnight_is_rejected(self):        # T9
        self.assertIs(can_book(1380, 1441, NOW, False, EX), False)

    def test_second_booking_overlap(self):           # T10
        self.assertIs(can_book(720, 780, NOW, False, [(600, 660), (700, 760)]), False)

    def test_request_containing_existing_booking_is_rejected(self):
        self.assertIs(can_book(570, 690, NOW, False, EX), False)

    def test_same_check_twice_and_no_mutation(self): # T11 / AC5
        existing = [(600, 660)]
        first = can_book(660, 720, NOW, False, existing)
        second = can_book(660, 720, NOW, False, existing)
        self.assertIs(first, True)
        self.assertIs(second, True)
        self.assertEqual(existing, [(600, 660)])

    def test_unsorted_bookings_are_not_mutated(self):
        existing = [(900, 960), (600, 660), (700, 760)]
        result = can_book(780, 840, NOW, False, existing)
        self.assertIs(result, True)
        self.assertEqual(existing, [(900, 960), (600, 660), (700, 760)])

    def test_touching_start_is_allowed(self):
        self.assertIs(can_book(540 + 1, 600, NOW, False, EX), True)

    def test_non_int_and_bool_rejected(self):
        self.assertIs(can_book(660.5, 720, NOW, False, EX), False)
        self.assertIs(can_book("660", 720, NOW, False, EX), False)
        self.assertIs(can_book(True, 720, NOW, False, EX), False)

    def test_malformed_existing_returns_false(self):
        self.assertIs(can_book(660, 720, NOW, False, [(600,)]), False)
        self.assertIs(can_book(660, 720, NOW, False, None), False)

    def test_empty_existing(self):
        self.assertIs(can_book(660, 720, NOW, False, []), True)


if __name__ == "__main__":
    unittest.main()