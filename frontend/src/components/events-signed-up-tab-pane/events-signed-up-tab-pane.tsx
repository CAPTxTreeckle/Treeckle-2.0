import React, { useEffect } from "react";
import { Tab } from "semantic-ui-react";
import { useGetSignedUpEvents } from "../../custom-hooks/api";
import EventViewOnlyGallery from "../event-view-only-gallery";
import PlaceholderWrapper from "../placeholder-wrapper";

function EventsSignedUpTabPane() {
  const { events, isLoading, getSignedUpEvents } = useGetSignedUpEvents();

  useEffect(() => {
    getSignedUpEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tab.Pane attached={false}>
      <PlaceholderWrapper
        isLoading={isLoading}
        loadingMessage="Retrieving signed up events"
        showDefaultMessage={events.length === 0}
        defaultMessage="You have not signed up for any event"
        placeholder
      >
        <EventViewOnlyGallery events={events} />
      </PlaceholderWrapper>
    </Tab.Pane>
  );
}

export default EventsSignedUpTabPane;
