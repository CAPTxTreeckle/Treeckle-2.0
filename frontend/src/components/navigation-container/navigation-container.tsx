import React, { useContext } from "react";
import MobileNavigationBar from "./mobile-navigation-bar";
import DesktopNavigationBar from "./desktop-navigation-bar";
import { UserContext, Media } from "../../context-providers";
import "./navigation-container.scss";

type Props = {
  children: React.ReactNode;
};

function NavigationContainer({ children }: Props) {
  const { accessToken } = useContext(UserContext);

  return (
    <>
      {accessToken ? (
        <>
          <Media lessThan="computer">
            <MobileNavigationBar>{children}</MobileNavigationBar>
          </Media>
          <Media greaterThanOrEqual="computer">
            <DesktopNavigationBar>{children}</DesktopNavigationBar>
          </Media>
        </>
      ) : (
        children
      )}
    </>
  );
}

export default NavigationContainer;
