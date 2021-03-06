import React, { useCallback, useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "semantic-ui-react";
import { VenuesContext } from "../../context-providers";
import { useDeleteVenue } from "../../custom-hooks/api";
import { ADMIN_VENUES_EDIT_PATH } from "../../routes/paths";
import { VenueViewProps } from "../../types/venues";
import { resolveApiError } from "../../utils/error-utils";
import PopUpActionsWrapper from "../pop-up-actions-wrapper";
import VenueBookingForm from "../venue-booking-form";

type Props = VenueViewProps;

function VenueFormGalleryItem({ id, venueFormProps }: Props) {
  const history = useHistory();
  const { getVenues } = useContext(VenuesContext);

  const { deleteVenue, isLoading } = useDeleteVenue();

  const onDelete = useCallback(async () => {
    try {
      await deleteVenue(id);
      getVenues();
      toast.success("The venue has been deleted successfully.");
    } catch (error) {
      resolveApiError(error);
    }
  }, [id, deleteVenue, getVenues]);

  const onEdit = useCallback(() => {
    history.push(ADMIN_VENUES_EDIT_PATH.replace(":id", `${id}`));
  }, [history, id]);

  const actionButtons = useMemo(
    () => [
      <Button key="edit" content="Edit" onClick={onEdit} color="black" />,
      <Button
        key="delete"
        content="Delete"
        onClick={onDelete}
        color="red"
        loading={isLoading}
      />,
    ],
    [isLoading, onDelete, onEdit],
  );

  return (
    <PopUpActionsWrapper
      actionButtons={actionButtons}
      offsetRatio={{ heightRatio: -2 }}
    >
      <div className="flex-display hover-bob pointer ">
        <div className="flex-display full-width scale-in-center">
          <VenueBookingForm venueFormProps={venueFormProps} readOnly />
        </div>
      </div>
    </PopUpActionsWrapper>
  );
}

export default VenueFormGalleryItem;
