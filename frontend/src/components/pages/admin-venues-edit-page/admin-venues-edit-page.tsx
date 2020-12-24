import React, { useCallback, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Icon } from "semantic-ui-react";
import { useGetSingleVenue, useUpdateVenue } from "../../../custom-hooks/api";
import { ADMIN_VENUES_PATH } from "../../../routes/paths";
import { VenueFormProps } from "../../../types/venues";
import { resolveApiError } from "../../../utils/error-utils";
import PlaceholderWrapper from "../../placeholder-wrapper";
import VenueDetailsForm from "../../venue-details-form";

function AdminVenuesEditPage() {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const venueId = parseInt(id, 10);
  const { venue, isLoading, getSingleVenue } = useGetSingleVenue();
  const { updateVenue } = useUpdateVenue();

  const onSaveChanges = useCallback(
    async (data: VenueFormProps) => {
      try {
        await updateVenue(venue?.id ?? venueId, data);
        toast.success("The venue has been updated successfully.");
        history.push(ADMIN_VENUES_PATH);
      } catch (error) {
        resolveApiError(error);
      }
    },
    [updateVenue, venue, venueId, history],
  );

  useEffect(() => {
    getSingleVenue(venueId);
  }, [getSingleVenue, venueId]);

  return (
    <>
      <Button
        animated="vertical"
        fluid
        color="red"
        as={Link}
        to={ADMIN_VENUES_PATH}
      >
        <Button.Content hidden content="Cancel Changes" />
        <Button.Content visible content={<Icon name="close" />} />
      </Button>

      <PlaceholderWrapper
        isLoading={isLoading}
        loadingMessage="Retrieving venue"
        showDefaultMessage={!venue}
        defaultMessage="No venue found"
        inverted
        placeholder
      >
        <>
          <h1>Venue Update</h1>
          <VenueDetailsForm
            onSubmit={onSaveChanges}
            submitButtonProps={{ content: "Save Changes", color: "blue" }}
            defaultValues={venue?.venueFormProps}
          />
        </>
      </PlaceholderWrapper>
    </>
  );
}

export default AdminVenuesEditPage;
