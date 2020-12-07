import React, { useContext } from "react";
import { StrictButtonProps } from "semantic-ui-react";
import { DeleteModalContext } from "../../context-providers";
import DeleteButton from "../delete-button";

type Props = {
  compact?: boolean;
  popUpContent?: string | null;
  label?: string;
  icon?: StrictButtonProps["icon"];
};

function DeleteModalButton({ compact, popUpContent, label, icon }: Props) {
  const { setModalOpen } = useContext(DeleteModalContext);

  return (
    <DeleteButton
      onDelete={() => setModalOpen(true)}
      compact={compact}
      popUpContent={popUpContent}
      label={label}
      icon={icon}
    />
  );
}

export default DeleteModalButton;
