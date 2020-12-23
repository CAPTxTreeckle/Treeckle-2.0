import React, { useContext } from "react";
import { Popup, Button, ModalContent } from "semantic-ui-react";
import { GlobalModalContext } from "../../context-providers";
import { BookingViewProps } from "../../types/bookings";
import BookingDetailsView from "../booking-details-view";

type Props = {
  bookingViewProps: BookingViewProps;
  adminView?: boolean;
};

function BookingDetailsViewButton({
  bookingViewProps,
  adminView = false,
}: Props) {
  const { setModalOpen, setModalProps } = useContext(GlobalModalContext);

  return (
    <Popup
      trigger={
        <Button
          icon="list alternate outline"
          color="blue"
          onClick={() => {
            setModalProps({
              size: "small",
              content: (
                <ModalContent>
                  <BookingDetailsView
                    bookingViewProps={bookingViewProps}
                    adminView={adminView}
                  />
                </ModalContent>
              ),
            });
            setModalOpen(true);
          }}
        />
      }
      content="View details"
      position="top center"
    />
  );
}

export default BookingDetailsViewButton;
