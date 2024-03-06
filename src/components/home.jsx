import React, { useState, useEffect } from "react";

function Home() {
  const [tubeStatus, setTubeStatus] = useState([]);
  const [tubeDisruption, setTubeDisruption] = useState([]);
  const [viewMore, setViewMore] = useState(false);
  const [selectedDisruption, setSelectedDisruption] = useState(null);
  const [affectedStations, setAffectedStations] = useState([]);

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

  const handleViewMoreClick = (disruption, lineName) => {
    // Set selected disruption and open view more modal
    setSelectedDisruption(disruption);
    setViewMore(true);

    // Extract beginning and end stations from the disruption description
    const description = disruption.description;
    const betweenIndex = description.indexOf("between");
    const andIndex = description.indexOf("and", betweenIndex + 8); // Start searching for "and" after "between"
    const beginningStation = description
      .substring(betweenIndex + 8, andIndex)
      .trim();
    const endStation = description
      .substring(andIndex + 4, description.indexOf("due to"))
      .trim();

    console.log(betweenIndex, andIndex, beginningStation, endStation, lineName);

    // Fetch stop points for the specific line
    fetch(`https://api.tfl.gov.uk/Line/${lineName}/StopPoints`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Extract affected stations between beginning and end stations
        const beginningIndex = data.findIndex(
          (station) => station.commonName === beginningStation
        );
        const endIndex = data.findIndex(
          (station) => station.commonName === endStation
        );

        if (beginningIndex !== -1 && endIndex !== -1) {
          const affectedStations = data
            .slice(beginningIndex, endIndex + 1)
            .map((station) => station.name);
          setAffectedStations(affectedStations);
        } else {
          console.error(
            "Beginning station or end station not found in the data array."
          );
        }
      })
      .catch((error) => {
        console.error("There was a problem fetching stop points data:", error);
      });
  };

  const handleClose = () => {
    // Close view more modal
    setViewMore(false);
    setSelectedDisruption(null);
    setAffectedStations([]);
  };

  return (
    <div>
      <h1 className="text-lg font-sans font-medium">TFL Network Status</h1>
      {tubeStatus.map((status, index) => (
        <div
          key={index}
          className="grid grid-cols-4 gap-4 mx-auto px-4 shrink justify-evenly items-center place-content-stretch mt-3 border shadow relative"
        >
          <img
            src={status.logoUrl}
            alt={`${status.name} Line Logo`}
            className="img-fluid mr-2"
            style={{ width: "100px", height: "100px" }}
          />
          <div>
            {status.status !== "Good Service" && (
              <p className="decoration-red-950 text-red-600 font-sans font-medium">
                {status.status}
              </p>
            )}

            {tubeDisruption
              .filter((disruption, dIndex) => {
                console.log("Disruption Description:", disruption.description);
                return (
                  disruption.description.includes(status.name) &&
                  dIndex ===
                    tubeDisruption.findIndex(
                      (d) => d.description === disruption.description
                    )
                );
              })
              .map((disruption, dIndex) => (
                <div key={dIndex} className="relative">
                  <button
                    className="transition ease-in-out delay-40 transform bg-red-600 hover:bg-red-800 hover:scale-65 hover:-translate-y-0.5 duration-300 text-white py-2 px-4 rounded-full align-middle"
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
            className="img-fluid ml-2"
            style={{ width: "50px", height: "50px" }}
          />
        </div>
      ))}
      {viewMore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex justify-center items-center">
          <div className="bg-white p-4 max-w-md rounded-md">
            <h2 className="text-lg font-semibold mb-2 font-medium">
              Full Details
            </h2>
            <p className="font-sans font-normal mb-2">
              {selectedDisruption.description}
            </p>
            {affectedStations.length > 0 && (
              <div>
                <h3 className="text-md font-semibold mb-1">
                  Affected Stations
                </h3>
                <ul>
                  {affectedStations.map((station, index) => (
                    <li key={index}>{station}</li>
                  ))}
                </ul>
              </div>
            )}
            <button
              className="text-blue-600 hover:text-blue-800 font-medium"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
