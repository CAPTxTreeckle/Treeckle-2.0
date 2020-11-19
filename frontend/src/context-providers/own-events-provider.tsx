import React from "react";
import { useGetOwnEvents } from "../custom-hooks/api";
import { EventViewProps } from "../types/events";

type OwnEventsContextType = {
  ownEvents: EventViewProps[];
  getOwnEvents: () => Promise<EventViewProps[]>;
  isLoading: boolean;
};

export const OwnEventsContext = React.createContext<OwnEventsContextType>({
  ownEvents: [],
  getOwnEvents: () => {
    throw new Error("getOwnEvents not defined");
  },
  isLoading: false,
});

type Props = {
  children: React.ReactNode;
};

function EventsProvider({ children }: Props) {
  const { events: ownEvents, isLoading, getOwnEvents } = useGetOwnEvents();

  return (
    <OwnEventsContext.Provider value={{ ownEvents, isLoading, getOwnEvents }}>
      {children}
    </OwnEventsContext.Provider>
  );
}

export default EventsProvider;
