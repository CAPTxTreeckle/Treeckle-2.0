import { useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../context-providers";
import { useAxiosWithTokenRefresh } from "./auth-api";
import { UserData } from "../../types/users";

export function useGetUsersFromSameOrganisation() {
  const { accessToken } = useContext(UserContext);
  const [
    {
      data = {
        users: [],
      },
      loading,
    },
    apiCall,
  ] = useAxiosWithTokenRefresh<{ users: UserData[] }>(
    {
      url: "/users/",
      method: "get",
      headers: { authorization: `${accessToken}` },
    },
    { manual: true },
  );
  const { users } = data;

  const getUsers = useCallback(async () => {
    try {
      const { data = { users: [] } } = await apiCall();
      console.log("GET /users success:", data.users);
    } catch (error) {
      console.log("GET /users error:", error, error?.response);
    }
  }, [apiCall]);

  return { users, isLoading: loading, getUsers };
}

export function useDeleteUser() {
  const { accessToken } = useContext(UserContext);
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<string[]>(
    {
      url: "/users/",
      method: "delete",
      headers: { authorization: `${accessToken}` },
    },
    { manual: true },
  );

  const deleteUser = useCallback(
    async (email: string) => {
      try {
        const data = { emails: email };
        const response = await apiCall({
          url: `/users/`,
          data,
        });
        console.log(`DELETE /users/ success:`, response);
        toast.success("The user has been deleted successfully.");
        return true;
      } catch (error) {
        console.log(`DELETE /users/ fail:`, error, error?.response);
        toast.error("An unknown error has occurred.");
        return false;
      }
    },
    [apiCall],
  );

  return { isLoading: loading, deleteUser };
}

export function usePatchUserRole() {
  const { accessToken } = useContext(UserContext);
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<string[]>(
    {
      method: "patch",
      headers: { authorization: `${accessToken}` },
    },
    { manual: true },
  );

  const patchUserRole = useCallback(
    async (id: number, role: string) => {
      try {
        const data = { role };
        const response = await apiCall({
          url: `/users/${id}`,
          data,
        });
        console.log(`PATCH /users/${id} success:`, response);
        toast.success("The user has been updated successfully.");
        return true;
      } catch (error) {
        console.log(`PATCH /users/${id} fail:`, error, error?.response);
        toast.error("An unknown error has occurred.");
        return false;
      }
    },
    [apiCall],
  );

  return { isLoading: loading, patchUserRole };
}

export function useInviteUsers() {
  const { accessToken } = useContext(UserContext);
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<string[]>(
    {
      method: "post",
      headers: { authorization: `${accessToken}` },
    },
    { manual: true },
  );

  const inviteUsers = useCallback(
    async (emails: string[]) => {
      try {
        const data = { emails };
        const response = await apiCall({
          url: `/users/invite`,
          data,
        });
        console.log(`POST /users/invite success:`, response);
        toast.success("An invitation email has been sent to these users.");
        return true;
      } catch (error) {
        console.log(`POST /users/invite fail:`, error, error?.response);
        toast.error("An unknown error has occurred.");
        return false;
      }
    },
    [apiCall],
  );

  return { isLoading: loading, inviteUsers };
}
