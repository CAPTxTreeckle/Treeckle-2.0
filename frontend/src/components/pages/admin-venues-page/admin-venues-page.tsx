import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";
import { VenuesContext } from "../../../context-providers";
import { ADMIN_VENUES_CREATION_PATH } from "../../../routes/paths";
import PlaceholderWrapper from "../../placeholder-wrapper";
import VenueFormGallery from "../../venue-form-gallery";

function AdminVenuesPage() {
  const { venues, isLoading, getVenues } = useContext(VenuesContext);

  useEffect(() => {
    getVenues();
  }, [getVenues]);

  return (
    <>
      <Button
        animated="vertical"
        fluid
        color="teal"
        as={Link}
        to={ADMIN_VENUES_CREATION_PATH}
      >
        <Button.Content hidden content="Create New Venue" />
        <Button.Content visible content={<Icon name="add" />} />
      </Button>

      <h1>All Venues</h1>
      <PlaceholderWrapper
        isLoading={isLoading}
        loadingMessage="Retrieving venues"
        showDefaultMessage={venues.length === 0}
        defaultMessage="There are no venues"
        inverted
        placeholder
      >
        <VenueFormGallery venues={venues} />
      </PlaceholderWrapper>
    </>
  );
}

export default AdminVenuesPage;
