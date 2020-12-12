import React, { useEffect } from "react";
import { Tab } from "semantic-ui-react";
import { useGetAllEvents } from "../../custom-hooks/api";
import EventGallery from "../event-gallery";
import EventViewOnlyGalleryItem from "../event-view-only-gallery-item";
import PlaceholderWrapper from "../placeholder-wrapper";

function EventsAllTabPane() {
  const { events, isLoading, getAllEvents } = useGetAllEvents();

  useEffect(() => {
    getAllEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tab.Pane attached={false}>
      <PlaceholderWrapper
        isLoading={isLoading}
        loadingMessage="Retrieving all events"
        showDefaultMessage={events.length === 0}
        defaultMessage="There are no events"
        placeholder
      >
        <EventGallery events={events} GalleryItem={EventViewOnlyGalleryItem} />
      </PlaceholderWrapper>
    </Tab.Pane>
  );
}

export default EventsAllTabPane;
