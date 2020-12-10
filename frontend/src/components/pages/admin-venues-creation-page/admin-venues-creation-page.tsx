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
  const { createVenue: _createVenue } = useCreateVenue();

  const createVenue = useCallback(
    async (venueFormProps: VenueFormProps) => {
      try {
        await _createVenue(venueFormProps);
        toast.success("A new venue has been created successfully.");
        history.push(ADMIN_VENUES_PATH);
        return true;
      } catch (error) {
        resolveApiError(error);
        return false;
      }
    },
    [_createVenue, history],
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

      <VenueDetailsForm
        onSubmit={createVenue}
        submitButtonProps={{ content: "Create Venue", color: "blue" }}
      />
    </>
  );
}

export default AdminVenuesCreationPage;
