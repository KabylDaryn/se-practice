def can_book(start, end, now, blocked, existing):
    """Return True only when the request satisfies AC1-AC4."""
    # Type checks: whole-minute ints only (bool is not accepted as a time)
    for value in (start, end, now):
        if type(value) is not int:
            return False
    if type(blocked) is not bool:
        return False

    # AC1: valid range within one day
    if not (0 <= start < end <= 1440):
        return False

    # AC1: start must be strictly after now
    if start <= now:
        return False

    # AC2: at most 120 minutes (exactly 120 is allowed)
    if end - start > 120:
        return False

    # AC3: blocked room rejects every request
    if blocked:
        return False

    # AC4: overlap with any existing booking (touching is not overlap)
    for b_start, b_end in existing:
        if start < b_end and end > b_start:
            return False

    return True