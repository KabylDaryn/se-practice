def can_book(start, end, now, blocked, existing):
    """
    Determines if a study room booking request is valid.
    
    Parameters:
    - start (int): Start time in minutes after midnight
    - end (int): End time in minutes after midnight
    - now (int): Current time in minutes after midnight (0-1439)
    - blocked (bool): Whether the room is blocked
    - existing (list of tuples): Active (start, end) bookings for the room
    
    Returns:
    - bool: True if all AC1-AC4 conditions are met, False otherwise.
    """
    # AC3: The room must not be blocked
    if blocked:
        return False
    
    # AC1: 0 <= start <= end <= 1440, and start must be strictly greater than now
    if not (0 <= start <= end <= 1440):
        return False
    if start <= now:
        return False
        
    # AC2: Duration must be at most 120 minutes
    if (end - start) > 120:
        return False
        
    # AC4: No overlap with existing bookings. Touching endpoints are allowed.
    for ex_start, ex_end in existing:
        # Two intervals overlap if max(start, ex_start) < min(end, ex_end)
        if max(start, ex_start) < min(end, ex_end):
            return False
            
    return True