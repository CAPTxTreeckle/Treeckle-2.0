import React, { useContext, useEffect } from "react";
import { Tab } from "semantic-ui-react";
import { OwnEventsContext } from "../../context-providers";
import EventEditableGallery from "../event-editable-gallery";
import PlaceholderWrapper from "../placeholder-wrapper";

function EventsOwnTabPane() {
  const { ownEvents, isLoading, getOwnEvents } = useContext(OwnEventsContext);

  useEffect(() => {
    getOwnEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tab.Pane attached={false}>
      <PlaceholderWrapper
        isLoading={isLoading}
        loadingMessage="Retrieving own events"
        showDefaultMessage={ownEvents.length === 0}
        defaultMessage="You have not created any event"
        placeholder
      >
        <EventEditableGallery events={ownEvents} />
      </PlaceholderWrapper>
    </Tab.Pane>
  );
}

export default EventsOwnTabPane;
