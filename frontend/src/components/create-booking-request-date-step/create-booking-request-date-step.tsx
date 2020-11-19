import React, { useContext, useState } from "react";
import { Label } from "semantic-ui-react";

import { CreateBookingRequestContext } from "../../context-providers/create-booking-request-provider";
import StepLayout from "../create-booking-requests-step-layout";
import { useGetAllBookingRequests } from "../../custom-hooks/api/bookings-api";
import InfiniteCalendar from "../infinite-calendar";
import PlaceholderWrapper from "../placeholder-wrapper";
import "./create-booking-request-date-step.scss";

function BookingRequestDateStep() {
  const { bookingRequestData, setBookingRequestData } = useContext(
    CreateBookingRequestContext,
  );

  const [selectedDates, setSelectedDates] = useState<Date[]>(
    bookingRequestData.dates,
  );

  const [showError, setShowError] = useState(false);

  const {
    bookingRequests,
    isLoading,
    getBookingRequests,
  } = useGetAllBookingRequests();

  React.useEffect(() => {
    getBookingRequests({
      venue: bookingRequestData.venueId,
      start: Date.now(),
      status: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disabledDates = bookingRequests
    .filter((request) => {
      const bookedStartDate = new Date(request.startDate);
      const bookedEndDate = new Date(request.endDate);

      const bookingStartDate = new Date(request.startDate);
      bookingStartDate.setHours(bookingRequestData.startTime.getHours());
      bookingStartDate.setMinutes(bookingRequestData.startTime.getMinutes());
      const bookingEndDate = new Date(request.endDate);
      bookingEndDate.setHours(bookingRequestData.endTime.getHours());
      bookingEndDate.setMinutes(bookingRequestData.endTime.getMinutes());

      return (
        bookedStartDate <= bookingEndDate && bookedEndDate >= bookingStartDate
      );
    })
    .map((request) => new Date(request.startDate));

  function onSelect(selectedDate: Date) {
    const newDates = [...selectedDates];

    if (
      Boolean(
        newDates.find((date) => date.getTime() === selectedDate.getTime()),
      ) === true
    ) {
      newDates.splice(newDates.indexOf(selectedDate), 1);
      setSelectedDates(newDates);
    } else {
      newDates.push(selectedDate);
      setSelectedDates(newDates);
    }

    if (showError) {
      setShowError(false);
    }
  }

  async function onNextStep() {
    if (selectedDates.length === 0) {
      setShowError(true);
      return false;
    }

    setBookingRequestData({
      ...bookingRequestData,
      dates: selectedDates,
    });
    return true;
  }

  return (
    <StepLayout onNextStep={onNextStep}>
      <PlaceholderWrapper
        isLoading={isLoading}
        loadingMessage="Retrieving bookings"
        placeholder
        inverted
        withDimmer
      >
        <div className="create-booking-request-date-step-container">
          <InfiniteCalendar
            selectedDates={selectedDates}
            disabledDates={disabledDates}
            onSelect={onSelect}
          />
          {showError && (
            <Label
              basic
              color="red"
              pointing
              className="create-booking-request-date-step-error-popup"
            >
              Please select at least one date to book.
            </Label>
          )}
        </div>
      </PlaceholderWrapper>
    </StepLayout>
  );
}

export default BookingRequestDateStep;
