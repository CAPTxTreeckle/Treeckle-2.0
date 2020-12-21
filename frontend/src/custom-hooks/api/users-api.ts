import { useCallback, useMemo } from "react";
import { useAxiosWithTokenRefresh } from "./auth-api";
import {
  UserData,
  UserInviteData,
  UserInvitePatchData,
  UserInvitePostData,
  UserPatchData,
} from "../../types/users";
import { errorHandlerWrapper } from "../../utils/error-utils";
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

export function useCreateUserInvites() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<UserInviteData[]>(
    {
      url: "/users/invite",
      method: "post",
    },
    { manual: true },
  );

  const createUserInvites = useMemo(
    () =>
      errorHandlerWrapper(async (invitations: UserInvitePostData[]) => {
        const { data: userInvites = [] } = await apiCall({
          data: { invitations },
        });
        console.log("POST /users/invite success:", userInvites);

        if (userInvites.length === 0) {
          throw new Error("No new users were created.");
        }
        return userInvites;
      }, "POST /users/invite error:"),
    [apiCall],
  );

  return {
    isLoading: loading,
    createUserInvites,
  };
}

export function useUpdateUserInvites() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<UserInviteData[]>(
    {
      url: "/users/invite",
      method: "patch",
    },
    { manual: true },
  );

  const updateUserInvites = useMemo(
    () =>
      errorHandlerWrapper(async (users: UserInvitePatchData[]) => {
        const { data: updatedUserInvites = [] } = await apiCall({
          data: { users },
        });
        console.log("PATCH /users/invite success:", updatedUserInvites);

        if (updatedUserInvites.length === 0) {
          throw new Error("No pending registration users were updated.");
        }

        return updatedUserInvites;
      }, "PATCH /users/invite error:"),
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

  const deleteUserInvites = useMemo(
    () =>
      errorHandlerWrapper(async (emails: string[]) => {
        const { data: deletedEmails = [] } = await apiCall({
          data: { emails },
        });

        console.log("DELETE /users/invite success:", deletedEmails);

        if (deletedEmails.length === 0) {
          throw new Error("No pending registration users were deleted.");
        }

        return deletedEmails;
      }, "DELETE /users/invite error:"),
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

  const updateExistingUsers = useMemo(
    () =>
      errorHandlerWrapper(async (users: UserPatchData[]) => {
        const { data: updatedExistingUsers = [] } = await apiCall({
          data: { users },
        });
        console.log("PATCH /users/ success:", updatedExistingUsers);

        if (updatedExistingUsers.length === 0) {
          throw new Error("No existing users were updated.");
        }

        return updatedExistingUsers;
      }, "PATCH /users/ error:"),
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

  const deleteExistingUsers = useMemo(
    () =>
      errorHandlerWrapper(async (emails: string[]) => {
        const { data: deletedEmails = [] } = await apiCall({
          data: { emails },
        });

        console.log("DELETE /users/ success:", deletedEmails);

        if (deletedEmails.length === 0) {
          throw new Error("No existing users were deleted.");
        }

        return deletedEmails;
      }, "DELETE /users/ error:"),
    [apiCall],
  );

  return { isLoading: loading, deleteExistingUsers };
}
