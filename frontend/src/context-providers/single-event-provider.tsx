import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useGetSingleEvent,
  useSignUpForEvent,
  useUpdateSignUpsForEvent,
  useWithdrawFromEvent,
} from "../custom-hooks/api";
import { EventViewProps, SignUpAction } from "../types/events";
import { setAdd, setDelete, setDifference, setUnion } from "../utils/set-utils";
import { UserContext } from "./user-provider";

type SingleEventType = {
  event?: EventViewProps;
  getSingleEvent: () => Promise<EventViewProps | undefined>;
  signUpForEvent: () => Promise<void>;
  withdrawFromEvent: () => Promise<void>;
  updateSignUpsForEvent: (actions: SignUpAction[]) => Promise<boolean>;
  willUpdateUserIds: Set<number>;
};

export const SingleEventContext = React.createContext<SingleEventType>({
  getSingleEvent: () => {
    throw new Error("getSingleEvent is not defined");
  },
  signUpForEvent: () => {
    throw new Error("signUpForEvent is not defined");
  },
  withdrawFromEvent: () => {
    throw new Error("withdrawFromEvent is not defined");
  },
  updateSignUpsForEvent: () => {
    throw new Error("updateSignUpsForEvent is not defined");
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
  const eventId = useMemo(() => event.id, [event.id]);

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
    setWillUpdateUserIds(setAdd(willUpdateUserIds, currentUserId));
    await _signUpForEvent(eventId, getSingleEvent);
    setWillUpdateUserIds(setDelete(willUpdateUserIds, currentUserId));
  }, [
    _signUpForEvent,
    getSingleEvent,
    eventId,
    currentUserId,
    willUpdateUserIds,
  ]);

  const { withdrawFromEvent: _withdrawFromEvent } = useWithdrawFromEvent();

  const withdrawFromEvent = useCallback(async () => {
    setWillUpdateUserIds(setAdd(willUpdateUserIds, currentUserId));
    await _withdrawFromEvent(eventId, getSingleEvent);
    setWillUpdateUserIds(setDelete(willUpdateUserIds, currentUserId));
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
      setWillUpdateUserIds(setUnion(willUpdateUserIds, userIds));
      const result = await _updateSignUpsForEvent(
        eventId,
        actions,
        getSingleEvent,
      );
      setWillUpdateUserIds(setDifference(willUpdateUserIds, userIds));
      return result;
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
