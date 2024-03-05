import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="max-w-md bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-yellow-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            <h1 className="text-xl font-semibold mt-4">Page Under Construction</h1>
            <p className="text-gray-600 mt-2">You stumbled across this accidentally, pretend you never saw this....</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
