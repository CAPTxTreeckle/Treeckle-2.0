import { useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../context-providers";
import { BookingRequestCommentsData } from "../../types/comments";
import { useAxiosWithTokenRefresh } from "./auth-api";

export function useGetBookingRequestComments() {
  const { accessToken } = useContext(UserContext);
  const [
    { data: bookingRequestComments = [], loading },
    apiCall,
  ] = useAxiosWithTokenRefresh<BookingRequestCommentsData[]>(
    {
      method: "get",
      headers: { authorization: `${accessToken}` },
    },
    { manual: true },
  );

  const getComments = useCallback(
    async (bookingRequestId: number) => {
      try {
        const { data: bookingRequestComments } = await apiCall({
          url: `/comments/`,
          params: {
            id: bookingRequestId,
          },
        });
        console.log("GET /comments/ success:", bookingRequestComments);
      } catch (error) {
        console.log("GET /comments/ error:", error, error?.response);
      }
    },
    [apiCall],
  );

  return { bookingRequestComments, isLoading: loading, getComments };
}

export function useCreateBookingRequestComment() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<
    BookingRequestCommentsData
  >(
    {
      method: "post",
    },
    { manual: true },
  );

  const createBookingRequestComment = useCallback(
    async (id: number, content: string) => {
      try {
        const { data: comment } = await apiCall({
          url: "/comments/",
          params: {
            id,
          },
          data: {
            content,
          },
        });
        console.log("POST /comments/ success:", comment);
        return true;
      } catch (error) {
        console.log("POST /comments/ error:", error, error?.response);
        toast.error("An unknown error has occurred.");
        return false;
      }
    },
    [apiCall],
  );

  return { createBookingRequestComment, isLoading: loading };
}
