import { Link } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";
import { BOOKINGS_CREATION_PATH } from "../../../routes/paths";
import BookingUserSection from "../../booking-user-section";

function BookingsPage() {
  return (
    <>
      <Button
        animated="vertical"
        fluid
        color="teal"
        as={Link}
        to={BOOKINGS_CREATION_PATH}
      >
        <Button.Content hidden content="Create New Bookings" />
        <Button.Content visible content={<Icon name="add" />} />
      </Button>

      <h1>My Bookings</h1>

      <BookingUserSection />
    </>
  );
}

export default BookingsPage;
