import React, { useCallback, useState } from "react";
import { Button, Popup, Modal, Header, Icon } from "semantic-ui-react";

type Props = {
  onDelete?: () => Promise<boolean>;
  deleteTitle?: string;
  deleteDescription?: string;
};

function DeleteButton({
  onDelete,
  deleteTitle = "Delete",
  deleteDescription = "Are you sure you want to delete?",
}: Props) {
  const [isPrompting, setPrompting] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const _onDelete = useCallback(async () => {
    setDeleting(true);
    if (await onDelete?.()) {
      setPrompting(false);
    }
    setDeleting(false);
  }, [onDelete]);

  return (
    <>
      <Popup
        content="Delete"
        position="top center"
        trigger={
          <Button
            color="red"
            compact
            icon="trash alternate"
            onClick={() => setPrompting(true)}
          />
        }
      />
      <Modal
        basic
        onClose={() => setPrompting(false)}
        open={isPrompting}
        size="tiny"
      >
        <Header icon>
          <Icon name="trash alternate outline" />
          {deleteTitle}
        </Header>

        <Modal.Content>
          <Modal.Description>{deleteDescription}</Modal.Description>
        </Modal.Content>

        <Modal.Actions>
          <Button
            onClick={() => setPrompting(false)}
            basic
            color="red"
            inverted
            icon="remove"
            content="No"
          />
          <Button
            onClick={_onDelete}
            loading={isDeleting}
            basic
            color="green"
            inverted
            icon="checkmark"
            content="Yes"
          />
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default DeleteButton;
