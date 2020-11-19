import React, { useContext } from "react";
import { Button, Header, Modal, Progress } from "semantic-ui-react";
import {
  CreateBookingRequestStepsHeaders,
  CreateBookingRequestSteps,
  CreateBookingRequestStepsOrder,
  CreateBookingRequestContext,
} from "../../context-providers/create-booking-request-provider";
import { OwnBookingRequestsContext } from "../../context-providers/own-booking-requests-provider";
import { useCreateBookingRequest } from "../../custom-hooks/api/bookings-api";
import PlaceholderWrapper from "../placeholder-wrapper";

interface Props {
  children: React.ReactNode;
  onNextStep?: (() => Promise<boolean>) | (() => boolean) | (() => void);
  displayNextButton?: boolean;
  closeBookingRequestModal?: () => void;
}

function StepLayout({
  children,
  onNextStep,
  displayNextButton = true,
  closeBookingRequestModal,
}: Props) {
  const {
    bookingRequestData,
    currentStep,
    goToNextStep,
    goToPreviousStep,
    resetCreateBookingRequestContext,
  } = useContext(CreateBookingRequestContext);

  const { isLoading, createBookingRequest } = useCreateBookingRequest();

  const isLastStep =
    currentStep ===
    CreateBookingRequestStepsOrder[CreateBookingRequestStepsOrder.length - 1];

  async function onClickNext() {
    let shouldGoToNextStep = true;
    if (onNextStep) {
      const affectsNextStep = await onNextStep();
      if (affectsNextStep !== undefined) {
        shouldGoToNextStep = affectsNextStep;
      }
    }
    if (shouldGoToNextStep) {
      goToNextStep();
    }
  }

  const { getBookingRequests } = useContext(OwnBookingRequestsContext);

  async function submitBookingRequest() {
    await createBookingRequest(bookingRequestData);
    getBookingRequests();
    closeBookingRequestModal && closeBookingRequestModal();
    resetCreateBookingRequestContext();
  }

  return (
    <PlaceholderWrapper
      isLoading={isLoading}
      loadingMessage="Creating your booking request"
      placeholder
      inverted
      withDimmer
    >
      <Modal.Header className="create-booking-request-modal-header">
        <Header as="h2">
          Create a Booking Request
          <Header.Subheader>
            {CreateBookingRequestStepsHeaders[currentStep]}
          </Header.Subheader>
        </Header>
      </Modal.Header>
      <Progress
        percent={(currentStep / CreateBookingRequestSteps.COMPLETED) * 100}
        indicating
        size="small"
        className="create-booking-request-progress-bar"
      />
      <Modal.Content className="create-booking-request-modal-content">
        {children}
      </Modal.Content>
      <Modal.Actions>
        <Button
          disabled={currentStep === CreateBookingRequestStepsOrder[0]}
          onClick={goToPreviousStep}
          secondary
        >
          Back
        </Button>
        {isLastStep ? (
          <Button color="green" onClick={submitBookingRequest}>
            Submit
          </Button>
        ) : (
          displayNextButton && (
            <Button color="teal" onClick={onClickNext}>
              Next
            </Button>
          )
        )}
      </Modal.Actions>
    </PlaceholderWrapper>
  );
}

export default StepLayout;
