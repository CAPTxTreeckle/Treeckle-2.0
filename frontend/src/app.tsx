import React from "react";
import { toast } from "react-toastify";
import Axios from "axios";
import { configure } from "axios-hooks";
import { UserProvider, ResponsiveProvider } from "./context-providers";
import Routes from "./routes";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.min.css";
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
      <UserProvider>
        <ResponsiveProvider>
          <Routes />
        </ResponsiveProvider>
      </UserProvider>
    </div>
  );
}

export default App;
