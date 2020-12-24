import { ReactNode, useContext } from "react";
import { UserContext } from "../../context-providers/user-provider";
import { Role } from "../../types/users";

type Props = {
  children: ReactNode;
  roles: Role[];
  defaultRender?: ReactNode;
};

function RoleRestrictedWrapper({
  children,
  roles,
  defaultRender = null,
}: Props) {
  const { role = Role.Resident } = useContext(UserContext);

  return <>{roles.includes(role) ? children : defaultRender}</>;
}

export default RoleRestrictedWrapper;
