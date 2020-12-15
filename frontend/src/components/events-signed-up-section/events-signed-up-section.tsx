import React, { useEffect } from "react";
import { Segment } from "semantic-ui-react";
import { useGetSignedUpEvents } from "../../custom-hooks/api";
import EventGallery from "../event-gallery";
import EventViewOnlyGalleryItem from "../event-view-only-gallery-item";
import PlaceholderWrapper from "../placeholder-wrapper";

function EventsSignedUpSection() {
  const { events, isLoading, getSignedUpEvents } = useGetSignedUpEvents();

  useEffect(() => {
    getSignedUpEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Segment>
      <PlaceholderWrapper
        isLoading={isLoading}
        loadingMessage="Retrieving signed up events"
        showDefaultMessage={events.length === 0}
        defaultMessage="You have not signed up for any event"
        placeholder
      >
        <EventGallery events={events} GalleryItem={EventViewOnlyGalleryItem} />
      </PlaceholderWrapper>
    </Segment>
  );
}

export default EventsSignedUpSection;
