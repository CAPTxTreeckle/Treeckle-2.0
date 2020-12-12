import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { SingleEventProvider } from "../../context-providers";
import { EVENTS_SINGLE_VIEW_PATH } from "../../routes/paths";
import { EventViewProps } from "../../types/events";
import EventGalleryItem from "../event-gallery-card";

type Props = EventViewProps;

function EventViewOnlyGalleryItem(props: Props) {
  const history = useHistory();
  const { id } = props;

  const onClickEvent = useCallback(() => {
    history.push(EVENTS_SINGLE_VIEW_PATH.replace(":id", `${id}`));
  }, [history, id]);

  return (
    <div
      className="flex-display hover-bob hover-pointing"
      onClick={onClickEvent}
    >
      <SingleEventProvider eventViewProps={props}>
        <EventGalleryItem />
      </SingleEventProvider>
    </div>
  );
}

export default EventViewOnlyGalleryItem;
