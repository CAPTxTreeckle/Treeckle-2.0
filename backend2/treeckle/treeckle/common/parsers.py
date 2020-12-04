from datetime import datetime


def parse_datetime_to_ms_timestamp(date: datetime) -> int:
    return int(date.timestamp() * 1000)