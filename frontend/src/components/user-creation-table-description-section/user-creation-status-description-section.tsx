import React from "react";
import { Grid, Icon, Message, Segment } from "semantic-ui-react";
import {
  userCreationStatuses,
  UserCreationStatusDetails,
} from "../../types/users";
import { parseToTitleCase } from "../../utils/parsers";
import "./user-creation-table-description-section.scss";

function UserCreationTableDescriptionSection() {
  return (
    <Segment className="user-creation-table-description-section" raised>
      <Message info icon>
        <Icon name="info circle" />
        <Message.Content>
          <p>This section contains the parsed users' details.</p>

          <p>
            There are 4 types of user statuses:
            <Grid
              centered
              padded="vertically"
              verticalAlign="middle"
              columns="2"
              stackable
            >
              {userCreationStatuses.map((status) => {
                const { description, classType } =
                  UserCreationStatusDetails.get(status) ?? {};

                return (
                  <Grid.Row className="status-row" key={status}>
                    <Grid.Column textAlign="center" width="3">
                      <Message
                        className="status-title-container"
                        size="mini"
                        content={parseToTitleCase(status)}
                        positive={classType === "positive"}
                        negative={classType === "negative"}
                        warning={classType === "warning"}
                      />
                    </Grid.Column>
                    <Grid.Column width="13">{description}</Grid.Column>
                  </Grid.Row>
                );
              })}
            </Grid>
          </p>

          <p>
            <strong>Note:</strong> Only users with <strong>New</strong> status
            will be submitted for creation. Entries with other statuses will be
            ignored.
          </p>
        </Message.Content>
      </Message>
    </Segment>
  );
}

export default UserCreationTableDescriptionSection;
