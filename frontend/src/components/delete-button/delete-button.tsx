import React, { useContext } from "react";
import { Button, Popup } from "semantic-ui-react";
import { DeleteModalContext } from "../../context-providers";

function DeleteButton() {
  const { setModalOpen } = useContext(DeleteModalContext);

  return (
    <Popup
      content="Delete"
      position="top center"
      trigger={
        <Button
          color="red"
          compact
          icon="trash alternate"
          onClick={() => setModalOpen(true)}
        />
      }
    />
  );
}

export default DeleteButton;
