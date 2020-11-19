import React from "react";
import {
  Button,
  ButtonProps,
  Popup,
  StrictButtonGroupProps,
  StrictPopupProps,
} from "semantic-ui-react";

type Props = {
  children: React.ReactNode;
  actions: ButtonProps[];
  offsetRatio?: { widthRatio?: number; heightRatio?: number };
  vertical?: boolean;
  popUpPosition?: StrictPopupProps["position"];
};

function PopUpActionsWrapper({
  children,
  actions,
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
    >
      <Button.Group
        fluid
        widths={actions.length as StrictButtonGroupProps["widths"]}
        vertical={vertical}
        buttons={actions}
      />
    </Popup>
  );
}

export default PopUpActionsWrapper;
