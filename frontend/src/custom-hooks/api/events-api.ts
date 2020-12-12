import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useAxiosWithTokenRefresh } from ".";
import {
  EventData,
  EventFormProps,
  EventViewProps,
  EventPostData,
  EventPutData,
  SignUpData,
  SignUpStatus,
  EventWithSignUpsData,
  SignUpAction,
  SignUpPatchData,
  EventCategorySubscriptionData,
  EventCategorySubscriptionAction,
} from "../../types/events";
import { defaultArray } from "./default";

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
    { data: eventCategories = defaultArray as string[], loading },
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
      const { data: eventCategories = [] } = await apiCall();
      console.log("GET /events/categories success:", eventCategories);
      return eventCategories;
    } catch (error) {
      console.log("GET /events/categories error:", error, error?.response);
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
      const { data: events = [] } = await apiCall();
      console.log("GET /events/ success:", events);
      const parsedEvents = events.map((event) => parseEventData(event));
      setEvents(parsedEvents);
      return parsedEvents;
    } catch (error) {
      console.log("GET /events/ error:", error, error?.response);
      return [];
    }
  }, [apiCall]);

  return { events, isLoading: loading, getAllEvents };
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
      const { data: events = [] } = await apiCall();
      console.log("GET /events/own success:", events);
      const parsedEvents = events.map((event) => parseEventData(event));
      setEvents(parsedEvents);
      return parsedEvents;
    } catch (error) {
      console.log("GET /events/own error:", error, error?.response);
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
      const { data: events = [] } = await apiCall();
      console.log("GET /events/signedup success:", events);
      const parsedEvents = events.map((event) => parseEventData(event));
      setEvents(parsedEvents);
      return parsedEvents;
    } catch (error) {
      console.log("GET /events/signedup error:", error, error?.response);
      return [];
    }
  }, [apiCall]);

  return { events, isLoading: loading, getSignedUpEvents };
}

export function useCreateEvent() {
  const history = useHistory();

  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventData>(
    {
      url: "/events/",
      method: "post",
    },
    { manual: true },
  );

  const createEvent = useCallback(
    async (eventFormProps: EventFormProps, redirectPath?: string) => {
      try {
        const data: EventPostData = parseEventFormProps(eventFormProps);
        console.log("POST /events/ data:", data);
        const { data: event } = await apiCall({
          data,
        });

        console.log("POST /events/ success:", event);
        toast.success("A new event has been created successfully.");
        redirectPath && history.push(redirectPath);
        return true;
      } catch (error) {
        console.log("POST /events/ error:", error, error?.response);
        toast.error("An unknown error has occurred.");
        return false;
      }
    },
    [apiCall, history],
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

  const deleteEvent = useCallback(
    async (id: number, onSuccess?: () => Promise<unknown> | unknown) => {
      try {
        const response = await apiCall({
          url: `/events/${id}`,
        });
        console.log(`DELETE /events/${id} success:`, response);
        onSuccess?.();
        toast.success("The event has been deleted successfully.");
        return true;
      } catch (error) {
        console.log(`DELETE /events/${id} error:`, error, error?.response);
        toast.error("An unknown error has occurred.");
        return false;
      }
    },
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
    async (id: number) => {
      try {
        const { data: eventWithSignUpsData } = await apiCall({
          url: `/events/${id}`,
        });
        console.log(`GET /events/${id} success:`, eventWithSignUpsData);
        const parsedEvent = parseEventWithSignUpsData(eventWithSignUpsData);
        setEvent(parsedEvent);
        return parsedEvent;
      } catch (error) {
        console.log(`GET /events/${id} error:`, error, error?.response);
        setEvent(undefined);
      }
    },
    [apiCall],
  );

  return { event, isLoading: loading, getSingleEvent };
}

export function useUpdateEvent() {
  const history = useHistory();
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventData>(
    {
      method: "put",
    },
    { manual: true },
  );

  const updateEvent = useCallback(
    async (
      id: number,
      eventFormProps: EventFormProps,
      redirectPath?: string,
    ) => {
      try {
        const data: EventPutData = parseEventFormProps(eventFormProps);
        const { data: event } = await apiCall({
          url: `/events/${id}`,
          data,
        });
        console.log(`PUT /events/${id} success:`, event);
        toast.success("The event has been updated successfully.");
        redirectPath && history.push(redirectPath);
        return true;
      } catch (error) {
        console.log(`PUT /events/${id} error:`, error, error?.response);
        toast.error("An unknown error has occurred.");
        return false;
      }
    },
    [apiCall, history],
  );

  return { updateEvent, isLoading: loading };
}

export function useSignUpForEvent() {
  const [, apiCall] = useAxiosWithTokenRefresh<SignUpData>(
    {
      method: "post",
    },
    { manual: true },
  );
  const [isLoading, setLoading] = useState(false);

  const signUpForEvent = useCallback(
    async (id: number, onSuccess?: () => Promise<unknown> | unknown) => {
      try {
        setLoading(true);
        const { data: signUpData } = await apiCall({
          url: `/events/${id}/self_sign_up`,
        });
        console.log(`POST /events/${id}/self_sign_up success:`, signUpData);
        await onSuccess?.();
        const { status } = signUpData;

        if (status === SignUpStatus.Pending) {
          toast.info("You have requested to sign up for the event.");
        } else {
          toast.success("You have successfully signed up for the event.");
        }
      } catch (error) {
        console.log(
          `POST /events/${id}/self_sign_up error:`,
          error,
          error?.response,
        );
        toast.error("An unknown error has occurred.");
      } finally {
        setLoading(false);
      }
    },
    [apiCall],
  );

  return { signUpForEvent, isLoading };
}

export function useWithdrawFromEvent() {
  const [, apiCall] = useAxiosWithTokenRefresh(
    {
      method: "delete",
    },
    { manual: true },
  );
  const [isLoading, setLoading] = useState(false);

  const withdrawFromEvent = useCallback(
    async (id: number, onSuccess?: () => Promise<unknown> | unknown) => {
      try {
        setLoading(true);
        const response = await apiCall({ url: `/events/${id}/self_sign_up` });
        console.log(`DELETE /events/${id}/self_sign_up success:`, response);
        await onSuccess?.();
        toast.success("You have successfully withdrawn from the event.");
      } catch (error) {
        console.log(
          `DELETE /events/${id}/self_sign_up error:`,
          error,
          error?.response,
        );
        toast.error("An unknown error has occurred.");
      } finally {
        setLoading(false);
      }
    },
    [apiCall],
  );

  return { withdrawFromEvent, isLoading };
}

export function useAttendEvent() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh(
    {
      method: "patch",
    },
    { manual: true },
  );

  const attendEvent = useCallback(
    async (id: number, onSuccess?: () => Promise<unknown> | unknown) => {
      try {
        const response = await apiCall({ url: `/events/${id}/self_sign_up` });
        console.log(`PATCH /events/${id}/self_sign_up success:`, response);
        onSuccess?.();
        toast.success("Your attendance for the event has been recorded.", {
          position: "top-center",
        });
      } catch (error) {
        console.log(
          `PATCH /events/${id}/self_sign_up error:`,
          error,
          error?.response,
        );
        toast.error("Your attendance for the event cannot be recorded.", {
          position: "top-center",
        });
      }
    },
    [apiCall],
  );

  return { attendEvent, isLoading: loading };
}

export function useUpdateSignUpsForEvent() {
  const [, apiCall] = useAxiosWithTokenRefresh(
    {
      method: "patch",
    },
    { manual: true },
  );
  const [isLoading, setLoading] = useState(false);

  const updateSignUpsForEvent = useCallback(
    async (
      eventId: number,
      actions: SignUpAction[],
      onSuccess?: () => Promise<unknown> | unknown,
    ) => {
      try {
        setLoading(true);
        const data: SignUpPatchData = { actions };
        const response = await apiCall({
          url: `/events/${eventId}/sign_up`,
          data,
        });
        console.log(`PATCH /events/${eventId}/sign_up success:`, response);
        await onSuccess?.();
        toast.success("Event sign-ups updated successfully.");
        return true;
      } catch (error) {
        console.log(
          `PATCH /events/${eventId}/sign_up error:`,
          error,
          error?.response,
        );
        toast.error("An unknown error has occurred.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [apiCall],
  );

  return { updateSignUpsForEvent, isLoading };
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
      const { data: events = [] } = await apiCall();
      console.log("GET /events/recommended success:", events);
      const parsedEvents = events.map((event) => parseEventData(event));
      setEvents(parsedEvents);
      return parsedEvents;
    } catch (error) {
      console.log("GET /events/recommended error:", error, error?.response);
      return [];
    }
  }, [apiCall]);

  return { events, isLoading: loading, getRecommendedEvents };
}

export function useGetSubscriptions() {
  const [
    {
      data: {
        subscribedCategories = defaultArray as string[],
        nonSubscribedCategories = defaultArray as string[],
      } = {},
      loading,
    },
    apiCall,
  ] = useAxiosWithTokenRefresh<EventCategorySubscriptionData>(
    {
      url: "/events/categories/subscriptions",
      method: "get",
    },
    { manual: true },
  );

  const getSubscriptions = useCallback(
    async (onSuccess?: () => Promise<unknown> | unknown) => {
      try {
        const {
          data: subscriptions = {
            subscribedCategories: [],
            nonSubscribedCategories: [],
          },
        } = await apiCall();
        console.log(
          "GET /events/categories/subscriptions success:",
          subscriptions,
        );
        onSuccess?.();
        return subscriptions;
      } catch (error) {
        console.log(
          "GET /events/categories/subscriptions error:",
          error,
          error?.response,
        );
        return { subscribedCategories: [], nonSubscribedCategories: [] };
      }
    },
    [apiCall],
  );

  return {
    subscribedCategories,
    nonSubscribedCategories,
    isLoading: loading,
    getSubscriptions,
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
      const { data: events = [] } = await apiCall();
      console.log("GET /events/subscribed success:", events);
      const parsedEvents = events.map((event) => parseEventData(event));
      setEvents(parsedEvents);
      return parsedEvents;
    } catch (error) {
      console.log("GET /events/subscribed error:", error, error?.response);
      return [];
    }
  }, [apiCall]);

  return { events, isLoading: loading, getSubscribedEvents };
}

export function useUpdateSubscriptions() {
  const [
    {
      data: {
        subscribedCategories = defaultArray as string[],
        nonSubscribedCategories = defaultArray as string[],
      } = {},
      loading,
    },
    apiCall,
  ] = useAxiosWithTokenRefresh<EventCategorySubscriptionData>(
    {
      url: "/events/categories/subscriptions",
      method: "patch",
    },
    { manual: true },
  );

  const updateSubscriptions = useCallback(
    async (
      actions: EventCategorySubscriptionAction[],
      onSuccess?: () => Promise<unknown> | unknown,
    ) => {
      try {
        const {
          data: subscriptions = {
            subscribedCategories: [],
            nonSubscribedCategories: [],
          },
        } = await apiCall({ data: { actions } });
        console.log(
          "PATCH /events/categories/subscriptions success:",
          subscriptions,
        );
        onSuccess?.();
        return subscriptions;
      } catch (error) {
        console.log(
          "PATCH /events/categories/subscriptions error:",
          error,
          error?.response,
        );
        return { subscribedCategories: [], nonSubscribedCategories: [] };
      }
    },
    [apiCall],
  );

  return {
    subscribedCategories,
    nonSubscribedCategories,
    isLoading: loading,
    updateSubscriptions,
  };
}
