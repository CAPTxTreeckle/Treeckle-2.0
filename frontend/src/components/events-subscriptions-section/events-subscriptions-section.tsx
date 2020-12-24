import { useContext } from "react";
import { Divider } from "semantic-ui-react";
import {
  EventSubscriptionsContext,
  EventSubscriptionsProvider,
} from "../../context-providers";
import EventGallery from "../event-gallery";
import EventSubscriptionsSelector from "../event-subscriptions-selector";
import EventViewOnlyGalleryItem from "../event-view-only-gallery-item";
import PlaceholderWrapper from "../placeholder-wrapper";

const EventSubscriptionGallery = () => {
  const {
    isLoadingEventCategories,
    isLoadingSubscribedEvents,
    subscribedEvents,
  } = useContext(EventSubscriptionsContext);

  return (
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
  );
};

function EventsSubscriptionsSection() {
  return (
    <EventSubscriptionsProvider>
      <EventSubscriptionsSelector />

      <Divider />

      <EventSubscriptionGallery />
    </EventSubscriptionsProvider>
  );
}

export default EventsSubscriptionsSection;
