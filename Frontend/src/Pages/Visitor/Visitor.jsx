import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdFileUpload } from "react-icons/md";
import axios from "axios";
import { MONGO_URI } from "../../Variables/Variables";

const Visitor = () => {
  const [visitorCount, setVisitorCount] = useState([]);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const response = await axios.get(`${MONGO_URI}/api/visitorcount`);
        setVisitorCount(response.data.analyticsData); // ✅ Fix: Access `response.data.analyticsData`
      } catch (error) {
        console.error("Error fetching visitor count:", error);
      }
    };

    fetchVisitorCount();
  }, []);

  return (
    <div className="home">
      <div className="homeContainer">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-2 md:space-y-0 ml-[70px]">
          <h1 className="page-title text-2xl font-semibold text-gray-800 text-center ">
            Visitors
          </h1>
          <div
            className="button-container flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 items-center"
            style={{ visibility: "hidden" }}
          >
            <button className="open-modal-btn flex items-center justify-center bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition duration-200 w-full md:w-auto">
              <MdFileUpload className="mr-2 my-3" />
              <span className="btn-text">Import Adset</span>
            </button>
            <button className="filter-btn flex items-center justify-center bg-green-600 text-white rounded-md px-4 py-2 hover:bg-green-700 transition duration-200 w-full md:w-auto">
              <IoMdAdd className="mr-2" />
              <span className="btn-text">New Adset</span>
            </button>
          </div>
        </div>

        <div
          className={`md:w-[90%] bg-white shadow-md rounded-lg p-4 md:ml-16 lg:ml-16`}
        >
          <div className="overflow-x-auto">
            <table className="min-w-max table-auto">
              <thead>
                <tr className="bg-gray-800 text-white text-left">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Country</th>
                  <th className="px-4 py-2">Browser</th>
                  <th className="px-4 py-2">Active Users</th>
                  <th className="px-4 py-2">New Users</th>
                  <th className="px-4 py-2">Page Views</th>
                  <th className="px-4 py-2">Sessions</th>
                  <th className="px-4 py-2">Bounce Rate</th>
                </tr>
              </thead>

              <tbody className="text-gray-700">
                {visitorCount.length > 0 ? (
                  visitorCount.map((item, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{item.country}</td>
                      <td className="px-4 py-2">{item.browser}</td>
                      <td className="px-4 py-2">{item.activeUsers}</td>
                      <td className="px-4 py-2">{item.newUsers}</td>
                      <td className="px-4 py-2">{item.pageViews}</td>
                      <td className="px-4 py-2">{item.sessions}</td>
                      <td className="px-4 py-2">
                        {(item.bounceRate * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center px-4 py-2">
                      Loading visitor data...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visitor;
