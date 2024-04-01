import React, { useState, useEffect } from "react";

function Home() {
  const [tubeStatus, setTubeStatus] = useState([]);
  const [tubeDisruption, setTubeDisruption] = useState([]);
  const [viewMore, setViewMore] = useState(false);
  const [selectedDisruption, setSelectedDisruption] = useState(null);
  const [affectedStations, setAffectedStations] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false); // Define isDarkMode state variable
  

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const ToggleSwitch = ({ isDarkMode, onToggle }) => {
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          id="toggle"
          className="hidden"
          checked={isDarkMode}
          onChange={onToggle}
        />
        <label htmlFor="toggle" className="cursor-pointer relative w-14 h-8 rounded-full bg-gray-400 dark:bg-gray-800 flex items-center">
          <div className={`toggle-dot absolute w-6 h-6 rounded-full bg-white dark:bg-gray-400 shadow-md transform ${isDarkMode ? 'translate-x-6' : ''}`}></div>
        </label>
      </div>
    );
  };


  useEffect(() => {
    fetch("https://api.tfl.gov.uk/Line/Mode/tube,%20dlr,%20overground/Status", {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.error);
        }
        return response.json();
      })
      .then((data) => {
        const mappedData = data.map((line) => ({
          name: line.name,
          status: line.lineStatuses[0].statusSeverityDescription,
          imageUrl: getImageUrl(line.lineStatuses[0].statusSeverityDescription),
          logoUrl: getLogoUrl(line.name),
        }));
         // Log the mappedData to inspect its structure
        console.log("Mapped Data:", mappedData);
        setTubeStatus(mappedData);
      })
      .catch((error) => {
        console.error("There was a problem fetching data");
      });

    fetch(
      "https://api.tfl.gov.uk/Line/Mode/tube,%20dlr,%20overground/Disruption",
      {
        method: "GET",
        // Request headers
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    )
      .then((response) => {
        if (!response.status) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((data) => {
        setTubeDisruption(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const getImageUrl = (status) => {
    switch (status) {
      case "Good Service":
        return "https://upload.wikimedia.org/wikipedia/commons/c/ca/Eo_circle_green_blank.svg";
      case "Minor Delays":
        return "https://upload.wikimedia.org/wikipedia/commons/9/91/Location_dot_orange.svg";
      case "Severe Delays":
        return "https://upload.wikimedia.org/wikipedia/commons/0/02/Red_Circle%28small%29.svg";
      case "Part Suspended":
        return "https://upload.wikimedia.org/wikipedia/commons/f/f1/Triangle_warning_sign_%28red_and_yellow%29.svg";
      // Add more cases as needed for other status types
      default:
        return "https://upload.wikimedia.org/wikipedia/commons/4/48/Light_Blue_Circle.svg"; // Default to empty string if no image URL is available
    }
  };

  const getLogoUrl = (lineName) => {
    switch (lineName) {
      case "Bakerloo":
        return "https://upload.wikimedia.org/wikipedia/commons/0/0a/Bakerloo_line_roundel.svg";
      case "Central":
        return "https://upload.wikimedia.org/wikipedia/commons/4/45/Central_Line_roundel.svg";
      case "Circle":
        return "https://upload.wikimedia.org/wikipedia/commons/e/e9/Circle_Line_roundel.svg";
      case "District":
        return "https://upload.wikimedia.org/wikipedia/commons/f/fd/District_line_roundel.svg";
      case "Hammersmith & City":
        return "https://upload.wikimedia.org/wikipedia/commons/9/9a/H%26c_line_roundel.svg";
      case "Jubilee":
        return "https://upload.wikimedia.org/wikipedia/commons/1/17/Jubilee_line_roundel.svg";
      case "Metropolitan":
        return "https://upload.wikimedia.org/wikipedia/commons/0/0d/Metropolitan_line_roundel.svg";
      case "Northern":
        return "https://upload.wikimedia.org/wikipedia/commons/7/7d/Northern_line_roundel.svg";
      case "Piccadilly":
        return "https://upload.wikimedia.org/wikipedia/commons/a/ae/Piccadilly_line_roundel.svg";
      case "Victoria":
        return "https://upload.wikimedia.org/wikipedia/commons/b/be/Victoria_line_roundel.svg";
      case "Waterloo & City":
        return "https://upload.wikimedia.org/wikipedia/commons/6/67/W%26c_line_roundel.svg";
      case "DLR":
        return "https://upload.wikimedia.org/wikipedia/commons/9/94/Docklands-Light-Railway-Logo.svg";
      case "London Overground":
        return "https://upload.wikimedia.org/wikipedia/commons/e/eb/London_Overground_logo.svg";
      default:
        return ""; // Default to empty string if no logo URL is available
    }
  };

  const handleViewMoreClick = async (disruption) => {
    // Set selected disruption and open view more modal
    setSelectedDisruption(disruption);
    setViewMore(true);

    // Extract beginning and end stations from the disruption description
    const description = disruption.description;
    const betweenIndex = description.indexOf("between");
    let andIndex = description.indexOf("and", betweenIndex + 8); // Start searching for "and" after "between"
    if (andIndex === -1) {
        andIndex = description.indexOf("/", betweenIndex + 8); // Use "/" if "and" is not found
    }
    const beginningStation = description.substring(betweenIndex + 8, andIndex).trim();
    let endStation = description.substring(andIndex + 4, description.indexOf("due to")).trim();

    // Handle multiple stations separated by "/"
    const stationsAfterSlash = endStation.split("/");
    endStation = stationsAfterSlash[0].trim(); // Update endStation to the first station after the slash

    try {
        // Fetch station IDs for beginning and end stations
        const beginningStationId = await fetchStationIdByName(beginningStation);
        const endStationId = await fetchStationIdByName(endStation);

        // Check if disruption.lineName is defined and not empty
        if (disruption.lineName) {
            // Fetch all stop points between beginning and end stations
            const stopPoints = await fetchStopPointsBetweenStations(beginningStationId, endStationId, disruption.lineName);

            // Extract station names from stop points
            const intermediateStations = stopPoints.map(stopPoint => stopPoint.commonName);

            console.log("Intermediate stations:", intermediateStations);
        } else {
            throw new Error("Line name is undefined or empty");
        }
    } catch (error) {
        console.error("Error fetching intermediate stations:", error);
    }
};



const fetchStationIdByName = async (stationName) => {
    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/Search?query=${stationName}&modes=tube`);
    const data = await response.json();
    if (data.matches.length > 0) {
        return data.matches[0].id;
    } else {
        throw new Error(`Station '${stationName}' not found`);
    }
};

const fetchStopPointsBetweenStations = async (beginningStationId, endStationId, lineName) => {
  const response = await fetch(`https://api.tfl.gov.uk/Line/${lineName}/StopPoints?includeCrowdingData=false`);
  const data = await response.json();

  // Check if data is in the expected format
  if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid response from API");
  }

  // Find the line details from the response
  const lineDetails = data.find(line => line.id === lineName);
  if (!lineDetails || !Array.isArray(lineDetails.stopPoints)) {
      throw new Error("Invalid response from API - Stop points not found for the specified line");
  }

  // Filter out stop points that are not on the specified line
  const lineStopPoints = lineDetails.stopPoints;

  const beginningIndex = lineStopPoints.findIndex(stopPoint => stopPoint.id === beginningStationId);
  const endIndex = lineStopPoints.findIndex(stopPoint => stopPoint.id === endStationId);
  if (beginningIndex !== -1 && endIndex !== -1) {
      return lineStopPoints.slice(Math.min(beginningIndex, endIndex), Math.max(beginningIndex, endIndex) + 1);
  } else {
      throw new Error("Beginning or end station not found in stop points list");
  }
};

  const handleClose = () => {
    // Close view more modal
    setViewMore(false);
    setSelectedDisruption(null);
    setAffectedStations([]);
  };

  return (
    <div className={`App transition-colors duration-600 ${isDarkMode ? 'dark bg-dark-background' : 'light bg-white'}`}>
  <div className="flex justify-end p-4">
    <ToggleSwitch isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
  </div>
  <h1 className={`page-header text-center text-3xl font-bold mb-8 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>TFL Network Status</h1>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {tubeStatus.map((status, index) => (
      <div key={index} className={`tube-status-card ${isDarkMode ? 'bg-dark-secondary' : 'bg-white'} p-4 rounded-lg shadow-md`}>
        <img
          src={status.logoUrl}
          alt={`${status.name} Line Logo`}
          className="w-24 h-24 mx-auto mb-4"
        />
        <div>
          {status.status.toLowerCase() === "good service" && (
            <p></p>
          )}
          {status.status.toLowerCase() === "minor delays" && (
            <p className={`tube-line-status text-center text-yellow-600 font-bold py-1 rounded-lg ${status.status.toLowerCase().replace(' ', '-')}`}>
            {status.status}
          </p>
          )}
          {status.status.toLowerCase() === "severe delays" && (
          <p className={`tube-line-status text-center text-red-600 font-bold font-outline py-1 rounded-lg ${status.status.toLowerCase().replace(' ', '-')}`}>
            {status.status}
            </p>
          )}
          {status.status.toLowerCase() === "part suspended" && (
          <p className={`tube-line-status text-center text-red-600 font-extrabold py-1 rounded-lg ${status.status.toLowerCase().replace(' ', '-')}`}>
            {status.status}
            </p>
          )}
          {tubeDisruption
            .filter((disruption, dIndex) => disruption.description.includes(status.name) &&
              dIndex === tubeDisruption.findIndex(d => d.description === disruption.description))
            .map((disruption, dIndex) => (
              <div key={dIndex} className="relative flex justify-center">
                <button
                  className="view-more-button bg-gray-800 hover:bg-blue-600 content-center text-white font-bold py-2 px-4 rounded-lg inline-block mt-2"
                  onClick={() => handleViewMoreClick(disruption, status.name)}
                >
                  View More
                </button>
              </div>
            ))}
        </div>
        <img
          src={status.imageUrl}
          alt={`${status.name} Line Status`}
          className="w-12 h-12 mx-auto mt-4"
        />
      </div>
    ))}
  </div>
  {viewMore && (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-800 bg-opacity-75">
    <div className="overlay-content bg-white dark:bg-dark-secondary p-8 rounded-lg shadow-lg">
        <h2 className="overlay-title text-2xl font-bold mb-4 dark:text-white">Full Details</h2>
        <p className="overlay-description mb-4 dark:text-white">{selectedDisruption.description}</p>
        {affectedStations.length > 0 && (
          <div>
            <h3 className="affected-stations-title text-lg font-bold mb-2">Affected Stations</h3>
            <ul>
              {affectedStations.map((station, index) => (
                <li key={index} className="text-gray-700">{station}</li>
              ))}
            </ul>
          </div>
        )}
        <button className="close-button bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg mt-6" onClick={handleClose}>Close</button>
      </div>
    </div>
  )}
</div>
  );
}

export default Home;
