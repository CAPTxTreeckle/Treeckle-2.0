import React from "react";
import { toast } from "react-toastify";
import Axios from "axios";
import { configure } from "axios-hooks";
import {
  UserProvider,
  ResponsiveProvider,
  GlobalModalProvider,
  PendingBookingCountProvider,
} from "./context-providers";
import Routes from "./routes";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.min.css";
import "react-virtualized/styles.css";
import "./animations.scss";
import "./app.scss";

toast.configure({
  position: "bottom-center",
  autoClose: 4000,
  limit: 3,
});

configure({ axios: Axios.create({ baseURL: process.env.REACT_APP_API_URL }) });

function App() {
  return (
    <div className="app">
      <ResponsiveProvider>
        <GlobalModalProvider>
          <UserProvider>
            <PendingBookingCountProvider>
              <Routes />
            </PendingBookingCountProvider>
          </UserProvider>
        </GlobalModalProvider>
      </ResponsiveProvider>
    </div>
  );
}

export default App;
