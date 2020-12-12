import React from "react";
import { Grid } from "semantic-ui-react";
import { EventViewProps } from "../../types/events";

type Props = {
  events: EventViewProps[];
  GalleryItem: (eventViewProps: EventViewProps) => JSX.Element;
};

function EventGallery({ events, GalleryItem }: Props) {
  return (
    <Grid stretched columns="4" centered padded="vertically" stackable>
      {events.map((event) => (
        <Grid.Column key={event.id}>
          <GalleryItem {...event} />
        </Grid.Column>
      ))}
    </Grid>
  );
}

export default EventGallery;
