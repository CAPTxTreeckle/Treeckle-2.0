import { Grid } from "semantic-ui-react";
import { VenueViewProps } from "../../types/venues";
import VenueFormGalleryItem from "../venue-form-gallery-item";
import "./venue-form-gallery.scss";

type Props = {
  venues: VenueViewProps[];
};

function VenueFormGallery({ venues }: Props) {
  return (
    <Grid className="venue-form-gallery" stretched>
      {venues.map((venue) => (
        <Grid.Column
          className="venue-form-item-container"
          key={venue.id}
          width="16"
        >
          <VenueFormGalleryItem {...venue} />
        </Grid.Column>
      ))}
    </Grid>
  );
}

export default VenueFormGallery;
