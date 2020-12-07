import React, { useCallback, useContext, useMemo } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Button, Icon, Tab, TabProps } from "semantic-ui-react";
import {
  EventSubscriptionsProvider,
  OwnEventsProvider,
  UserContext,
} from "../../../context-providers";
import { Role } from "../../../types/users";
import { EVENTS_CREATION_PATH, EVENTS_PATH } from "../../../routes/paths";
import EventsAllTabPane from "../../events-all-tab-pane";
import EventsOwnTabPane from "../../events-own-tab-pane";
import EventsRecommendationsTabPane from "../../events-recommendations-tab-pane";
import EventsSignedUpTabPane from "../../events-signed-up-tab-pane";
import EventsSubscriptionsTabPane from "../../events-subscriptions-tab-pane";
import RoleRestrictedWrapper from "../../role-restricted-wrapper";
import "./events-page.scss";

const EVENTS_CATEGORY_PATH = "/events/:category";
const eventCategoryPaths = [
  "",
  "signedup",
  "recommendations",
  "subscriptions",
  "own",
];
const eventCategoryHeaders = [
  "All Events",
  "Signed Up Events",
  "Event Recommendations",
  "Event Subscriptions",
  "Own Events",
];

const residentPanes = [
  { menuItem: "All", render: () => <EventsAllTabPane /> },
  { menuItem: "Signed Up", render: () => <EventsSignedUpTabPane /> },
  {
    menuItem: "Recommendations",
    render: () => <EventsRecommendationsTabPane />,
  },
  {
    menuItem: "Subscriptions",
    render: () => (
      <EventSubscriptionsProvider>
        <EventsSubscriptionsTabPane />
      </EventSubscriptionsProvider>
    ),
  },
];

const organiserPanes = [
  {
    menuItem: "Own Events",
    render: () => (
      <OwnEventsProvider>
        <EventsOwnTabPane />
      </OwnEventsProvider>
    ),
  },
];

function EventsPage() {
  const history = useHistory();
  const { role } = useContext(UserContext);
  const match = useRouteMatch<{ category: string }>({
    path: [EVENTS_CATEGORY_PATH, EVENTS_PATH],
    strict: true,
    sensitive: true,
  });
  const activeIndex = useMemo(() => {
    const category = match?.params?.category ?? eventCategoryPaths[0];
    return eventCategoryPaths.indexOf(category);
  }, [match]);

  const panes = useMemo(() => {
    if (role && [Role.Organizer, Role.Admin].includes(role)) {
      return residentPanes.concat(organiserPanes);
    }
    return residentPanes;
  }, [role]);

  const onTabChange = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>,
      { activeIndex = 0 }: TabProps,
    ) => {
      const newCategory = eventCategoryPaths?.[activeIndex as number] ?? 0;
      const newPath = EVENTS_CATEGORY_PATH.replace(
        "/:category",
        `${newCategory ? "/" : ""}${newCategory}`,
      );

      if (newPath === window.location.pathname) {
        return;
      }
      history.push(newPath);
    },
    [history],
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

      <Tab
        id="events-page"
        menu={{ attached: false }}
        panes={panes}
        activeIndex={activeIndex}
        onTabChange={onTabChange}
      />
    </>
  );
}

export default EventsPage;
