import React, { useEffect } from "react";
import { useGetSignedUpEvents } from "../../custom-hooks/api";
import EventGallery from "../event-gallery";
import EventViewOnlyGalleryItem from "../event-view-only-gallery-item";
import PlaceholderWrapper from "../placeholder-wrapper";

function EventsSignedUpSection() {
  const { events, isLoading, getSignedUpEvents } = useGetSignedUpEvents();

  useEffect(() => {
    getSignedUpEvents();
  }, [getSignedUpEvents]);

  return (
    <PlaceholderWrapper
      isLoading={isLoading}
      loadingMessage="Retrieving signed up events"
      showDefaultMessage={events.length === 0}
      defaultMessage="You have not signed up for any event"
      placeholder
    >
      <EventGallery events={events} GalleryItem={EventViewOnlyGalleryItem} />
    </PlaceholderWrapper>
  );
}

export default EventsSignedUpSection;
