import React, { useCallback, useContext, useState } from "react";
import { Button } from "semantic-ui-react";
import {
  DeleteModalProvider,
  UserInvitesContext,
} from "../../context-providers";
import { UserData, UserInviteData } from "../../types/users";
import DeleteModalButton from "../delete-modal-button";
import UserRoleChangeButton from "../user-role-change-button";
import PopUpActionsWrapper from "../pop-up-actions-wrapper";

type Props = {
  rowData: UserInviteData;
};

function UserInviteTableActionsCellRenderer({ rowData }: Props) {
  const { id, email, role } = rowData as UserData;
  const { deleteUserInvites, updateUserInvites } = useContext(
    UserInvitesContext,
  );
  const [isDeleting, setDeleting] = useState(false);

  const onDelete = useCallback(async () => {
    setDeleting(true);
    const deletedEmails = await deleteUserInvites([email]);
    setDeleting(false);
    return deletedEmails.length > 0;
  }, [deleteUserInvites, email]);

  return (
    <DeleteModalProvider
      isDeleting={isDeleting}
      onDelete={onDelete}
      deleteTitle="Delete Pending Registration User"
      deleteDescription={`Are you sure you want to delete pending registration user (${email})?`}
    >
      <PopUpActionsWrapper
        actionButtons={[
          <UserRoleChangeButton
            key={0}
            userId={id}
            currentRole={role}
            updateUsers={updateUserInvites}
          />,
          <DeleteModalButton key={1} />,
        ]}
      >
        <Button icon="ellipsis horizontal" compact />
      </PopUpActionsWrapper>
    </DeleteModalProvider>
  );
}

export default UserInviteTableActionsCellRenderer;
