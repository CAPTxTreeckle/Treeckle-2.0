import { useContext } from "react";
import { UserContext } from "../../../context-providers";
import "./dashboard-page.scss";

function DashboardPage() {
  const { name } = useContext(UserContext);

  return (
    <div className="dashboard-page">
      <h1>Welcome, {name}!</h1>
      <h2>Head over to the "Bookings" tab to view/make bookings.</h2>

      <h2>Visit the "Events" tab to see upcoming events!</h2>

      <h4>
        <strong>Note:</strong> Treeckle is currently in development and we are
        working hard towards making residential life better for you. For urgent
        queries or if you have found any bugs, please contact us at{" "}
        <a href="mailto:treeckle@googlegroups.com" className="text-link">
          treeckle@googlegroups.com
        </a>
        .
      </h4>
      <br />
      <iframe
        title="NUSMods"
        className="full-width"
        style={{ height: "50rem" }}
        src="https://nusmods.com"
      />
    </div>
  );
}

export default DashboardPage;
