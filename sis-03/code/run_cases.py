import sys, importlib.util

path = sys.argv[1]
spec = importlib.util.spec_from_file_location("m", path)
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)

NOW, EX = 540, [(600, 660)]
cases = [
    ("T1", 660, 720, False, EX),
    ("T2", 630, 690, False, EX),
    ("T3", 660, 720, True, EX),
    ("T4", 720, 840, False, EX),
    ("T5", 720, 841, False, EX),
    ("T6", 540, 570, False, EX),
    ("T7", 720, 660, False, EX),
    ("T8", 1380, 1440, False, EX),
    ("T9", 1380, 1441, False, EX),
    ("T10", 720, 780, False, [(600, 660), (700, 760)]),
]
for name, s, e, b, ex in cases:
    try:
        print(name, m.can_book(s, e, NOW, b, ex))
    except Exception as err:
        print(name, "Error", type(err).__name__)

ex = [(600, 660)]
m.can_book(660, 720, NOW, False, ex)
print("T11", m.can_book(660, 720, NOW, False, ex), "(second call)")