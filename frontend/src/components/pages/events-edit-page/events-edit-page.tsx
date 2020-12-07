import React, { useCallback, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useLastLocation } from "react-router-last-location";
import { Button, Icon } from "semantic-ui-react";
import { useGetSingleEvent, useUpdateEvent } from "../../../custom-hooks/api";
import { EVENTS_PATH } from "../../../routes/paths";
import { EventFormProps } from "../../../types/events";
import EventDetailsForm from "../../event-details-form";
import PlaceholderWrapper from "../../placeholder-wrapper";

function EventsEditPage() {
  const { id } = useParams<{ id: string }>();
  const eventId = parseInt(id, 10);
  const { event, isLoading, getSingleEvent } = useGetSingleEvent();
  const { updateEvent } = useUpdateEvent();
  const lastLocation = useLastLocation();
  const previousPath = lastLocation?.pathname ?? EVENTS_PATH;

  const onSaveChanges = useCallback(
    async (data: EventFormProps) =>
      updateEvent(event?.id ?? eventId, data, previousPath),
    [event, eventId, updateEvent, previousPath],
  );

  useEffect(() => {
    getSingleEvent(eventId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  return (
    <>
      <Button animated="vertical" fluid color="red" as={Link} to={previousPath}>
        <Button.Content hidden content="Cancel Changes" />
        <Button.Content visible content={<Icon name="close" />} />
      </Button>

      <PlaceholderWrapper
        isLoading={isLoading}
        loadingMessage="Retrieving event"
        showDefaultMessage={!event}
        defaultMessage="No event found"
        inverted
        placeholder
      >
        <EventDetailsForm
          onSubmit={onSaveChanges}
          submitButtonProps={{ content: "Save Changes", color: "blue" }}
          defaultValues={event?.eventFormProps}
        />
      </PlaceholderWrapper>
    </>
  );
}

export default EventsEditPage;
