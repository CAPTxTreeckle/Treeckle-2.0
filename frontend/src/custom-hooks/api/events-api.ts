import { useCallback, useMemo, useState } from "react";
import { useAxiosWithTokenRefresh } from "./auth-api";
import {
  EventData,
  EventFormProps,
  EventViewProps,
  EventPostData,
  EventPutData,
  SignUpData,
  EventWithSignUpsData,
  SignUpAction,
  SignUpPatchData,
  EventCategorySubscriptionData,
  EventCategorySubscriptionAction,
} from "../../types/events";
import { errorHandlerWrapper, resolveApiError } from "../../utils/error-utils";

function parseEventFormProps(
  eventFormProps: EventFormProps,
): EventPostData | EventPutData {
  const {
    title,
    organizedBy,
    venueName,
    categories,
    capacity,
    startDateTime,
    endDateTime,
    description,
    image,
    isSignUpAllowed,
    isSignUpApprovalRequired,
    isPublished,
  } = eventFormProps;

  const data: EventPostData | EventPutData = {
    title,
    organizedBy,
    venueName,
    categories,
    capacity: capacity || null,
    startDateTime,
    endDateTime,
    description,
    image,
    isSignUpAllowed,
    isSignUpApprovalRequired,
    isPublished,
  };

  return data;
}

function parseEventData(eventData: EventData): EventViewProps {
  const {
    title,
    organizedBy,
    venueName,
    categories,
    capacity,
    startDateTime,
    endDateTime,
    description,
    image,
    isSignUpAllowed,
    isSignUpApprovalRequired,
    isPublished,
    createdAt,
    updatedAt,
    id,
    signUpCount,
    signUpStatus,
    creator,
  } = eventData;

  const eventFormProps: EventFormProps = {
    title,
    organizedBy,
    venueName,
    categories,
    capacity: capacity ?? "",
    startDateTime,
    endDateTime,
    description,
    image,
    isSignUpAllowed,
    isSignUpApprovalRequired,
    isPublished,
  };

  const eventViewProps: EventViewProps = {
    id,
    createdAt,
    updatedAt,
    creator,
    signUpCount,
    signUpStatus,
    eventFormProps,
  };

  return eventViewProps;
}

function parseEventWithSignUpsData(
  eventWithSignUpsData: EventWithSignUpsData,
): EventViewProps {
  const { event, signUps } = eventWithSignUpsData;

  const eventViewProps: EventViewProps = { ...parseEventData(event), signUps };

  return eventViewProps;
}

export function useGetEventCategories() {
  const [
    { data: eventCategories = [], loading },
    apiCall,
  ] = useAxiosWithTokenRefresh<string[]>(
    {
      url: "/events/categories",
      method: "get",
    },
    { manual: true },
  );

  const getEventCategories = useCallback(async () => {
    try {
      return await errorHandlerWrapper(async () => {
        const { data: eventCategories = [] } = await apiCall();
        console.log("GET /events/categories success:", eventCategories);
        return eventCategories;
      }, "GET /events/categories error:")();
    } catch (error) {
      resolveApiError(error);

      return [];
    }
  }, [apiCall]);

  return { eventCategories, isLoading: loading, getEventCategories };
}

export function useGetAllEvents() {
  const [events, setEvents] = useState<EventViewProps[]>([]);
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventData[]>(
    {
      url: "/events/",
      method: "get",
    },
    { manual: true },
  );

  const getAllEvents = useCallback(async () => {
    try {
      return await errorHandlerWrapper(async () => {
        const { data: events = [] } = await apiCall();
        console.log("GET /events/ success:", events);
        const parsedEvents = events.map((event) => parseEventData(event));
        setEvents(parsedEvents);
        return parsedEvents;
      }, "GET /events/ error:")();
    } catch (error) {
      resolveApiError(error);

      setEvents([]);
      return [];
    }
  }, [apiCall]);

  return { events, isLoading: loading, getAllEvents };
}

export function useGetPublishedEvents() {
  const [events, setEvents] = useState<EventViewProps[]>([]);
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventData[]>(
    {
      url: "/events/published",
      method: "get",
    },
    { manual: true },
  );

  const getPublishedEvents = useCallback(async () => {
    try {
      return await errorHandlerWrapper(async () => {
        const { data: events = [] } = await apiCall();
        console.log("GET /events/published success:", events);
        const parsedEvents = events.map((event) => parseEventData(event));
        setEvents(parsedEvents);
        return parsedEvents;
      }, "GET /events/published error:")();
    } catch (error) {
      resolveApiError(error);

      setEvents([]);
      return [];
    }
  }, [apiCall]);

  return { events, isLoading: loading, getPublishedEvents };
}

export function useGetOwnEvents() {
  const [events, setEvents] = useState<EventViewProps[]>([]);
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventData[]>(
    {
      url: "/events/own",
      method: "get",
    },
    { manual: true },
  );

  const getOwnEvents = useCallback(async () => {
    try {
      return await errorHandlerWrapper(async () => {
        const { data: events = [] } = await apiCall();
        console.log("GET /events/own success:", events);
        const parsedEvents = events.map((event) => parseEventData(event));
        setEvents(parsedEvents);
        return parsedEvents;
      }, "GET /events/own error:")();
    } catch (error) {
      resolveApiError(error);

      setEvents([]);
      return [];
    }
  }, [apiCall]);

  return { events, isLoading: loading, getOwnEvents };
}

export function useGetSignedUpEvents() {
  const [events, setEvents] = useState<EventViewProps[]>([]);
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventData[]>(
    {
      url: "/events/signedup",
      method: "get",
    },
    { manual: true },
  );

  const getSignedUpEvents = useCallback(async () => {
    try {
      return await errorHandlerWrapper(async () => {
        const { data: events = [] } = await apiCall();
        console.log("GET /events/signedup success:", events);
        const parsedEvents = events.map((event) => parseEventData(event));
        setEvents(parsedEvents);
        return parsedEvents;
      }, "GET /events/signedup error:")();
    } catch (error) {
      resolveApiError(error);

      setEvents([]);
      return [];
    }
  }, [apiCall]);

  return { events, isLoading: loading, getSignedUpEvents };
}

export function useCreateEvent() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventData>(
    {
      url: "/events/",
      method: "post",
    },
    { manual: true },
  );

  const createEvent = useMemo(
    () =>
      errorHandlerWrapper(async (eventFormProps: EventFormProps) => {
        const data: EventPostData = parseEventFormProps(eventFormProps);
        console.log("POST /events/ data:", data);
        const { data: event } = await apiCall({
          data,
        });

        console.log("POST /events/ success:", event);

        return event;
      }, "POST /events/ error:"),
    [apiCall],
  );

  return { createEvent, isLoading: loading };
}

export function useDeleteEvent() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh(
    {
      method: "delete",
    },
    { manual: true },
  );

  const deleteEvent = useMemo(
    () =>
      errorHandlerWrapper(async (eventId: number) => {
        const response = await apiCall({
          url: `/events/${eventId}`,
        });
        console.log(`DELETE /events/${eventId} success:`, response);
      }, "DELETE /events/:eventId error:"),
    [apiCall],
  );

  return { deleteEvent, isLoading: loading };
}

export function useGetSingleEvent() {
  const [event, setEvent] = useState<EventViewProps>();
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventWithSignUpsData>(
    {
      method: "get",
    },
    { manual: true },
  );

  const getSingleEvent = useCallback(
    async (eventId: number) => {
      try {
        return await errorHandlerWrapper(async () => {
          const { data: eventWithSignUps } = await apiCall({
            url: `/events/${eventId}`,
          });
          console.log(`GET /events/${eventId} success:`, eventWithSignUps);
          const parsedEvent = parseEventWithSignUpsData(eventWithSignUps);
          setEvent(parsedEvent);
          return parsedEvent;
        }, `GET /events/${eventId} error:`)();
      } catch (error) {
        resolveApiError(error);

        setEvent(undefined);
        return undefined;
      }
    },
    [apiCall],
  );

  return { event, isLoading: loading, getSingleEvent };
}

export function useUpdateEvent() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventData>(
    {
      method: "put",
    },
    { manual: true },
  );

  const updateEvent = useMemo(
    () =>
      errorHandlerWrapper(
        async (eventId: number, eventFormProps: EventFormProps) => {
          const data: EventPutData = parseEventFormProps(eventFormProps);
          const { data: event } = await apiCall({
            url: `/events/${eventId}`,
            data,
          });
          console.log(`PUT /events/${eventId} success:`, event);

          return event;
        },
        "PUT /events/:eventId error:",
      ),
    [apiCall],
  );

  return { updateEvent, isLoading: loading };
}

export function useSignUpForEvent() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<SignUpData>(
    {
      method: "post",
    },
    { manual: true },
  );

  const signUpForEvent = useMemo(
    () =>
      errorHandlerWrapper(async (eventId: number) => {
        const { data: signUp } = await apiCall({
          url: `/events/${eventId}/selfsignup`,
        });
        console.log(`POST /events/${eventId}/selfsignup success:`, signUp);

        return signUp;
      }, "POST /events/:eventId/selfsignup error:"),
    [apiCall],
  );

  return { signUpForEvent, isLoading: loading };
}

export function useWithdrawFromEvent() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh(
    {
      method: "delete",
    },
    { manual: true },
  );

  const withdrawFromEvent = useMemo(
    () =>
      errorHandlerWrapper(async (eventId: number) => {
        const response = await apiCall({
          url: `/events/${eventId}/selfsignup`,
        });
        console.log(`DELETE /events/${eventId}/selfsignup success:`, response);
      }, "DELETE /events/:eventId/selfsignup error:"),
    [apiCall],
  );

  return { withdrawFromEvent, isLoading: loading };
}

export function useAttendEvent() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<SignUpData>(
    {
      method: "patch",
    },
    { manual: true },
  );

  const attendEvent = useMemo(
    () =>
      errorHandlerWrapper(async (eventId: number) => {
        const { data: signUp } = await apiCall({
          url: `/events/${eventId}/selfsignup`,
        });
        console.log(`PATCH /events/${eventId}/selfsignup success:`, signUp);
        return signUp;
      }, "PATCH /events/:eventId/selfsignup error:"),
    [apiCall],
  );

  return { attendEvent, isLoading: loading };
}

export function useUpdateSignUpsForEvent() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<SignUpData[]>(
    {
      method: "patch",
    },
    { manual: true },
  );

  const updateSignUpsForEvent = useMemo(
    () =>
      errorHandlerWrapper(async (eventId: number, actions: SignUpAction[]) => {
        const data: SignUpPatchData = { actions };
        const { data: signUps = [] } = await apiCall({
          url: `/events/${eventId}/signup`,
          data,
        });
        console.log(`PATCH /events/${eventId}/signup success:`, signUps);

        return signUps;
      }, "PATCH /events/:eventId/signup error:"),
    [apiCall],
  );

  return { updateSignUpsForEvent, isLoading: loading };
}

export function useGetRecommendedEvents() {
  const [events, setEvents] = useState<EventViewProps[]>([]);
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventData[]>(
    {
      url: "/events/recommended",
      method: "get",
    },
    { manual: true },
  );

  const getRecommendedEvents = useCallback(async () => {
    try {
      return await errorHandlerWrapper(async () => {
        const { data: events = [] } = await apiCall();
        console.log("GET /events/recommended success:", events);
        const parsedEvents = events.map((event) => parseEventData(event));
        setEvents(parsedEvents);
        return parsedEvents;
      }, "GET /events/recommended error:")();
    } catch (error) {
      resolveApiError(error);

      return [];
    }
  }, [apiCall]);

  return { events, isLoading: loading, getRecommendedEvents };
}

export function useGetEventCategorySubscriptions() {
  const [subscribedCategories, setSubscribedCategories] = useState<string[]>(
    [],
  );
  const [nonSubscribedCategories, setNonSubscribedCategories] = useState<
    string[]
  >([]);
  const [
    { loading },
    apiCall,
  ] = useAxiosWithTokenRefresh<EventCategorySubscriptionData>(
    {
      url: "/events/categories/subscriptions",
      method: "get",
    },
    { manual: true },
  );

  const getEventCategorySubscriptions = useCallback(async () => {
    try {
      return await errorHandlerWrapper(async () => {
        const {
          data: eventCategorySubscriptions = {
            subscribedCategories: [],
            nonSubscribedCategories: [],
          },
        } = await apiCall();
        console.log(
          "GET /events/categories/subscriptions success:",
          eventCategorySubscriptions,
        );

        setSubscribedCategories(
          eventCategorySubscriptions.subscribedCategories,
        );
        setNonSubscribedCategories(
          eventCategorySubscriptions.nonSubscribedCategories,
        );

        return eventCategorySubscriptions;
      }, "GET /events/categories/subscriptions error:")();
    } catch (error) {
      resolveApiError(error);

      return { subscribedCategories: [], nonSubscribedCategories: [] };
    }
  }, [apiCall]);

  return {
    subscribedCategories,
    nonSubscribedCategories,
    isLoading: loading,
    getEventCategorySubscriptions,
  };
}

export function useGetSubscribedEvents() {
  const [events, setEvents] = useState<EventViewProps[]>([]);
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventData[]>(
    {
      url: "/events/subscribed",
      method: "get",
    },
    { manual: true },
  );

  const getSubscribedEvents = useCallback(async () => {
    try {
      return await errorHandlerWrapper(async () => {
        const { data: events = [] } = await apiCall();
        console.log("GET /events/subscribed success:", events);
        const parsedEvents = events.map((event) => parseEventData(event));
        setEvents(parsedEvents);
        return parsedEvents;
      }, "GET /events/subscribed error:")();
    } catch (error) {
      resolveApiError(error);

      setEvents([]);
      return [];
    }
  }, [apiCall]);

  return { events, isLoading: loading, getSubscribedEvents };
}

export function useUpdateEventCategorySubscriptions() {
  const [subscribedCategories, setSubscribedCategories] = useState<string[]>(
    [],
  );
  const [nonSubscribedCategories, setNonSubscribedCategories] = useState<
    string[]
  >([]);
  const [
    { loading },
    apiCall,
  ] = useAxiosWithTokenRefresh<EventCategorySubscriptionData>(
    {
      url: "/events/categories/subscriptions",
      method: "patch",
    },
    { manual: true },
  );

  const updateEventCategorySubscriptions = useMemo(
    () =>
      errorHandlerWrapper(
        async (actions: EventCategorySubscriptionAction[]) => {
          const {
            data: eventCategorySubscriptions = {
              subscribedCategories: [],
              nonSubscribedCategories: [],
            },
          } = await apiCall({ data: { actions } });
          console.log(
            "PATCH /events/categories/subscriptions success:",
            eventCategorySubscriptions,
          );

          setSubscribedCategories(
            eventCategorySubscriptions.subscribedCategories,
          );
          setNonSubscribedCategories(
            eventCategorySubscriptions.nonSubscribedCategories,
          );

          return eventCategorySubscriptions;
        },
        "PATCH /events/categories/subscriptions error:",
      ),
    [apiCall],
  );

  return {
    subscribedCategories,
    nonSubscribedCategories,
    isLoading: loading,
    updateEventCategorySubscriptions,
  };
}
