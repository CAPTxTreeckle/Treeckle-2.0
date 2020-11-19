import React from "react";
import { Grid } from "semantic-ui-react";
import { EventViewProps } from "../../types/events";
import EventEditableGalleryItem from "../event-editable-gallery-item";

type Props = {
  events: EventViewProps[];
};

function EventEditableGallery({ events }: Props) {
  return (
    <Grid stretched columns="3" centered padded="vertically" stackable>
      {events.map((event) => (
        <Grid.Column key={event.id}>
          <EventEditableGalleryItem {...event} />
        </Grid.Column>
      ))}
    </Grid>
  );
}

export default EventEditableGallery;
