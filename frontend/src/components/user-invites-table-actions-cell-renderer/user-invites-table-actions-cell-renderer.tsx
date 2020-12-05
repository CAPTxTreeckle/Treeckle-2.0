import React from "react";
import { Button } from "semantic-ui-react";
import { DeleteModalProvider } from "../../context-providers";
import { useDeleteUserInvites } from "../../custom-hooks/api";
import {
  UserData,
  UserInviteData,
  UserInvitePatchData,
} from "../../types/users";
import DeleteButton from "../delete-button";
import UserRoleChangeButton from "../user-role-change-button";
import PopUpActionsWrapper from "../pop-up-actions-wrapper";

type Props = {
  cellData: UserInviteData;
  getAllUserInvites: () => Promise<UserInviteData[]>;
  updateUserInvites: (
    users: UserInvitePatchData[],
  ) => Promise<UserInviteData[]>;
};

function UserInvitesTableActionsCellRenderer({
  cellData,
  getAllUserInvites,
  updateUserInvites,
}: Props) {
  const { id, email, role } = cellData as UserData;
  const { deleteUserInvites, isLoading: isDeleting } = useDeleteUserInvites();

  return (
    <DeleteModalProvider
      isDeleting={isDeleting}
      onDelete={() => deleteUserInvites([email], getAllUserInvites)}
      deleteTitle="Delete Pending User"
      deleteDescription={`Are you sure you want to delete pending user (${email})?`}
    >
      <PopUpActionsWrapper
        actionButtons={[
          <UserRoleChangeButton
            key={0}
            userId={id}
            currentRole={role}
            updateUsers={updateUserInvites}
          />,
          <DeleteButton key={1} />,
        ]}
      >
        <Button icon="ellipsis horizontal" compact />
      </PopUpActionsWrapper>
    </DeleteModalProvider>
  );
}

export default UserInvitesTableActionsCellRenderer;