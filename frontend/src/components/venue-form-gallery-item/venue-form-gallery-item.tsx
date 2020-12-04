import React, { useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { VenuesContext } from "../../context-providers";
import { useDeleteVenue } from "../../custom-hooks/api";
import { ADMIN_VENUES_EDIT_PATH } from "../../routes";
import { VenueViewProps } from "../../types/venues";
import PopUpActionsWrapper from "../pop-up-actions-wrapper";
import VenueBookingForm from "../venue-booking-form";

type Props = VenueViewProps;

function VenueFormGalleryItem({ id, venueFormProps }: Props) {
  const history = useHistory();
  const { getAllVenues } = useContext(VenuesContext);

  const { deleteVenue, isLoading } = useDeleteVenue();

  const onDelete = useCallback(() => {
    deleteVenue(id, getAllVenues);
  }, [id, deleteVenue, getAllVenues]);

  const onEdit = useCallback(() => {
    history.push(ADMIN_VENUES_EDIT_PATH.replace(":id", `${id}`));
  }, [history, id]);

  return (
    <PopUpActionsWrapper
      actions={[
        { key: 0, content: "Edit", onClick: onEdit, color: "black" },
        {
          key: 1,
          content: "Delete",
          onClick: onDelete,
          loading: isLoading,
          color: "red",
        },
      ]}
      offsetRatio={{ heightRatio: -2 }}
    >
      <div className="flex-display hover-bob hover-pointing">
        <VenueBookingForm venueFormProps={venueFormProps} readOnly />
      </div>
    </PopUpActionsWrapper>
  );
}

export default VenueFormGalleryItem;
