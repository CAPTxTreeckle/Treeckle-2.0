import React, { useEffect } from "react";
import { Segment } from "semantic-ui-react";
import { useGetAllEvents } from "../../custom-hooks/api";
import EventGallery from "../event-gallery";
import EventViewOnlyGalleryItem from "../event-view-only-gallery-item";
import PlaceholderWrapper from "../placeholder-wrapper";

function EventsAllSection() {
  const { events, isLoading, getAllEvents } = useGetAllEvents();

  useEffect(() => {
    getAllEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Segment raised>
      <PlaceholderWrapper
        isLoading={isLoading}
        loadingMessage="Retrieving all events"
        showDefaultMessage={events.length === 0}
        defaultMessage="There are no events"
        placeholder
      >
        <EventGallery events={events} GalleryItem={EventViewOnlyGalleryItem} />
      </PlaceholderWrapper>
    </Segment>
  );
}

export default EventsAllSection;
