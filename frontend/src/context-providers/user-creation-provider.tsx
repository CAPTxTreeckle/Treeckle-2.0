import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { PendingCreationUser } from "../types/users";

type UserCreationContextType = {
  pendingCreationUsers: PendingCreationUser[];
  setPendingCreationUsers: Dispatch<SetStateAction<PendingCreationUser[]>>;
};

export const UserCreationContext = createContext<UserCreationContextType>({
  pendingCreationUsers: [],
  setPendingCreationUsers: () => {
    throw new Error("setPendingCreationUsers not defined.");
  },
});

type Props = {
  children: ReactNode;
};

function UserCreationProvider({ children }: Props) {
  const [pendingCreationUsers, setPendingCreationUsers] = useState<
    PendingCreationUser[]
  >([]);

  return (
    <UserCreationContext.Provider
      value={{ pendingCreationUsers, setPendingCreationUsers }}
    >
      {children}
    </UserCreationContext.Provider>
  );
}

export default UserCreationProvider;
