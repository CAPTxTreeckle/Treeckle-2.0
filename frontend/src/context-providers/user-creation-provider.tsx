import React, { useState } from "react";
import { PendingCreationUser } from "../types/users";

type UserCreationContextType = {
  pendingCreationUsers: PendingCreationUser[];
  setPendingCreationUsers: React.Dispatch<
    React.SetStateAction<PendingCreationUser[]>
  >;
};

export const UserCreationContext = React.createContext<UserCreationContextType>(
  {
    pendingCreationUsers: [],
    setPendingCreationUsers: () => {
      throw new Error("setPendingCreationUsers not defined.");
    },
  },
);

type Props = {
  children: React.ReactNode;
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
