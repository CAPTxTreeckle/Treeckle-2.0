import React, { useContext } from "react";
import { Divider, Tab } from "semantic-ui-react";
import { EventSubscriptionsContext } from "../../context-providers";
import EventGallery from "../event-gallery";
import EventSubscriptionsSelector from "../event-subscriptions-selector";
import EventViewOnlyGalleryItem from "../event-view-only-gallery-item";
import PlaceholderWrapper from "../placeholder-wrapper";

function EventsSubscriptionsTabPane() {
  const {
    isLoadingEventCategories,
    isLoadingSubscribedEvents,
    subscribedEvents,
  } = useContext(EventSubscriptionsContext);

  return (
    <Tab.Pane attached={false}>
      <EventSubscriptionsSelector />

      <Divider />

      <PlaceholderWrapper
        isLoading={isLoadingSubscribedEvents || isLoadingEventCategories}
        loadingMessage="Retrieving subscribed events"
        showDefaultMessage={subscribedEvents.length === 0}
        defaultMessage="There are no subscribed events"
        placeholder
      >
        <EventGallery
          events={subscribedEvents}
          GalleryItem={EventViewOnlyGalleryItem}
        />
      </PlaceholderWrapper>
    </Tab.Pane>
  );
}

export default EventsSubscriptionsTabPane;
