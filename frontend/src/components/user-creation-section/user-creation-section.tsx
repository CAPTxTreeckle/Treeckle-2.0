import React from "react";
import { UserCreationProvider } from "../../context-providers";
import UserCreationInputSection from "../user-creation-input-section";
import UserCreationTable from "../user-creation-table";

function UserCreationSection() {
  return (
    <UserCreationProvider>
      <h1>User Creation</h1>
      <UserCreationInputSection />

      <h1>Pending Creation Users</h1>
      <UserCreationTable />
    </UserCreationProvider>
  );
}

export default UserCreationSection;
