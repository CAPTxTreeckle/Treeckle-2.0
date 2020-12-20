import { useCallback } from "react";
import { useAxiosWithTokenRefresh } from ".";
import {
  END_DATE_TIME,
  START_DATE_TIME,
  STATUS,
  USER_ID,
  VENUE_NAME,
} from "../../constants";
import { BookingData, BookingStatus } from "../../types/bookings";
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
