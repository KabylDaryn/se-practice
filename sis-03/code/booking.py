MAX_MINUTES = 120
DAY_END = 1440


def _is_minute(value):
    """True only for a real int (bool is rejected)."""
    return type(value) is int


def _valid_existing(existing):
    """existing must be a list/tuple of (start, end) int pairs with start < end."""
    if not isinstance(existing, (list, tuple)):
        return False
    for booking in existing:
        if not isinstance(booking, (list, tuple)) or len(booking) != 2:
            return False
        b_start, b_end = booking
        if not (_is_minute(b_start) and _is_minute(b_end)) or b_start >= b_end:
            return False
    return True


def can_book(start, end, now, blocked, existing):
    """Return True only when the request satisfies AC1-AC4.

    Never modifies `existing`. Invalid input returns False instead of raising.
    """
    if not (_is_minute(start) and _is_minute(end) and _is_minute(now)):
        return False
    if type(blocked) is not bool:
        return False
    if not _valid_existing(existing):
        return False

    # AC1
    if not (0 <= start < end <= DAY_END):
        return False
    if start <= now:
        return False
    # AC2
    if end - start > MAX_MINUTES:
        return False
    # AC3
    if blocked:
        return False
    # AC4: touching at an endpoint is not an overlap
    for b_start, b_end in existing:
        if start < b_end and end > b_start:
            return False
    return True