import React, { useContext } from "react";
import { TIME_FORMAT } from "../../constants";
import { CreateBookingRequestContext } from "../../context-providers/create-booking-request-provider";
import { displayDatetime } from "../../utils/parser";
import BookingRequestsFormData from "../booking-requests-table-form-data";
import StepLayout from "../create-booking-requests-step-layout";
import "./create-booking-request-completed-step.scss";

interface Props {
  closeBookingRequestModal: () => void;
}

function BookingRequestCompleted({ closeBookingRequestModal }: Props) {
  const { bookingRequestData } = useContext(CreateBookingRequestContext);

  const { venueName, startTime, endTime, dates } = bookingRequestData;

  return (
    <StepLayout closeBookingRequestModal={closeBookingRequestModal}>
      <BookingRequestsFormData
        formData={{
          Venue: venueName,
          "Start Time": displayDatetime(startTime, TIME_FORMAT),
          "End Time": displayDatetime(endTime, TIME_FORMAT),
          Dates: [...dates],
          ...bookingRequestData.formData,
        }}
        className="create-booking-requests-table-form-data-grid"
        headerWidth={3}
        valueWidth={13}
      />
    </StepLayout>
  );
}

export default BookingRequestCompleted;
