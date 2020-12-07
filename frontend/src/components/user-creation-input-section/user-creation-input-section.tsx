import React from "react";
import { Segment, Grid, Message } from "semantic-ui-react";
import UserCreationForm from "../user-creation-form";
import UserCreationCsvUploader from "../user-creation-csv-uploader";

function UserCreationInputSection() {
  return (
    <Segment raised>
      <Grid centered stackable>
        <Grid.Row columns="1">
          <Grid.Column>
            <Message info>
              Type or paste in the emails, separated with{" "}
              <strong>spaces</strong> or <strong>commas</strong>, to create new
              users. Alternatively, you can upload a CSV file with the emails.
              <br />
              <br />
              Currently, Treeckle supports both <strong>NUSNET</strong> and{" "}
              <strong>Gmail</strong> users.
              <br />
              <br />
              <strong>Note:</strong> For creation of NUSNET users, please
              provide NUSNET emails and <strong>NOT</strong> friendly emails.
            </Message>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns="2" stretched>
          <Grid.Column>
            <UserCreationForm />
          </Grid.Column>
          <Grid.Column>
            <UserCreationCsvUploader />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
}

export default UserCreationInputSection;
