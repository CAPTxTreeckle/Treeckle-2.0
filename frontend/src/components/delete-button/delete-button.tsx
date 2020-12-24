import { Popup, Button, StrictButtonProps } from "semantic-ui-react";

type Props = {
  compact?: boolean;
  onDelete?: () => void;
  popUpContent?: string | null;
  label?: string;
  icon?: StrictButtonProps["icon"];
  disabled?: boolean;
};

function DeleteButton({
  compact = false,
  onDelete,
  popUpContent = "Delete",
  label,
  icon = "trash alternate",
  disabled = false,
}: Props) {
  return (
    <Popup
      content={popUpContent}
      position="top center"
      disabled={popUpContent === null}
      trigger={
        <Button
          compact={compact}
          color="red"
          icon={icon}
          onClick={onDelete}
          content={label}
          disabled={disabled}
        />
      }
    />
  );
}

export default DeleteButton;
