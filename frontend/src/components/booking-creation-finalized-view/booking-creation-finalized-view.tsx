import { useContext } from "react";
import { Segment, Button, Grid } from "semantic-ui-react";
import { BookingCreationContext } from "../../context-providers";
import { FieldType } from "../../types/venues";
import { displayDateTime } from "../../utils/parser-utils";
import TextViewer from "../text-viewer";

function BookingCreationFinalizedView() {
  const {
    goToNextStep,
    goToPreviousStep,
    selectedVenue,
    newBookingDateTimeRanges,
    bookingTitle,
    bookingFormData,
    isSubmitting,
    hasCreatedBookings,
  } = useContext(BookingCreationContext);
  const { name: venueName } = { ...selectedVenue?.venueFormProps };

  return (
    <>
      <Segment padded="very">
        <TextViewer>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width="4">
                <strong>Venue:</strong>
              </Grid.Column>
              <Grid.Column width="12">{venueName}</Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width="4">
                <strong>Booking period(s):</strong>
              </Grid.Column>
              <Grid.Column width="12">
                {`1. ${displayDateTime(
                  newBookingDateTimeRanges[0].startDateTime,
                )} - ${displayDateTime(
                  newBookingDateTimeRanges[0].endDateTime,
                )}`}
              </Grid.Column>
            </Grid.Row>

            {newBookingDateTimeRanges.flatMap(
              ({ startDateTime, endDateTime }, index) => {
                const label = `${index + 1}. ${displayDateTime(
                  startDateTime,
                )} - ${displayDateTime(endDateTime)}`;

                return index > 0
                  ? [
                      <Grid.Row key={label}>
                        <Grid.Column width="4" />
                        <Grid.Column width="12">{label}</Grid.Column>
                      </Grid.Row>,
                    ]
                  : [];
              },
            )}

            <Grid.Row>
              <Grid.Column width="4">
                <strong>Booking Title:</strong>
              </Grid.Column>
              <Grid.Column width="12">{bookingTitle}</Grid.Column>
            </Grid.Row>

            {bookingFormData.flatMap(
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
                        <Grid.Column width="12">
                          {displayedResponse}
                        </Grid.Column>
                      </Grid.Row>,
                    ]
                  : [];
              },
            )}
          </Grid>
        </TextViewer>
      </Segment>

      <Segment secondary>
        <div className="action-container justify-end">
          <Button
            color="black"
            content="Back"
            onClick={goToPreviousStep}
            disabled={hasCreatedBookings}
          />
          <Button
            color="blue"
            content="Submit"
            onClick={goToNextStep}
            loading={isSubmitting}
            disabled={hasCreatedBookings}
          />
        </div>
      </Segment>
    </>
  );
}

export default BookingCreationFinalizedView;
