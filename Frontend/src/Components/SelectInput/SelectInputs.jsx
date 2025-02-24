import React, { useCallback, useEffect } from "react";
import Brands from "../BrandFilter/Brands";
import axios from "axios";
import { MONGO_URI } from "../../Variables/Variables";

const SelectInputs = ({
  rowsPerPage,
  setSearch,
  search,
  handleRowsPerPageChange,
  setCurrentPage,
  name,
  setMongoData,
  setCampaignDetails,
  setTotalPages,
}) => {
  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearch(value);
      setCurrentPage(0);
    },
    [setSearch, setCurrentPage]
  );

  

  useEffect(() => {
    if (name !== "lead" && name !== "dmp" && name !== "enrolle" && name !== "packsent" && name !== "leadsent" ) return; // Ensure name is either 'lead' or 'dmp'

    if (search === " ") {
      setCurrentPage(0);
      return;
    }

    const fetchDataFromAPI = async () => {
      try {
        let apiEndpoint = "";

        if (name === "lead") {
          apiEndpoint = `${MONGO_URI}/api/leads`;
        } else if (name === "dmp") {
          apiEndpoint = `${MONGO_URI}/api/dmp`;
        }else if (name === "enrolle") {
          apiEndpoint = `${MONGO_URI}/api/enrolle`;
        }else if (name === "packsent") {
          apiEndpoint = `${MONGO_URI}/api/packsent`;
        }else if (name === "leadsent") {
          apiEndpoint = `${MONGO_URI}/api/leadsent`;
        }

        const response = await axios.get(apiEndpoint, {
          params: {
            page: 1,
            pageSize: rowsPerPage,
            search: search,
            sortOrder: "asc",
            startDate: null,
            endDate: null,
          },
        });

        setMongoData(response.data);

        if (name === "lead") {
          setCampaignDetails(response.data.leads);
        } else if (name === "dmp") {
          setCampaignDetails(response.data.dmps);
        }else if (name === "enrolle") {
          setCampaignDetails(response.data.enrollees);
        }else if (name === "packsent") {
          setCampaignDetails(response.data.packsent);
        }else if (name === "leadsent") {
          setCampaignDetails(response.data.dmps);
        }

        setCurrentPage(response.data.currentPage - 1);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchDataFromAPI();
  }, [search, rowsPerPage, setCurrentPage, MONGO_URI, name, setMongoData]);

  return (
    <div className="table-header flex justify-between items-center mb-4">
      <select
        value={rowsPerPage}
        onChange={handleRowsPerPageChange}
        className="border p-2 rounded-md"
      >
        <option value={500}>Show 500 entries</option>
        <option value={100}>Show 100 entries</option>
        <option value={50}>Show 50 entries</option>
        <option value={25}>Show 25 entries</option>
        <option value={10}>Show 10 entries</option>
      </select>

      {name === "campaign" ||
      name === "adset" ||
      name === "ads" ||
      name === "lead"  ? (
        <Brands setSearch={setSearch} setCurrentPage={setCurrentPage} />
      ) : null}

      {[
        "campaign",
        "adset",
        "ads",
        "account",
        "allpayments",
        "lead",
        "dmp",
        "Source",
        "enrolle",
        "packsent",
        "leadsent",
      ].includes(name) && (
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearchChange}
          className="border border-gray-300 p-2 rounded-md"
        />
      )}
    </div>
  );
};

export default SelectInputs;
