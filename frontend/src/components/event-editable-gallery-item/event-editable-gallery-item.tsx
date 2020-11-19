import React, { useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { OwnEventsContext, SingleEventProvider } from "../../context-providers";
import { useDeleteEvent } from "../../custom-hooks/api";
import { EVENTS_EDIT_PATH, EVENTS_SINGLE_VIEW_PATH } from "../../routes";
import { EventViewProps } from "../../types/events";
import EventGalleryItem from "../event-gallery-item";
import PopUpActionsWrapper from "../pop-up-actions-wrapper";

type Props = EventViewProps;

function EventEditableGalleryItem(props: Props) {
  const history = useHistory();
  const { id } = props;
  const { getOwnEvents } = useContext(OwnEventsContext);

  const { deleteEvent, isLoading } = useDeleteEvent();

  const onDelete = useCallback(() => deleteEvent(id, getOwnEvents), [
    id,
    deleteEvent,
    getOwnEvents,
  ]);

  const onEdit = useCallback(
    () => history.push(EVENTS_EDIT_PATH.replace(":id", `${id}`)),
    [history, id],
  );

  const onView = useCallback(
    () => history.push(EVENTS_SINGLE_VIEW_PATH.replace(":id", `${id}`)),
    [history, id],
  );

  return (
    <PopUpActionsWrapper
      actions={[
        { key: 0, content: "View", onClick: onView, color: "blue" },
        { key: 1, content: "Edit", onClick: onEdit, color: "black" },
        {
          key: 2,
          content: "Delete",
          onClick: onDelete,
          color: "red",
          loading: isLoading,
        },
      ]}
      offsetRatio={{ heightRatio: -2 }}
    >
      <div className="animation-wrapper hover-bob hover-pointing">
        <SingleEventProvider eventViewProps={props}>
          <EventGalleryItem />
        </SingleEventProvider>
      </div>
    </PopUpActionsWrapper>
  );
}

export default EventEditableGalleryItem;
