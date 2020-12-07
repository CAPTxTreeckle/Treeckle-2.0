import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";
import { useLastLocation } from "react-router-last-location";
import { EVENTS_PATH } from "../../../routes/paths";
import EventDetailsForm from "../../event-details-form";
import { useCreateEvent } from "../../../custom-hooks/api/events-api";
import { EventFormProps } from "../../../types/events";

function EventsCreationPage() {
  const { createEvent } = useCreateEvent();
  const lastLocation = useLastLocation();
  const previousPath = lastLocation?.pathname ?? EVENTS_PATH;

  const onCreateEvent = useCallback(
    async (data: EventFormProps) => createEvent(data, previousPath),

    [createEvent, previousPath],
  );

  return (
    <>
      <Button animated="vertical" fluid color="red" as={Link} to={previousPath}>
        <Button.Content hidden content="Cancel Event Creation" />
        <Button.Content visible content={<Icon name="close" />} />
      </Button>

      <EventDetailsForm
        onSubmit={onCreateEvent}
        submitButtonProps={{ content: "Create Event", color: "blue" }}
      />
    </>
  );
}

export default EventsCreationPage;
