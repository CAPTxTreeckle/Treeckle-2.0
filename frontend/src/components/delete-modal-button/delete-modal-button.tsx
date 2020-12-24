import { useContext } from "react";
import { StrictButtonProps } from "semantic-ui-react";
import { DeleteModalContext } from "../../context-providers";
import DeleteButton from "../delete-button";

type Props = {
  compact?: boolean;
  popUpContent?: string | null;
  label?: string;
  icon?: StrictButtonProps["icon"];
  disabled?: boolean;
};

function DeleteModalButton({
  compact,
  popUpContent,
  label,
  icon,
  disabled,
}: Props) {
  const { setModalOpen } = useContext(DeleteModalContext);

  return (
    <DeleteButton
      onDelete={() => setModalOpen(true)}
      compact={compact}
      popUpContent={popUpContent}
      label={label}
      icon={icon}
      disabled={disabled}
    />
  );
}

export default DeleteModalButton;
