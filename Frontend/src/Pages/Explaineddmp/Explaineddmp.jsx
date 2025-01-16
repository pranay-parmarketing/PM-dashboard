import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Navbar from "../../Components/Navbar/Navbar";
import { MdFileUpload } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import ChooseFileModal from "../../Components/CustomModal/ChooseFileModal";
import AddModal from "../../Components/CustomModal/AddModal";
import "./Explaineddmp.css";

const Explaineddmp = () => {
  const [mydata, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Dummy data for the table

  // Dummy data for the table
  const data = [
    {
      id: 1,
      name: "WhatsApp Campaign",
      fbAccountID: "23856451032910657",
      fbAccountName: "LionLaw",
      table: "Table1",
    },
    {
      id: 2,
      name: "WhatsApp Campaign",
      fbAccountID: "23846635955920657",
      fbAccountName: "LionLaw",
      table: "Table2",
    },
    {
      id: 3,
      name: "WebConversion mum-ban",
      fbAccountID: "23846616020680657",
      fbAccountName: "LionLaw",
      table: "Table3",
    },
    {
      id: 4,
      name: "UK Credit Card - LG Campaign",
      fbAccountID: "23850599791490657",
      fbAccountName: "LionLaw",
      table: "Table4",
    },
    {
      id: 5,
      name: "U.K Campaign Testing – MSE",
      fbAccountID: "120207992470810658",
      fbAccountName: "LionLaw",
      table: "Table5",
    },
    {
      id: 6,
      name: "U.K Campaign Testing",
      fbAccountID: "23847077639820657",
      fbAccountName: "LionLaw",
      table: "Table6",
    },
    {
      id: 7,
      name: "U.K Campaign Remarketing WV - June",
      fbAccountID: "23850533990450657",
      fbAccountName: "LionLaw",
      table: "Table7",
    },
    {
      id: 8,
      name: "U.K Campaign Remarketing WV",
      fbAccountID: "23849756909710657",
      fbAccountName: "LionLaw",
      table: "Table8",
    },
    {
      id: 9,
      name: "TC Campaign - June",
      fbAccountID: "120208996044880658",
      fbAccountName: "LionLaw",
      table: "Table9",
    },
    {
      id: 10,
      name: "TC Campaign - July",
      fbAccountID: "120209447348510658",
      fbAccountName: "LionLaw",
      table: "Table10",
    },
  ];

  useEffect(() => {
    setData(data);
  }, []);

  const handleEdit = (row) => {
    setSelectedRow(row);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id) => {
    const newData = mydata.filter((item) => item.id !== id);
    setData(newData);
  };

  const handleAddNewCampaign = () => {
    setSelectedRow(null);
    setIsAddModalOpen(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file);
    setError("");
  };

  const handleFileSave = () => {
    if (!selectedFile) {
      setError("Please choose a valid file.");
    } else {
   
      setIsModalOpen(false);
    }
  };

  // Filter data based on search input
  const filteredData = mydata.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home">
      <ChooseFileModal
        Name={"DMP"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFileChange={handleFileChange}
        onFileSave={handleFileSave}
        errorMessage={error}
      />
      <AddModal
        Name={"DMP"}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        selected={selectedRow}
      />

      <div className="homeContainer">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-2 md:space-y-0 ml-[70px]">
          <h1 className="page-title text-2xl font-semibold text-gray-800 text-center ">
          Explained DMP
          </h1>
          <div className="button-container flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 items-center">
            <button
              className="open-modal-btn flex items-center justify-center bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition duration-200 w-full md:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              <MdFileUpload className="mr-2 my-3" />
              <span className="btn-text">Import Explaineddmp</span>
            </button>
            <button
              className="filter-btn flex items-center justify-center bg-green-600 text-white rounded-md px-4 py-2 hover:bg-green-700 transition duration-200 w-full md:w-auto"
              onClick={handleAddNewCampaign}
            >
              <IoMdAdd className="mr-2" />
              <span className="btn-text">New Explaineddmp</span>
            </button>
          </div>
        </div>

       <div
          className={` md:w-[90%]   bg-white shadow-md rounded-lg p-4 ${
            isSidebarOpen ? "md:ml-16 lg:ml-16" : "md:ml-20"
          }`}
        >
          <div className="table-header flex justify-between items-center mb-4">
            <select
              onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
              value={rowsPerPage}
              className="border border-gray-300 p-2 rounded-md"
            >
              <option value={100}>Show 100 entries</option>
              <option value={50}>Show 50 entries</option>
              <option value={25}>Show 25 entries</option>
              <option value={10}>Show 10 entries</option>
            </select>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 p-2 rounded-md"
            />
          </div>
          <div className="overflow-x-auto">
          <table className="min-w-max table-auto">
              <thead>
                <tr className="bg-gray-800 text-white text-left">
                  <th>#</th>
                  <th>Lead Date</th>
                  <th>Date </th>
                  <th>Phone</th>
                  <th>Source</th>
                  <th>Agent</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {filteredData.slice(0, rowsPerPage).map((row, index) => (
                  <tr key={row.id}>
                    <td data-label="#">{index + 1}</td>
                    <td data-label="Name">{row.name}</td>
                    <td data-label="Facebook Account ID">{row.fbAccountID}</td>
                    <td data-label="Facebook Account ID">{row.fbAccountID}</td>
                    <td data-label="Facebook Account ID">{row.fbAccountID}</td>
                     <td data-label="Actions">
                      <button
                        onClick={() => handleEdit(row)}
                        className="edit-button mx-1"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="delete-button mx-1"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-footer flex justify-between items-center mt-4">
            <p className="text-gray-600">
              Showing 1 to {Math.min(rowsPerPage, filteredData.length)} of{" "}
              {filteredData.length} entries
            </p>
            <div className="pagination flex space-x-2">
              <button
                className="border rounded px-2 py-1"
                disabled={filteredData.length <= rowsPerPage}
              >
                Prev
              </button>
              <span>1</span>
              <button
                className="border rounded px-2 py-1"
                disabled={filteredData.length <= rowsPerPage}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explaineddmp;
