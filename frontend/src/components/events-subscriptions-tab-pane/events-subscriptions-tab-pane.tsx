import React, { useContext } from "react";
import { Divider, Tab } from "semantic-ui-react";
import { EventSubscriptionsContext } from "../../context-providers";
import EventSubscriptionsSelector from "../event-subscriptions-selector";
import EventViewOnlyGallery from "../event-view-only-gallery";
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
        <EventViewOnlyGallery events={subscribedEvents} />
      </PlaceholderWrapper>
    </Tab.Pane>
  );
}

export default EventsSubscriptionsTabPane;
