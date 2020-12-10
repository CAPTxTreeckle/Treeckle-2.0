from datetime import datetime


def parse_datetime_to_ms_timestamp(date: datetime) -> int:
    return round(date.timestamp() * 1000)