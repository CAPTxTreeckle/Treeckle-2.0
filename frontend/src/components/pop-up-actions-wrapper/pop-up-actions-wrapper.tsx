import React from "react";
import {
  Button,
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
};

function PopUpActionsWrapper({
  children,
  actionButtons,
  offsetRatio: { widthRatio = 0, heightRatio = 0 } = {
    heightRatio: 0,
    widthRatio: 0,
  },
  vertical = false,
  popUpPosition = "top center",
}: Props) {
  return (
    <Popup
      trigger={children}
      position={popUpPosition}
      hoverable
      on={["click"]}
      hideOnScroll
      size="huge"
      offset={({ popper: { width, height } }) => [
        width * widthRatio,
        height * heightRatio,
      ]}
      popper={{ style: { zIndex: 500 } }}
    >
      <Button.Group
        fluid
        widths={actionButtons.length as StrictButtonGroupProps["widths"]}
        vertical={vertical}
      >
        {actionButtons}
      </Button.Group>
    </Popup>
  );
}

export default PopUpActionsWrapper;
