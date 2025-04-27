import { useState, useEffect, useCallback, useRef } from "react";

import { useParams } from "react-router-dom"; // Import useParams for dynamic routing
import DashNav from "../components/DashNav";
import BookingCalendar from "../components/BookingCalendar"; // Import the BookingSession component
import { useUser } from "../components/UserContext";
import serverConfig from "../server.config";
import axios from "axios"; // Import useUser for user context
// Import icons (install @heroicons/react if you want to use these)
import {
  CalendarDaysIcon,
  ClockIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline"; // Use outline variants for consistency

const BookingSession = () => {
  const params = useParams(); // Get the email from the URL parameters
  const { user } = useUser(); // Get the user from context
  const mentorEmail = params.email;
  const providerEmail = params.email; // Extract the mentor's email from the URL
  const bookerEmail = user.email; // Extract the booker's email from the user context
  // Placeholder data - replace with actual props or state
  const [availableSlots, setAvailableSlots] = useState([]);
  const messageRef = useRef(null); // Ref for the message textarea
  const selectedDate = "January 15, 2023";
  const selectedTime = "11:00 AM - 12:00 PM";
  const [mentor, setMentor] = useState(); // State to hold mentor data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // --- New State ---
  // Store selected slots with their data (start, end, id)
  const [selectedSlots, setSelectedSlots] = useState([]);
  // --- State for booking process ---
  const [isBooking, setIsBooking] = useState(false);
  const availableTimeSlots = [
    { time: "9:00 AM", duration: "60 min session" },
    { time: "11:00 AM", duration: "60 min session" },
    { time: "2:00 PM", duration: "60 min session" },
  ];
  useEffect(() => {
    // Fetch mentor data using the email from the URL
    const mentoremail = params.email; // Get the mentor's email from the URL parameters
    const fetchMentor = axios
      .get(`${serverConfig.serverAddress}${serverConfig.Users}/${mentoremail}`)
      .then((response) => {
        setMentor(response.data);
      })
      .catch((error) => {
        console.error("Error fetching mentor data:", error);
      });
  }, []);
  // Fetch provider's availability (using useCallback for potential future optimizations)
  const fetchAvailability = useCallback(async () => {
    // Check if providerEmail is available before making the request
    if (!providerEmail) {
      console.error("Provider email is required for BookingCalendar.");
      setError("Provider email is missing.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${serverConfig.serverAddress}${serverConfig.Users}/checkAvailability/${providerEmail}`
      );
      setAvailableSlots(response.data.sessions || []);
    } catch (err) {
      console.error("Error fetching availability for booking:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load available slots. Please try again later."
      );
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  }, [providerEmail]); // Dependency: refetch if providerEmail changes

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]); // Call the memoized fetch function

  // --- New Booking Handler ---
  // Triggered by the confirmation button
  const handleConfirmBooking = async () => {
    if (selectedSlots.length === 0) {
      alert("Please select at least one slot to book.");
      return;
    }

    setIsBooking(true); // Indicate booking is in progress
    console.log("Confirming booking for slots:", selectedSlots);

    try {
      // **IMPORTANT:** Adjust endpoint and payload structure for multiple bookings
      const bookingPayload = {
        providerEmail: providerEmail,
        bookerEmail: bookerEmail,
        // Send selected slots as an array (adjust format if backend expects differently)
        slots: selectedSlots.map((slot) => ({
          start: slot.start,
          end: slot.end,
          // include id if backend needs it: originalId: slot.id
        })),
        header: "Booking",
        message: `Booking Confirmation:\n ${
          messageRef.current.value || "No additional message"
        }`,
        bookerName: user.name,
        providerName: mentor.user.name,
        status: "Pending",
        bookerProfile: user.profilePic ? user.profilePic : null, // Assuming user has a profile image URL
      };

      // console.log("Sending multi-booking request:", bookingPayload);

      // Example: POST request to create multiple bookings
      const response = await axios.post(
        `${serverConfig.serverAddress}${serverConfig.Messages}/`, // **<-- ADJUST ENDPOINT FOR MULTIPLE**
        bookingPayload
      );

      alert("Booking successful!");

      // Clear selection after successful booking
      setSelectedSlots([]);

      // Refresh availability from the server to show changes
      // (Alternatively, remove booked slots locally based on response)
      fetchAvailability();
    } catch (bookingError) {
      console.error("Error creating multiple bookings:", bookingError);
      // Provide more specific feedback if possible (e.g., which slots failed)
      alert(
        bookingError.response?.data?.message ||
          "Error creating booking. Some slots might no longer be available or another error occurred."
      );
      // Optionally: You might want to only clear successfully booked slots
      // from selectedSlots based on backend response, or trigger a refetch.
      fetchAvailability(); // Refetch to get the latest status even on error
    } finally {
      setIsBooking(false); // Reset booking progress indicator
    }
  };

  return (
    <>
      <DashNav />
      <div className="bg-white p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto">
        {" "}
        {/* Added padding and max-width */}
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <span>Mentors</span>
          <ChevronRightIcon className="h-4 w-4 mx-1 text-gray-400" />
          {mentor && <span>{mentor.user.name}</span>}
          <ChevronRightIcon className="h-4 w-4 mx-1 text-gray-400" />
          <span className="text-gray-700">Schedule</span>
        </nav>
        {/* Main Title */}
        {mentor && (
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            Schedule a Session with {mentor.user.name}
          </h1>
        )}
        <p className="text-gray-600 mb-8">
          Select a date from the calendar below to view available time slots.
        </p>
        {/* Calendar Placeholder Section */}
        {availableSlots && (
          <BookingCalendar
            providerEmail={mentorEmail}
            bookerEmail={user.email}
            availableSlots={availableSlots}
            fetchAvailability={fetchAvailability}
            loading={loading}
            error={error}
            selectedSlots={selectedSlots} // Pass selected slots to BookingCalendar
            setSelectedSlots={setSelectedSlots} // Pass setter function to BookingCalendar
            setIsBooking={setIsBooking} // Pass setter function to BookingCalendar
            isBooking={isBooking} // Pass booking state to BookingCalendar
          />
        )}
        {/* Topics Text Area */}
        <div className="mb-6">
          <label
            htmlFor="topics"
            className="block text-base font-medium text-gray-800 mb-2"
          >
            Topics you'd like to discuss / Additional notes for mentor
          </label>
          <textarea
            id="topics"
            name="topics"
            ref={messageRef} // Attach ref to textarea
            rows={4}
            className="w-full bg-gray-100 rounded-lg p-4 border border-gray-200 focus:ring-violet-500 focus:border-violet-500 placeholder-gray-500 text-sm"
            placeholder="E.g., Career transition, Skill development, Project feedback"
          ></textarea>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button className="bg-violet-100 text-violet-700 text-sm font-medium px-5 py-2 rounded-md hover:bg-violet-200 transition-colors">
            Cancel
          </button>
          <button
            disabled={selectedSlots.length === 0 || isBooking || loading} // Disable if no selection, booking in progress, or loading availability
            className={`bg-violet-600 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-violet-700 
                transition-colors  disabled:opacity-50 disabled:cursor-not-allowed ${
                  isBooking ? "animate-pulse" : ""
                }`} // Added styling for disabled/loading state`}
            onClick={handleConfirmBooking} // Call the booking handler
          >
            {isBooking ? "Booking..." : `Confirm Booking`}
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingSession;
