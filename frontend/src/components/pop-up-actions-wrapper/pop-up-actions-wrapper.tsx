import React, { useCallback, useState } from "react";
import {
  Button,
  Divider,
  Popup,
  StrictButtonGroupProps,
  StrictPopupProps,
} from "semantic-ui-react";

type Props = {
  children: React.ReactNode;
  actionButtons: JSX.Element[];
  offsetRatio?: { widthRatio?: number; heightRatio?: number };
  vertical?: boolean;
  popUpPosition?: StrictPopupProps["position"];
  inverted?: boolean;
};

type PopUpActionsWrapperContextType = {
  extraContent: React.ReactNode;
  setExtraContent: (extraContent: React.ReactNode) => void;
  closePopUp: () => void;
};

export const PopUpActionsWrapperContext = React.createContext<PopUpActionsWrapperContextType>(
  {
    extraContent: null,
    setExtraContent: () => new Error("setExtraContent not defined."),
    closePopUp: () => new Error("setPopUpOpen not defined."),
  },
);

function PopUpActionsWrapper({
  children,
  actionButtons,
  offsetRatio: { widthRatio = 0, heightRatio = 0 } = {
    heightRatio: 0,
    widthRatio: 0,
  },
  vertical = false,
  popUpPosition = "top center",
  inverted = false,
}: Props) {
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [extraContent, setExtraContent] = useState<React.ReactNode>(null);

  const closePopUp = useCallback(() => {
    setExtraContent(null);
    setPopUpOpen(false);
  }, []);

  return (
    <PopUpActionsWrapperContext.Provider
      value={{ extraContent, setExtraContent, closePopUp }}
    >
      <Popup
        inverted={inverted}
        trigger={children}
        position={popUpPosition}
        on={["click"]}
        hideOnScroll
        size="huge"
        offset={({ popper: { width, height } }) => [
          width * widthRatio,
          height * heightRatio,
        ]}
        popperDependencies={[extraContent]}
        onClose={closePopUp}
        onOpen={() => setPopUpOpen(true)}
        open={isPopUpOpen}
      >
        {extraContent && (
          <>
            {extraContent}
            <Divider />
          </>
        )}

        <Button.Group
          fluid
          widths={actionButtons.length as StrictButtonGroupProps["widths"]}
          vertical={vertical}
        >
          {actionButtons}
        </Button.Group>
      </Popup>
    </PopUpActionsWrapperContext.Provider>
  );
}

export default PopUpActionsWrapper;
