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
  BookingPostData,
  BookingStatus,
} from "../../types/bookings";
import { errorHandlerWrapper } from "../../utils/error-utils";
import { parseQueryParamsToUrl } from "../../utils/parser-utils";

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
      errorHandlerWrapper(async (data: BookingPostData) => {
        console.log("POST /bookings/ data:", data);
        const { data: bookings = [] } = await apiCall({ data });

        console.log("POST /bookings/ success:", bookings);

        return bookings;
      }, "POST /bookings/ error:"),
    [apiCall],
  );

  return { bookings, isLoading: loading, createBookings };
}
