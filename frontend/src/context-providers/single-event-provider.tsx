import React, { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useGetSingleEvent,
  useSignUpForEvent,
  useUpdateSignUpsForEvent,
  useWithdrawFromEvent,
} from "../custom-hooks/api";
import {
  EventViewProps,
  SignUpAction,
  SignUpData,
  SignUpStatus,
} from "../types/events";
import { resolveApiError } from "../utils/error-utils";
import { setAdd, setDelete, setDifference, setUnion } from "../utils/set-utils";
import { UserContext } from "./user-provider";

type SingleEventType = {
  event?: EventViewProps;
  getSingleEvent: () => Promise<EventViewProps | undefined>;
  signUpForEvent: () => Promise<SignUpData | undefined>;
  withdrawFromEvent: () => Promise<void>;
  updateSignUpsForEvent: (actions: SignUpAction[]) => Promise<void>;
  willUpdateUserIds: Set<number>;
};

export const SingleEventContext = React.createContext<SingleEventType>({
  getSingleEvent: () => {
    throw new Error("getSingleEvent is not defined.");
  },
  signUpForEvent: () => {
    throw new Error("signUpForEvent is not defined.");
  },
  withdrawFromEvent: () => {
    throw new Error("withdrawFromEvent is not defined.");
  },
  updateSignUpsForEvent: () => {
    throw new Error("updateSignUpsForEvent is not defined.");
  },
  willUpdateUserIds: new Set(),
});

type Props = {
  children: React.ReactNode;
  eventViewProps: EventViewProps;
};

function SingleEventProvider({ children, eventViewProps }: Props) {
  const { id: currentUserId = 0 } = useContext(UserContext);
  const [event, setEvent] = useState(eventViewProps);
  const [willUpdateUserIds, setWillUpdateUserIds] = useState<Set<number>>(
    new Set(),
  );
  const eventId = event.id;

  useEffect(() => {
    setEvent(eventViewProps);
  }, [eventViewProps]);

  const {
    event: _event,
    getSingleEvent: _getSingleEvent,
  } = useGetSingleEvent();

  useEffect(() => {
    if (!_event) {
      return;
    }
    setEvent(_event);
  }, [_event]);

  const getSingleEvent = useCallback(() => _getSingleEvent(eventId), [
    eventId,
    _getSingleEvent,
  ]);

  const { signUpForEvent: _signUpForEvent } = useSignUpForEvent();

  const signUpForEvent = useCallback(async () => {
    try {
      setWillUpdateUserIds(setAdd(willUpdateUserIds, currentUserId));

      const signUpData = await _signUpForEvent(eventId);
      await getSingleEvent();

      const { status } = signUpData;
      toast.success(
        status === SignUpStatus.Pending
          ? "You have requested to sign up for the event."
          : "You have successfully signed up for the event.",
      );
      return signUpData;
    } catch (error) {
      resolveApiError(error);
      return undefined;
    } finally {
      setWillUpdateUserIds(setDelete(willUpdateUserIds, currentUserId));
    }
  }, [
    _signUpForEvent,
    getSingleEvent,
    eventId,
    currentUserId,
    willUpdateUserIds,
  ]);

  const { withdrawFromEvent: _withdrawFromEvent } = useWithdrawFromEvent();

  const withdrawFromEvent = useCallback(async () => {
    try {
      setWillUpdateUserIds(setAdd(willUpdateUserIds, currentUserId));

      await _withdrawFromEvent(eventId);
      await getSingleEvent();

      toast.success("You have successfully withdrawn from the event.");
    } catch (error) {
      resolveApiError(error);
    } finally {
      setWillUpdateUserIds(setDelete(willUpdateUserIds, currentUserId));
    }
  }, [
    _withdrawFromEvent,
    getSingleEvent,
    eventId,
    currentUserId,
    willUpdateUserIds,
  ]);

  const {
    updateSignUpsForEvent: _updateSignUpsForEvent,
  } = useUpdateSignUpsForEvent();

  const updateSignUpsForEvent = useCallback(
    async (actions: SignUpAction[]) => {
      const userIds = new Set(actions.map(({ userId }) => userId));
      try {
        setWillUpdateUserIds(setUnion(willUpdateUserIds, userIds));

        await _updateSignUpsForEvent(eventId, actions);
        await getSingleEvent();

        toast.success("Event sign-ups updated successfully.");
      } catch (error) {
        resolveApiError(error);
      } finally {
        setWillUpdateUserIds(setDifference(willUpdateUserIds, userIds));
      }
    },
    [_updateSignUpsForEvent, getSingleEvent, eventId, willUpdateUserIds],
  );

  return (
    <SingleEventContext.Provider
      value={{
        event,
        getSingleEvent,
        signUpForEvent,
        withdrawFromEvent,
        updateSignUpsForEvent,
        willUpdateUserIds,
      }}
    >
      {children}
    </SingleEventContext.Provider>
  );
}

export default SingleEventProvider;
