import React, { useContext, useEffect } from "react";
import { Calendar, View } from "react-big-calendar";
import { Button, Label, Segment } from "semantic-ui-react";
import {
  BookingCreationContext,
  GlobalModalContext,
} from "../../context-providers";
import { useGetBookings } from "../../custom-hooks/api";
import { BookingStatus } from "../../types/bookings";
import {
  CURRENT_LOCALE,
  localizer,
  weekRangeFormat,
  dayHeaderFormat,
  dayPropGetter,
  slotPropGetter,
} from "../../utils/calendar-utils";
import { useBookingCreationCalendarState } from "../../custom-hooks";
import PlaceholderWrapper from "../placeholder-wrapper";
import { displayDateTime } from "../../utils/parser-utils";
import { CalendarBooking } from "../../custom-hooks/use-booking-creation-calendar-state";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./booking-creation-time-slot-selector.scss";

const eventPropGetter = ({
  isNew,
}: CalendarBooking): { className?: string; style?: React.CSSProperties } =>
  isNew ? { style: { backgroundColor: "#00b5ad" } } : {};

const views: View[] = ["month", "week", "day"];

function BookingCreationTimeSlotSelector() {
  const {
    goToNextStep,
    goToPreviousStep,
    newBookingDateTimeRanges,
    selectedVenue,
  } = useContext(BookingCreationContext);
  const { setModalOpen, setModalProps } = useContext(GlobalModalContext);
  const { name: venueName } = {
    ...selectedVenue?.venueFormProps,
  };

  const {
    bookings: approvedBookings,
    isLoading,
    getBookings,
  } = useGetBookings();

  const {
    allBookings,
    newBookings,
    visibleDateRange,
    view,
    dateView,
    onRangeChange,
    onView,
    onSelectSlot,
    onNavigate,
    onSelectEvent,
    onSelecting,
    removeNewBooking,
  } = useBookingCreationCalendarState(
    approvedBookings,
    newBookingDateTimeRanges,
  );

  useEffect(() => {
    if (isLoading) {
      setModalProps({
        basic: true,
        content: (
          <PlaceholderWrapper
            isLoading
            loadingMessage="Retrieving booking periods"
          />
        ),
        closeIcon: false,
      });
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [isLoading, setModalProps, setModalOpen]);

  useEffect(() => {
    const { start, end } = visibleDateRange;
    const startDateTime = start.getTime();
    const endDateTime = end.getTime();

    getBookings({
      venueName,
      status: BookingStatus.Approved,
      startDateTime,
      endDateTime,
    });
  }, [getBookings, venueName, visibleDateRange]);

  return (
    <>
      <Segment className="booking-creation-time-slot-selector">
        <Segment raised placeholder>
          <Label
            attached="top left"
            content="Selected time slot(s)"
            size="large"
          />
          <Label.Group className="selected-time-slots-container">
            {newBookings.map((booking) => {
              const { start, end } = booking;
              const label = `${displayDateTime(start)} - ${displayDateTime(
                end,
              )}`;

              return (
                <Label
                  key={label}
                  color="teal"
                  className="pointer"
                  content={label}
                  onClick={(e) => onSelectEvent(booking, e, true)}
                  onRemove={() => removeNewBooking(booking)}
                />
              );
            })}
          </Label.Group>
        </Segment>

        <h2>{venueName} Bookings</h2>
        <Calendar
          className="booking-calendar"
          events={allBookings}
          localizer={localizer}
          toolbar
          step={30}
          timeslots={1}
          selectable
          showMultiDayTimes
          popup
          views={views}
          view={view}
          culture={CURRENT_LOCALE}
          date={dateView}
          formats={{
            dayHeaderFormat,
            dayRangeHeaderFormat: weekRangeFormat,
          }}
          dayPropGetter={dayPropGetter}
          slotPropGetter={slotPropGetter}
          eventPropGetter={eventPropGetter}
          scrollToTime={dateView}
          onRangeChange={onRangeChange}
          onView={onView}
          onSelectSlot={onSelectSlot}
          onNavigate={onNavigate}
          onSelectEvent={onSelectEvent}
          onSelecting={onSelecting}
          onDoubleClickEvent={removeNewBooking}
        />
      </Segment>

      <Segment secondary>
        <div className="action-container justify-end">
          <Button color="black" content="Back" onClick={goToPreviousStep} />
          <Button
            color="blue"
            content="Next"
            onClick={() => goToNextStep(newBookings)}
            disabled={newBookings.length <= 0}
          />
        </div>
      </Segment>
    </>
  );
}

export default BookingCreationTimeSlotSelector;
