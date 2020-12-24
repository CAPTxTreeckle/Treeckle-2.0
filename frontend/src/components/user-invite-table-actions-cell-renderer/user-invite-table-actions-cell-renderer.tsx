import React, { useCallback, useContext } from "react";
import { Button } from "semantic-ui-react";
import {
  DeleteModalProvider,
  UserInvitesContext,
} from "../../context-providers";
import { UserInviteData } from "../../types/users";
import DeleteModalButton from "../delete-modal-button";
import UserRoleChangeButton from "../user-role-change-button";
import PopUpActionsWrapper from "../pop-up-actions-wrapper";

type Props = {
  rowData: UserInviteData;
};

function UserInviteTableActionsCellRenderer({ rowData }: Props) {
  const { id, email, role } = rowData;
  const { deleteUserInvites, updateUserInvites } = useContext(
    UserInvitesContext,
  );

  const onDelete = useCallback(async () => {
    const deletedEmails = await deleteUserInvites([email]);
    return deletedEmails.length > 0;
  }, [deleteUserInvites, email]);

  return (
    <DeleteModalProvider
      onDelete={onDelete}
      deleteTitle="Delete Pending Registration User"
      deleteDescription={`Are you sure you want to delete pending registration user (${email})?`}
    >
      <PopUpActionsWrapper
        actionButtons={[
          <UserRoleChangeButton
            key="change role"
            userId={id}
            currentRole={role}
            updateUsers={updateUserInvites}
          />,
          <DeleteModalButton key="delete" />,
        ]}
      >
        <Button icon="ellipsis horizontal" compact />
      </PopUpActionsWrapper>
    </DeleteModalProvider>
  );
}

export default UserInviteTableActionsCellRenderer;
