import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { Modal, ModalProps, TransitionablePortal } from "semantic-ui-react";

type GlobalModalContextType = {
  isModalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  modalProps: ModalProps;
  setModalProps: Dispatch<SetStateAction<ModalProps>>;
};

export const GlobalModalContext = createContext<GlobalModalContextType>({
  isModalOpen: false,
  setModalOpen: () => {
    throw new Error("setModalOpen not defined.");
  },
  modalProps: {},
  setModalProps: () => {
    throw new Error("setModalProps not defined.");
  },
});

type Props = {
  children: ReactNode;
};

function GlobalModalProvider({ children }: Props) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState<ModalProps>({});

  return (
    <GlobalModalContext.Provider
      value={{
        isModalOpen,
        setModalOpen,
        modalProps,
        setModalProps,
      }}
    >
      {children}
      <TransitionablePortal
        open={isModalOpen}
        transition={{ animation: "fade down" }}
      >
        <Modal
          size="tiny"
          closeIcon
          {...modalProps}
          dimmer={<Modal.Dimmer style={{ zIndex: 3000 }} />}
          open
          onClose={() => setModalOpen(false)}
        />
      </TransitionablePortal>
    </GlobalModalContext.Provider>
  );
}

export default GlobalModalProvider;
