import { useCallback, useContext, useMemo, useState } from "react";
import { Button, Popup } from "semantic-ui-react";
import { BookingsContext } from "../../context-providers";
import { BookingStatus, BookingStatusActionType } from "../../types/bookings";
import { PopUpActionsWrapperContext } from "../pop-up-actions-wrapper";

type Props = {
  bookingId: number;
  currentStatus: BookingStatus;
  adminView?: boolean;
};

function BookingStatusChangeButton({
  bookingId,
  currentStatus,
  adminView = false,
}: Props) {
  const { extraContent, setExtraContent, closePopUp } = useContext(
    PopUpActionsWrapperContext,
  );
  const { updateBookingStatuses } = useContext(BookingsContext);
  const [isUpdating, setUpdating] = useState(false);

  const updateBookingStatus = useCallback(
    async (action: BookingStatusActionType) => {
      setUpdating(true);
      await updateBookingStatuses([{ bookingId, action }]);
      setUpdating(false);
      closePopUp();
    },
    [bookingId, updateBookingStatuses, closePopUp],
  );

  const approveButton = useMemo(
    () => (
      <Button
        key="approve"
        content="Approve"
        color="green"
        onClick={() => updateBookingStatus(BookingStatusActionType.Approve)}
      />
    ),
    [updateBookingStatus],
  );

  const revokeButton = useMemo(
    () => (
      <Button
        key="revoke"
        content="Revoke"
        color="orange"
        onClick={() => updateBookingStatus(BookingStatusActionType.Revoke)}
      />
    ),
    [updateBookingStatus],
  );

  const rejectButton = useMemo(
    () => (
      <Button
        key="reject"
        content="Reject"
        color="red"
        onClick={() => updateBookingStatus(BookingStatusActionType.Reject)}
      />
    ),
    [updateBookingStatus],
  );

  const cancelButton = useMemo(
    () => (
      <Button
        key="cancel"
        content="Cancel"
        color="black"
        onClick={() => updateBookingStatus(BookingStatusActionType.Cancel)}
      />
    ),
    [updateBookingStatus],
  );

  const actionButtons = useMemo(() => {
    if (!adminView) {
      return currentStatus === BookingStatus.Cancelled ? [] : [cancelButton];
    }

    switch (currentStatus) {
      case BookingStatus.Pending:
        return [approveButton, rejectButton];
      case BookingStatus.Approved:
        return [revokeButton, rejectButton];
      case BookingStatus.Rejected:
        return [approveButton, revokeButton];
      case BookingStatus.Cancelled:
      default:
        return [];
    }
  }, [
    currentStatus,
    approveButton,
    revokeButton,
    rejectButton,
    cancelButton,
    adminView,
  ]);

  return (
    <Popup
      trigger={
        <Button
          disabled={currentStatus === BookingStatus.Cancelled}
          icon="refresh"
          color="twitter"
          loading={isUpdating}
          onClick={() =>
            setExtraContent(
              extraContent || actionButtons.length === 0 ? null : (
                <Button.Group fluid vertical>
                  {actionButtons}
                </Button.Group>
              ),
            )
          }
        />
      }
      position="top center"
      content="Change status"
    />
  );
}

export default BookingStatusChangeButton;
