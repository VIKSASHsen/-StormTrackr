import React from "react";

const History = ({ searchHistory, onSearch }) => {
  return (
    <div>
      <h2>📍 Search History</h2>
      <ul>
        {searchHistory.length === 0 ? (
          <p>No search history yet.</p>
        ) : (
          searchHistory.map((city, index) => (
            <li key={index} onClick={() => onSearch(city)} style={{ cursor: "pointer", color: "blue" }}>
              {city}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default History;
