import React, { useState } from "react";
import { Modal, ModalProps, TransitionablePortal } from "semantic-ui-react";

type GlobalModalContextType = {
  isModalOpen: boolean;
  setModalOpen: (newValue: boolean) => void;
  modalProps: ModalProps;
  setModalProps: (modalProps: ModalProps) => void;
};

export const GlobalModalContext = React.createContext<GlobalModalContextType>({
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
  children: React.ReactNode;
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
          {...modalProps}
          dimmer={<Modal.Dimmer style={{ zIndex: 3000 }} />}
          open
          onClose={() => setModalOpen(false)}
          size="tiny"
          closeIcon
        />
      </TransitionablePortal>
    </GlobalModalContext.Provider>
  );
}

export default GlobalModalProvider;
