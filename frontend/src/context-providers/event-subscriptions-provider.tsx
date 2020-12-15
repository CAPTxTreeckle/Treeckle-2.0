import React, { useCallback, useEffect, useState } from "react";
import {
  useGetSubscribedEvents,
  useGetEventCategorySubscriptions,
  useUpdateEventCategorySubscriptions,
} from "../custom-hooks/api";
import {
  EventViewProps,
  EventCategorySubscriptionAction,
  EventCategorySubscriptionData,
} from "../types/events";
import { resolveApiError } from "../utils/error-utils";

type EventSubscriptionsContextType = {
  subscribedEvents: EventViewProps[];
  getEventCategorySubscriptions: () => Promise<EventCategorySubscriptionData>;
  updateEventCategorySubscriptions: (
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
    getEventCategorySubscriptions: () => {
      throw new Error("getEventCategorySubscriptions not defined.");
    },
    updateEventCategorySubscriptions: () => {
      throw new Error("updateEventCategorySubscriptions not defined.");
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
    getEventCategorySubscriptions: _getEventCategorySubscriptions,
    isLoading: isLoadingEventCategories,
  } = useGetEventCategorySubscriptions();

  const getEventCategorySubscriptions = useCallback(async () => {
    const eventCategorySubscriptions = await _getEventCategorySubscriptions();
    getSubscribedEvents();
    return eventCategorySubscriptions;
  }, [_getEventCategorySubscriptions, getSubscribedEvents]);

  useEffect(() => {
    setSubscribedCategories(_subscribedCategories);
    setNotSubscribedCategories(_nonSubscribedCategories);
  }, [_subscribedCategories, _nonSubscribedCategories]);

  const {
    updateEventCategorySubscriptions: _updateEventCategorySubscriptions,
    subscribedCategories: updatedSubscribedCategories,
    nonSubscribedCategories: updatedNotSubscribedCategories,
  } = useUpdateEventCategorySubscriptions();

  const updateEventCategorySubscriptions = useCallback(
    async (actions: EventCategorySubscriptionAction[]) => {
      try {
        const eventCategorySubscriptions = await _updateEventCategorySubscriptions(
          actions,
        );
        getSubscribedEvents();
        return eventCategorySubscriptions;
      } catch (error) {
        resolveApiError(error);
        return { subscribedCategories: [], nonSubscribedCategories: [] };
      }
    },
    [_updateEventCategorySubscriptions, getSubscribedEvents],
  );

  useEffect(() => {
    setSubscribedCategories(updatedSubscribedCategories);
    setNotSubscribedCategories(updatedNotSubscribedCategories);
  }, [updatedSubscribedCategories, updatedNotSubscribedCategories]);

  return (
    <EventSubscriptionsContext.Provider
      value={{
        subscribedEvents,
        getEventCategorySubscriptions,
        updateEventCategorySubscriptions,
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
