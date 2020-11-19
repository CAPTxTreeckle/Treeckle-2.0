import React, { useContext, useEffect } from "react";
import { VenuesContext } from "../../context-providers";
import { CreateBookingRequestContext } from "../../context-providers/create-booking-request-provider";
import { VenueViewProps } from "../../types/venues";
import StepLayout from "../create-booking-requests-step-layout";
import PlaceholderWrapper from "../placeholder-wrapper";
import VenueGallery from "../venue-gallery";

function BookingRequestVenueStep() {
  const { venues, isLoading, getAllVenues } = useContext(VenuesContext);
  const {
    bookingRequestData,
    setBookingRequestData,
    goToNextStep,
  } = useContext(CreateBookingRequestContext);

  useEffect(() => {
    (async () => getAllVenues())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StepLayout displayNextButton={false}>
      <PlaceholderWrapper
        isLoading={isLoading}
        loadingMessage="Retrieving venues"
        showDefaultMessage={venues.length === 0}
        defaultMessage="There are no venues"
        placeholder
        inverted
        withDimmer
      >
        <VenueGallery
          venues={venues}
          displayForm={false}
          onClickVenue={(venue: VenueViewProps) => {
            setBookingRequestData({
              ...bookingRequestData,
              venueId: venue.id,
              venueName: venue.venueFormProps.venueName,
            });
            goToNextStep();
          }}
        />
      </PlaceholderWrapper>
    </StepLayout>
  );
}

export default BookingRequestVenueStep;
