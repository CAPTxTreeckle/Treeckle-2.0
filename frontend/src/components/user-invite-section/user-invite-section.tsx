import React from "react";
import { UserInvitesProvider } from "../../context-providers";
import UserInviteTable from "../user-invite-table";

function UserInviteSection() {
  return (
    <UserInvitesProvider>
      <UserInviteTable />
    </UserInvitesProvider>
  );
}

export default UserInviteSection;
