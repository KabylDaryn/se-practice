import unittest
from booking import can_book

class TestCanBook(unittest.TestCase):
    
    def setup_base(self):
        return {"now": 540, "blocked": False, "existing": [(600, 660)]}

    def test_touching(self):
        data = self.setup_base()
        self.assertTrue(can_book(660, 720, data["now"], data["blocked"], data["existing"]))

    def test_exactly_two_hours(self):
        data = self.setup_base()
        self.assertTrue(can_book(720, 840, data["now"], data["blocked"], data["existing"]))

    def test_overlap(self):
        data = self.setup_base()
        self.assertFalse(can_book(630, 690, data["now"], data["blocked"], data["existing"]))

    def test_over_two_hours(self):
        data = self.setup_base()
        self.assertFalse(can_book(720, 841, data["now"], data["blocked"], data["existing"]))

    def test_blocked(self):
        data = self.setup_base()
        self.assertFalse(can_book(660, 720, data["now"], True, data["existing"]))

    def test_starts_now(self):
        data = self.setup_base()
        self.assertFalse(can_book(540, 570, data["now"], data["blocked"], data["existing"]))

    def test_zero_length(self):
        data = self.setup_base()
        self.assertFalse(can_book(660, 660, data["now"], data["blocked"], data["existing"]))

    def test_reversed_times(self):
        data = self.setup_base()
        self.assertFalse(can_book(720, 660, data["now"], data["blocked"], data["existing"]))

    def test_day_bounds_exceeded(self):
        data = self.setup_base()
        self.assertFalse(can_book(1400, 1600, data["now"], data["blocked"], data["existing"]))

    # --- Ловим M2 (специфичные граничные проверки AC1) ---
    def test_negative_start_and_end(self):
        data = self.setup_base()
        self.assertFalse(can_book(-100, -10, data["now"], data["blocked"], data["existing"]))

    def test_start_at_zero_bound(self):
        # Если now=540, старт в 0 нарушает условие start > now, но проверяет нижний рубеж 0
        data = self.setup_base()
        self.assertFalse(can_book(0, 60, data["now"], data["blocked"], data["existing"]))

    # --- Ловим M7 (различные варианты пересечений AC4) ---
    def test_left_partial_overlap(self):
        data = self.setup_base()
        self.assertFalse(can_book(550, 620, data["now"], data["blocked"], data["existing"]))

    def test_right_partial_overlap(self):
        data = self.setup_base()
        self.assertFalse(can_book(640, 700, data["now"], data["blocked"], data["existing"]))

    def test_complete_enclosure_of_existing(self):
        data = self.setup_base()
        self.assertFalse(can_book(590, 670, data["now"], data["blocked"], data["existing"]))

    def test_request_encloses_existing_completely(self):
        # Запрос шире, чем существующее бронирование (покрывает его полностью снаружи)
        data = self.setup_base()
        self.assertFalse(can_book(550, 700, data["now"], data["blocked"], data["existing"]))

    # --- Ловим M10 (строгие типы возврата и инверсии) ---
    def test_strict_boolean_identity(self):
        data = self.setup_base()
        res_true = can_book(660, 720, data["now"], data["blocked"], data["existing"])
        res_false = can_book(630, 690, data["now"], data["blocked"], data["existing"])
        self.assertIs(res_true, True)
        self.assertIs(res_false, False)

    def test_positive_case_explicit_bool(self):
        # Дополнительная позитивная проверка для M10
        res = can_book(700, 760, 540, False, [(600, 660)])
        self.assertIs(res, True)

    def test_empty_existing_bookings(self):
        self.assertTrue(can_book(600, 660, 540, False, []))

    def test_multiple_existing_bookings(self):
        existing = [(550, 580), (700, 750)]
        self.assertTrue(can_book(600, 660, 540, False, existing))

    def test_inputs_not_mutated(self):
        existing = [(600, 660)]
        existing_copy = list(existing)
        can_book(700, 750, 540, False, existing)
        self.assertEqual(existing, existing_copy)

if __name__ == "__main__":
    unittest.main()