import React, { Dispatch, SetStateAction, useContext } from "react";
import { Modal } from "semantic-ui-react";
import {
  CreateBookingRequestContext,
  CreateBookingRequestSteps,
} from "../../context-providers/create-booking-request-provider";
import BookingRequestVenueStep from "../create-booking-request-venue-step";
import BookingRequestTimeStep from "../create-booking-request-time";
import BookingRequestDateStep from "../create-booking-request-date-step";
import BookingRequestFormStep from "../create-booking-request-custom-form-step";
import BookingRequestCompleted from "../create-booking-request-completed-step";
import { VenuesProvider } from "../../context-providers";
import "./create-booking-request-modal.scss";

interface Props {
  isCreateBookingRequestModalOpen: boolean;
  setIsCreateBookingRequestModalOpen: Dispatch<SetStateAction<boolean>>;
}

function CreateBookingRequestModal({
  isCreateBookingRequestModalOpen,
  setIsCreateBookingRequestModalOpen,
}: Props) {
  const { currentStep } = useContext(CreateBookingRequestContext);

  function ModalContent() {
    switch (currentStep) {
      case CreateBookingRequestSteps.VENUE:
        return (
          <VenuesProvider>
            <BookingRequestVenueStep />
          </VenuesProvider>
        );
      case CreateBookingRequestSteps.TIME:
        return <BookingRequestTimeStep />;
      case CreateBookingRequestSteps.DATE:
        return <BookingRequestDateStep />;
      case CreateBookingRequestSteps.FORM:
        return <BookingRequestFormStep />;
      case CreateBookingRequestSteps.COMPLETED:
        return (
          <BookingRequestCompleted
            closeBookingRequestModal={() =>
              setIsCreateBookingRequestModalOpen(false)
            }
          />
        );
      default:
        throw new Error("Invalid step");
    }
  }

  return (
    <Modal
      size="large"
      open={isCreateBookingRequestModalOpen}
      onClose={() => setIsCreateBookingRequestModalOpen(false)}
      centered
    >
      <ModalContent />
    </Modal>
  );
}

export default CreateBookingRequestModal;
