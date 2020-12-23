import React, { useContext } from "react";
import { Label, Icon } from "semantic-ui-react";
import { PendingBookingCountContext } from "../../context-providers";

function BookingPendingStatusCountLabel() {
  const { pendingBookingCount, isLoading } = useContext(
    PendingBookingCountContext,
  );

  return (
    <Label
      content={isLoading ? undefined : pendingBookingCount}
      icon={isLoading ? <Icon name="spinner" loading fitted /> : undefined}
      color="red"
    />
  );
}

export default BookingPendingStatusCountLabel;
