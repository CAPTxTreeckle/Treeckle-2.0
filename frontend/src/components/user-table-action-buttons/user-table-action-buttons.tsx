import React from "react";
import { Button, Icon, Popup } from "semantic-ui-react";
import { Media } from "../../context-providers/responsive-provider";
import { Role, UserData } from "../../types/users";
import { toTitleCase } from "../../utils/helpers";
import "./user-table-action-buttons.scss";

interface Props {
  rowData: UserData;
  onClickDeleteUserButton: () => void;
  patchUserRole: (id: number, role: string) => Promise<void>;
}

const arrayOfUserRoles = Object.entries(Role).map(([key, value]) => ({
  role: value,
  label: toTitleCase(key),
}));

function UserTableActionButtons({
  rowData,
  onClickDeleteUserButton,
  patchUserRole,
}: Props) {
  const userRole = rowData.role;
  const isDisabled = userRole === Role.ADMIN;
  interface ButtonProps {
    isMobile: boolean;
  }
  const ChangeRoleButton = ({ isMobile }: ButtonProps) => (
    <Popup
      on="click"
      pinned
      position={isMobile ? "left center" : "bottom center"}
      inverted
      trigger={
        <Button
          basic
          size={isMobile ? "mini" : "medium"}
          color="green"
          disabled={isDisabled}
          className="user-table-action-button"
        >
          <Media greaterThanOrEqual="computer">Change Role</Media>
          <Media lessThan="computer">
            <Icon name="edit" className="user-table-button-icon" />
          </Media>
        </Button>
      }
      className="change-role-container"
    >
      {arrayOfUserRoles.map((role) => {
        if (userRole === role.role) {
          return null;
        }
        return (
          <Button
            basic
            fluid
            inverted
            color="green"
            onClick={() => {
              patchUserRole(rowData.id, role.label.toUpperCase());
            }}
          >
            Change to {role.label}
          </Button>
        );
      })}
    </Popup>
  );

  const DeleteUserButton = ({ isMobile }: ButtonProps) => (
    <Button
      onClick={onClickDeleteUserButton}
      color="red"
      size={isMobile ? "mini" : "medium"}
      disabled={isDisabled}
      className="user-table-action-button"
    >
      <Media greaterThanOrEqual="computer">Delete User</Media>
      <Media lessThan="computer">
        <Icon name="trash" className="user-table-button-icon" />
      </Media>
    </Button>
  );

  return (
    <>
      <Media greaterThanOrEqual="computer">
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ChangeRoleButton isMobile={false} />
          <DeleteUserButton isMobile={false} />
        </div>
      </Media>
      <Media between={["mobileM", "computer"]}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <ChangeRoleButton isMobile />
          <DeleteUserButton isMobile />
        </div>
      </Media>
      <Media lessThan="mobileM">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Popup
            on="click"
            pinned
            position="bottom center"
            inverted
            trigger={
              <Button
                basic
                size="mini"
                color="green"
                className="user-table-action-button"
              >
                <Icon
                  name="caret square down"
                  className="user-table-button-icon"
                />
              </Button>
            }
          >
            <ChangeRoleButton isMobile />
            <DeleteUserButton isMobile />
          </Popup>
        </div>
      </Media>
    </>
  );
}

export default UserTableActionButtons;
