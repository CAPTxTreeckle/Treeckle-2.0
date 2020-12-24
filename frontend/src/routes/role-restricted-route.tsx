import { useContext } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { HOME_PATH } from "./paths";
import { UserContext } from "../context-providers/user-provider";
import { Role } from "../types/users";

function RoleRestrictedRoute(props: RouteProps & { roles: Role[] }) {
  const { role = Role.Resident } = useContext(UserContext);
  const { roles } = props;

  return roles.includes(role) ? (
    <Route {...props} />
  ) : (
    <Redirect to={HOME_PATH} />
  );
}

export default RoleRestrictedRoute;
