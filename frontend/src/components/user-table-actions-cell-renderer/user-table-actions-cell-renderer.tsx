import React, { useCallback, useContext } from "react";
import { Button } from "semantic-ui-react";
import {
  DeleteModalProvider,
  ExistingUsersContext,
  UserContext,
} from "../../context-providers";
import { UserData } from "../../types/users";
import DeleteModalButton from "../delete-modal-button";
import UserRoleChangeButton from "../user-role-change-button";
import PopUpActionsWrapper from "../pop-up-actions-wrapper";

type Props = {
  rowData: UserData;
};

function UserTableActionsCellRenderer({ rowData }: Props) {
  const { id, email, role } = rowData;
  const { id: currentUserId } = useContext(UserContext);
  const { deleteExistingUsers, updateExistingUsers } = useContext(
    ExistingUsersContext,
  );

  const onDelete = useCallback(async () => {
    const deletedEmails = await deleteExistingUsers([email]);
    return deletedEmails.length > 0;
  }, [deleteExistingUsers, email]);

  return (
    <DeleteModalProvider
      onDelete={onDelete}
      deleteTitle="Delete Existing User"
      deleteDescription={`Are you sure you want to delete existing user (${email})?`}
    >
      <PopUpActionsWrapper
        actionButtons={[
          <UserRoleChangeButton
            key="change role"
            userId={id}
            currentRole={role}
            updateUsers={updateExistingUsers}
          />,
          <DeleteModalButton key="delete" />,
        ]}
      >
        <Button
          icon="ellipsis horizontal"
          compact
          disabled={id === currentUserId}
        />
      </PopUpActionsWrapper>
    </DeleteModalProvider>
  );
}

export default UserTableActionsCellRenderer;
