import React, { useState } from "react";
import {
  Dashboard as DashboardIcon,
  AccountBox as AccountBoxIcon,
  Campaign as CampaignIcon,
  YouTube as YouTubeIcon,
  Subscriptions as SubscriptionsIcon,
  Source as SourceIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  ShowChart as ShowChartIcon,
  PieChart as PieChartIcon,
  InsertEmoticon as InsertEmoticonIcon,
  Headset as HeadsetIcon,
  Leaderboard as LeaderboardIcon,
  Inventory2 as Inventory2Icon,
  ListAlt as ListAltIcon,
  Payment as PaymentIcon,
  Assessment as AssessmentIcon,
  Laptop as LaptopIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const initialSections = [
  { to: "/", icon: <DashboardIcon />, label: "Dashboard" },
  { to: "/account", icon: <AccountBoxIcon />, label: "Account" },
  { to: "/campaign", icon: <CampaignIcon />, label: "Campaign" },
  { to: "/adset", icon: <YouTubeIcon />, label: "Adset" },
  { to: "/ads", icon: <SubscriptionsIcon />, label: "Ads" }, 
  { to: "/source", icon: <SourceIcon />, label: "Source" },
  { to: "/budget", icon: <CurrencyRupeeIcon />, label: "Budget" },
  { to: "/expense", icon: <ShowChartIcon />, label: "Expense" },
  { to: "/visitor", icon: <InsertEmoticonIcon />, label: "Visitor" },
  { to: "/leads", icon: <PieChartIcon />, label: "Leads" },
  { to: "/lead-sent", icon: <LeaderboardIcon />, label: "Lead Sent" },
  { to: "/explained-dmp", icon: <HeadsetIcon />, label: "Explained DMP" },
  { to: "/pack-sent", icon: <Inventory2Icon />, label: "Pack Sent" },
  { to: "/enrolled", icon: <ListAltIcon />, label: "Enrolled" },
  { to: "/all-payments", icon: <PaymentIcon />, label: "All Payments" },
  { to: "/reports", icon: <AssessmentIcon />, label: "Reports" },
  { to: "/marketing-report", icon: <LaptopIcon />, label: "Marketing Report" },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [sections, setSections] = useState(initialSections);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow dropping by preventing the default behavior
  };

  const handleDrop = (index) => {
    if (draggedIndex === null) return;

    const updatedSections = [...sections];
    const [draggedItem] = updatedSections.splice(draggedIndex, 1); // Remove dragged item
    updatedSections.splice(index, 0, draggedItem); // Insert it at the drop index

    setSections(updatedSections); // Update the state with the new order
    setDraggedIndex(null); // Reset dragged index
  };

  return (
    <div
      className={`flex flex-col bg-gray-900 text-white h-screen fixed top-0 ${
        isOpen ? "w-64" : "w-20"
      } transition-all duration-300 z-50 overflow-hidden`}
      style={{
        transition: "width 0.3s ease-in-out",
        boxSizing: "border-box",
      }}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-700 mx-auto">
        <span
          className={`text-lg font-semibold ${isOpen ? "block" : "hidden"}`}
        >
          Marketing Dashboard
        </span>
        <button
          className={`text-gray-300 ${isOpen ? "pl-3" : ""}`}
          onClick={toggleSidebar}
        >
          <MenuIcon />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto sidebar-scrollbar">
        <ul className="space-y-2 p-4">
          {sections.map((section, index) => (
            <li
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              className="draggable-item"
            >
              <NavLink
                to={section.to}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center p-3 text-blue-500 bg-gray-800 rounded-md"
                    : "flex items-center p-3 text-gray-300 hover:bg-gray-700 rounded-md"
                }
              >
                <span className="icon">{section.icon}</span>
                <span className={`ml-4 ${isOpen ? "block" : "hidden"}`}>
                  {section.label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
