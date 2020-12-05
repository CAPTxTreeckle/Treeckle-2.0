import React, { useCallback, useContext, useMemo, useState } from "react";
import { Button, Popup } from "semantic-ui-react";
import {
  Role,
  UserData,
  UserInviteData,
  UserInvitePatchData,
  UserPatchData,
} from "../../types/users";
import { PopUpActionsWrapperContext } from "../pop-up-actions-wrapper";

type Props = {
  userId: number;
  currentRole: Role;
  updateUsers: (
    users: UserPatchData[] | UserInvitePatchData[],
  ) => Promise<UserData[] | UserInviteData[]>;
};

function UserRoleChangeButton({ userId, currentRole, updateUsers }: Props) {
  const { extraContent, setExtraContent, closePopUp } = useContext(
    PopUpActionsWrapperContext,
  );
  const [isUpdating, setUpdating] = useState(false);

  const updateExistingUserRole = useCallback(
    async (newRole: Role) => {
      setUpdating(true);
      await updateUsers([{ id: userId, role: newRole }]);
      setUpdating(false);
      closePopUp();
    },
    [userId, updateUsers, closePopUp],
  );

  const onMakeAdmin = useCallback(() => updateExistingUserRole(Role.Admin), [
    updateExistingUserRole,
  ]);

  const onMakeOrganizer = useCallback(
    () => updateExistingUserRole(Role.Organizer),
    [updateExistingUserRole],
  );

  const onMakeResident = useCallback(
    () => updateExistingUserRole(Role.Resident),
    [updateExistingUserRole],
  );

  const makeAdminButton = useMemo(
    () => (
      <Button key={0} content="Make Admin" color="blue" onClick={onMakeAdmin} />
    ),
    [onMakeAdmin],
  );

  const makeOrganizerButton = useMemo(
    () => (
      <Button
        key={1}
        content="Make Organizer"
        color="blue"
        onClick={onMakeOrganizer}
      />
    ),
    [onMakeOrganizer],
  );

  const makeResidentButton = useMemo(
    () => (
      <Button
        key={2}
        content="Make Resident"
        color="blue"
        onClick={onMakeResident}
      />
    ),
    [onMakeResident],
  );

  const actionButtons = useMemo(() => {
    switch (currentRole) {
      case Role.Admin:
        return [makeOrganizerButton, makeResidentButton];
      case Role.Organizer:
        return [makeAdminButton, makeResidentButton];
      case Role.Resident:
        return [makeAdminButton, makeOrganizerButton];
      default:
        return [makeAdminButton, makeOrganizerButton, makeResidentButton];
    }
  }, [currentRole, makeAdminButton, makeOrganizerButton, makeResidentButton]);

  return (
    <Popup
      trigger={
        <Button
          icon="users"
          color="black"
          loading={isUpdating}
          onClick={() =>
            setExtraContent(
              extraContent ? null : (
                <Button.Group compact vertical>
                  {actionButtons}
                </Button.Group>
              ),
            )
          }
        />
      }
      position="top center"
      content="Change role"
    />
  );
}

export default UserRoleChangeButton;
