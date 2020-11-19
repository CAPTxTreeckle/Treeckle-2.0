import { useCallback, useContext } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { UserContext } from "../../context-providers";
import { useAxiosWithTokenRefresh } from "./auth-api";
import {
  BookingRequestData,
  BookingRequestPostData,
} from "../../types/bookings";
import { CreateBookingRequestData } from "../../context-providers/create-booking-request-provider";

interface GetAllBookingRequestsParams {
  limit?: number;
  offset?: number;
  status?: number;
  start?: number;
  end?: number;
  venue?: number;
}

export function useGetAllBookingRequests() {
  const { accessToken } = useContext(UserContext);
  const [
    { data: bookingRequests = [], loading },
    apiCall,
  ] = useAxiosWithTokenRefresh<BookingRequestData[]>(
    {
      url: "/bookings/all/",
      method: "get",
      headers: { authorization: `${accessToken}` },
    },
    { manual: true },
  );

  const getBookingRequests = useCallback(
    async (params?: GetAllBookingRequestsParams) => {
      try {
        const { data: bookingRequests } = await apiCall({
          params,
        });
        console.log("GET /bookings/all success:", bookingRequests);
      } catch (error) {
        console.log("GET /bookings/all error:", error, error?.response);
      }
    },
    [apiCall],
  );

  return { bookingRequests, isLoading: loading, getBookingRequests };
}

export function useGetOwnBookingRequests() {
  const { accessToken } = useContext(UserContext);
  const [
    { data: bookingRequests = [], loading },
    apiCall,
  ] = useAxiosWithTokenRefresh<BookingRequestData[]>(
    {
      url: "/bookings/",
      method: "get",
      headers: { authorization: `${accessToken}` },
    },
    { manual: true },
  );

  const getBookingRequests = useCallback(async () => {
    try {
      const { data: bookingRequests } = await apiCall();
      console.log("GET /bookings/ success:", bookingRequests);
    } catch (error) {
      console.log("GET /bookings/ error:", error, error?.response);
    }
  }, [apiCall]);

  return { bookingRequests, isLoading: loading, getBookingRequests };
}

export function usePatchBookingStatus() {
  const { accessToken } = useContext(UserContext);
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<string[]>(
    {
      method: "patch",
      headers: { authorization: `${accessToken}` },
    },
    { manual: true },
  );

  const patchBookingStatus = useCallback(
    async (id: number, status: number) => {
      try {
        const data = { id, status };
        const response = await apiCall({
          url: `/bookings/`,
          data,
        });
        console.log(`PATCH /bookings success:`, response);
        toast.success("The booking request has been updated successfully.");
        return true;
      } catch (error) {
        console.log(`PATCH /bookings fail:`, error, error?.response);
        toast.error("An unknown error has occurred.");
        return false;
      }
    },
    [apiCall],
  );

  return { isLoading: loading, patchBookingStatus };
}

function parseBookingRequestFormData(
  bookingRequestFormData: CreateBookingRequestData,
  booker: number,
): BookingRequestPostData[] {
  const {
    venueId,
    startTime,
    endTime,
    isOvernight,
    dates,
    formData,
  } = bookingRequestFormData;
  const data = dates.map((date) => {
    const start_date = `${dayjs(date).format("YYYY-MM-DD")} ${dayjs(
      startTime,
    ).format("HH:mm")}:00`;

    const processedEndDate = isOvernight
      ? dayjs(date).add(1, "day")
      : dayjs(date);
    const end_date = `${processedEndDate.format("YYYY-MM-DD")} ${dayjs(
      endTime,
    ).format("HH:mm")}:00`;

    return {
      venue: venueId,
      start_date,
      end_date,
      status: 0,
      form_data: JSON.stringify(formData),
      booker,
    };
  });

  console.log(data);

  return data;
}

export function useCreateBookingRequest() {
  const { id } = useContext(UserContext);
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<BookingRequestData>(
    {
      url: "/bookings/",
      method: "post",
    },
    { manual: true },
  );

  const createBookingRequest = useCallback(
    async (bookingRequestFormData: CreateBookingRequestData) => {
      try {
        const data: BookingRequestPostData[] = parseBookingRequestFormData(
          bookingRequestFormData,
          id as number,
        );
        const { data: bookingRequest } = await apiCall({
          data,
        });
        console.log("POST /bookings/ success:", bookingRequest);
        toast.success("Your booking request has been created successfully.");
        return true;
      } catch (error) {
        console.log("POST /bookings/ error:", error, error?.response);
        toast.error("An unknown error has occurred.");
        return false;
      }
    },
    [apiCall, id],
  );

  return { createBookingRequest, isLoading: loading };
}
