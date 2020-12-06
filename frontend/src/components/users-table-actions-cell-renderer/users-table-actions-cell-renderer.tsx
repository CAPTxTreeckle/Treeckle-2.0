import React, { useCallback, useContext } from "react";
import { Button } from "semantic-ui-react";
import { DeleteModalProvider } from "../../context-providers";
import { useDeleteExistingUsers } from "../../custom-hooks/api";
import { UserData } from "../../types/users";
import DeleteButton from "../delete-button";
import UserRoleChangeButton from "../user-role-change-button";
import PopUpActionsWrapper from "../pop-up-actions-wrapper";
import { UsersSectionContext } from "../users-section";
import { toast } from "react-toastify";

type Props = {
  cellData: UserData;
};

function UsersTableActionsCellRenderer({ cellData }: Props) {
  const { id, email, role } = cellData as UserData;
  const { getAllExistingUsers, updateExistingUsers } = useContext(
    UsersSectionContext,
  );
  const {
    deleteExistingUsers: _deleteExistingUsers,
    isLoading: isDeleting,
  } = useDeleteExistingUsers();

  const onDelete = useCallback(async () => {
    try {
      const deletedEmails = await _deleteExistingUsers([email]);
      getAllExistingUsers();

      toast.success(
        `Existing user${
          deletedEmails.length > 1 ? "s" : ""
        } deleted successfully.`,
      );
      return true;
    } catch (error) {
      return false;
    }
  }, [_deleteExistingUsers, getAllExistingUsers, email]);

  return (
    <DeleteModalProvider
      isDeleting={isDeleting}
      onDelete={onDelete}
      deleteTitle="Delete Existing User"
      deleteDescription={`Are you sure you want to delete existing user (${email})?`}
    >
      <PopUpActionsWrapper
        actionButtons={[
          <UserRoleChangeButton
            key={0}
            userId={id}
            currentRole={role}
            updateUsers={updateExistingUsers}
          />,
          <DeleteButton key={1} />,
        ]}
      >
        <Button icon="ellipsis horizontal" compact />
      </PopUpActionsWrapper>
    </DeleteModalProvider>
  );
}

export default UsersTableActionsCellRenderer;
