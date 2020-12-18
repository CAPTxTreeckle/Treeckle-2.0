import React, { useContext, useEffect } from "react";
import { Card, Grid, Segment } from "semantic-ui-react";
import { BookingCreationContext } from "../../context-providers";
import { useGetVenueCategories } from "../../custom-hooks/api";
import PlaceholderWrapper from "../placeholder-wrapper";

function BookingCreationCategorySelector() {
  const { goToNextStep } = useContext(BookingCreationContext);
  const {
    venueCategories,
    getVenueCategories,
    isLoading,
  } = useGetVenueCategories();

  useEffect(() => {
    getVenueCategories();
  }, [getVenueCategories]);

  return (
    <PlaceholderWrapper
      loadingMessage="Retrieving categories"
      isLoading={isLoading}
      showDefaultMessage={venueCategories.length <= 0}
      defaultMessage="There are no available categories"
    >
      <Grid columns="3" stackable stretched centered padded>
        {venueCategories.map((category) => (
          <Grid.Column>
            <div className="flex-display hover-bob hover-pointing hover-dimming">
              <div className="flex-display full-width scale-in-center">
                <Card
                  as={Segment}
                  centered
                  raised
                  padded
                  fluid
                  onClick={() => goToNextStep(category)}
                >
                  <Card.Content>
                    <Card.Header textAlign="center">{category}</Card.Header>
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

export default BookingCreationCategorySelector;
