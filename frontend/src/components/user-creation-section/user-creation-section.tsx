import React, { useState } from "react";
import { PendingCreationUser } from "../../types/users";
import UserCreationInputSection from "../user-creation-input-section";
import UserCreationTable from "../user-creation-table";

type UserCreationSectionContextType = {
  pendingCreationUsers: PendingCreationUser[];
  setPendingCreationUsers: (
    updatedPendingCreationUsers: PendingCreationUser[],
  ) => void;
};

export const UserCreationSectionContext = React.createContext<UserCreationSectionContextType>(
  {
    pendingCreationUsers: [],
    setPendingCreationUsers: () => {
      throw new Error("setPendingCreationUsers not defined.");
    },
  },
);

function UserCreationSection() {
  const [pendingCreationUsers, setPendingCreationUsers] = useState<
    PendingCreationUser[]
  >([]);

  return (
    <UserCreationSectionContext.Provider
      value={{
        pendingCreationUsers,
        setPendingCreationUsers,
      }}
    >
      <h1>Create New Users</h1>
      <UserCreationInputSection />

      <h1>Pending Creation Users</h1>
      <UserCreationTable />
    </UserCreationSectionContext.Provider>
  );
}

export default UserCreationSection;
