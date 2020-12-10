import { useCallback, useMemo, useState } from "react";
import {
  VenueData,
  VenueFormProps,
  VenueViewProps,
  VenuePostData,
  VenuePutData,
} from "../../types/venues";
import { errorHandlerWrapper } from "../../utils/error-utils";
import { useAxiosWithTokenRefresh } from "./auth-api";
import { defaultArray } from "./default";

function parseVenueFormProps(
  venueFormProps: VenueFormProps,
): VenuePostData | VenuePutData {
  const {
    name,
    category,
    capacity,
    icName,
    icEmail,
    icContactNumber,
    venueDetailsCustomFormFieldsSection,
  } = venueFormProps;
  const data: VenuePostData | VenuePutData = {
    name,
    category,
    capacity: capacity || undefined,
    icName,
    icEmail,
    icContactNumber,
    formFieldData: venueDetailsCustomFormFieldsSection ?? [],
  };

  return data;
}

function parseVenueData(venueData: VenueData): VenueViewProps {
  const {
    id,
    createdAt,
    updatedAt,
    name,
    category,
    capacity,
    icName,
    icEmail,
    icContactNumber,
    formFieldData,
  } = venueData;

  const venueViewProps: VenueViewProps = {
    id,
    createdAt,
    updatedAt,
    venueFormProps: {
      name,
      category,
      capacity,
      icName,
      icEmail,
      icContactNumber,
      venueDetailsCustomFormFieldsSection: formFieldData,
    },
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
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<VenueData>(
    {
      url: "/venues/",
      method: "post",
    },
    { manual: true },
  );

  const createVenue = useMemo(
    () =>
      errorHandlerWrapper(async (venueFormProps: VenueFormProps) => {
        const data: VenuePostData = parseVenueFormProps(venueFormProps);
        const { data: venue } = await apiCall({
          data,
        });
        console.log("POST /venues/ success:", venue);

        return venue;
      }, "POST /venues/ error:"),
    [apiCall],
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

  const deleteVenue = useMemo(
    () =>
      errorHandlerWrapper(async (venueId: number) => {
        const response = await apiCall({
          url: `/venues/${venueId}`,
        });
        console.log(`DELETE /venues/${venueId} success:`, response);

        return true;
      }, `DELETE /venues/:venueId error:`),
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
    async (venueId: number) => {
      try {
        const { data: venue } = await apiCall({
          url: `/venues/${venueId}`,
        });
        console.log(`GET /venues/${venueId} success:`, venue);
        const parsedVenue = parseVenueData(venue);
        setVenue(parsedVenue);
        return parsedVenue;
      } catch (error) {
        console.log(`GET /venues/${venueId} error:`, error, error?.response);
        setVenue(undefined);
        return undefined;
      }
    },
    [apiCall],
  );

  return { venue, isLoading: loading, getSingleVenue };
}

export function useUpdateVenue() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<VenueData>(
    {
      method: "put",
    },
    { manual: true },
  );

  const updateVenue = useMemo(
    () =>
      errorHandlerWrapper(
        async (venueId: number, venueFormProps: VenueFormProps) => {
          const data: VenuePutData = parseVenueFormProps(venueFormProps);
          const { data: venue } = await apiCall({
            url: `/venues/${venueId}`,
            data,
          });
          console.log(`PUT /venues/${venueId} success:`, venue);

          return venue;
        },
        `PUT /venues/:venueId error:`,
      ),
    [apiCall],
  );

  return { updateVenue, isLoading: loading };
}
