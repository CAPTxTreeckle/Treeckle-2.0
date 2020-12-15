import React, { useEffect } from "react";
import { Segment } from "semantic-ui-react";
import { useGetRecommendedEvents } from "../../custom-hooks/api";
import EventGallery from "../event-gallery";
import EventViewOnlyGalleryItem from "../event-view-only-gallery-item";

import PlaceholderWrapper from "../placeholder-wrapper";

function EventsRecommendationsSection() {
  const { isLoading, events, getRecommendedEvents } = useGetRecommendedEvents();

  useEffect(() => {
    getRecommendedEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Segment>
      <PlaceholderWrapper
        isLoading={isLoading}
        loadingMessage="Retrieving recommended events"
        showDefaultMessage={events.length === 0}
        defaultMessage="There are no recommended events"
        placeholder
      >
        <EventGallery events={events} GalleryItem={EventViewOnlyGalleryItem} />
      </PlaceholderWrapper>
    </Segment>
  );
}

export default EventsRecommendationsSection;
