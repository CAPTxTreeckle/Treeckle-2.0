import React from "react";
import { Grid } from "semantic-ui-react";
import { EventViewProps } from "../../types/events";
import EventViewOnlyGalleryItem from "../event-view-only-gallery-item";

type Props = {
  events: EventViewProps[];
};

function EventViewOnlyGallery({ events }: Props) {
  return (
    <Grid stretched columns="3" centered padded="vertically" stackable>
      {events.map((event) => (
        <Grid.Column key={event.id}>
          <EventViewOnlyGalleryItem {...event} />
        </Grid.Column>
      ))}
    </Grid>
  );
}

export default EventViewOnlyGallery;
