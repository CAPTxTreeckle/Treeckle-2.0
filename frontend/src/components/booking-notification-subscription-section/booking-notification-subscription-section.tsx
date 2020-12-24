import { Segment, Message, Icon } from "semantic-ui-react";
import { BookingNotificationSubscriptionProvider } from "../../context-providers";
import BookingNotificationSubscriptionTable from "../booking-notification-subscription-table";

function BookingNotificationSubscriptionSection() {
  return (
    <BookingNotificationSubscriptionProvider>
      <Segment raised>
        <Message info icon>
          <Icon name="info circle" />
          <Message.Content>
            <p>
              The emails below will be subscribed to the cc email list and
              receive booking receipts for any creation or change in status of
              bookings.
            </p>
          </Message.Content>
        </Message>
      </Segment>

      <BookingNotificationSubscriptionTable />
    </BookingNotificationSubscriptionProvider>
  );
}

export default BookingNotificationSubscriptionSection;
