import React from "react";
import { Link } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";
import { useCreateVenue } from "../../../custom-hooks/api";
import { ADMIN_VENUES_PATH } from "../../../routes";
import VenueDetailsForm from "../../venue-details-form";

function AdminVenuesCreationPage() {
  const { createVenue } = useCreateVenue();

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
