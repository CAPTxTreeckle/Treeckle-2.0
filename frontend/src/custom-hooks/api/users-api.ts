import { useCallback } from "react";
import { toast } from "react-toastify";
import { useAxiosWithTokenRefresh } from "./auth-api";
import { UserData, UserInviteData } from "../../types/users";
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

        if (deletedEmails.length <= 0) {
          throw new Error("No user invites deleted.");
        }

        toast.success(
          `The following invited user${
            deletedEmails.length > 1 ? "s" : ""
          } ${deletedEmails.join(", ")} has been deleted successfully.`,
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

        if (deletedEmails.length <= 0) {
          throw new Error("No users deleted.");
        }

        toast.success(
          `The following user${
            deletedEmails.length > 1 ? "s" : ""
          } ${deletedEmails.join(", ")} has been deleted successfully.`,
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
