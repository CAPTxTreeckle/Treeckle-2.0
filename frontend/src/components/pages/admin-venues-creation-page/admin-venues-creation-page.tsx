import React, { useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Icon } from "semantic-ui-react";
import { useCreateVenue } from "../../../custom-hooks/api";
import { ADMIN_VENUES_PATH } from "../../../routes/paths";
import { VenueFormProps } from "../../../types/venues";
import { resolveApiError } from "../../../utils/error-utils";
import VenueDetailsForm from "../../venue-details-form";

function AdminVenuesCreationPage() {
  const history = useHistory();
  const { createVenue } = useCreateVenue();

  const onCreateVenue = useCallback(
    async (venueFormProps: VenueFormProps) => {
      try {
        await createVenue(venueFormProps);
        toast.success("The new venue has been created successfully.");
        history.push(ADMIN_VENUES_PATH);
      } catch (error) {
        resolveApiError(error);
      }
    },
    [createVenue, history],
  );

  return (
    <>
      <Button
        animated="vertical"
        fluid
        color="red"
        as={Link}
        to={ADMIN_VENUES_PATH}
      >
        <Button.Content hidden content="Cancel Venue Creation" />
        <Button.Content visible content={<Icon name="close" />} />
      </Button>

      <h1>Venue Creation</h1>

      <VenueDetailsForm
        onSubmit={onCreateVenue}
        submitButtonProps={{ content: "Create Venue", color: "blue" }}
      />
    </>
  );
}

export default AdminVenuesCreationPage;
