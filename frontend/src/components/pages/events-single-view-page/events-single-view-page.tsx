import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useLastLocation } from "react-router-last-location";
import { Button, Icon } from "semantic-ui-react";
import { useGetSingleEvent } from "../../../custom-hooks/api";
import { EVENTS_PATH } from "../../../routes";
import EventView from "../../event-view";
import PlaceholderWrapper from "../../placeholder-wrapper";

function EventsSingleViewPage() {
  const { id } = useParams<{ id: string }>();
  const eventId = parseInt(id, 10);
  const { event, isLoading, getSingleEvent } = useGetSingleEvent();
  const lastLocation = useLastLocation();
  const previousPath = lastLocation?.pathname ?? EVENTS_PATH;

  useEffect(() => {
    getSingleEvent(eventId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  return (
    <>
      <Button
        animated="vertical"
        fluid
        color="blue"
        as={Link}
        to={previousPath}
      >
        <Button.Content hidden content="Back to Events" />
        <Button.Content visible content={<Icon name="home" />} />
      </Button>

      <PlaceholderWrapper
        isLoading={isLoading}
        loadingMessage="Retrieving event"
        showDefaultMessage={!event}
        defaultMessage="No event found"
        inverted
        placeholder
      >
        {event && <EventView {...event} />}
      </PlaceholderWrapper>
    </>
  );
}

export default EventsSingleViewPage;
