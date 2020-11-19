import React from "react";
import { Menu, Container } from "semantic-ui-react";
import LogoTab from "../logo-tab";
import DashboardTab from "../dashboard-tab";
import EventsTab from "../events-tab";
import BookingsTab from "../bookings-tab";
import DesktopAdminTab from "../desktop-admin-tab";
import UserTab from "../user-tab";
import "./desktop-navigation-bar.scss";
import { Role } from "../../../types/users";
import RoleRestrictedWrapper from "../../role-restricted-wrapper";

type Props = {
  children: React.ReactNode;
};

function DesktopNavigationBar({ children }: Props) {
  return (
    <div className="desktop-root-container">
      <Menu className="app-bar" borderless size="huge" fixed="top">
        <LogoTab />
        <DashboardTab />
        <BookingsTab />
        <EventsTab />
        <RoleRestrictedWrapper roles={[Role.ADMIN]}>
          <DesktopAdminTab />
        </RoleRestrictedWrapper>
        <UserTab />
      </Menu>

      <div className="desktop-page-container">
        <Container>{children}</Container>
      </div>
    </div>
  );
}

export default DesktopNavigationBar;
