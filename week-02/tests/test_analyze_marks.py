#!/usr/bin/env python3
import importlib.util
import sys
from pathlib import Path

TOLERANCE = 0.01

CASES = [
    ("1", [40, 60, 80], 50,
     {"average": 60.0, "highest": 80, "lowest": 40, "pass_rate": 66.67}),
    ("2", [100], 50,
     {"average": 100.0, "highest": 100, "lowest": 100, "pass_rate": 100.0}),
    ("3", [49.5, 50], 50,
     {"average": 49.75, "highest": 50, "lowest": 49.5, "pass_rate": 50.0}),
    ("4", [], 50, ValueError),
    ("5", [40, "60"], 50, ValueError),
    ("6", [-1, 50, 101], 50, ValueError),
]

REQUIRED_KEYS = ("average", "highest", "lowest", "pass_rate")


def load_function(path_str):
    path = Path(path_str)
    if not path.is_file():
        print(f"ERROR: no such file: {path}")
        sys.exit(2)

    spec = importlib.util.spec_from_file_location("student_solution", path)
    module = importlib.util.module_from_spec(spec)
    try:
        spec.loader.exec_module(module)
    except Exception as exc:
        print(f"ERROR: {path} could not be imported: {type(exc).__name__}: {exc}")
        sys.exit(2)

    fn = getattr(module, "analyze_marks", None)
    if fn is None or not callable(fn):
        print(f"ERROR: {path} defines no callable named 'analyze_marks'.")
        sys.exit(2)
    return fn


def check_signature(fn):
    try:
        fn([50])
    except TypeError as exc:
        if "argument" in str(exc).lower():
            return f"SIGNATURE: pass_mark has no default value ({exc})"
        return "SIGNATURE: ok"
    except Exception:
        return "SIGNATURE: ok"
    return "SIGNATURE: ok"


def close(actual, expected):
    try:
        return abs(float(actual) - float(expected)) <= TOLERANCE
    except (TypeError, ValueError):
        return False


def run_value_case(fn, marks, pass_mark, expected):
    try:
        got = fn(list(marks), pass_mark)
    except Exception as exc:
        return "ERROR", f"raised {type(exc).__name__}: {exc}"

    if not isinstance(got, dict):
        return "FAIL", f"returned {type(got).__name__}, expected a dictionary"

    missing = [k for k in REQUIRED_KEYS if k not in got]
    if missing:
        return "FAIL", f"missing key(s) {', '.join(missing)} — got keys {sorted(got)}"

    wrong = []
    for key in REQUIRED_KEYS:
        if not close(got[key], expected[key]):
            wrong.append(f"{key}={got[key]!r} expected {expected[key]}")
    if wrong:
        return "FAIL", "; ".join(wrong)

    shown = ", ".join(f"{k}={got[k]!r}" for k in REQUIRED_KEYS)
    return "PASS", shown


def run_error_case(fn, marks, pass_mark):
    try:
        got = fn(list(marks), pass_mark)
    except ValueError as exc:
        return "PASS", f"raised ValueError: {exc}"
    except Exception as exc:
        return "ERROR", f"raised {type(exc).__name__} instead of ValueError: {exc}"
    return "FAIL", f"returned {got!r} where ValueError was required"


def main():
    if len(sys.argv) != 2:
        sys.exit(2)

    target = sys.argv[1]
    fn = load_function(target)

    print("=" * 72)
    print(f"analyze_marks harness — {target}")
    print(f"tolerance for numeric comparison: {TOLERANCE}")
    print("=" * 72)
    print(check_signature(fn))
    print("-" * 72)

    tally = {"PASS": 0, "FAIL": 0, "ERROR": 0}

    for label, marks, pass_mark, expected in CASES:
        call = f"analyze_marks({marks!r}, {pass_mark})"
        if expected is ValueError:
            verdict, detail = run_error_case(fn, marks, pass_mark)
            want = "ValueError"
        else:
            verdict, detail = run_value_case(fn, marks, pass_mark, expected)
            want = ", ".join(f"{k}={expected[k]}" for k in REQUIRED_KEYS)
        tally[verdict] += 1
        print(f"case {label}  {verdict:<5}  {call}")
        print(f"          expect: {want}")
        print(f"          got   : {detail}")
        print("-" * 72)

    print(f"RESULT  {tally['PASS']} PASS · {tally['FAIL']} FAIL · {tally['ERROR']} ERROR   ({target})")
    print("=" * 72)


if __name__ == "__main__":
    main()