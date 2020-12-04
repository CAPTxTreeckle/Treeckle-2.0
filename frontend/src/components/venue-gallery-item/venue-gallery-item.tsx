import React from "react";
import { Card } from "semantic-ui-react";
import { VenueViewProps } from "../../types/venues";

interface Props {
  venue: VenueViewProps;
  onClickVenue?: (venue: VenueViewProps) => void;
}

function VenueGalleryItem({ venue, onClickVenue }: Props) {
  const { venueFormProps } = venue;
  const { venueName } = venueFormProps;
  return (
    <div
      className="flex-display hover-bob hover-pointing"
      onClick={onClickVenue && (() => onClickVenue(venue))}
    >
      <Card raised>
        <Card.Content className="flex-no-grow">{venueName}</Card.Content>
      </Card>
    </div>
  );
}

export default VenueGalleryItem;
