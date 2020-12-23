import { useCallback, useMemo, useState } from "react";
import { useAxiosWithTokenRefresh } from "./auth-api";
import {
  OrganizationListenerData,
  OrganizationListenerDeleteData,
  OrganizationListenerPostData,
  OrganizationListenerViewProps,
} from "../../types/organizations";
import { errorHandlerWrapper, resolveApiError } from "../../utils/error-utils";

export function useGetOrganizationListeners() {
  const [organizationListeners, setOrganizationListeners] = useState<
    OrganizationListenerViewProps[]
  >([]);
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<
    OrganizationListenerData[]
  >(
    {
      url: "/organizations/listeners",
      method: "get",
    },
    { manual: true },
  );

  const getOrganizationListeners = useCallback(async () => {
    try {
      return await errorHandlerWrapper(async () => {
        const { data: listeners = [] } = await apiCall();
        console.log("GET /organizations/listeners success:", listeners);

        setOrganizationListeners(listeners);
        return listeners;
      }, "GET /organizations/listeners error:")();
    } catch (error) {
      resolveApiError(error);

      setOrganizationListeners([]);
      return [];
    }
  }, [apiCall]);

  return {
    organizationListeners,
    isLoading: loading,
    getOrganizationListeners,
  };
}

export function useCreateOrganizationListeners() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<
    OrganizationListenerData[]
  >(
    {
      url: "/organizations/listeners",
      method: "post",
    },
    { manual: true },
  );

  const createOrganizationListeners = useMemo(
    () =>
      errorHandlerWrapper(async (listeners: OrganizationListenerPostData[]) => {
        const { data: newListeners = [] } = await apiCall({
          data: { listeners },
        });
        console.log("POST /organizations/listeners success:", newListeners);

        if (newListeners.length === 0) {
          throw new Error("No new CC emails were added.");
        }

        return newListeners;
      }, "POST /organizations/listeners error:"),
    [apiCall],
  );

  return {
    isLoading: loading,
    createOrganizationListeners,
  };
}

export function useDeleteOrganizationListeners() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<
    OrganizationListenerData[]
  >(
    {
      url: "/organizations/listeners",
      method: "delete",
    },
    { manual: true },
  );

  const deleteOrganizationListeners = useMemo(
    () =>
      errorHandlerWrapper(async (ids: number[]) => {
        const organizationListenerDeleteData: OrganizationListenerDeleteData = {
          ids,
        };

        const { data: deletedListeners = [] } = await apiCall({
          data: organizationListenerDeleteData,
        });

        console.log(
          "DELETE /organizations/listeners success:",
          deletedListeners,
        );

        if (deletedListeners.length === 0) {
          throw new Error("No CC emails were removed.");
        }

        return deletedListeners;
      }, "DELETE /organizations/listeners error:"),
    [apiCall],
  );

  return { isLoading: loading, deleteOrganizationListeners };
}
