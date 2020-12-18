import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { UserData, UserPatchData } from "../types/users";
import {
  useGetAllExistingUsers,
  useUpdateExistingUsers,
} from "../custom-hooks/api";
import { resolveApiError } from "../utils/error-utils";

type ExistingUsersContextType = {
  existingUsers: UserData[];
  isLoading: boolean;
  getAllExistingUsers: () => Promise<UserData[]>;
  updateExistingUsers: (users: UserPatchData[]) => Promise<UserData[]>;
};

export const ExistingUsersContext = React.createContext<ExistingUsersContextType>(
  {
    existingUsers: [],
    isLoading: false,
    getAllExistingUsers: () => {
      throw new Error("getAllExistingUsers not defined.");
    },
    updateExistingUsers: () => {
      throw new Error("updateExistingUsers not defined.");
    },
  },
);

type Props = {
  children: React.ReactNode;
};

function ExistingUsersProvider({ children }: Props) {
  const {
    existingUsers,
    getAllExistingUsers: _getAllExistingUsers,
  } = useGetAllExistingUsers();
  const {
    updateExistingUsers: _updateExistingUsers,
  } = useUpdateExistingUsers();

  const [isLoading, setLoading] = useState(false);

  const getAllExistingUsers = useCallback(async () => {
    setLoading(true);
    const existingUsers = await _getAllExistingUsers();
    setLoading(false);
    return existingUsers;
  }, [_getAllExistingUsers]);

  const updateExistingUsers = useCallback(
    async (users: UserPatchData[]) => {
      try {
        const updatedExistingUsers = await _updateExistingUsers(users);

        await _getAllExistingUsers();

        toast.success(
          updatedExistingUsers.length > 1
            ? "Existing users updated successfully."
            : "The existing user has been updated successfully.",
        );

        return updatedExistingUsers;
      } catch (error) {
        resolveApiError(error);
        return [];
      }
    },
    [_updateExistingUsers, _getAllExistingUsers],
  );

  return (
    <ExistingUsersContext.Provider
      value={{
        existingUsers,
        isLoading,
        getAllExistingUsers,
        updateExistingUsers,
      }}
    >
      {children}
    </ExistingUsersContext.Provider>
  );
}

export default ExistingUsersProvider;
