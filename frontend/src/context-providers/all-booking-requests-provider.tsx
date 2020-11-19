import React from "react";
import { useGetAllBookingRequests } from "../custom-hooks/api/bookings-api";
import { BookingRequestData } from "../types/bookings";

interface AllBookingRequestsContextType {
  bookingRequests: BookingRequestData[];
  getBookingRequests: () => Promise<void>;
  isLoading: boolean;
}

export const AllBookingRequestsContext = React.createContext<
  AllBookingRequestsContextType
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

function AllBookingRequestsProvider({ children }: Props) {
  const {
    bookingRequests,
    isLoading,
    getBookingRequests,
  } = useGetAllBookingRequests();

  return (
    <AllBookingRequestsContext.Provider
      value={{ bookingRequests, isLoading, getBookingRequests }}
    >
      {children}
    </AllBookingRequestsContext.Provider>
  );
}

export default AllBookingRequestsProvider;
