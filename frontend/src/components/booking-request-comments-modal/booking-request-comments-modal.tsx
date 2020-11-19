import React from "react";
import { Icon, Modal } from "semantic-ui-react";
import BookingRequestComments from "../booking-request-comments/booking-request-comments";
import "./booking-request-comments-modal.scss";

interface Props {
  bookingRequestId: number;
  iconClassName?: string;
}

function BookingRequestCommentModal({
  bookingRequestId,
  iconClassName,
}: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Modal
      open={isOpen}
      dimmer="blurring"
      trigger={
        <Icon
          name="comments"
          className={iconClassName ?? ""}
          onClick={(event: React.MouseEvent) => {
            event.preventDefault();
            setIsOpen(true);
            event.stopPropagation();
          }}
        />
      }
      // workaround to prevent modal from closing on click
      onClick={(event: React.MouseEvent) => event.stopPropagation()}
    >
      <BookingRequestComments bookingRequestId={bookingRequestId} />
    </Modal>
  );
}

export default BookingRequestCommentModal;
