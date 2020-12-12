import React, { useCallback, useEffect, useState } from "react";
import {
  useGetSubscribedEvents,
  useGetSubscriptions,
  useUpdateSubscriptions,
} from "../custom-hooks/api";
import {
  EventViewProps,
  EventCategorySubscriptionAction,
  EventCategorySubscriptionData,
} from "../types/events";

type EventSubscriptionsContextType = {
  subscribedEvents: EventViewProps[];
  getSubscriptions: () => Promise<EventCategorySubscriptionData>;
  updateSubscriptions: (
    actions: EventCategorySubscriptionAction[],
  ) => Promise<EventCategorySubscriptionData>;
  isLoadingSubscribedEvents: boolean;
  isLoadingEventCategories: boolean;
  subscribedCategories: string[];
  nonSubscribedCategories: string[];
};

export const EventSubscriptionsContext = React.createContext<EventSubscriptionsContextType>(
  {
    subscribedEvents: [],
    getSubscriptions: () => {
      throw new Error("getSubcriptions not defined.");
    },
    updateSubscriptions: () => {
      throw new Error("updateSubscriptions not defined.");
    },
    isLoadingSubscribedEvents: false,
    isLoadingEventCategories: false,
    subscribedCategories: [],
    nonSubscribedCategories: [],
  },
);

type Props = {
  children: React.ReactNode;
};

function EventSubscriptionsProvider({ children }: Props) {
  const [subscribedCategories, setSubscribedCategories] = useState<string[]>(
    [],
  );
  const [nonSubscribedCategories, setNotSubscribedCategories] = useState<
    string[]
  >([]);

  const {
    events: subscribedEvents,
    getSubscribedEvents,
    isLoading: isLoadingSubscribedEvents,
  } = useGetSubscribedEvents();

  const {
    subscribedCategories: _subscribedCategories,
    nonSubscribedCategories: _nonSubscribedCategories,
    getSubscriptions: _getSubscriptions,
    isLoading: isLoadingEventCategories,
  } = useGetSubscriptions();

  const getSubscriptions = useCallback(
    () => _getSubscriptions(getSubscribedEvents),
    [_getSubscriptions, getSubscribedEvents],
  );

  useEffect(() => {
    setSubscribedCategories(_subscribedCategories);
    setNotSubscribedCategories(_nonSubscribedCategories);
  }, [_subscribedCategories, _nonSubscribedCategories]);

  const {
    updateSubscriptions: _updateSubscriptions,
    subscribedCategories: updatedSubscribedCategories,
    nonSubscribedCategories: updatedNotSubscribedCategories,
  } = useUpdateSubscriptions();

  const updateSubscriptions = useCallback(
    (actions: EventCategorySubscriptionAction[]) =>
      _updateSubscriptions(actions, getSubscribedEvents),
    [_updateSubscriptions, getSubscribedEvents],
  );

  useEffect(() => {
    setSubscribedCategories(updatedSubscribedCategories);
    setNotSubscribedCategories(updatedNotSubscribedCategories);
  }, [updatedSubscribedCategories, updatedNotSubscribedCategories]);

  return (
    <EventSubscriptionsContext.Provider
      value={{
        subscribedEvents,
        getSubscriptions,
        updateSubscriptions,
        isLoadingSubscribedEvents,
        isLoadingEventCategories,
        subscribedCategories,
        nonSubscribedCategories,
      }}
    >
      {children}
    </EventSubscriptionsContext.Provider>
  );
}

export default EventSubscriptionsProvider;
