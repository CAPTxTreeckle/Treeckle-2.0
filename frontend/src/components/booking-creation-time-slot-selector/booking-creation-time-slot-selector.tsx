import React, { useCallback, useContext, useEffect } from "react";
import { Calendar, View } from "react-big-calendar";
import { Button, Label, ModalContent, Popup, Segment } from "semantic-ui-react";
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
  } = useContext(BookingCreationContext);
  const { setModalOpen, setModalProps } = useContext(GlobalModalContext);
  const { selectedVenue } = useContext(BookingCreationContext);
  const { name: venueName, icName, icEmail, icContactNumber } = {
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

  const onClickHelp = useCallback(() => {
    const helpInfo = (
      <>
        {icName || icEmail || icContactNumber ? (
          <>
            {icName && (
              <p>
                <strong>Name:</strong> {icName}
              </p>
            )}
            {icEmail && (
              <p>
                <strong>Email:</strong>{" "}
                <a className="email-link" href={`mailto:${icEmail}`}>
                  {icEmail}
                </a>
              </p>
            )}
            {icContactNumber && (
              <p>
                <strong>Contact Number:</strong> {icContactNumber}
              </p>
            )}
          </>
        ) : (
          <p>
            <strong>Email:</strong>{" "}
            <a className="email-link" href="mailto:treeckle@googlegroups.com">
              treeckle@googlegroups.com
            </a>
          </p>
        )}
      </>
    );

    setModalProps({
      header: `${venueName} Help Info`,
      content: (
        <ModalContent>
          <h3>For any queries, do contact:</h3>
          {helpInfo}
        </ModalContent>
      ),
    });
    setModalOpen(true);
  }, [
    venueName,
    icName,
    icEmail,
    icContactNumber,
    setModalOpen,
    setModalProps,
  ]);

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

        <h2 className="section-title-container">
          <div className="section-title">
            Select booking time slot(s) for {venueName}
          </div>
          <div className="section-title-action-container">
            <Popup
              trigger={
                <Button
                  icon="help"
                  color="black"
                  circular
                  compact
                  onClick={onClickHelp}
                />
              }
              position="top center"
              content="Help"
            />
          </div>
        </h2>
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
