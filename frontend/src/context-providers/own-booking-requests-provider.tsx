import React from "react";
import { useGetOwnBookingRequests } from "../custom-hooks/api/bookings-api";
import { BookingRequestData } from "../types/bookings";

interface OwnBookingRequestsContextType {
  bookingRequests: BookingRequestData[];
  getBookingRequests: () => Promise<void>;
  isLoading: boolean;
}

export const OwnBookingRequestsContext = React.createContext<
  OwnBookingRequestsContextType
>({
  bookingRequests: [],
  getBookingRequests: () => {
    throw new Error("getBookingRequests not defined");
  },
  isLoading: false,
});

type Props = {
  children: React.ReactNode;
};

function OwnBookingRequestsProvider({ children }: Props) {
  const {
    bookingRequests,
    isLoading,
    getBookingRequests,
  } = useGetOwnBookingRequests();

  return (
    <OwnBookingRequestsContext.Provider
      value={{ bookingRequests, isLoading, getBookingRequests }}
    >
      {children}
    </OwnBookingRequestsContext.Provider>
  );
}

export default OwnBookingRequestsProvider;
