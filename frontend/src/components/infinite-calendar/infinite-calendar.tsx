import React from "react";
import RInfinitCalendar, {
  Calendar,
  defaultMultipleDateInterpolation,
  withMultipleDates,
} from "react-infinite-calendar";
import "react-infinite-calendar/styles.css";

interface Props {
  selectedDates: Date[];
  disabledDates: Date[];
  onSelect: (selectedDate: Date) => void;
}

function InfiniteCalendar({ selectedDates, disabledDates, onSelect }: Props) {
  const CalendarWithRangeAndMultipleDates = withMultipleDates(Calendar);

  return (
    <RInfinitCalendar
      Component={CalendarWithRangeAndMultipleDates}
      // @ts-ignore
      interpolateSelection={defaultMultipleDateInterpolation}
      width={320}
      height={400}
      selected={selectedDates}
      onSelect={onSelect}
      disabledDates={disabledDates}
      minDate={new Date()}
      theme={{
        selectionColor: "rgb(48, 135, 250)",
        textColor: {
          default: "#333",
          active: "#FFF",
        },
        weekdayColor: "rgb(39, 86, 240)",
        headerColor: "rgb(35, 0, 175)",
        floatingNav: {
          background: "rgba(81, 67, 138, 0.96)",
          color: "#FFF",
          chevron: "#FFA726",
        },
      }}
    />
  );
}

export default InfiniteCalendar;
