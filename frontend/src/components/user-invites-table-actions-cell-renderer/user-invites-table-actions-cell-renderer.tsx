import React, { useCallback } from "react";
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
import { toast } from "react-toastify";

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
  const {
    deleteUserInvites: _deleteUserInvites,
    isLoading: isDeleting,
  } = useDeleteUserInvites();

  const onDelete = useCallback(async () => {
    try {
      const deletedEmails = await _deleteUserInvites([email]);
      getAllUserInvites();

      toast.success(
        `New pending user${
          deletedEmails.length > 1 ? "s" : ""
        } deleted successfully.`,
      );
      return true;
    } catch (error) {
      return false;
    }
  }, [_deleteUserInvites, getAllUserInvites, email]);

  return (
    <DeleteModalProvider
      isDeleting={isDeleting}
      onDelete={onDelete}
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
