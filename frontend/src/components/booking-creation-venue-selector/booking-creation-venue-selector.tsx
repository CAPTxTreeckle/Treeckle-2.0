import React, { useContext, useEffect } from "react";
import { Grid, Card, Segment } from "semantic-ui-react";
import { BookingCreationContext } from "../../context-providers";
import { useGetVenues } from "../../custom-hooks/api";
import PlaceholderWrapper from "../placeholder-wrapper";

function BookingCreationVenueSelector() {
  const { selectedCategory, goToNextStep } = useContext(BookingCreationContext);
  const { venues, isLoading, getVenues } = useGetVenues();

  useEffect(() => {
    getVenues(selectedCategory);
  }, [getVenues, selectedCategory]);

  return (
    <PlaceholderWrapper
      loadingMessage="Retrieving venues"
      isLoading={isLoading}
      showDefaultMessage={venues.length <= 0}
      defaultMessage="There are no available venues"
    >
      <Grid columns="3" stackable stretched centered padded>
        {venues.map((venue) => (
          <Grid.Column>
            <div className="flex-display hover-bob hover-pointing hover-dimming">
              <div className="flex-display full-width scale-in-center">
                <Card
                  as={Segment}
                  centered
                  raised
                  padded
                  fluid
                  onClick={() => goToNextStep(venue)}
                >
                  <Card.Content>
                    <Card.Header textAlign="center">
                      {venue.venueFormProps.name}
                    </Card.Header>
                  </Card.Content>
                </Card>
              </div>
            </div>
          </Grid.Column>
        ))}
      </Grid>
    </PlaceholderWrapper>
  );
}

export default BookingCreationVenueSelector;
