import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { ADMIN_VENUES_PATH } from "../../routes";
import {
  VenueData,
  VenueFormProps,
  VenueViewProps,
  VenuePostData,
  VenuePutData,
} from "../../types/venues";
import { useAxiosWithTokenRefresh } from "./auth-api";
import { defaultArray } from "./default";

function parseVenueFormProps(
  venueFormProps: VenueFormProps,
): VenuePostData | VenuePutData {
  const { venueName: name, category } = venueFormProps;
  const data: VenuePostData | VenuePutData = {
    name,
    category,
    formData: JSON.stringify(venueFormProps),
  };

  return data;
}

function parseVenueData(venueData: VenueData): VenueViewProps {
  const { id, createdAt, updatedAt, formData } = venueData;

  const venueViewProps: VenueViewProps = {
    id,
    createdAt,
    updatedAt,
    venueFormProps: JSON.parse(formData),
  };

  return venueViewProps;
}

export function useGetVenueCategories() {
  const [
    { data: venueCategories = defaultArray, loading },
    apiCall,
  ] = useAxiosWithTokenRefresh<string[]>(
    {
      url: "/venues/categories",
      method: "get",
    },
    { manual: true },
  );

  const getVenueCategories = useCallback(async () => {
    try {
      const { data: categories = [] } = await apiCall();
      console.log("GET /venues/categories success:", categories);
      return categories;
    } catch (error) {
      console.log("GET /venues/categories error:", error, error?.response);
      return [];
    }
  }, [apiCall]);

  return { venueCategories, isLoading: loading, getVenueCategories };
}

export function useGetAllVenues() {
  const [venues, setVenues] = useState<VenueViewProps[]>([]);
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<VenueData[]>(
    {
      url: "/venues/",
      method: "get",
    },
    { manual: true },
  );

  const getAllVenues = useCallback(async () => {
    try {
      const { data: venues = [] } = await apiCall();
      console.log("GET /venues/ success:", venues);
      const parsedVenues = venues.map((venue) => parseVenueData(venue));
      setVenues(parsedVenues);
      return parsedVenues;
    } catch (error) {
      console.log("GET /venues/ error:", error, error?.response);
      return [];
    }
  }, [apiCall]);

  return { venues, isLoading: loading, getAllVenues };
}

export function useCreateVenue() {
  const history = useHistory();
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<VenueData>(
    {
      url: "/venues/",
      method: "post",
    },
    { manual: true },
  );

  const createVenue = useCallback(
    async (venueFormProps: VenueFormProps) => {
      try {
        const data: VenuePostData = parseVenueFormProps(venueFormProps);
        const { data: venue } = await apiCall({
          data,
        });
        console.log("POST /venues/ success:", venue);
        toast.success("A new venue has been created successfully.");
        history.push(ADMIN_VENUES_PATH);
        return true;
      } catch (error) {
        console.log("POST /venues/ error:", error, error?.response);
        toast.error("An unknown error has occurred.");
        return false;
      }
    },
    [apiCall, history],
  );

  return { createVenue, isLoading: loading };
}

export function useDeleteVenue() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh(
    {
      method: "delete",
    },
    { manual: true },
  );

  const deleteVenue = useCallback(
    async (id: number, onSuccess?: () => Promise<unknown> | unknown) => {
      try {
        const response = await apiCall({
          url: `/venues/${id}`,
        });
        console.log(`DELETE /venues/${id} success:`, response);
        onSuccess?.();
        toast.success("The venue has been deleted successfully.");
        return true;
      } catch (error) {
        console.log(`DELETE /venues/${id} error:`, error, error?.response);
        toast.error("An unknown error has occurred.");
        return false;
      }
    },
    [apiCall],
  );

  return { deleteVenue, isLoading: loading };
}

export function useGetSingleVenue() {
  const [venue, setVenue] = useState<VenueViewProps>();
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<VenueData>(
    {
      method: "get",
    },
    { manual: true },
  );

  const getSingleVenue = useCallback(
    async (id: number) => {
      try {
        const { data: venue } = await apiCall({
          url: `/venues/${id}`,
        });
        console.log(`GET /venues/${id} success:`, venue);
        const parsedVenue = parseVenueData(venue);
        setVenue(parsedVenue);
        return parsedVenue;
      } catch (error) {
        console.log(`GET /venues/${id} error:`, error, error?.response);
        setVenue(undefined);
      }
    },
    [apiCall],
  );

  return { venue, isLoading: loading, getSingleVenue };
}

export function useUpdateVenue() {
  const history = useHistory();
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<VenueData>(
    {
      method: "put",
    },
    { manual: true },
  );

  const updateVenue = useCallback(
    async (id: number, venueFormProps: VenueFormProps) => {
      try {
        const data: VenuePutData = parseVenueFormProps(venueFormProps);
        const { data: venue } = await apiCall({
          url: `/venues/${id}`,
          data,
        });
        console.log(`PUT /venues/${id} success:`, venue);
        toast.success("The venue has been updated successfully.");
        history.push(ADMIN_VENUES_PATH);
        return true;
      } catch (error) {
        console.log(`PUT /venues/${id} error:`, error, error?.response);
        toast.error("An unknown error has occurred.");
        return false;
      }
    },
    [apiCall, history],
  );

  return { updateVenue, isLoading: loading };
}
