import { useEffect } from "react";
import { useGetPublishedEvents } from "../../custom-hooks/api";
import EventGallery from "../event-gallery";
import EventViewOnlyGalleryItem from "../event-view-only-gallery-item";
import PlaceholderWrapper from "../placeholder-wrapper";

function EventsAllSection() {
  const { events, isLoading, getPublishedEvents } = useGetPublishedEvents();

  useEffect(() => {
    getPublishedEvents();
  }, [getPublishedEvents]);

  return (
    <PlaceholderWrapper
      isLoading={isLoading}
      loadingMessage="Retrieving all events"
      showDefaultMessage={events.length === 0}
      defaultMessage="There are no events"
      placeholder
    >
      <EventGallery events={events} GalleryItem={EventViewOnlyGalleryItem} />
    </PlaceholderWrapper>
  );
}

export default EventsAllSection;
