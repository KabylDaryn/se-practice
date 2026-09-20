def analyze_marks(marks):
    if not marks:
        return None
    
    total = sum(marks)
    average = total / len(marks)
    highest = max(marks)
    lowest = min(marks)
    
    passed = [m for m in marks if m >= 50]
    pass_rate = (len(passed) / len(marks)) * 100
    
    return {
        'avg': average,
        'highest': highest,
        'lowest': lowest,
        'pass_rate': pass_rate
    }