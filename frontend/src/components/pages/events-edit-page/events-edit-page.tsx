import React, { useCallback, useEffect, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useLastLocation } from "react-router-last-location";
import { toast } from "react-toastify";
import { Button, Icon } from "semantic-ui-react";
import { useGetSingleEvent, useUpdateEvent } from "../../../custom-hooks/api";
import { EVENTS_PATH } from "../../../routes/paths";
import { EventFormProps } from "../../../types/events";
import { resolveApiError } from "../../../utils/error-utils";
import EventDetailsForm from "../../event-details-form";
import PlaceholderWrapper from "../../placeholder-wrapper";

function EventsEditPage() {
  const { id } = useParams<{ id: string }>();
  const { event, isLoading, getSingleEvent } = useGetSingleEvent();
  const eventId = useMemo(() => event?.id ?? parseInt(id, 10), [event, id]);
  const { updateEvent } = useUpdateEvent();
  const lastLocation = useLastLocation();
  const history = useHistory();
  const previousPath = useMemo(() => lastLocation?.pathname ?? EVENTS_PATH, [
    lastLocation,
  ]);

  const onSaveChanges = useCallback(
    async (data: EventFormProps) => {
      try {
        await updateEvent(eventId, data);
        toast.success("The event has been updated successfully.");
        history.push(previousPath);
      } catch (error) {
        resolveApiError(error);
      }
    },
    [eventId, updateEvent, previousPath, history],
  );

  useEffect(() => {
    getSingleEvent(eventId);
  }, [getSingleEvent, eventId]);

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
