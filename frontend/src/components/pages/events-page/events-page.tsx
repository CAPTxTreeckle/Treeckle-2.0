import React, { useCallback, useContext, useMemo } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Button, Icon, Segment } from "semantic-ui-react";
import { Role } from "../../../types/users";
import {
  EVENTS_CREATION_PATH,
  EVENTS_PATH,
  EVENTS_SIGNED_UP_PATH,
  EVENTS_SUBSCRIPTIONS_PATH,
  EVENTS_OWN_PATH,
} from "../../../routes/paths";
import EventsAllSection from "../../events-all-section";
import EventsOwnSection from "../../events-own-section";
import EventsSignedUpSection from "../../events-signed-up-section";
import EventsSubscriptionsSection from "../../events-subscriptions-section";
import RoleRestrictedWrapper from "../../role-restricted-wrapper";
import { UserContext } from "../../../context-providers";
import ResponsiveSelectorMenu from "../../responsive-selector-menu";

const eventCategoryPaths = [
  EVENTS_PATH,
  EVENTS_SIGNED_UP_PATH,
  EVENTS_SUBSCRIPTIONS_PATH,
  EVENTS_OWN_PATH,
];
const eventCategoryHeaders = [
  "All Events",
  "Signed Up Events",
  "Event Subscriptions",
  "Own Events",
];
const residentEventCategories = [
  { key: "All", name: "All" },
  {
    key: "Signed Up",
    name: "Signed Up",
  },
  {
    key: "Subscriptions",
    name: "Subscriptions",
  },
];

const organizerEventCategories = [
  ...residentEventCategories,
  {
    key: "Own Events",
    name: "Own Events",
  },
];

const eventSections = [
  <EventsAllSection />,
  <EventsSignedUpSection />,
  <EventsSubscriptionsSection />,
  <EventsOwnSection />,
];

function EventsPage() {
  const { role } = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();

  const activeIndex = useMemo(() => {
    const activeIndex = eventCategoryPaths.indexOf(location.pathname);

    return activeIndex >= 0 ? activeIndex : 0;
  }, [location]);

  const activeSection = useMemo(() => eventSections[activeIndex], [
    activeIndex,
  ]);

  const onChange = useCallback(
    (selectedIndex: number) => {
      const newPath = eventCategoryPaths?.[selectedIndex] ?? EVENTS_PATH;

      if (selectedIndex === activeIndex) {
        return;
      }

      history.push(newPath);
    },
    [history, activeIndex],
  );

  return (
    <>
      <RoleRestrictedWrapper roles={[Role.Organizer, Role.Admin]}>
        <Button
          animated="vertical"
          fluid
          color="teal"
          as={Link}
          to={EVENTS_CREATION_PATH}
        >
          <Button.Content hidden content="Create New Event" />
          <Button.Content visible content={<Icon name="add" />} />
        </Button>
      </RoleRestrictedWrapper>

      <h1>{eventCategoryHeaders[activeIndex]}</h1>

      <div className="black-text">
        <ResponsiveSelectorMenu
          options={
            role === Role.Resident
              ? residentEventCategories
              : organizerEventCategories
          }
          onChange={onChange}
          activeIndex={activeIndex}
        />

        <Segment raised>{activeSection}</Segment>
      </div>
    </>
  );
}

export default EventsPage;
