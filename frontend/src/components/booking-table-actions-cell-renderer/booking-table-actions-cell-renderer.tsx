import React, { useCallback, useContext, useMemo } from "react";
import { Button } from "semantic-ui-react";
import PopUpActionsWrapper from "../pop-up-actions-wrapper";
import { BookingViewProps, BookingStatus } from "../../types/bookings";
import BookingStatusChangeButton from "../booking-status-change-button/booking-status-change-button";
import { BookingsContext, DeleteModalProvider } from "../../context-providers";
import DeleteModalButton from "../delete-modal-button";
import BookingDetailsViewButton from "../booking-details-view-button";

type Props = {
  rowData: BookingViewProps;
  adminView?: boolean;
};

function BookingTableActionsCellRenderer({
  rowData,
  adminView = false,
}: Props) {
  const { id, status, title } = rowData;
  const { deleteBookings } = useContext(BookingsContext);

  const onDelete = useCallback(async () => {
    const deletedBookings = await deleteBookings([id]);
    return deletedBookings.length > 0;
  }, [deleteBookings, id]);

  const actionButtons = useMemo(() => {
    const buttons = [
      <BookingDetailsViewButton
        key="view details"
        bookingViewProps={rowData}
        adminView={adminView}
      />,
    ];

    if (status !== BookingStatus.Cancelled) {
      buttons.push(
        <BookingStatusChangeButton
          key="change status"
          bookingId={id}
          currentStatus={status}
          adminView={adminView}
        />,
      );
    }

    if (adminView) {
      buttons.push(<DeleteModalButton key="delete" />);
    }
    return buttons;
  }, [status, id, adminView, rowData]);

  return (
    <DeleteModalProvider
      onDelete={onDelete}
      deleteTitle="Delete Booking Request"
      deleteDescription={`Are you sure you want to delete booking request (${title})?`}
    >
      <PopUpActionsWrapper actionButtons={actionButtons}>
        <Button icon="ellipsis horizontal" compact />
      </PopUpActionsWrapper>
    </DeleteModalProvider>
  );
}

export default BookingTableActionsCellRenderer;
