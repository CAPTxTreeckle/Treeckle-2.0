import React, { useCallback } from "react";
import { Button } from "semantic-ui-react";
import { toast } from "react-toastify";
import { DeleteModalProvider } from "../../context-providers";
import { useDeleteUserInvites } from "../../custom-hooks/api";
import {
  UserData,
  UserInviteData,
  UserInvitePatchData,
} from "../../types/users";
import DeleteModalButton from "../delete-modal-button";
import UserRoleChangeButton from "../user-role-change-button";
import PopUpActionsWrapper from "../pop-up-actions-wrapper";
import { resolveApiError } from "../../utils/error-utils";

type Props = {
  rowData: UserInviteData;
  getAllUserInvites: () => Promise<UserInviteData[]>;
  updateUserInvites: (
    users: UserInvitePatchData[],
  ) => Promise<UserInviteData[]>;
};

function UserInvitesTableActionsCellRenderer({
  rowData,
  getAllUserInvites,
  updateUserInvites,
}: Props) {
  const { id, email, role } = rowData as UserData;
  const { deleteUserInvites, isLoading: isDeleting } = useDeleteUserInvites();

  const onDelete = useCallback(async () => {
    try {
      const deletedEmails = await deleteUserInvites([email]);
      getAllUserInvites();

      toast.success(
        deletedEmails.length > 1
          ? "Pending registration users deleted successfully."
          : "The pending registration user has been deleted successfully.",
      );

      return true;
    } catch (error) {
      resolveApiError(error);
      return false;
    }
  }, [deleteUserInvites, getAllUserInvites, email]);

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

export default UserInvitesTableActionsCellRenderer;
