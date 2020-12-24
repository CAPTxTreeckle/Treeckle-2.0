import { createContext, ReactNode, useCallback, useState } from "react";
import { toast } from "react-toastify";
import { UserData, UserPatchData } from "../types/users";
import {
  useDeleteExistingUsers,
  useGetAllExistingUsers,
  useUpdateExistingUsers,
} from "../custom-hooks/api";
import { resolveApiError } from "../utils/error-utils";

type ExistingUsersContextType = {
  existingUsers: UserData[];
  isLoading: boolean;
  getAllExistingUsers: () => Promise<UserData[]>;
  updateExistingUsers: (users: UserPatchData[]) => Promise<UserData[]>;
  deleteExistingUsers: (emails: string[]) => Promise<string[]>;
};

export const ExistingUsersContext = createContext<ExistingUsersContextType>({
  existingUsers: [],
  isLoading: false,
  getAllExistingUsers: () => {
    throw new Error("getAllExistingUsers not defined.");
  },
  updateExistingUsers: () => {
    throw new Error("updateExistingUsers not defined.");
  },
  deleteExistingUsers: () => {
    throw new Error("deleteExistingUsers not defined.");
  },
});

type Props = {
  children: ReactNode;
};

function ExistingUsersProvider({ children }: Props) {
  const {
    existingUsers,
    getAllExistingUsers: _getAllExistingUsers,
  } = useGetAllExistingUsers();
  const {
    updateExistingUsers: _updateExistingUsers,
  } = useUpdateExistingUsers();
  const {
    deleteExistingUsers: _deleteExistingUsers,
  } = useDeleteExistingUsers();

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

  const deleteExistingUsers = useCallback(
    async (emails: string[]) => {
      try {
        const deletedEmails = await _deleteExistingUsers(emails);
        getAllExistingUsers();

        toast.success(
          deletedEmails.length > 1
            ? "Existing users deleted successfully."
            : "The existing user has been deleted successfully.",
        );
        return deletedEmails;
      } catch (error) {
        resolveApiError(error);
        return [];
      }
    },
    [_deleteExistingUsers, getAllExistingUsers],
  );

  return (
    <ExistingUsersContext.Provider
      value={{
        existingUsers,
        isLoading,
        getAllExistingUsers,
        updateExistingUsers,
        deleteExistingUsers,
      }}
    >
      {children}
    </ExistingUsersContext.Provider>
  );
}

export default ExistingUsersProvider;
