def analyze_marks(marks, pass_mark=50):
    if not isinstance(marks, list) or len(marks) == 0:
        raise ValueError("Input 'marks' must be a non-empty list.")
    
    if not isinstance(pass_mark, (int, float)) or isinstance(pass_mark, bool):
        raise ValueError("pass_mark must be a numeric value.")

    for m in marks:
        if isinstance(m, bool) or not isinstance(m, (int, float)):
            raise ValueError(f"Invalid element {m!r}: all marks must be numeric (int/float).")
        if not (0 <= m <= 100):
            raise ValueError(f"Mark {m} out of bounds: marks must be between 0 and 100 inclusive.")

    avg = sum(marks) / len(marks)
    hi = max(marks)
    lo = min(marks)
    passed_count = sum(1 for m in marks if m >= pass_mark)
    pass_rate = round((passed_count / len(marks)) * 100, 2)

    return {
        "average": round(avg, 2),
        "highest": hi,
        "lowest": lo,
        "pass_rate": pass_rate
    }