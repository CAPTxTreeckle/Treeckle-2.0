import React, { useContext, useMemo } from "react";
import isEqual from "lodash.isequal";
import { SingleEventProvider, UserContext } from "../../context-providers";
import { EventViewProps } from "../../types/events";
import EventDetailsView from "../event-details-view";
import EventManagementView from "../event-management-view";
import { Role } from "../../types/users";
import { parseUserToUserData } from "../../utils/parser-utils";

type Props = EventViewProps;

function EventView(props: Props) {
  const { creator } = props;
  const user = useContext(UserContext);
  const isValidEventOrganizer = useMemo(
    () =>
      isEqual(creator, parseUserToUserData(user)) || user.role === Role.Admin,
    [creator, user],
  );

  return (
    <SingleEventProvider eventViewProps={props}>
      <EventDetailsView />
      {isValidEventOrganizer && <EventManagementView />}
    </SingleEventProvider>
  );
}

export default EventView;
