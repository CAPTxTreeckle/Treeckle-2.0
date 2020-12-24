import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const updateExistingUserRole = useCallback(
    async (newRole: Role) => {
      setUpdating(true);
      await updateUsers([{ id: userId, role: newRole }]);

      if (isMounted.current) {
        setUpdating(false);
        closePopUp();
      }
    },
    [userId, updateUsers, closePopUp],
  );

  const makeAdminButton = useMemo(
    () => (
      <Button
        key="make admin"
        content="Make Admin"
        color="blue"
        onClick={() => updateExistingUserRole(Role.Admin)}
      />
    ),
    [updateExistingUserRole],
  );

  const makeOrganizerButton = useMemo(
    () => (
      <Button
        key="make organizer"
        content="Make Organizer"
        color="blue"
        onClick={() => updateExistingUserRole(Role.Organizer)}
      />
    ),
    [updateExistingUserRole],
  );

  const makeResidentButton = useMemo(
    () => (
      <Button
        key="make resident"
        content="Make Resident"
        color="blue"
        onClick={() => updateExistingUserRole(Role.Resident)}
      />
    ),
    [updateExistingUserRole],
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
        return [];
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
              extraContent || actionButtons.length === 0 ? null : (
                <Button.Group fluid vertical>
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
