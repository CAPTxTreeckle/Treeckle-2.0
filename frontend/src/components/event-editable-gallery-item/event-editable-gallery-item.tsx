import React, { useCallback, useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "semantic-ui-react";
import { OwnEventsContext, SingleEventProvider } from "../../context-providers";
import { useDeleteEvent } from "../../custom-hooks/api";
import { EVENTS_EDIT_PATH, EVENTS_SINGLE_VIEW_PATH } from "../../routes/paths";
import { EventViewProps } from "../../types/events";
import { resolveApiError } from "../../utils/error-utils";
import EventGalleryItem from "../event-gallery-card";
import PopUpActionsWrapper from "../pop-up-actions-wrapper";

type Props = EventViewProps;

function EventEditableGalleryItem(props: Props) {
  const history = useHistory();
  const { id } = props;
  const { getOwnEvents } = useContext(OwnEventsContext);

  const { deleteEvent, isLoading } = useDeleteEvent();

  const onDelete = useCallback(async () => {
    try {
      await deleteEvent(id);
      getOwnEvents();
      toast.success("The event has been deleted successfully.");
    } catch (error) {
      resolveApiError(error);
    }
  }, [id, deleteEvent, getOwnEvents]);

  const onEdit = useCallback(
    () => history.push(EVENTS_EDIT_PATH.replace(":id", `${id}`)),
    [history, id],
  );

  const onView = useCallback(
    () => history.push(EVENTS_SINGLE_VIEW_PATH.replace(":id", `${id}`)),
    [history, id],
  );

  const actionButtons = useMemo(
    () => [
      <Button key={0} content="View" onClick={onView} color="blue" />,
      <Button key={1} content="Edit" onClick={onEdit} color="black" />,
      <Button
        key={2}
        content="Delete"
        onClick={onDelete}
        color="red"
        loading={isLoading}
      />,
    ],
    [isLoading, onDelete, onView, onEdit],
  );

  return (
    <PopUpActionsWrapper
      actionButtons={actionButtons}
      offsetRatio={{ heightRatio: -2 }}
    >
      <div className="flex-display hover-bob pointer">
        <div className="flex-display full-width scale-in-center">
          <SingleEventProvider eventViewProps={props}>
            <EventGalleryItem />
          </SingleEventProvider>
        </div>
      </div>
    </PopUpActionsWrapper>
  );
}

export default EventEditableGalleryItem;
