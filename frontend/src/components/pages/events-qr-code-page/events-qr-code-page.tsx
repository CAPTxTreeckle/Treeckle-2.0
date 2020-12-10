import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleEvent } from "../../../custom-hooks/api";
import PlaceholderWrapper from "../../placeholder-wrapper";
import { QrCodeType } from "../../../types/qr-code";
import QrCodeViewer from "../../qr-code-viewer";
import "./events-qr-code-page.scss";

function EventsQrCodePage() {
  const { id } = useParams<{ id: string }>();
  const eventId = parseInt(id, 10);
  const { event, isLoading, getSingleEvent } = useGetSingleEvent();
  const qrCodeData = useMemo(
    () =>
      JSON.stringify({
        type: QrCodeType.EventAttendance,
        eventId,
      }),
    [eventId],
  );

  useEffect(() => {
    getSingleEvent(eventId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  return (
    <PlaceholderWrapper
      isLoading={isLoading}
      loadingMessage="Generating QR code"
      showDefaultMessage={!event}
      defaultMessage="No event found"
      inverted
      placeholder
    >
      <div id="events-qr-code-page">
        <h1>{event?.eventFormProps?.title}</h1>
        <h2 className="subtitle">
          (Scan using Treeckle's in-app QR code scanner)
        </h2>
        <QrCodeViewer value={qrCodeData} />
      </div>
    </PlaceholderWrapper>
  );
}

export default EventsQrCodePage;
