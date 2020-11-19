import React from "react";
import UserTable from "../../user-table";
import UserInvite from "../../user-invite";
import "./admin-users-page.scss";

function AdminUsersPage() {
  return (
    <div className="admin-users-page-container">
      <h1>User Accounts</h1>
      <UserInvite className="invite-users-button" />
      <UserTable />
    </div>
  );
}

export default AdminUsersPage;
