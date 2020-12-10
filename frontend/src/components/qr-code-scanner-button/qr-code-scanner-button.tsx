import React, { useCallback, useState } from "react";
import {
  Header,
  Icon,
  Menu,
  Modal,
  TransitionablePortal,
} from "semantic-ui-react";
import QrReader from "react-qr-reader";
import { toast } from "react-toastify";
import { useAttendEvent } from "../../custom-hooks/api";
import PlaceholderWrapper from "../placeholder-wrapper";
import { QrCodeType } from "../../types/qr-code";

function QrCodeScannerButton() {
  const [isQrScannerOpened, setQrScannerOpened] = useState(false);
  const { attendEvent, isLoading } = useAttendEvent();

  const onError = useCallback((error: Error) => {
    toast.error(error?.message ?? "QR code cannot be read.", {
      position: "top-center",
    });
  }, []);

  const onScan = useCallback(
    async (dataString: string | null) => {
      if (!dataString || isLoading) {
        return;
      }

      try {
        const data = JSON.parse(dataString);
        const { type }: { type: QrCodeType } = data;

        if (type === QrCodeType.EventAttendance) {
          const { eventId }: { eventId: number } = data;
          await attendEvent(eventId);
          return;
        }

        throw new Error("Invalid QR code.");
      } catch (error) {
        onError(error);
      } finally {
        setQrScannerOpened(false);
      }
    },
    [onError, attendEvent, isLoading],
  );

  return (
    <Menu.Item>
      <Icon
        name="qrcode"
        link
        fitted
        size="large"
        onClick={() => setQrScannerOpened(true)}
      />
      <TransitionablePortal
        open={isQrScannerOpened}
        transition={{ animation: "fade down" }}
      >
        <Modal
          open
          onClose={() => setQrScannerOpened(false)}
          size="tiny"
          closeIcon
        >
          <Modal.Header as={Header} textAlign="center" content="Scan QR Code" />
          <Modal.Content>
            <PlaceholderWrapper isLoading={isLoading} placeholder>
              <QrReader
                onError={onError}
                onScan={onScan}
                showViewFinder={false}
                delay={300}
              />
            </PlaceholderWrapper>
          </Modal.Content>
        </Modal>
      </TransitionablePortal>
    </Menu.Item>
  );
}

export default QrCodeScannerButton;
