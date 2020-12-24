import { useCallback, useMemo } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";
import { useLastLocation } from "react-router-last-location";
import { toast } from "react-toastify";
import { EVENTS_PATH } from "../../../routes/paths";
import EventDetailsForm from "../../event-details-form";
import { useCreateEvent } from "../../../custom-hooks/api/events-api";
import { EventFormProps } from "../../../types/events";
import { resolveApiError } from "../../../utils/error-utils";

function EventsCreationPage() {
  const { createEvent } = useCreateEvent();
  const history = useHistory();
  const lastLocation = useLastLocation();
  const previousPath = useMemo(() => lastLocation?.pathname ?? EVENTS_PATH, [
    lastLocation,
  ]);

  const onCreateEvent = useCallback(
    async (eventFormProps: EventFormProps) => {
      try {
        await createEvent(eventFormProps);
        toast.success("The new event has been created successfully.");
        history.push(previousPath);
      } catch (error) {
        resolveApiError(error);
      }
    },

    [createEvent, history, previousPath],
  );

  return (
    <>
      <Button animated="vertical" fluid color="red" as={Link} to={previousPath}>
        <Button.Content hidden content="Cancel Event Creation" />
        <Button.Content visible content={<Icon name="close" />} />
      </Button>

      <h1>Event Creation</h1>
      <EventDetailsForm
        onSubmit={onCreateEvent}
        submitButtonProps={{ content: "Create Event", color: "blue" }}
      />
    </>
  );
}

export default EventsCreationPage;
