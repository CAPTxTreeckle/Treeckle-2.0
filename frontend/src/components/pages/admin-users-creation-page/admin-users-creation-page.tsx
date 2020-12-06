import React from "react";
import { Link } from "react-router-dom";
import { useLastLocation } from "react-router-last-location";
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Message,
  Popup,
  Segment,
} from "semantic-ui-react";
import { ADMIN_USERS_PATH } from "../../../routes";
import FileUploader from "../../file-uploader";
import papaparse from "papaparse";
import { saveAs } from "file-saver";

const userCreationCsvTemplate = new Blob(
  [
    papaparse.unparse({
      fields: ["email", "role (optional/default to Resident)"],
      data: [
        ["jeremy@example.com", "Resident"],
        ["john@example.com", "Organizer"],
        ["jenny@example.com", "Admin"],
        ["james@another.example.com"],
      ],
    }),
  ],
  { type: "text/csv;charset=utf-8" },
);

console.log(userCreationCsvTemplate);

function AdminUsersCreationPage() {
  const lastLocation = useLastLocation();
  const previousPath = lastLocation?.pathname ?? ADMIN_USERS_PATH;

  return (
    <>
      <Button animated="vertical" fluid color="red" as={Link} to={previousPath}>
        <Button.Content hidden content="Cancel User Creation" />
        <Button.Content visible content={<Icon name="close" />} />
      </Button>

      <h1>Create New Users</h1>

      <Segment raised>
        <Grid centered>
          <Grid.Row columns="1">
            <Grid.Column>
              <Message info>
                Type or paste in the emails of the people you wish to invite,
                separated using spaces, and enter them in. Alternatively, upload
                a CSV file with the emails.
                <br />
                <br />
                Currently, Treeckle supports both <strong>
                  NUSNET
                </strong> and <strong>Gmail</strong> users.
                <br />
                <br />
                <strong>Note:</strong> For creation of NUSNET users, please
                provide NUSNET emails and <strong>NOT</strong> friendly emails.
              </Message>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns="2">
            <Grid.Column>
              <Form>
                <Header>Create Account</Header>
                <Form.Input />
                <Form.Button fluid />
              </Form>
            </Grid.Column>
            <Grid.Column>
              <h2 className="section-title-container black-text">
                <div className="section-title">CSV Upload</div>

                <div className="section-title-action-container">
                  <Popup
                    content="Download user creation CSV template"
                    wide
                    trigger={
                      <Button
                        compact
                        icon={
                          <Icon>
                            <i className="fas fa-file-csv" />
                          </Icon>
                        }
                        color="blue"
                        onClick={() =>
                          saveAs(
                            userCreationCsvTemplate,
                            "user creation template.csv",
                          )
                        }
                      />
                    }
                    position="top center"
                    on="hover"
                  />
                </div>
              </h2>

              <FileUploader
                onAcceptFiles={() => {}}
                icon={
                  <Icon>
                    <i className="fas fa-file-csv" />
                  </Icon>
                }
                title="Drag and drop, or click here to upload CSV file."
                accept="text/csv"
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </>
  );
}

export default AdminUsersCreationPage;
