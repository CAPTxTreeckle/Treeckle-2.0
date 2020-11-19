import React, { useEffect } from "react";
import { Tab } from "semantic-ui-react";
import { useGetRecommendedEvents } from "../../custom-hooks/api";
import EventViewOnlyGallery from "../event-view-only-gallery";
import PlaceholderWrapper from "../placeholder-wrapper";

function EventsRecommendationsTabPane() {
  const { isLoading, events, getRecommendedEvents } = useGetRecommendedEvents();

  useEffect(() => {
    getRecommendedEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tab.Pane attached={false}>
      <PlaceholderWrapper
        isLoading={isLoading}
        loadingMessage="Retrieving recommended events"
        showDefaultMessage={events.length === 0}
        defaultMessage="There are no recommended events"
        placeholder
      >
        <EventViewOnlyGallery events={events} />
      </PlaceholderWrapper>
    </Tab.Pane>
  );
}

export default EventsRecommendationsTabPane;
