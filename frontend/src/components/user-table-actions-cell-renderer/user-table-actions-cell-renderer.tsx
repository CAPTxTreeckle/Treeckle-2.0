import React, { useCallback, useContext, useState } from "react";
import { Button } from "semantic-ui-react";
import {
  DeleteModalProvider,
  ExistingUsersContext,
} from "../../context-providers";
import { UserData } from "../../types/users";
import DeleteModalButton from "../delete-modal-button";
import UserRoleChangeButton from "../user-role-change-button";
import PopUpActionsWrapper from "../pop-up-actions-wrapper";

type Props = {
  rowData: UserData;
};

function UserTableActionsCellRenderer({ rowData }: Props) {
  const { id, email, role } = rowData as UserData;
  const { deleteExistingUsers, updateExistingUsers } = useContext(
    ExistingUsersContext,
  );
  const [isDeleting, setDeleting] = useState(false);

  const onDelete = useCallback(async () => {
    setDeleting(true);
    const deletedEmails = await deleteExistingUsers([email]);
    setDeleting(false);
    return deletedEmails.length > 0;
  }, [deleteExistingUsers, email]);

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

export default UserTableActionsCellRenderer;
