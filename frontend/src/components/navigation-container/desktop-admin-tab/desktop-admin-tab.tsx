import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Label, Dropdown } from "semantic-ui-react";
import {
  ADMIN_BOOKINGS_PATH,
  ADMIN_USERS_PATH,
  ADMIN_SETTINGS_PATH,
  ADMIN_VENUES_PATH,
} from "../../../routes/paths";

function DesktopAdminTab() {
  const location = useLocation();
  const { pathname } = location;

  return (
    <Dropdown
      className={pathname.startsWith("/admin") ? "active" : undefined}
      text="Admin"
      item
      icon={<Label content={0} color="red" />}
      floating
    >
      <Dropdown.Menu>
        <Dropdown.Item
          as={Link}
          to={ADMIN_BOOKINGS_PATH}
          active={pathname.startsWith(ADMIN_BOOKINGS_PATH)}
          text="Bookings"
        />
        <Dropdown.Item
          as={Link}
          to={ADMIN_VENUES_PATH}
          active={pathname.startsWith(ADMIN_VENUES_PATH)}
          text="Venues"
        />
        <Dropdown.Item
          as={Link}
          to={ADMIN_USERS_PATH}
          active={pathname.startsWith(ADMIN_USERS_PATH)}
          text="Users"
        />
        <Dropdown.Item
          as={Link}
          to={ADMIN_SETTINGS_PATH}
          active={pathname.startsWith(ADMIN_SETTINGS_PATH)}
          text="Settings"
        />
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DesktopAdminTab;
