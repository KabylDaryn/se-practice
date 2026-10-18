def can_book(start, end, now, blocked, existing):
    # AC3: The room must not be blocked
    if blocked:
        return False
    
    # AC1: 0 <= start < end <= 1440, and start must be strictly greater than now
    # Заменяем <= на < для end, чтобы нулевая длительность (start == end) отклонялась
    if not (0 <= start < end <= 1440):
        return False
    if start <= now:
        return False
        
    # AC2: Duration must be at most 120 minutes
    if (end - start) > 120:
        return False
        
    # AC4: No overlap with existing bookings. Touching endpoints are allowed.
    for ex_start, ex_end in existing:
        if max(start, ex_start) < min(end, ex_end):
            return False
            
    return True