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
    </Router>
  );
}

export default App;
