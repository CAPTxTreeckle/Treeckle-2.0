import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { toast } from "react-toastify";
import {
  BookingViewProps,
  BookingGetQueryParams,
  BookingStatusAction,
} from "../types/bookings";
import {
  useDeleteBookings,
  useGetBookings,
  useUpdateBookingStatuses,
} from "../custom-hooks/api";
import { resolveApiError } from "../utils/error-utils";
import { PendingBookingCountContext } from "./pending-booking-count-provider";

type GetBookingsConfig = {
  queryParams?: BookingGetQueryParams;
  showLoading?: boolean;
};

type BookingsContextType = {
  bookings: BookingViewProps[];
  isLoading: boolean;
  getBookings: (configs?: GetBookingsConfig) => Promise<BookingViewProps[]>;
  updateBookingStatuses: (
    actions: BookingStatusAction[],
  ) => Promise<BookingViewProps[]>;
  deleteBookings: (ids: number[]) => Promise<BookingViewProps[]>;
};

export const BookingsContext = createContext<BookingsContextType>({
  bookings: [],
  isLoading: false,
  getBookings: () => {
    throw new Error("getBookings not defined.");
  },
  updateBookingStatuses: () => {
    throw new Error("updateBookingStatuses not defined.");
  },
  deleteBookings: () => {
    throw new Error("deleteBookings not defined.");
  },
});

type Props = {
  defaultQueryParams?: BookingGetQueryParams;
  children: ReactNode;
};

function BookingsProvider({ children, defaultQueryParams }: Props) {
  const { getPendingBookingCount } = useContext(PendingBookingCountContext);
  const { bookings, getBookings: _getBookings } = useGetBookings();
  const {
    updateBookingStatuses: _updateBookingStatuses,
  } = useUpdateBookingStatuses();
  const { deleteBookings: _deleteBookings } = useDeleteBookings();

  const [isLoading, setLoading] = useState(false);

  const getBookings = useCallback(
    async ({ queryParams, showLoading = true }: GetBookingsConfig = {}) => {
      showLoading && setLoading(true);
      const bookings = await _getBookings({
        ...defaultQueryParams,
        ...queryParams,
      });
      getPendingBookingCount({ showLoading: false });
      showLoading && setLoading(false);

      return bookings;
    },
    [_getBookings, defaultQueryParams, getPendingBookingCount],
  );

  const updateBookingStatuses = useCallback(
    async (actions: BookingStatusAction[]) => {
      try {
        const updatedBookings = await _updateBookingStatuses(actions);

        await getBookings({ showLoading: false });

        toast.success(
          updatedBookings.length > 1
            ? "Booking statuses updated successfully."
            : "The booking status has been updated successfully.",
        );

        return updatedBookings;
      } catch (error) {
        resolveApiError(error);
        return [];
      }
    },
    [_updateBookingStatuses, getBookings],
  );

  const deleteBookings = useCallback(
    async (ids: number[]) => {
      try {
        const deletedBookings = await _deleteBookings(ids);
        getBookings();

        toast.success(
          deletedBookings.length > 1
            ? "Booking requests deleted successfully."
            : "The booking request has been deleted successfully.",
        );

        return deletedBookings;
      } catch (error) {
        resolveApiError(error);
        return [];
      }
    },
    [_deleteBookings, getBookings],
  );

  return (
    <BookingsContext.Provider
      value={{
        bookings,
        isLoading,
        getBookings,
        updateBookingStatuses,
        deleteBookings,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
}

export default BookingsProvider;
