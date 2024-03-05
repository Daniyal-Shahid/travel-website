import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from "./components/about";
import ContactUs from "./components/contactUs";
import Home from "./components/home";

function App() {
  return (
    <Router>
      <div>
        <nav className="bg-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-white font-bold">LT</div>
            <div>
              <ul className="flex space-x-4 text-white">
                <li>
                  <Link to="/home" className="hover:text-gray-300">
                    Tube Status
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-gray-300">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-gray-300">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>

      </div>

      <div className="min-h-screen bg-gradient-to-r from-blue-400 to-blue-600 flex flex-col justify-center items-center">
      <div className="max-w-md bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mt-4">Welcome to London Travels</h1>
            <p className="text-gray-600 mt-2">London's Best Train Status Website 🇬🇧</p>
            <p className="text-gray-600 mt-2">To navigate the website, use the navigation bar at the top. To check the status of the tube, click "Tube Status" above. Any other page is under construction!</p>
          </div>
        </div>
      </div>
    </div>
    </Router>

    
  );
}

export default App;
