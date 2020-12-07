import React, { useCallback, useContext } from "react";
import { Button } from "semantic-ui-react";
import { toast } from "react-toastify";
import { DeleteModalProvider } from "../../context-providers";
import { useDeleteExistingUsers } from "../../custom-hooks/api";
import { UserData } from "../../types/users";
import DeleteModalButton from "../delete-modal-button";
import UserRoleChangeButton from "../user-role-change-button";
import PopUpActionsWrapper from "../pop-up-actions-wrapper";
import { UsersSectionContext } from "../users-section";

type Props = {
  rowData: UserData;
};

function UsersTableActionsCellRenderer({ rowData }: Props) {
  const { id, email, role } = rowData as UserData;
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
        deletedEmails.length > 1
          ? "Existing users deleted successfully."
          : "The existing user has been deleted successfully.",
      );
      return true;
    } catch (error) {
      toast.warn("No existing users were deleted");
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
          <DeleteModalButton key={1} />,
        ]}
      >
        <Button icon="ellipsis horizontal" compact />
      </PopUpActionsWrapper>
    </DeleteModalProvider>
  );
}

export default UsersTableActionsCellRenderer;
