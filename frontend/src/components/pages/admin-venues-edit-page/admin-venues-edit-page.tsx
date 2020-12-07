import React, { useCallback, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";
import { useGetSingleVenue, useUpdateVenue } from "../../../custom-hooks/api";
import { ADMIN_VENUES_PATH } from "../../../routes/paths";
import { VenueFormProps } from "../../../types/venues";
import PlaceholderWrapper from "../../placeholder-wrapper";
import VenueDetailsForm from "../../venue-details-form";

function AdminVenuesEditPage() {
  const { id } = useParams<{ id: string }>();
  const venueId = parseInt(id, 10);
  const { venue, isLoading, getSingleVenue } = useGetSingleVenue();
  const { updateVenue } = useUpdateVenue();

  const onSaveChanges = useCallback(
    async (data: VenueFormProps) => updateVenue(venue?.id ?? venueId, data),
    [updateVenue, venue, venueId],
  );

  useEffect(() => {
    getSingleVenue(venueId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueId]);

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
        <VenueDetailsForm
          onSubmit={onSaveChanges}
          submitButtonProps={{ content: "Save Changes", color: "blue" }}
          defaultValues={venue?.venueFormProps}
        />
      </PlaceholderWrapper>
    </>
  );
}

export default AdminVenuesEditPage;
