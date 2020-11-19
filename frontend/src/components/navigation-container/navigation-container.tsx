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
            {(mediaClassNames, renderChildren) => (
              <div className={mediaClassNames}>
                {renderChildren ? (
                  <MobileNavigationBar>{children}</MobileNavigationBar>
                ) : (
                  <DesktopNavigationBar>{children}</DesktopNavigationBar>
                )}
              </div>
            )}
          </Media>
        </>
      ) : (
        children
      )}
    </>
  );
}

export default NavigationContainer;
