import { Grid, Label } from "semantic-ui-react";
import { BookingViewProps, BookingStatusDetails } from "../../types/bookings";
import { FieldType } from "../../types/venues";
import { displayDateTime } from "../../utils/parser-utils";
import TextViewer from "../text-viewer";

type Props = {
  bookingViewProps: BookingViewProps;
  adminView?: boolean;
};

function BookingDetailsView({ bookingViewProps, adminView = false }: Props) {
  const {
    venueName,
    startDateTime,
    endDateTime,
    createdAt,
    status,
    title,
    formResponseData,
    booker: { name, email },
  } = bookingViewProps;

  return (
    <TextViewer>
      <Grid stackable>
        {adminView && (
          <>
            <Grid.Row>
              <Grid.Column width="4">
                <strong>Name:</strong>
              </Grid.Column>
              <Grid.Column width="12">{name}</Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width="4">
                <strong>Email:</strong>
              </Grid.Column>
              <Grid.Column width="12">{email}</Grid.Column>
            </Grid.Row>
          </>
        )}

        <Grid.Row>
          <Grid.Column width="4">
            <strong>Venue:</strong>
          </Grid.Column>
          <Grid.Column width="12">{venueName}</Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width="4">
            <strong>Booking period:</strong>
          </Grid.Column>
          <Grid.Column width="12">
            {`${displayDateTime(startDateTime)} - ${displayDateTime(
              endDateTime,
            )}`}
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width="4">
            <strong>Created at:</strong>
          </Grid.Column>
          <Grid.Column width="12">{displayDateTime(createdAt)}</Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width="4">
            <strong>Status:</strong>
          </Grid.Column>
          <Grid.Column width="12">
            <Label
              color={BookingStatusDetails.get(status)?.color}
              className="capitalize-text "
              content={status.toLowerCase()}
              size="large"
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width="4">
            <strong>Booking title:</strong>
          </Grid.Column>
          <Grid.Column width="12">{title}</Grid.Column>
        </Grid.Row>

        {formResponseData.flatMap(
          ({ fieldLabel, response, fieldType }, index) => {
            let displayedResponse: string;
            if (fieldType !== FieldType.Boolean) {
              displayedResponse = response as string;
            } else {
              displayedResponse = response ? "Yes" : "No";
            }

            return displayedResponse
              ? [
                  <Grid.Row key={`${fieldLabel}${index}`}>
                    <Grid.Column width="4">
                      <strong>{fieldLabel}:</strong>
                    </Grid.Column>
                    <Grid.Column width="12">{displayedResponse}</Grid.Column>
                  </Grid.Row>,
                ]
              : [];
          },
        )}
      </Grid>
    </TextViewer>
  );
}

export default BookingDetailsView;
