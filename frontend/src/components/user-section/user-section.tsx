import React from "react";
import { ExistingUsersProvider } from "../../context-providers";
import UserTable from "../user-table";

function UserSection() {
  return (
    <ExistingUsersProvider>
      <UserTable />
    </ExistingUsersProvider>
  );
}

export default UserSection;
