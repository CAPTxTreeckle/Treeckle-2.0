import React, { useContext } from "react";
import { Progress, Segment } from "semantic-ui-react";
import {
  BookingCreationContext,
  BookingCreationProvider,
} from "../../context-providers";
import {
  BookingCreationStep,
  bookingCreationStepComponents,
  bookingCreationStepHeaders,
} from "../../context-providers/booking-creation-provider";
import "./booking-creation-section.scss";

const BookingCreationLayout = () => {
  const { currentCreationStep } = useContext(BookingCreationContext);

  return (
    <Segment.Group raised className="booking-creation-section">
      <Segment>
        <h2>{bookingCreationStepHeaders[currentCreationStep]}</h2>
      </Segment>
      <Segment className="progress-bar-container">
        <Progress
          className="progress-bar"
          size="small"
          indicating
          percent={
            (currentCreationStep / (BookingCreationStep.__length - 1)) * 100
          }
        />
      </Segment>

      {bookingCreationStepComponents[currentCreationStep]}
    </Segment.Group>
  );
};

function BookingCreationSection() {
  return (
    <BookingCreationProvider>
      <BookingCreationLayout />
    </BookingCreationProvider>
  );
}

export default BookingCreationSection;
