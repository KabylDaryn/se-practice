def analyze_marks(marks, pass_mark=50):
    if not marks:
        raise ValueError("Marks list cannot be empty.")
    
    for mark in marks:
        if not isinstance(mark, (int, float)) or isinstance(mark, bool):
            raise ValueError("All marks must be integers or floats.")
        if not (0 <= mark <= 100):
            raise ValueError("All marks must be in the range [0, 100].")

    avg = sum(marks) / len(marks)
    hi = max(marks)
    lo = min(marks)
    passed = sum(1 for m in marks if m >= pass_mark)
    pass_rate = (passed / len(marks)) * 100

    return {
        "average": round(avg, 2),
        "highest": round(hi, 2) if isinstance(hi, float) else hi,
        "lowest": round(lo, 2) if isinstance(lo, float) else lo,
        "pass_rate": round(pass_rate, 2)
    }