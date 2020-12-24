import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import {
  useDeleteUserInvites,
  useGetAllUserInvites,
  useUpdateUserInvites,
} from "../custom-hooks/api";
import { UserInviteData, UserInvitePatchData } from "../types/users";
import { resolveApiError } from "../utils/error-utils";

type UserInvitesContextType = {
  userInvites: UserInviteData[];
  isLoading: boolean;
  getAllUserInvites: () => Promise<UserInviteData[]>;
  updateUserInvites: (
    users: UserInvitePatchData[],
  ) => Promise<UserInviteData[]>;
  deleteUserInvites: (emails: string[]) => Promise<string[]>;
};

export const UserInvitesContext = React.createContext<UserInvitesContextType>({
  userInvites: [],
  isLoading: false,
  getAllUserInvites: () => {
    throw new Error("getAllUserInvites not defined.");
  },
  updateUserInvites: () => {
    throw new Error("updateUserInvites not defined.");
  },
  deleteUserInvites: () => {
    throw new Error("deleteUserInvites not defined.");
  },
});

type Props = {
  children: React.ReactNode;
};

function UserInvitesProvider({ children }: Props) {
  const {
    userInvites,
    getAllUserInvites: _getAllUserInvites,
  } = useGetAllUserInvites();
  const { updateUserInvites: _updateUserInvites } = useUpdateUserInvites();
  const { deleteUserInvites: _deleteUserInvites } = useDeleteUserInvites();

  const [isLoading, setLoading] = useState(false);

  const getAllUserInvites = useCallback(async () => {
    setLoading(true);
    const userInvites = await _getAllUserInvites();
    setLoading(false);
    return userInvites;
  }, [_getAllUserInvites]);

  const updateUserInvites = useCallback(
    async (users: UserInvitePatchData[]) => {
      try {
        const updatedUserInvites = await _updateUserInvites(users);

        await _getAllUserInvites();

        toast.success(
          updatedUserInvites.length > 1
            ? "Pending registration users updated successfully."
            : "The pending registration user has been updated successfully.",
        );

        return updatedUserInvites;
      } catch (error) {
        resolveApiError(error);
        return [];
      }
    },
    [_updateUserInvites, _getAllUserInvites],
  );

  const deleteUserInvites = useCallback(
    async (emails: string[]) => {
      try {
        const deletedEmails = await _deleteUserInvites(emails);
        getAllUserInvites();

        toast.success(
          deletedEmails.length > 1
            ? "Pending registration users deleted successfully."
            : "The pending registration user has been deleted successfully.",
        );

        return deletedEmails;
      } catch (error) {
        resolveApiError(error);
        return [];
      }
    },
    [_deleteUserInvites, getAllUserInvites],
  );

  return (
    <UserInvitesContext.Provider
      value={{
        userInvites,
        isLoading,
        getAllUserInvites,
        updateUserInvites,
        deleteUserInvites,
      }}
    >
      {children}
    </UserInvitesContext.Provider>
  );
}

export default UserInvitesProvider;
