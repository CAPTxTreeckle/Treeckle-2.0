import React, { useContext } from "react";
import { Grid, Segment, Image } from "semantic-ui-react";
import defaultAvatarImage from "../../../assets/avatar.png";
import { UserContext } from "../../../context-providers";
import "./profile-page.scss";

function ProfilePage() {
  const { name, email, organisation, role } = useContext(UserContext);

  return (
    <Segment id="profile-page" raised padded="very">
      <Grid columns="2" relaxed="very" stackable>
        <Grid.Column width="6" verticalAlign="middle">
          <Image
            src={defaultAvatarImage}
            className="avatar-image"
            avatar
            bordered
            alt=""
            centered
          />
        </Grid.Column>
        <Grid.Column width="10">
          <h2>{name}</h2>

          <h4 className="meta-info">
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Organisation:</strong> {organisation}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              <text className="capitalise">{role?.toLowerCase()}</text>
            </p>
          </h4>
        </Grid.Column>
      </Grid>
    </Segment>
  );
}

export default ProfilePage;
