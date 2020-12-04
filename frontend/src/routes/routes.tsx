import React, { useContext } from "react";
import { LastLocationProvider } from "react-router-last-location";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import NavigationContainer from "../components/navigation-container";
import {
  DashboardPage,
  BookingsPage,
  EventsPage,
  AdminBookingsPage,
  AdminUsersPage,
  AdminSettingsPage,
  ProfilePage,
  HomePage,
  OpenIdPage,
  AdminVenuesPage,
  AdminVenuesCreationPage,
  AdminVenuesEditPage,
  EventsCreationPage,
  EventsSingleViewPage,
  EventsEditPage,
  EventsQrCodePage,
} from "../components/pages";
import {
  DASHBOARD_PATH,
  BOOKINGS_PATH,
  EVENTS_PATH,
  EVENTS_SIGNED_UP_PATH,
  EVENTS_RECOMMENDATIONS_PATH,
  EVENTS_SUBSCRIPTIONS_PATH,
  EVENTS_OWN_PATH,
  EVENTS_CREATION_PATH,
  EVENTS_SINGLE_VIEW_PATH,
  EVENTS_EDIT_PATH,
  EVENTS_QR_CODE_PATH,
  ADMIN_BOOKINGS_PATH,
  ADMIN_SETTINGS_PATH,
  ADMIN_USERS_PATH,
  PROFILE_PATH,
  HOME_PATH,
  OPEN_ID_PATH,
  ADMIN_VENUES_PATH,
  ADMIN_VENUES_CREATION_PATH,
  ADMIN_VENUES_EDIT_PATH,
} from "./index";
import { UserContext, VenuesProvider } from "../context-providers";
import RoleRestrictedRoute from "./role-restricted-route";
import { Role } from "../types/users";

function Routes() {
  const { accessToken } = useContext(UserContext);

  return (
    <Router>
      <LastLocationProvider>
        <NavigationContainer>
          <Switch>
            <Route path={HOME_PATH} exact>
              {accessToken ? <Redirect to={DASHBOARD_PATH} /> : <HomePage />}
            </Route>

            {!accessToken && (
              <Route path={OPEN_ID_PATH}>
                <OpenIdPage />
              </Route>
            )}

            {!accessToken && (
              <Route>
                <Redirect to={HOME_PATH} />
              </Route>
            )}

            <Route path={DASHBOARD_PATH} exact strict>
              <DashboardPage />
            </Route>

            <Route path={BOOKINGS_PATH} exact strict>
              <BookingsPage />
            </Route>

            <Route path={PROFILE_PATH} exact strict>
              <ProfilePage />
            </Route>

            <Route
              path={[
                EVENTS_PATH,
                EVENTS_SIGNED_UP_PATH,
                EVENTS_RECOMMENDATIONS_PATH,
                EVENTS_SUBSCRIPTIONS_PATH,
              ]}
              exact
              strict
            >
              <EventsPage />
            </Route>

            <RoleRestrictedRoute
              roles={[Role.Organizer, Role.Admin]}
              path={EVENTS_OWN_PATH}
              exact
              strict
            >
              <EventsPage />
            </RoleRestrictedRoute>

            <RoleRestrictedRoute
              roles={[Role.Organizer, Role.Admin]}
              path={EVENTS_CREATION_PATH}
              exact
              strict
            >
              <EventsCreationPage />
            </RoleRestrictedRoute>

            <Route path={EVENTS_SINGLE_VIEW_PATH} exact strict>
              <EventsSingleViewPage />
            </Route>

            <RoleRestrictedRoute
              roles={[Role.Organizer, Role.Admin]}
              path={EVENTS_EDIT_PATH}
              exact
              strict
            >
              <EventsEditPage />
            </RoleRestrictedRoute>

            <RoleRestrictedRoute
              roles={[Role.Organizer, Role.Admin]}
              path={EVENTS_QR_CODE_PATH}
              exact
              strict
            >
              <EventsQrCodePage />
            </RoleRestrictedRoute>

            <RoleRestrictedRoute
              roles={[Role.Admin]}
              path={ADMIN_BOOKINGS_PATH}
              exact
              strict
            >
              <AdminBookingsPage />
            </RoleRestrictedRoute>

            <RoleRestrictedRoute
              roles={[Role.Admin]}
              path={ADMIN_VENUES_PATH}
              exact
              strict
            >
              <VenuesProvider>
                <AdminVenuesPage />
              </VenuesProvider>
            </RoleRestrictedRoute>

            <RoleRestrictedRoute
              roles={[Role.Admin]}
              path={ADMIN_VENUES_CREATION_PATH}
              exact
              strict
            >
              <AdminVenuesCreationPage />
            </RoleRestrictedRoute>

            <RoleRestrictedRoute
              roles={[Role.Admin]}
              path={ADMIN_VENUES_EDIT_PATH}
              exact
              strict
            >
              <AdminVenuesEditPage />
            </RoleRestrictedRoute>

            <RoleRestrictedRoute
              roles={[Role.Admin]}
              path={ADMIN_USERS_PATH}
              exact
              strict
            >
              <AdminUsersPage />
            </RoleRestrictedRoute>

            <RoleRestrictedRoute
              roles={[Role.Admin]}
              path={ADMIN_SETTINGS_PATH}
              exact
              strict
            >
              <AdminSettingsPage />
            </RoleRestrictedRoute>

            <Route>
              <Redirect to={HOME_PATH} />
            </Route>
          </Switch>
        </NavigationContainer>
      </LastLocationProvider>
    </Router>
  );
}

export default Routes;
