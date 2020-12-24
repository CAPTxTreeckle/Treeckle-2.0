import React, { useCallback, useMemo } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";
import {
  ADMIN_USERS_CREATION_PATH,
  ADMIN_USERS_PATH,
  ADMIN_USERS_PENDING_REGISTRATION_PATH,
} from "../../../routes/paths";
import ResponsiveSelectorMenu from "../../responsive-selector-menu";
import UserInviteSection from "../../user-invite-section";
import UserSection from "../../user-section";

const adminUsersCategoryPaths = [
  ADMIN_USERS_PATH,
  ADMIN_USERS_PENDING_REGISTRATION_PATH,
];

const adminUsersCategoryHeaders = [
  "Existing Users",
  "Pending Registration Users",
];

const adminUsersCategories = [
  { key: "Existing", name: "Existing", text: "Existing" },
  { key: "Pending Registration", name: "Pending Registration" },
];

const adminUsersSections = [<UserSection />, <UserInviteSection />];

function AdminUsersPage() {
  const history = useHistory();
  const location = useLocation();

  const activeIndex = useMemo(() => {
    const activeIndex = adminUsersCategoryPaths.indexOf(location.pathname);

    return activeIndex >= 0 ? activeIndex : 0;
  }, [location]);

  const activeSection = useMemo(() => adminUsersSections[activeIndex], [
    activeIndex,
  ]);

  const onChange = useCallback(
    (selectedIndex: number) => {
      const newPath =
        adminUsersCategoryPaths?.[selectedIndex] ?? ADMIN_USERS_PATH;

      if (selectedIndex === activeIndex) {
        return;
      }

      history.push(newPath);
    },
    [history, activeIndex],
  );

  return (
    <>
      <Button
        animated="vertical"
        fluid
        color="teal"
        as={Link}
        to={ADMIN_USERS_CREATION_PATH}
      >
        <Button.Content hidden content="Create New Users" />
        <Button.Content visible content={<Icon name="add" />} />
      </Button>

      <h1>{adminUsersCategoryHeaders[activeIndex]}</h1>

      <ResponsiveSelectorMenu
        options={adminUsersCategories}
        onChange={onChange}
        activeIndex={activeIndex}
      />

      {activeSection}
    </>
  );
}

export default AdminUsersPage;
