import React, { useEffect, useState } from "react";
import { Sidebar, Menu, Container } from "semantic-ui-react";
import LogoTab from "../logo-tab";
import DashboardTab from "../dashboard-tab";
import EventsTab from "../events-tab";
import BookingsTab from "../bookings-tab";
import MobileAdminTab from "../mobile-admin-tab";
import UserTab from "../user-tab";
import "./mobile-navigation-bar.scss";
import { Role } from "../../../types/users";
import RoleRestrictedWrapper from "../../role-restricted-wrapper";

type Props = {
  children: React.ReactNode;
};

function MobileNavigationBar({ children }: Props) {
  const [isSidebarOpened, setSidebarOpened] = useState(false);

  const onTabClick = () => {
    setSidebarOpened(false);
  };

  useEffect(() => () => setSidebarOpened(false), []);

  return (
    <Sidebar.Pushable className="mobile-navigation-bar">
      <Sidebar
        as={Menu}
        animation="push"
        onHide={() => setSidebarOpened(false)}
        vertical
        visible={isSidebarOpened}
      >
        <LogoTab onTabClick={onTabClick} />
        <DashboardTab onTabClick={onTabClick} />
        <BookingsTab onTabClick={onTabClick} />
        <EventsTab onTabClick={onTabClick} />
        <RoleRestrictedWrapper roles={[Role.Admin]}>
          <MobileAdminTab onTabClick={onTabClick} />
        </RoleRestrictedWrapper>
      </Sidebar>

      <Sidebar.Pusher dimmed={isSidebarOpened}>
        <Menu className="app-bar" borderless size="huge" fixed="top">
          <Menu.Item
            className="mobile-sidebar-button"
            onClick={() => setSidebarOpened(true)}
            icon="sidebar"
          />
          <UserTab />
        </Menu>

        <div className="mobile-page-container">
          <Container>{children}</Container>
        </div>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
}

export default MobileNavigationBar;
