import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dropdown, Menu, Image } from "semantic-ui-react";
import { toast } from "react-toastify";
import { PROFILE_PATH } from "../../../routes/paths";
import defaultAvatarImage from "../../../assets/avatar.png";
import { UserContext } from "../../../context-providers";
import "./user-tab.scss";
import QrCodeScannerButton from "../../qr-code-scanner-button";

function UserTab() {
  const { name, setUser } = useContext(UserContext);
  const { pathname } = useLocation();

  const onSignOut = () => {
    setUser(null);
    toast.success("Signed out successfully.");
  };

  return (
    <Menu.Menu id="user-tab" position="right">
      <QrCodeScannerButton />
      <Menu.Item content={<strong>{name}</strong>} />

      <Dropdown
        className={pathname.startsWith(PROFILE_PATH) ? "active" : undefined}
        trigger={
          <Image src={defaultAvatarImage} alt="" avatar bordered size="mini" />
        }
        icon={null}
        floating
        item
      >
        <Dropdown.Menu>
          <Dropdown.Item
            as={Link}
            to={PROFILE_PATH}
            active={pathname.startsWith(PROFILE_PATH)}
            text="Profile"
            icon="user"
          />
          <Dropdown.Item onClick={onSignOut} text="Sign Out" icon="sign out" />
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  );
}

export default UserTab;
