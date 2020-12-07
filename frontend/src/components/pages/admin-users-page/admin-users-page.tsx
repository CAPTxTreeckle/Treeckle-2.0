import React, { useCallback, useMemo } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Button, Icon, Menu, MenuItemProps } from "semantic-ui-react";
import {
  ADMIN_USERS_CREATION_PATH,
  ADMIN_USERS_PATH,
  ADMIN_USERS_PENDING_REGISTRATION_PATH,
} from "../../../routes/paths";
import UserInvitesSection from "../../user-invites-section";
import UsersSection from "../../users-section";

const adminUsersCategoryPaths = [
  ADMIN_USERS_PATH,
  ADMIN_USERS_PENDING_REGISTRATION_PATH,
];

const adminUsersCategoryHeaders = [
  "Existing Users",
  "Pending Registration Users",
];

const adminUsersCategories = [
  { key: "existing", name: "Existing" },
  { key: "pending", name: "Pending Registration" },
];

function AdminUsersPage() {
  const history = useHistory();
  const location = useLocation();

  const activeIndex = useMemo(() => {
    const activeIndex = adminUsersCategoryPaths.indexOf(location.pathname);

    return activeIndex >= 0 ? activeIndex : 0;
  }, [location]);

  const activeSection = useMemo(
    () => [<UsersSection />, <UserInvitesSection />][activeIndex],
    [activeIndex],
  );

  const onTabClick = useCallback(
    (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      { index = 0 }: MenuItemProps,
    ) => {
      const newPath = adminUsersCategoryPaths?.[index] ?? ADMIN_USERS_PATH;

      if (index === activeIndex) {
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

      <Menu
        onItemClick={onTabClick}
        activeIndex={activeIndex}
        items={adminUsersCategories}
        fluid
      />

      {activeSection}
    </>
  );
}

export default AdminUsersPage;
