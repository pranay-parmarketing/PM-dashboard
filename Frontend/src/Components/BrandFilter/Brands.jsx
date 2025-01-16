import React from 'react';

const Brands = ({ setSearch,setCurrentPage }) => {
  const handleBrandChange = (e) => {
    const selectedBrand = e.target.value;
    setSearch(selectedBrand); // Update the search with the selected brand's initials
    setCurrentPage(0);
  };

  return (
    <div>
      <select
        onChange={handleBrandChange}
        className="border p-2 rounded-md"
      >
        <option value="">All Brands</option>
        <option value="SD">Single Debt</option>
        <option value="TC">Taurus Collection</option>
        <option value="SML">Settle My Loan</option>
      </select>
    </div>
  );
};

export default Brands;
