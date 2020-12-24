import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

type DeleteModalContextType = {
  isModalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteModalContext = createContext<DeleteModalContextType>({
  isModalOpen: false,
  setModalOpen: () => {
    throw new Error("setModalOpen not defined.");
  },
});

type Props = {
  children: ReactNode;
  isDeleting?: boolean;
  onDelete?: () => Promise<boolean> | boolean;
  deleteTitle?: string;
  deleteDescription?: string;
};

function DeleteModalProvider({
  children,
  isDeleting = false,
  onDelete,
  deleteTitle = "Delete",
  deleteDescription = "Are you sure you want to delete?",
}: Props) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [_isDeleting, setDeleting] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const _onDelete = useCallback(async () => {
    setDeleting(true);
    if (await onDelete?.()) {
      isMounted.current && setModalOpen(false);
    }
    isMounted.current && setDeleting(false);
  }, [onDelete]);

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
            onClick={_onDelete}
            loading={isDeleting || _isDeleting}
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

export default DeleteModalProvider;
