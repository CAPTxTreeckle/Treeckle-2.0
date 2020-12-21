import React, { useCallback, useState } from "react";
import {
  BookingData,
  BookingStatus,
  BookingStatusAction,
} from "../types/bookings";
import { useGetBookings, useUpdateBookingStatuses } from "../custom-hooks/api";

type BookingsContextType = {
  bookings: BookingData[];
  isLoading: boolean;
  getBookings: (queryParams?: {
    userId?: number;
    venueName?: string;
    startDateTime?: number;
    endDateTime?: number;
    status?: BookingStatus;
  }) => Promise<BookingData[]>;
  updateBookingStatuses: (
    actions: BookingStatusAction[],
  ) => Promise<BookingData[]>;
};

export const BookingsContext = React.createContext<BookingsContextType>({
  bookings: [],
  isLoading: false,
  getBookings: () => {
    throw new Error("getBookings not defined.");
  },
  updateBookingStatuses: () => {
    throw new Error("updateBookingStatuses not defined.");
  },
});

type Props = {
  children: React.ReactNode;
};

function BookingsProvider({ children }: Props) {
  const { bookings, getBookings: _getBookings } = useGetBookings();
  const { updateBookingStatuses } = useUpdateBookingStatuses();

  const [isLoading, setLoading] = useState(false);

  const getBookings = useCallback(
    async (queryParams?: {
      userId?: number;
      venueName?: string;
      startDateTime?: number;
      endDateTime?: number;
      status?: BookingStatus;
    }) => {
      setLoading(true);
      const bookings = await _getBookings(queryParams);
      setLoading(false);

      return bookings;
    },
    [_getBookings],
  );

  return (
    <BookingsContext.Provider
      value={{ bookings, isLoading, getBookings, updateBookingStatuses }}
    >
      {children}
    </BookingsContext.Provider>
  );
}

export default BookingsProvider;
