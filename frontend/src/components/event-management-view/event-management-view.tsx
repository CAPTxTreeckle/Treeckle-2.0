import React, { useCallback, useContext, useMemo, useState } from "react";
import { Grid, Icon, Label, Popup, Table } from "semantic-ui-react";
import { SingleEventContext } from "../../context-providers";
import { EVENTS_QR_CODE_PATH } from "../../routes/paths";
import { SignUpData, SignUpStatus } from "../../types/events";
import { displayDateTime } from "../../utils/parser-utils";
import EventSignUpStatusButton from "../event-sign-up-status-button";
import PlaceholderWrapper from "../placeholder-wrapper";

function EventManagementView() {
  const { event, getSingleEvent } = useContext(SingleEventContext);
  const [isLoading, setLoading] = useState(false);
  const { signUps = [], id: eventId = 0 } = { ...event };

  const refreshEvent = useCallback(async () => {
    setLoading(true);
    await getSingleEvent();
    setLoading(false);
  }, [getSingleEvent]);

  const headerRow = useMemo(
    () => (
      <Table.Row>
        <Table.HeaderCell content="Name" />
        <Table.HeaderCell content="Email" />
        <Table.HeaderCell content="Signed up at" />
        <Table.HeaderCell textAlign="center" content="Status" />
      </Table.Row>
    ),
    [],
  );

  const footerRow = useMemo(() => {
    let numPending = 0;
    let numAttending = 0;
    let numAttended = 0;
    signUps.forEach((signUp) => {
      switch (signUp.status) {
        case SignUpStatus.Pending:
          numPending++;
          break;
        case SignUpStatus.Confirmed:
          numAttending++;
          break;
        case SignUpStatus.Attended:
          numAttended++;
          break;
        default:
      }
    });

    return (
      <Table.Row>
        <Table.HeaderCell colSpan="4">
          <Grid columns="4" stackable verticalAlign="middle">
            <Grid.Column>
              <Label className="full-width center-text" size="big" color="blue">
                Sign-Ups: {numPending + numAttending + numAttended}
              </Label>
            </Grid.Column>
            <Grid.Column>
              <Label className="full-width center-text" size="big" color="teal">
                Attended: {numAttended}
              </Label>
            </Grid.Column>
            <Grid.Column>
              <Label
                className="full-width center-text"
                size="big"
                color="green"
              >
                Attending: {numAttending}
              </Label>
            </Grid.Column>
            <Grid.Column>
              <Label
                className="full-width center-text"
                size="big"
                color="orange"
              >
                Pending: {numPending}
              </Label>
            </Grid.Column>
          </Grid>
        </Table.HeaderCell>
      </Table.Row>
    );
  }, [signUps]);

  const renderBodyRow = useCallback(
    ({
      user: { name, email, id: userId },
      status,
      createdAt,
      id,
    }: SignUpData) => (
      <Table.Row key={id}>
        <Table.Cell content={name} />
        <Table.Cell content={email} />
        <Table.Cell content={displayDateTime(createdAt)} />
        <Table.Cell
          collapsing
          className="horizontal-space-margin"
          content={
            <EventSignUpStatusButton userId={userId} signUpStatus={status} />
          }
        />
      </Table.Row>
    ),
    [],
  );

  return (
    <>
      <h1>
        Sign-Ups{" "}
        <Popup
          content="Refresh"
          trigger={<Icon name="redo" link onClick={refreshEvent} />}
          position="top center"
          on="hover"
        />{" "}
        <Popup
          content="Show attendance QR code"
          trigger={
            <Icon
              name="qrcode"
              link
              onClick={() =>
                window.open(
                  EVENTS_QR_CODE_PATH.replace(":id", `${eventId}`),
                  "_blank",
                )
              }
            />
          }
          position="top center"
          on="hover"
        />
      </h1>
      <PlaceholderWrapper
        isLoading={isLoading}
        loadingMessage="Loading sign-ups"
        placeholder
        inverted
      >
        <Table
          selectable
          headerRow={headerRow}
          renderBodyRow={renderBodyRow}
          footerRow={footerRow}
          singleLine
          tableData={signUps}
        />
      </PlaceholderWrapper>
    </>
  );
}

export default EventManagementView;
