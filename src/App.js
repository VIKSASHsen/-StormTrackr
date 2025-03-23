import React, { useState, useEffect } from "react";
// import React, { useState, useEffect } from "react";
import "./App.css"; // ✅ CSS file import

const weatherBackgrounds = {
  Clear: "url('https://source.unsplash.com/1600x900/?sunny')",
  Clouds: "url('https://source.unsplash.com/1600x900/?cloudy')",
  Rain: "url('https://source.unsplash.com/1600x900/?rain')",
  Drizzle: "url('https://source.unsplash.com/1600x900/?drizzle')",
  Thunderstorm: "url('https://source.unsplash.com/1600x900/?thunderstorm')",
  Snow: "url('https://source.unsplash.com/1600x900/?snow')",
  Mist: "url('https://source.unsplash.com/1600x900/?mist')",
  Haze: "url('https://source.unsplash.com/1600x900/?haze')",
  Fog: "url('https://source.unsplash.com/1600x900/?fog')",
  Default: "url('https://source.unsplash.com/1600x900/?nature')",
};

const App = () => {
  const [forecast, setForecast] = useState(null);
  const [city, setCity] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [background, setBackground] = useState(weatherBackgrounds.Default);

  // 🟢 Load search history from Local Storage
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    setSearchHistory(savedHistory);
  }, []);

  // 🟢 Save search history when updated
  useEffect(() => {
    localStorage.setItem("weatherHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  const fetchForecast = async (cityName) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );
      const data = await response.json();

      if (data.cod === "200") {
        console.log("5-Day Forecast Data:", data);
        setForecast(data.list);

        // 🟢 Weather ke hisaab se background change karna
        const weatherType = data.list[0].weather[0].main;
        setBackground(weatherBackgrounds[weatherType] || weatherBackgrounds.Default);

        // 🟢 Unique search history add karna
        setSearchHistory((prev) => [...new Set([cityName, ...prev])]);
      } else {
        alert("City not found! Please enter a valid city.");
      }
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    }
  };

  const appStyle = {
    backgroundImage: background,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    color: "white",
    textAlign: "center",
    padding: "20px",
  };

  return (
    <div style={appStyle}>
      <h1>🌤 Weather App</h1>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={() => fetchForecast(city)}>🔥 Get 5-Day Weather</button>

      {/* 🟢 Search History */}
      <h2>📍 Search History</h2>
      <div style={{ maxHeight: "100px", overflowY: "auto" }}>
        {searchHistory.map((city, index) => (
          <p key={index}>{city}</p>
        ))}
      </div>

      {/* 🟢 Weather Forecast */}
      {forecast && (
        <div>
          <h2>📅 5-Day Forecast</h2>
          {forecast.slice(0, 5).map((item, index) => (
            <div key={index} style={{ background: "rgba(0, 0, 0, 0.6)", padding: "10px", margin: "10px", borderRadius: "10px" }}>
              <h3>📅 Date: {item.dt_txt.split(" ")[0]}</h3>
              <p>🌡 Temp: {item.main.temp}°C</p>
              <p>⛅ Weather: {item.weather[0].description}</p>
              <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="weather icon" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
