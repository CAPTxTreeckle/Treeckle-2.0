import React, { useState } from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

type DeleteModalContextType = {
  isModalOpen: boolean;
  setModalOpen: (newValue: boolean) => void;
};

export const DeleteModalContext = React.createContext<DeleteModalContextType>({
  isModalOpen: false,
  setModalOpen: () => {
    throw new Error("setModalOpen not defined.");
  },
});

type Props = {
  children: React.ReactNode;
  isDeleting?: boolean;
  onDelete?: () => Promise<boolean>;
  deleteTitle?: string;
  deleteDescription?: string;
};

function ModalProvider({
  children,
  isDeleting = false,
  onDelete,
  deleteTitle = "Delete",
  deleteDescription = "Are you sure you want to delete?",
}: Props) {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <DeleteModalContext.Provider
      value={{
        isModalOpen,
        setModalOpen,
      }}
    >
      {children}
      <Modal
        basic
        onClose={() => setModalOpen(false)}
        open={isModalOpen}
        size="tiny"
        dimmer={<Modal.Dimmer style={{ zIndex: 2000 }} />}
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
            onClick={() => setModalOpen(false)}
            basic
            color="red"
            inverted
            icon="remove"
            content="No"
          />
          <Button
            onClick={async () => (await onDelete?.()) && setModalOpen(false)}
            loading={isDeleting}
            basic
            color="green"
            inverted
            icon="checkmark"
            content="Yes"
          />
        </Modal.Actions>
      </Modal>
    </DeleteModalContext.Provider>
  );
}

export default ModalProvider;
