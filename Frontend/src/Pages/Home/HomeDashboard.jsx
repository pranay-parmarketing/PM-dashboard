// import React, { useState } from "react";
// import Sidebar from "../../Components/Sidebar/Sidebar";
// import Navbar from "../../Components/Navbar/Navbar";
// import Widgets from "../../Components/Widgets/Widgets";
// import FacebookTokenModal from "../../Components/CustomModal/FacebookTokenModal";
// import Charts from "../../Components/Charts/Charts";
// import FilterModal from "../../Components/CustomModal/FilterModal";
// import axios from 'axios';


// const HomeDashboard = () => {
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [isFilterModalOpen, setFilterModalOpen] = useState(false);
//   const [isSidebarOpen, setSidebarOpen] = useState(true);

//   const [widgets, setWidgets] = useState([
//     { id: 1, title: "Yesterday Leads", value: "16" },
//     { id: 2, title: "Yesterday Budget", value: "₹51511" },
//     { id: 3, title: "Yesterday Expense", value: "₹11011.01" },
//     { id: 4, title: "Yesterday Explained DMP", value: "0" },
//     { id: 5, title: "Yesterday Lead Sent", value: "0" },
//     { id: 6, title: "Yesterday Pack Sent", value: "0" },
//     { id: 7, title: "Yesterday Enrolled", value: "0" },
//     { id: 8, title: "Yesterday DI Amount", value: "0" },
//   ]);

//   const [draggedWidgetId, setDraggedWidgetId] = useState(null);

//   const handleDragStart = (e, id) => {
//     setDraggedWidgetId(id);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault(); // Allow drop
//   };

//   const handleDrop = (id) => {
//     const draggedIndex = widgets.findIndex((widget) => widget.id === draggedWidgetId);
//     const droppedIndex = widgets.findIndex((widget) => widget.id === id);

//     if (draggedIndex === droppedIndex) return; // No need to reorder if same widget is dropped

//     const updatedWidgets = [...widgets];
//     const [draggedWidget] = updatedWidgets.splice(draggedIndex, 1); // Remove dragged widget
//     updatedWidgets.splice(droppedIndex, 0, draggedWidget); // Insert it at new position

//     setWidgets(updatedWidgets);
//     setDraggedWidgetId(null);
//   };

//   const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // const data = [
  //   { year: "1991", value: 3 },
  //   { year: "1992", value: 4 },
  //   { year: "1993", value: 3.5 },
  //   { year: "1994", value: 5 },
  //   { year: "1995", value: 4.9 },
  //   { year: "1996", value: 6 },
  //   { year: "1997", value: 7 },
  //   { year: "1998", value: 9 },
  //   { year: "1999", value: 13 },
  // ];
// // 


//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <div className="flex-1 bg-gradient-to-r from-blue-50 to-white min-h-screen">
//         {/* Navbar */}
        
//         {/* Button Container */}
//         <div className="flex flex-col md:flex-row items-center justify-center gap-4 my-6 px-6">
//           <button
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
//             onClick={() => setModalOpen(true)}
//             aria-label="Open Facebook Token Modal"
//           >
//             Facebook Token
//           </button>
//           <button
//             className="px-6 py-3 bg-gray-700 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-transform transform hover:scale-105"
//             onClick={() => setFilterModalOpen(true)}
//             aria-label="Open Filter Modal"
//           >
//             Filter
//           </button>
//         </div>

//         {/* Modal Components */}
//         <FacebookTokenModal
//           isOpen={isModalOpen}
//           onClose={() => setModalOpen(false)}
//         />
//         <FilterModal
//           isOpen={isFilterModalOpen}
//           onClose={() => setFilterModalOpen(false)}
//         />

//         {/* Widgets Container */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
//           {widgets.map((widget) => (
//             <div
//               key={widget.id}
//               draggable
//               onDragStart={(e) => handleDragStart(e, widget.id)}
//               onDragOver={handleDragOver}
//               onDrop={() => handleDrop(widget.id)}
//               className="cursor-move"
//             >
//               <Widgets
//                 title={widget.title}
//                 value={widget.value}
//                 onDragStart={handleDragStart}
//                 onDragOver={handleDragOver}
//                 onDrop={handleDrop}
//                 id={widget.id}
//               />
//             </div>
//           ))}
//         </div>

//         {/* Charts Container */}
//         <div className="grid grid-cols-1 gap-6 p-6">
//           <Charts
//             title="Annual Sales"
//             data={data}
//             xField="year"
//             yField="value"
//             Amount={2300}
//           />
//           <Charts
//             title="Annual Revenue"
//             data={data}
//             xField="year"
//             yField="value"
//             Amount={2300}
//           />
//           <Charts
//             title="Customer Growth"
//             data={data}
//             xField="year"
//             yField="value"
//             Amount={2300}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomeDashboard;



import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Navbar from "../../Components/Navbar/Navbar";
import Widgets from "../../Components/Widgets/Widgets";
import FacebookTokenModal from "../../Components/CustomModal/FacebookTokenModal";
import Charts from "../../Components/Charts/Charts";
import FilterModal from "../../Components/CustomModal/FilterModal";
import axios from 'axios';
import { MONGO_URI } from "../../Variables/Variables";


const HomeDashboard = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const [widgets, setWidgets] = useState([
    { id: 1, title: "Yesterday Leads", value: "16" },
    { id: 2, title: "Yesterday Budget", value: "₹51511" },
    { id: 3, title: "Yesterday Expense", value: "₹11011.01" },
    { id: 4, title: "Yesterday Explained DMP", value: "0" },
    { id: 5, title: "Yesterday Lead Sent", value: "0" },
    { id: 6, title: "Yesterday Pack Sent", value: "0" },
    { id: 7, title: "Yesterday Enrolled", value: "0" },
    { id: 8, title: "Yesterday DI Amount", value: "0" },
  ]);

  const [draggedWidgetId, setDraggedWidgetId] = useState(null);

  const handleDragStart = (e, id) => {
    setDraggedWidgetId(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop
  };

  const handleDrop = (id) => {
    const draggedIndex = widgets.findIndex((widget) => widget.id === draggedWidgetId);
    const droppedIndex = widgets.findIndex((widget) => widget.id === id);

    if (draggedIndex === droppedIndex) return; // No need to reorder if same widget is dropped

    const updatedWidgets = [...widgets];
    const [draggedWidget] = updatedWidgets.splice(draggedIndex, 1); // Remove dragged widget
    updatedWidgets.splice(droppedIndex, 0, draggedWidget); // Insert it at new position

    setWidgets(updatedWidgets);
    setDraggedWidgetId(null);
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

 // API calls for different data
 const fetchYesterdayLeads = async () => {
  try {
    const response = await axios.get('your-leads-api-endpoint'); // Replace with actual API endpoint
    return response.data.leadsCount; // Assuming API returns leadsCount
  } catch (error) {
    console.error("Error fetching Yesterday Leads:", error);
    return "0";
  }
};

const fetchYesterdayBudget = async () => {
  try {
    const response = await axios.get('your-budget-api-endpoint'); // Replace with actual API endpoint
    return `₹${response.data.budgetAmount}`; // Assuming API returns budgetAmount
  } catch (error) {
    console.error("Error fetching Yesterday Budget:", error);
    return "₹0";
  }
};

const fetchDMPCount = async () => {
  try {
    const response = await axios.get(`${MONGO_URI}/api/dmp`); // Replace with actual API endpoint
    return response.data.yesterdayCount; // Assuming API returns dmpCount
  } catch (error) {
    console.error("Error fetching DMP Count:", error);
    return "0";
  }
};

const fetchLeadsentCount = async () => {
  try {
    const response = await axios.get(`${MONGO_URI}/api/dmp`); // Replace with actual API endpoint
    return response.data.yesterdayCount; // Assuming API returns dmpCount
  } catch (error) {
    console.error("Error fetching DMP Count:", error);
    return "0";
  }
};

// 
const fetchPackSentCount = async () => {
  try {
    const response = await axios.get(`${MONGO_URI}/api/dmp`); // Replace with actual API endpoint
    return response.data.yesterdayCount; // Assuming API returns dmpCount
  } catch (error) {
    console.error("Error fetching DMP Count:", error);
    return "0";
  }
};

const fetchEnrolledCount = async () => {
  try {
    const response = await axios.get(`${MONGO_URI}/api/dmp`); // Replace with actual API endpoint
    return response.data.yesterdayCount; // Assuming API returns dmpCount
  } catch (error) {
    console.error("Error fetching DMP Count:", error);
    return "0";
  }
};

const fetchDiAmountCount = async () => {
  try {
    const response = await axios.get(`${MONGO_URI}/api/dmp`); // Replace with actual API endpoint
    return response.data.yesterdayCount; // Assuming API returns dmpCount
  } catch (error) {
    console.error("Error fetching DMP Count:", error);
    return "0";
  }
};




const fetchAllData = async () => {
  try {
    const [
      leadsCount,
      budgetAmount,
      dmpCount,
      leadsSent,
      packSent,
      enrolled,
      diAmount
    ] = await Promise.all([
      fetchYesterdayLeads(),
      fetchYesterdayBudget(),
      fetchDMPCount(),
      fetchLeadsentCount(),
      fetchPackSentCount(),
      fetchEnrolledCount(),
      fetchDiAmountCount()
    ]);

    // Now, update the widgets with the fetched values
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) => {
        switch (widget.id) {
          case 1:
            return { ...widget, value: leadsCount };
          case 2:
            return { ...widget, value: budgetAmount };
          case 3:
            return { ...widget, value: "₹11011.01" }; // Example static value
          case 4:
            return { ...widget, value: dmpCount };
          case 5:
            return { ...widget, value: leadsSent };
          case 6:
            return { ...widget, value: packSent };
          case 7:
            return { ...widget, value: enrolled };
          case 8:
            return { ...widget, value: diAmount };
          default:
            return widget;
        }
      })
    );
  } catch (error) {
    console.error("Error fetching all data:", error);
  }
};

useEffect(() => {
  fetchAllData(); // Fetch data when the component mounts
}, []);

const data = [
  { year: "1991", value: 3 },
  { year: "1992", value: 4 },
  { year: "1993", value: 3.5 },
  { year: "1994", value: 5 },
  { year: "1995", value: 4.9 },
  { year: "1996", value: 6 },
  { year: "1997", value: 7 },
  { year: "1998", value: 9 },
  { year: "1999", value: 13 },
];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="flex-1 bg-gradient-to-r from-blue-50 to-white min-h-screen">
        {/* Navbar */}
        
        {/* Button Container */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 my-6 px-6">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            onClick={() => setModalOpen(true)}
            aria-label="Open Facebook Token Modal"
          >
            Facebook Token
          </button>
          <button
            className="px-6 py-3 bg-gray-700 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-transform transform hover:scale-105"
            onClick={() => setFilterModalOpen(true)}
            aria-label="Open Filter Modal"
          >
            Filter
          </button>
        </div>

        {/* Modal Components */}
        <FacebookTokenModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
        />
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setFilterModalOpen(false)}
        />

        {/* Widgets Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {widgets.map((widget) => (
            <div
              key={widget.id}
              draggable
              onDragStart={(e) => handleDragStart(e, widget.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(widget.id)}
              className="cursor-move"
            >
              <Widgets
                title={widget.title}
                value={widget.value}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                id={widget.id}
              />
            </div>
          ))}
        </div>

        {/* Charts Container */}
        <div className="grid grid-cols-1 gap-6 p-6">
          <Charts
            title="Annual Sales"
            data={data}
            xField="year"
            yField="value"
            Amount={2300}
          />
          <Charts
            title="Annual Revenue"
            data={data}
            xField="year"
            yField="value"
            Amount={2300}
          />
          <Charts
            title="Customer Growth"
            data={data}
            xField="year"
            yField="value"
            Amount={2300}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
