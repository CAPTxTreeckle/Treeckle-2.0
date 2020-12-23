import React from "react";
import { Link } from "react-router-dom";
import { useLastLocation } from "react-router-last-location";
import { Button, Icon } from "semantic-ui-react";
import { ADMIN_USERS_PATH } from "../../../routes/paths";
import UserCreationSection from "../../user-creation-section";

function AdminUsersCreationPage() {
  const lastLocation = useLastLocation();
  const previousPath = lastLocation?.pathname ?? ADMIN_USERS_PATH;

  return (
    <>
      <Button animated="vertical" fluid color="red" as={Link} to={previousPath}>
        <Button.Content hidden content="Cancel User Creation" />
        <Button.Content visible content={<Icon name="close" />} />
      </Button>

      <UserCreationSection />
    </>
  );
}

export default AdminUsersCreationPage;
