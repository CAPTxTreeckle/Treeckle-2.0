import React, { useContext, useEffect } from "react";
import { Grid, Card, Segment, Header, Button } from "semantic-ui-react";
import { BookingCreationContext } from "../../context-providers";
import { useGetVenues } from "../../custom-hooks/api";
import PlaceholderWrapper from "../placeholder-wrapper";

function BookingCreationVenueSelector() {
  const { selectedCategory, goToNextStep, goToPreviousStep } = useContext(
    BookingCreationContext,
  );
  const { venues, isLoading, getVenues } = useGetVenues();

  useEffect(() => {
    getVenues({ category: selectedCategory });
  }, [getVenues, selectedCategory]);

  return (
    <>
      <Segment>
        <PlaceholderWrapper
          loadingMessage="Retrieving venues"
          isLoading={isLoading}
          showDefaultMessage={venues.length === 0}
          defaultMessage="There are no available venues"
        >
          <Grid columns="3" stackable stretched centered padded>
            {venues.map((venue) => (
              <Grid.Column key={venue.id}>
                <div className="flex-display hover-bob pointer hover-dimming">
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
                        <Header textAlign="center">
                          {venue.venueFormProps.name}
                          {venue.venueFormProps.capacity && (
                            <Header.Subheader>
                              Recommended Capacity:{" "}
                              <strong>{venue.venueFormProps.capacity}</strong>
                            </Header.Subheader>
                          )}
                        </Header>
                      </Card.Content>
                    </Card>
                  </div>
                </div>
              </Grid.Column>
            ))}
          </Grid>
        </PlaceholderWrapper>
      </Segment>

      <Segment secondary>
        <div className="action-container justify-end">
          <Button color="black" content="Back" onClick={goToPreviousStep} />
        </div>
      </Segment>
    </>
  );
}

export default BookingCreationVenueSelector;
