import React, { useContext } from "react";
import { CreateBookingRequestContext } from "../../context-providers/create-booking-request-provider";
import { useGetSingleVenue } from "../../custom-hooks/api";
import { VenueFormProps } from "../../types/venues";
import StepLayout from "../create-booking-requests-step-layout";
import PlaceholderWrapper from "../placeholder-wrapper";
import VenueBookingForm from "../venue-booking-form";
import { VenueBookingFormWrapperProps } from "../venue-booking-form/venue-booking-form";
import "./create-booking-request-custom-form-step.scss";

function BookingRequestFormStep() {
  const { bookingRequestData, setBookingRequestData } = useContext(
    CreateBookingRequestContext,
  );

  const { venue, isLoading, getSingleVenue } = useGetSingleVenue();

  React.useEffect(() => {
    (async () => getSingleVenue(bookingRequestData.venueId))();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function VenueBookingFormWrapper({
    children,
    onSubmit,
  }: VenueBookingFormWrapperProps) {
    return (
      <StepLayout onNextStep={onSubmit}>
        <PlaceholderWrapper
          className="create-booking-request-form-step-placeholder-wrapper"
          isLoading={isLoading}
          loadingMessage="Retrieving venue booking form"
          showDefaultMessage={!venue}
          defaultMessage="No venue found"
          inverted
          placeholder
          withDimmer
        >
          {children}
        </PlaceholderWrapper>
      </StepLayout>
    );
  }

  function onSubmit(data?: Record<string, string | number>) {
    if (data) {
      setBookingRequestData({
        ...bookingRequestData,
        formData: { ...data },
      });
    }
  }

  return (
    <VenueBookingForm
      venueFormProps={(venue && venue.venueFormProps) as VenueFormProps}
      withCard={false}
      className="create-booking-request-form-step-custom-fields-wrapper"
      customFormWrapper={VenueBookingFormWrapper}
      onSubmit={onSubmit}
      defaultValues={bookingRequestData.formData}
    />
  );
}

export default BookingRequestFormStep;
