import React from "react";
import "./searchfile.css";

const SearchBar = ({ handleSearch }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Enter Name for Search"
        onChange={(e) => handleSearch(e)}
        className="search-input"
      />
      <button className="search-button">🔍 Search</button>
    </div>
  );
};

export default SearchBar;
