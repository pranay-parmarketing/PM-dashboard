import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/Apicontext";
import { AuthenticationProvider } from "./context/AuthContext";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthenticationProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AuthenticationProvider>
  </React.StrictMode>
);


reportWebVitals();
