import { useCallback } from "react";
import { toast } from "react-toastify";
import { useAxiosWithTokenRefresh } from "./auth-api";
import {
  UserData,
  UserInviteData,
  UserInvitePatchData,
  UserPatchData,
} from "../../types/users";
import { defaultArray } from "./default";

export function useGetAllUserInvites() {
  const [
    { data: userInvites = defaultArray as UserInviteData[], loading },
    apiCall,
  ] = useAxiosWithTokenRefresh<UserInviteData[]>(
    {
      url: "/users/invite",
      method: "get",
    },
    { manual: true },
  );

  const getAllUserInvites = useCallback(async () => {
    try {
      const { data: userInvites = [] } = await apiCall();
      console.log("GET /users/invite success:", userInvites);
      return userInvites;
    } catch (error) {
      console.log("GET /users/invite error:", error, error?.response);
      return [];
    }
  }, [apiCall]);

  return { userInvites, isLoading: loading, getAllUserInvites };
}

export function useUpdateUserInvites() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<UserInviteData[]>(
    {
      url: "/users/invite",
      method: "patch",
    },
    { manual: true },
  );

  const updateUserInvites = useCallback(
    async (
      users: UserInvitePatchData[],
      onSuccess?: () => Promise<unknown> | unknown,
    ) => {
      try {
        const { data: updatedUserInvites = [] } = await apiCall({
          data: { users },
        });
        console.log("PATCH /users/invite success:", updatedUserInvites);
        await onSuccess?.();

        toast.success(
          `Pending new user${
            updatedUserInvites.length > 1 ? "s" : ""
          } updated successfully.`,
        );

        return updatedUserInvites;
      } catch (error) {
        console.log("PATCH /users/invite error:", error, error?.response);
        toast.error("An unknown error has occurred.");
        return [];
      }
    },
    [apiCall],
  );

  return { isLoading: loading, updateUserInvites };
}

export function useDeleteUserInvites() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<string[]>(
    {
      url: "/users/invite",
      method: "delete",
    },
    { manual: true },
  );

  const deleteUserInvites = useCallback(
    async (emails: string[], onSuccess?: () => Promise<unknown> | unknown) => {
      try {
        const { data: deletedEmails = [] } = await apiCall({
          data: { emails },
        });

        console.log("DELETE /users/invite success:", deletedEmails);
        onSuccess?.();

        toast.success(
          `New pending user${
            deletedEmails.length > 1 ? "s" : ""
          } deleted successfully.`,
        );
        return true;
      } catch (error) {
        console.log("DELETE /users/invite error:", error, error?.response);
        toast.error("An unknown error has occurred.");
        return false;
      }
    },
    [apiCall],
  );

  return { isLoading: loading, deleteUserInvites };
}

export function useGetAllExistingUsers() {
  const [
    { data: existingUsers = defaultArray as UserData[], loading },
    apiCall,
  ] = useAxiosWithTokenRefresh<UserData[]>(
    {
      url: "/users/",
      method: "get",
    },
    { manual: true },
  );

  const getAllExistingUsers = useCallback(async () => {
    try {
      const { data: existingUsers = [] } = await apiCall();
      console.log("GET /users/ success:", existingUsers);
      return existingUsers;
    } catch (error) {
      console.log("GET /users/ error:", error, error?.response);
      return [];
    }
  }, [apiCall]);

  return { existingUsers, isLoading: loading, getAllExistingUsers };
}

export function useUpdateExistingUsers() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<UserData[]>(
    {
      url: "/users/",
      method: "patch",
    },
    { manual: true },
  );

  const updateExistingUsers = useCallback(
    async (
      users: UserPatchData[],
      onSuccess?: () => Promise<unknown> | unknown,
    ) => {
      try {
        const { data: updatedUsers = [] } = await apiCall({
          data: { users },
        });
        console.log("PATCH /users/ success:", updatedUsers);
        await onSuccess?.();

        toast.success(
          `Existing user${
            updatedUsers.length > 1 ? "s" : ""
          } updated successfully.`,
        );

        return updatedUsers;
      } catch (error) {
        console.log("PATCH /users/ error:", error, error?.response);
        toast.error("An unknown error has occurred.");
        return [];
      }
    },
    [apiCall],
  );

  return { isLoading: loading, updateExistingUsers };
}

export function useDeleteExistingUsers() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<string[]>(
    {
      url: "/users/",
      method: "delete",
    },
    { manual: true },
  );

  const deleteExistingUsers = useCallback(
    async (emails: string[], onSuccess?: () => Promise<unknown> | unknown) => {
      try {
        const { data: deletedEmails = [] } = await apiCall({
          data: { emails },
        });

        console.log("DELETE /users/ success:", deletedEmails);
        onSuccess?.();

        toast.success(
          `Existing user${
            deletedEmails.length > 1 ? "s" : ""
          } deleted successfully.`,
        );
        return true;
      } catch (error) {
        console.log("DELETE /users/ error:", error, error?.response);
        toast.error("An unknown error has occurred.");
        return false;
      }
    },
    [apiCall],
  );

  return { isLoading: loading, deleteExistingUsers };
}
