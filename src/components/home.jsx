import React, { useState, useEffect } from "react";

function Home() {
  const [tubeStatus, setTubeStatus] = useState([]);

  useEffect(() => {
    fetch("https://api.tfl.gov.uk/Line/Mode/tube/Status", {
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
  }, []);

  const [tubeDisruption, setTubeDisruption] = useState([]);

  useEffect(() => {
    fetch("https://api.tfl.gov.uk/Line/Mode/tube/Disruption", {
      method: "GET",
      // Request headers
      headers: {
        "Cache-Control": "no-cache",
      },
    })
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
      default:
        return ""; // Default to empty string if no logo URL is available
    }
  };

  return (
    <div>
      <h1 className="text-lg font-sans font-medium">TFL Tube Status</h1>
      {tubeStatus.map((status, index) => (
        <div
          key={index}
          className="grid grid-cols-4 gap-4 mx-auto px-4 shrink justify-evenly items-center place-content-stretch mt-3 border shadow"
        >
          <img
            src={status.logoUrl}
            alt={`${status.name} Line Logo`}
            className="img-fluid mr-2"
            style={{ width: "100px", height: "100px" }}
          />
          <div>
            {status.status !== "Good Service" && (
              <p class="decoration-red-950 text-red-600 font-sans font-medium align-middle">
                {status.status}
              </p>
            )}
            {tubeDisruption.map((disruption, Index) => {
              if (
                disruption.name === status.name &&
                !(status.status === "Good Service")
              ) {
                return (
                  <p key={Index} class="font-sans font-normal">
                    {disruption.description}
                  </p>
                );
              }
              return null;
            })}
          </div>
          <img
            src={status.imageUrl}
            alt={`${status.name} Line Status`}
            className="img-fluid ml-2"
            style={{ width: "50px", height: "50px" }}
          />
        </div>
      ))}
    </div>
  );
}

export default Home;
