import React, { useContext } from "react";
import { UserContext } from "../../../context-providers";

function DashboardPage() {
  const { name } = useContext(UserContext);

  return (
    <>
      <h1>Welcome, {name}!</h1>
      <h2>Head over to the "Bookings" tab to view/make bookings.</h2>

      <h2>Visit the "Events" tab to see upcoming events!</h2>

      <br />
      <iframe
        title="NUSMods"
        style={{ width: "100%", height: "50rem" }}
        src="https://nusmods.com"
      />
    </>
  );
}

export default DashboardPage;
