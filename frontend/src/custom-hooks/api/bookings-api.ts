import useAxios from "axios-hooks";
import { useCallback, useMemo } from "react";
import { useAxiosWithTokenRefresh } from ".";
import {
  END_DATE_TIME,
  START_DATE_TIME,
  STATUS,
  USER_ID,
  VENUE_NAME,
} from "../../constants";
import {
  BookingData,
  BookingDeleteData,
  BookingPatchData,
  BookingPostData,
  BookingStatus,
  BookingStatusAction,
} from "../../types/bookings";
import { errorHandlerWrapper } from "../../utils/error-utils";
import { parseQueryParamsToUrl } from "../../utils/parser-utils";

export function useGetTotalBookingCount() {
  const [{ data: totalBookingCount = 0, loading }, apiCall] = useAxios<number>(
    {
      url: "/bookings/totalcount",
      method: "get",
    },
    { manual: true },
  );

  const getTotalBookingCount = useCallback(async () => {
    try {
      const { data: totalBookingCount } = await apiCall();

      console.log(`GET /bookings/totalcount success:`, totalBookingCount);

      return totalBookingCount;
    } catch (error) {
      console.log(`GET /bookings/totalcount error:`, error, error?.response);

      return 0;
    }
  }, [apiCall]);

  return { totalBookingCount, isLoading: loading, getTotalBookingCount };
}

export function useGetPendingBookingCount() {
  const [
    { data: pendingCount = 0, loading },
    apiCall,
  ] = useAxiosWithTokenRefresh<number>(
    {
      url: "/bookings/pendingcount",
      method: "get",
    },
    { manual: true },
  );

  const getPendingBookingCount = useCallback(async () => {
    try {
      const { data: pendingCount } = await apiCall();

      console.log(`GET /bookings/pendingcount success:`, pendingCount);

      return pendingCount;
    } catch (error) {
      console.log(`GET /bookings/pendingcount error:`, error, error?.response);

      return 0;
    }
  }, [apiCall]);

  return { pendingCount, isLoading: loading, getPendingBookingCount };
}

export function useGetBookings() {
  const [{ data: bookings = [], loading }, apiCall] = useAxiosWithTokenRefresh<
    BookingData[]
  >(
    {
      method: "get",
    },
    { manual: true },
  );

  const getBookings = useCallback(
    async (
      queryParams: {
        [USER_ID]?: number;
        [VENUE_NAME]?: string;
        [START_DATE_TIME]?: number;
        [END_DATE_TIME]?: number;
        [STATUS]?: BookingStatus;
      } = {},
    ) => {
      const url = parseQueryParamsToUrl("/bookings/", queryParams);

      try {
        const { data: bookings = [] } = await apiCall({ url });

        console.log(`GET ${url} success:`, bookings);

        return bookings;
      } catch (error) {
        console.log(`GET ${url} error:`, error, error?.response);

        return [];
      }
    },
    [apiCall],
  );

  return { bookings, isLoading: loading, getBookings };
}

export function useCreateBookings() {
  const [{ data: bookings = [], loading }, apiCall] = useAxiosWithTokenRefresh<
    BookingData[]
  >(
    {
      url: "/bookings/",
      method: "post",
    },
    { manual: true },
  );

  const createBookings = useMemo(
    () =>
      errorHandlerWrapper(async (bookingPostData: BookingPostData) => {
        console.log("POST /bookings/ data:", bookingPostData);

        const { data: bookings = [] } = await apiCall({
          data: bookingPostData,
        });

        console.log("POST /bookings/ success:", bookings);

        return bookings;
      }, "POST /bookings/ error:"),
    [apiCall],
  );

  return { bookings, isLoading: loading, createBookings };
}

export function useUpdateBookingStatuses() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<BookingData[]>(
    {
      url: "/bookings/",
      method: "patch",
    },
    { manual: true },
  );

  const updateBookingStatuses = useMemo(
    () =>
      errorHandlerWrapper(async (actions: BookingStatusAction[]) => {
        const bookingPatchData: BookingPatchData = { actions };

        const { data: bookings = [] } = await apiCall({
          data: bookingPatchData,
        });

        console.log(`PATCH /bookings/ success:`, bookings);

        return bookings;
      }, "PATCH /bookings/ error:"),
    [apiCall],
  );

  return { updateBookingStatuses, isLoading: loading };
}

export function useDeleteBookings() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh(
    {
      url: "/bookings/",
      method: "delete",
    },
    { manual: true },
  );

  const deleteBookings = useMemo(
    () =>
      errorHandlerWrapper(async (ids: number[]) => {
        const bookingDeleteData: BookingDeleteData = { ids };

        const response = await apiCall({
          data: bookingDeleteData,
        });
        console.log(`DELETE /bookings/ success:`, response);
      }, "DELETE /bookings/ error:"),
    [apiCall],
  );

  return { deleteBookings, isLoading: loading };
}
