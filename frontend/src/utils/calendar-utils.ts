import { CSSProperties } from "react";
import {
  dateFnsLocalizer,
  DateRangeFormatFunction,
  DateRange,
  DateLocalizer,
} from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  max,
  min,
  endOfDay,
  startOfToday,
  isBefore,
  isPast,
} from "date-fns";
import { enUS } from "date-fns/locale";

export const CURRENT_LOCALE = "en-US";

const locales = {
  "en-US": enUS,
};

export const localizer: DateLocalizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const dayHeaderFormat = "cccc dd MMMM";

export const weekRangeFormat: DateRangeFormatFunction = (
  { start, end },
  culture = CURRENT_LOCALE,
  local = localizer,
) =>
  `${local.format(
    start,
    isSameMonth(start, end) ? "dd" : "dd MMMM",
    culture,
  )} – ${local.format(end, "dd MMMM", culture)}`;

function getFirstVisibleDateInCalendarMonth(date: Date): Date {
  const firstDateOfMonth = startOfMonth(date);

  return startOfWeek(firstDateOfMonth, {
    weekStartsOn: localizer.startOfWeek(CURRENT_LOCALE) as ReturnType<
      typeof getDay
    >,
  });
}

export function dayPropGetter(
  date: Date,
): { className?: string; style?: CSSProperties } {
  return isBefore(date, startOfToday())
    ? { style: { backgroundColor: "#f2f2f2" } }
    : {};
}

export function slotPropGetter(
  date: Date,
): { className?: string; style?: CSSProperties } {
  return isPast(date) ? { style: { backgroundColor: "#f2f2f2" } } : {};
}

function getLastVisibleDateInCalendarMonth(date: Date): Date {
  const lastDateOfMonth = endOfMonth(date);

  return endOfWeek(lastDateOfMonth, {
    weekStartsOn: localizer.startOfWeek(CURRENT_LOCALE) as ReturnType<
      typeof getDay
    >,
  });
}

export function getVisibleRangeInCalendarMonth(date: Date): DateRange {
  return {
    start: getFirstVisibleDateInCalendarMonth(date),
    end: getLastVisibleDateInCalendarMonth(date),
  };
}

export function getVisibleRange(dates: Date[]): DateRange {
  const minDate = min(dates);
  const maxDate = max(dates);

  return {
    start: minDate,
    end: endOfDay(maxDate),
  };
}
