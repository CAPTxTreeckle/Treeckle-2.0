import React, { useContext } from "react";
import { Button, Progress, Segment } from "semantic-ui-react";
import {
  BookingCreationContext,
  BookingCreationProvider,
} from "../../context-providers";
import {
  BookingCreationStep,
  undoableBookingCreationSteps,
} from "../../context-providers/booking-creation-provider";
import BookingCreationCategorySelector from "../booking-creation-category-selector";
import BookingCreationVenueSelector from "../booking-creation-venue-selector";
import BookingCreationTimeSlotSelector from "../booking-creation-time-slot-selector";
import BookingCreationCustomForm from "../booking-creation-custom-form";
import BookingCreationFinalizedView from "../booking-creation-finalized-view";
import "./booking-creation-section.scss";

const bookingCreationStepHeaders = [
  "Step 1: Choose a venue category",
  "Step 2: Select a venue",
  "Step 3: Select your time slot(s)",
  "Step 4: Complete the booking form",
  "Step 5: Review & submit",
];

const bookingCreationStepComponents = [
  <BookingCreationCategorySelector />,
  <BookingCreationVenueSelector />,
  <BookingCreationTimeSlotSelector />,
  <BookingCreationCustomForm />,
  <BookingCreationFinalizedView />,
];

const BookingCreationLayout = () => {
  const { currentCreationStep, goToNextStep, goToPreviousStep } = useContext(
    BookingCreationContext,
  );

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
      <Segment>{bookingCreationStepComponents[currentCreationStep]}</Segment>
      <Segment secondary>
        <div className="action-container justify-end">
          {undoableBookingCreationSteps.includes(currentCreationStep) && (
            <Button color="black" content="Back" onClick={goToPreviousStep} />
          )}
          {[
            BookingCreationStep.TimeSlot,
            BookingCreationStep.Form,
            BookingCreationStep.Finalize,
          ].includes(currentCreationStep) && (
            <Button
              color="blue"
              content={
                currentCreationStep === BookingCreationStep.Finalize
                  ? "Submit"
                  : "Next"
              }
              onClick={goToNextStep}
            />
          )}
        </div>
      </Segment>
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
