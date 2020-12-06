import React, { useCallback, useEffect, useState } from "react";
import {
  useGetSubscribedEvents,
  useGetSubscriptions,
  useUpdateSubscriptions,
} from "../custom-hooks/api";
import {
  EventViewProps,
  SubscribeAction,
  SubscriptionData,
} from "../types/events";

type EventSubscriptionsContextType = {
  subscribedEvents: EventViewProps[];
  getSubscriptions: () => Promise<SubscriptionData>;
  updateSubscriptions: (
    actions: SubscribeAction[],
  ) => Promise<SubscriptionData>;
  isLoadingSubscribedEvents: boolean;
  isLoadingEventCategories: boolean;
  subscribedCategories: string[];
  notSubscribedCategories: string[];
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
    notSubscribedCategories: [],
  },
);

type Props = {
  children: React.ReactNode;
};

function EventSubscriptionsProvider({ children }: Props) {
  const [subscribedCategories, setSubscribedCategories] = useState<string[]>(
    [],
  );
  const [notSubscribedCategories, setNotSubscribedCategories] = useState<
    string[]
  >([]);

  const {
    events: subscribedEvents,
    getSubscribedEvents,
    isLoading: isLoadingSubscribedEvents,
  } = useGetSubscribedEvents();

  const {
    subscribedCategories: _subscribedCategories,
    notSubscribedCategories: _notSubscribedCategories,
    getSubscriptions: _getSubscriptions,
    isLoading: isLoadingEventCategories,
  } = useGetSubscriptions();

  const getSubscriptions = useCallback(
    () => _getSubscriptions(getSubscribedEvents),
    [_getSubscriptions, getSubscribedEvents],
  );

  useEffect(() => {
    setSubscribedCategories(_subscribedCategories);
    setNotSubscribedCategories(_notSubscribedCategories);
  }, [_subscribedCategories, _notSubscribedCategories]);

  const {
    updateSubscriptions: _updateSubscriptions,
    subscribedCategories: updatedSubscribedCategories,
    notSubscribedCategories: updatedNotSubscribedCategories,
  } = useUpdateSubscriptions();

  const updateSubscriptions = useCallback(
    (actions: SubscribeAction[]) =>
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
        notSubscribedCategories,
      }}
    >
      {children}
    </EventSubscriptionsContext.Provider>
  );
}

export default EventSubscriptionsProvider;
