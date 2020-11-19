import React from "react";
import { Grid } from "semantic-ui-react";
import { VenueViewProps } from "../../types/venues";
import VenueFormGalleryItem from "../venue-form-gallery-item";
import VenueGalleryItem from "../venue-gallery-item";
import "./venue-gallery.scss";

type Props = {
  venues: VenueViewProps[];
  displayForm: boolean;
  onClickVenue?: (venue: VenueViewProps) => void;
};

function VenueGallery({ venues, displayForm, onClickVenue }: Props) {
  return (
    <Grid id="venue-form-gallery" stretched>
      {venues.map((venue) => (
        <Grid.Column
          className="venue-form-item-container"
          key={venue.id}
          width="16"
        >
          {displayForm ? (
            <VenueFormGalleryItem {...venue} />
          ) : (
            <VenueGalleryItem venue={venue} onClickVenue={onClickVenue} />
          )}
        </Grid.Column>
      ))}
    </Grid>
  );
}

export default VenueGallery;
