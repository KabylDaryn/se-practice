def analyze_marks(marks, pass_mark=50):
    if not marks:
        raise ValueError("List of marks cannot be empty.")
    
    for mark in marks:
        if not isinstance(mark, (int, float)):
            raise ValueError(f"Invalid mark value: {mark}. All marks must be numeric.")
        if mark < 0 or mark > 100:
            raise ValueError(f"Mark out of range: {mark}. Marks must be between 0 and 100.")

    average = sum(marks) / len(marks)
    highest = max(marks)
    lowest = min(marks)
    passed_count = sum(1 for mark in marks if mark >= pass_mark)
    pass_rate = (passed_count / len(marks)) * 100

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate
    }