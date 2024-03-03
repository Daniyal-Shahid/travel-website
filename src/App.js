import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';





function App() {
  // State to store the fetched data
  const [tubeStatus, setTubeStatus] = useState([]);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch('https://api.tfl.gov.uk/Line/Mode/tube/Status', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.error);
        }
        return response.json();
      })
      .then(data => {
        // Set the fetched data to the state
        setTubeStatus(data);
      })
      .catch(error => {
        console.error('There was a problem fetching data');
      });
  }, []); // Empty dependency array ensures that this effect runs only once on component mount

  const [tubeDisruption, setTubeDisruption] = useState([]);

    useEffect(() => {
      fetch('https://api.tfl.gov.uk/Line/Mode/tube/Disruption', {
        method: 'GET',
        // Request headers
        headers: {
        'Cache-Control': 'no-cache',
        }
      })
      .then(response => {
        if (!response.status) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(data => {
        setTubeDisruption(data);
      })
      .catch(err => console.error(err));
    }, [])

    const [airQuality, setAirQuality] = useState([]);
    
    useEffect(() => {
      fetch('https://api.tfl.gov.uk/AirQuality/', {
        method: 'GET',
        // Request headers
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); // Parse the JSON response
      })
      .then(data => {
        console.log("Air quality data:", data); // Log the fetched data
        setAirQuality(data); // Set the parsed JSON data to the state
      })
      .catch(err => console.error(err));
    }, []);

  
  // Access the forecastSummary of the first forecast if available
  // const firstForecastSummary = airQuality.currentForecast?.[0]?.forecastSummary || '';


  return (
    <div className="App container">
      <h1 className="mt-5">TFL Tube Status</h1>
      <ul className="list-group mt-3">
        {tubeStatus.map((status, index) => (
          <li key={index} className="list-group-item d-flex align-items-center">
            {status.name === 'Bakerloo' && (
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/0a/Bakerloo_line_roundel.svg" alt="Bakerloo Line Logo" className="img-fluid mr-2" style={{ maxWidth: '10%' }} />
            )}
            {status.name === 'Central' && (
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/45/Central_Line_roundel.svg" alt="Central Line Logo" className="img-fluid mr-2" style={{ maxWidth: '10%'}} />
            )}
            {status.name === 'Circle' && (
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Circle_Line_roundel.svg" alt="Circle Line Logo" className="img-fluid mr-2" style={{ maxWidth: '10%'}} />
            )}
            {status.name === 'District' && (
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fd/District_line_roundel.svg" alt="District Line Logo" className="img-fluid mr-2" style={{ maxWidth: '10%'}} />
            )}
            {status.name === 'Hammersmith & City' && (
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/H%26c_line_roundel.svg" alt="Hammersmith and City Line Logo" className="img-fluid mr-2" style={{ maxWidth: '10%'}} />
            )}
            {status.name === 'Jubilee' && (
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/17/Jubilee_line_roundel.svg" alt="Jubilee Logo" className="img-fluid mr-2" style={{ maxWidth: '10%'}} />
            )}
            {status.name === 'Metropolitan' && (
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Metropolitan_line_roundel.svg" alt="Metro Logo" className="img-fluid mr-2" style={{ maxWidth: '10%'}} />
            )}
            {status.name === 'Northern' && (
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/7d/Northern_line_roundel.svg" alt="Northern Logo" className="img-fluid mr-2" style={{ maxWidth: '10%'}} />
            )}
            {status.name === 'Piccadilly' && (
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Piccadilly_line_roundel.svg" alt="Piccadilly Logo" className="img-fluid mr-2" style={{ maxWidth: '10%'}} />
            )}
            {status.name === 'Victoria' && (
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/be/Victoria_line_roundel.svg" alt="Victoria Logo" className="img-fluid mr-2" style={{ maxWidth: '10%'}} />
            )}
            {status.name === 'Waterloo & City' && (
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/67/W%26c_line_roundel.svg" alt="Waterloo and City Logo" className="img-fluid mr-2" style={{ maxWidth: '10%'}} />
            )}
            <div>{status.lineStatuses[0].statusSeverityDescription} </div>
          </li>
        ))}
      </ul>

      <h2 className="mt-5">Tube Disruption</h2>
      <ul className="list-group mt-3">
        {tubeDisruption.map((disruption, index) => (
          <li key={index} className="list-group-item">{disruption.description}
          </li>
        ))}
      </ul>

      <h2 className="mt-5">Air Quality</h2>
      <ul className="list-group mt-3">{airQuality.currentForecast?.map((forecast, index) => (
    <li key={index} className="list-group-item">
      {forecast.forecastType === "Current" && (
        <>
          <strong>Todays air quality:</strong>
          <p>{forecast.forecastSummary}</p>
        </>
      )}
      {forecast.forecastType === "Future" && (
        <>
          <strong>Tomorrows air quality:</strong> 
          <p>{forecast.forecastSummary}</p>
        </>
      )}

      {forecast.forecastBand === "Low" && (
            <img src="http://www.clker.com/cliparts/L/u/0/1/d/C/green-square-md.png" alt= "Green square" className="img-fluid mr-2" style={{ maxWidth: '30px'}} />
          )}
    </li>

  ))}
</ul>



    </div>

        
  );

  
}

export default App;
