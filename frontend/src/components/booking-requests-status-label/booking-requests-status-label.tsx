import React from "react";
import { Button, Icon, Popup } from "semantic-ui-react";

import { BookingRequestStatus } from "../../types/bookings";
import "./booking-requests-status-label.scss";

const statusCellColorMapper = {
  Pending: "#ffecc7",
  Approved: "#ceebd3",
  Rejected: "#ffd9d1",
  Cancelled: "#fb726f",
};

interface Props {
  status: string;
  id: number;
  patchBookingStatus: (id: number, status: number) => Promise<void>;
  isAdminTable: boolean;
}

function BookingRequestStatusLabel({
  status,
  id,
  patchBookingStatus,
  isAdminTable,
}: Props) {
  const label =
    BookingRequestStatus[status as keyof typeof BookingRequestStatus];
  const isDisabled = label !== BookingRequestStatus.PENDING;

  return (
    <Popup
      on="click"
      pinned
      position="bottom center"
      disabled={isDisabled}
      onOpen={(event: React.MouseEvent) => {
        event.stopPropagation();
      }}
      trigger={
        <Button
          style={{
            backgroundColor: statusCellColorMapper[label],
            cursor: isDisabled && "default",
          }}
          size="tiny"
          className="booking-requests-table-status-label booking-requests-table-status-label-responsive"
        >
          {label}
          {!isDisabled && <Icon name="caret down" />}
        </Button>
      }
    >
      <Popup.Content className="booking-requests-status-label-popup-content">
        {isAdminTable ? (
          <>
            <Button
              basic
              fluid
              color="green"
              size="tiny"
              className="booking-requests-table-popup-button booking-requests-table-status-label-responsive"
              onClick={() => {
                patchBookingStatus(id, 1);
              }}
            >
              Approve
            </Button>
            <Button
              basic
              fluid
              color="red"
              size="tiny"
              className="booking-requests-table-popup-button booking-requests-table-status-label-responsive"
              onClick={() => {
                patchBookingStatus(id, 2);
              }}
            >
              Reject
            </Button>
          </>
        ) : (
          <Button
            basic
            fluid
            color="red"
            size="tiny"
            className="booking-requests-table-popup-button booking-requests-table-status-label-responsive"
            onClick={() => {
              patchBookingStatus(id, 3);
            }}
          >
            Cancel
          </Button>
        )}
      </Popup.Content>
    </Popup>
  );
}

export default BookingRequestStatusLabel;
