import React, { useEffect, useState, useCallback } from "react";
// Importing icons from react-icons
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import DashNav from "../components/DashNav";
import serverConfig from "../server.config"; // Assuming you have a serverConfig file for API endpoints
import { useUser } from "../components/UserContext"; // Assuming you have a UserContext for user data
import { useNavigate } from "react-router-dom"; // For navigation
// --- Reusable Mentor Card Component ---
const MentorCard = ({ mentor }) => {
  const navigate = useNavigate(); // For navigation to mentor profile
  // Simple star ratingCount display (replace with a more robust component if needed)
  const renderStars = (ratingCount) => {
    const fullStars = Math.floor(ratingCount);
    const halfStar = ratingCount % 1 >= 0.5; // You might want more precise logic
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    // Using simple text stars for brevity - consider SVG icons for better visuals
    return (
      <>
        {"★".repeat(fullStars)}
        {/* {halfStar && '½'}  Add half star logic if needed */}
        {"☆".repeat(emptyStars)}
      </>
    );
  };

  return (
    <div className="bg-purple-50/50 hover:shadow-lg transition-shadow duration-300 p-5 rounded-lg border border-gray-200 flex flex-col">
      <div className="flex items-center mb-3 gap-2">
        {/* Placeholder Icon */}
        {mentor.profilePic ? (
          <img
            src={mentor.profilePic}
            className="w-[30px] h-[30px] rounded-full"
          />
        ) : (
          <FaUserCircle className="text-indigo-500 text-3xl mr-3" />
        )}

        <div>
          <h3 className="font-semibold text-lg text-gray-800">{mentor.name}</h3>
          <p className="text-sm text-gray-600">
            {mentor.expertise &&
              mentor.expertise.map((expertise, index) => {
                if (index != mentor.expertise.length) {
                  return (
                    <span key={index}>
                      {expertise}
                      {index < mentor.expertise.length - 1 && ", "}
                    </span>
                  );
                }
              })}
          </p>
        </div>
      </div>
      <div className="flex items-center text-sm text-amber-500 mb-4">
        {mentor && renderStars(mentor.ratings)}
        <span className="ml-2 text-gray-700">
          ({mentor && mentor.ratings.toFixed(1)})
        </span>
      </div>
      <button
        className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200"
        onClick={() => navigate(`/mentor/${mentor.email}`)}
      >
        View Profile
      </button>
    </div>
  );
};

// --- Main Mentor Finder Component ---
const MentorFinder = () => {
  const { user } = useUser(); // Assuming you have a UserContext for user data
  console.log("User in MentorFinder:", user); // Debugging line to check user data
  // --- Placeholder Data (Replace with actual data fetching) ---
  const [mentors, setMentors] = useState([]);

  // State for pagination control
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Default items per page

  // State for pagination metadata from the backend
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // State for loading and error handling
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch mentors data - using useCallback for potential optimization
  const fetchMentors = useCallback(async (page, size) => {
    setIsLoading(true);
    setError(null); // Reset error before new fetch
    console.log(`Workspaceing page ${page} with size ${size}`); // Debugging line

    try {
      const response = await axios.get(
        `${serverConfig.serverAddress}${serverConfig.Users}/findmentors`,
        {
          params: {
            page: page, // Send page parameter
            size: size, // Send size parameter
          },
        }
      );

      console.log("Paginated Mentors data:", response.data); // Debugging line

      // Validate response structure (basic check)
      if (
        response.data &&
        Array.isArray(response.data.mentors) &&
        response.data.totalPages !== undefined
      ) {
        setMentors(response.data.mentors);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);
        // Optional: Sync currentPage state if backend sends it back reliably
        // setCurrentPage(response.data.currentPage);
      } else {
        console.error("Unexpected response structure:", response.data);
        throw new Error("Received invalid data structure from server.");
      }
    } catch (err) {
      console.error("Error fetching mentors:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch mentors."
      );
      // Reset data on error? Optional, depends on UX preference
      // setMentors([]);
      // setTotalPages(0);
      // setTotalItems(0);
    } finally {
      setIsLoading(false); // Ensure loading is set to false in both success and error cases
    }
  }, []); // Empty dependency array for useCallback as it doesn't depend on component state/props directly

  // useEffect to fetch data when component mounts or currentPage/pageSize changes
  useEffect(() => {
    fetchMentors(currentPage, pageSize);
  }, [currentPage, pageSize, fetchMentors]); // Add fetchMentors to dependencies

  // --- Pagination Handlers ---
  const handleNextPage = () => {
    // Prevent going beyond the last page
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    // Prevent going below page 1
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Optional: Handler to change page size (if you add a dropdown/select)
  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to page 1 when size changes
  };

  // --- Filter Options Data ---
  const filterOptions = [
    {
      label: "Skills",
      options: [
        "Select skills",
        "UX Design",
        "Data Science",
        "Web Development",
      ],
    },
    {
      label: "Availability",
      options: ["Any time", "Mornings", "Afternoons", "Evenings"],
    },
    {
      label: "ratingCount",
      options: ["Any ratingCount", "4+ Stars", "3+ Stars", "2+ Stars"],
    },
    { label: "Price Range", options: ["Any price", "$", "$$", "$$$"] },
  ];

  return (
    <>
      <DashNav />
      <div className="bg-white min-h-screen p-4 sm:p-8 font-sans">
        {" "}
        {/* Changed background to white as per image */}
        <div className="max-w-7xl mx-auto">
          {/* --- Title --- */}
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-6 sm:mb-8">
            Find Your Perfect Mentor
          </h1>

          {/* --- Search Bar --- */}
          <div className="relative max-w-xl mx-auto mb-8 sm:mb-10">
            <input
              type="text"
              placeholder="Search by name, skill, or expertise..."
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-700 placeholder-gray-400"
            />
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* --- Filter Section --- */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Filter Options
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filterOptions.map((filter) => (
                <div key={filter.label}>
                  <label
                    htmlFor={filter.label.toLowerCase().replace(" ", "-")}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {filter.label}
                  </label>
                  <select
                    id={filter.label.toLowerCase().replace(" ", "-")}
                    name={filter.label.toLowerCase().replace(" ", "-")}
                    className="w-full p-2.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                  >
                    {filter.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* --- Results Count --- */}
          <div className="mb-5 text-base text-gray-700">
            {mentors && mentors.length} Mentors Found
          </div>

          {/* --- Mentor Grid --- */}
          {/* Responsive Grid: 1 col default, 2 cols on sm, 3 on md, 4 on lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8 sm:mb-10">
            {mentors &&
              mentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
          </div>

          {/* --- Pagination --- */}
          {/* Basic static pagination structure - Needs state logic for actual functionality */}
          {totalPages > 0 && (
            <div className="flex items-center justify-center py-4">
              {totalPages > 0 && (
                <div className="bg-white rounded-md shadow-md p-4 flex items-center space-x-4">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1 || isLoading}
                    className={`bg-[#634AFF] text-white font-semibold p-2 focus:outline-none focus:ring-2 focus:ring-[#634AFF] focus:ring-opacity-50 flex items-center 
                      rounded-full ${
                        currentPage === 1 || isLoading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-indigo-600"
                      }`}
                  >
                    <FaChevronLeft className="mr-2" />
                  </button>
                  <span className="text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || isLoading}
                    className={`bg-[#634AFF] text-white font-semibold p-2 focus:outline-none focus:ring-2 focus:ring-[#634AFF] focus:ring-opacity-50 flex items-center 
                      rounded-full ${
                        currentPage === totalPages || isLoading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-[#634AFF]/60"
                      }`}
                  >
                    <FaChevronRight className="ml-2" />
                  </button>
                  {/* Optional: Page Size Selector */}
                  {/* <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  disabled={isLoading}
                  className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                </select> */}
                  <p className="text-gray-600">Total Mentors: {totalItems}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MentorFinder; // Export the main component
