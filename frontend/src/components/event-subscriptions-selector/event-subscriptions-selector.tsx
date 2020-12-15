import React, { useContext, useEffect } from "react";
import { Label } from "semantic-ui-react";
import { EventSubscriptionsContext } from "../../context-providers";
import { SubscriptionActionType } from "../../types/events";
import EventSubscriptionLabel from "../event-subscription-label";
import PlaceholderWrapper from "../placeholder-wrapper";

function EventSubscriptionsSelector() {
  const {
    isLoadingEventCategories,
    subscribedCategories,
    nonSubscribedCategories,
    getEventCategorySubscriptions,
  } = useContext(EventSubscriptionsContext);

  useEffect(() => {
    getEventCategorySubscriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h2>Available Categories</h2>
      <PlaceholderWrapper
        isLoading={isLoadingEventCategories}
        loadingMessage="Retrieving available categories"
        defaultMessage="There are no available categories"
        showDefaultMessage={nonSubscribedCategories.length === 0}
      >
        <Label.Group>
          {nonSubscribedCategories.map((category: string) => (
            <EventSubscriptionLabel
              key={category}
              category={category}
              color="blue"
              actionType={SubscriptionActionType.Subscribe}
            />
          ))}
        </Label.Group>
      </PlaceholderWrapper>

      <h2>Subscribed Categories</h2>
      <PlaceholderWrapper
        isLoading={isLoadingEventCategories}
        loadingMessage="Retrieving subscribed categories"
        defaultMessage="You have not subscribed to any category"
        showDefaultMessage={subscribedCategories.length === 0}
      >
        <Label.Group>
          {subscribedCategories.map((category: string) => (
            <EventSubscriptionLabel
              key={category}
              category={category}
              color="purple"
              actionType={SubscriptionActionType.Unsubscribe}
            />
          ))}
        </Label.Group>
      </PlaceholderWrapper>
    </>
  );
}

export default EventSubscriptionsSelector;
