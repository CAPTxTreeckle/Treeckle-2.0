import React, { useContext, useMemo } from "react";
import isEqual from "lodash.isequal";
import { SingleEventProvider, UserContext } from "../../context-providers";
import { EventViewProps } from "../../types/events";
import EventDetailsView from "../event-details-view";
import EventManagementView from "../event-management-view";
import { Role } from "../../types/users";
import { parseUserToUserData } from "../../utils/parser";

type Props = EventViewProps;

function EventView(props: Props) {
  const { organizer } = props;
  const user = useContext(UserContext);
  const isValidEventOrganiser = useMemo(
    () =>
      isEqual(organizer, parseUserToUserData(user)) || user.role === Role.ADMIN,
    [organizer, user],
  );

  return (
    <SingleEventProvider eventViewProps={props}>
      <EventDetailsView />
      {isValidEventOrganiser && <EventManagementView />}
    </SingleEventProvider>
  );
}

export default EventView;
