import React, { useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Login from "./Pages/Login/Login";
import HomeDashboard from "./Pages/Home/HomeDashboard";
import Account from "./Pages/Account/Account";
import Campaign from "./Pages/Campaign/Campaign";
import Adset from "./Pages/Adset/Adset";
import Source from "./Pages/SourcePage/Source";
import Budget from "./Pages/Budget/Budget";
import Expense from "./Pages/Expense/Expense";
import Visitor from "./Pages/Visitor/Visitor";
import Leads from "./Pages/Leads/Leads";
import Explaineddmp from "./Pages/Explaineddmp/Explaineddmp";
import LeadSent from "./Pages/LeadSent/LeadSent";
import PackSent from "./Pages/PackSent/PackSent";
import Enrolled from "./Pages/Enrolled/Enrolled";
import AllPayments from "./Pages/AllPayments/AllPayments";
import Reports from "./Pages/Reports/Reports";
import MarketingReport from "./Pages/MarketingReport/MarketingReport";
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import "./Utils/CommonStyles.css";
import Signup from "./Pages/Signup/Signup";
import { AuthenticationProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Ads from "./Pages/Ads/Ads";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Use the location to determine the current path
  const location = useLocation();

  // Define routes where the Sidebar should not be visible
  const noSidebarRoutes = ["/login", "/signup"];

  const shouldShowSidebar = !noSidebarRoutes.includes(
    location.pathname.toLowerCase()
  );

  return (
    <div>
      {/* Conditionally render Sidebar */}
      {shouldShowSidebar && (
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}
      <div
        className={`flex flex-col min-w-1 min-h-screen bg-gray-100 transition-all duration-300 ${
          shouldShowSidebar ? (isSidebarOpen ? "ml-18 lg:ml-64" : "ml-20") : ""
        }`}
      >
        {/* Navbar can also be conditionally rendered if needed */}
        {shouldShowSidebar && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />

          <Route
            path="/campaign"
            element={
              <ProtectedRoute>
                <Campaign />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/adset"
            element={
              <ProtectedRoute>
                <Adset />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/ads"
            element={
              <ProtectedRoute>
                <Ads />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/source"
            element={
              <ProtectedRoute>
                <Source />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget"
            element={
              <ProtectedRoute>
                <Budget />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/expense"
            element={
              <ProtectedRoute>
                <Expense />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/visitor"
            element={
              <ProtectedRoute>
                <Visitor />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads"
            element={
              <ProtectedRoute>
                <Leads />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/explained-dmp"
            element={
              <ProtectedRoute>
                <Explaineddmp />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/lead-sent"
            element={
              <ProtectedRoute>
                <LeadSent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pack-sent"
            element={
              <ProtectedRoute>
                <PackSent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enrolled"
            element={
              <ProtectedRoute>
                <Enrolled />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-payments"
            element={
              <ProtectedRoute>
                <AllPayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketing-report"
            element={
              <ProtectedRoute>
                <MarketingReport />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
