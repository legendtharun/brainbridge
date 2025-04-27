import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import serverConfig from "../server.config"; // Adjust to your setup
import "./calendar.css"; // Import custom CSS
// Adjust to your setup
const AvailabilityCalendar = ({ email, editable }) => {
  const [schedule, setSchedule] = useState([]);
  // Assuming you have a UserContext to get the current user
  // console.log("Email in AvailabilityCalendar:", email); // Keep for debugging if needed
  // console.log("Editable state:", editable);
  // console.log("Schedule in AvailabilityCalendar:", schedule); // Keep for debugging if needed

  useEffect(() => {
    // Only fetch if email is provided
    if (!email) {
      console.warn("AvailabilityCalendar: Email prop is missing.");
      setSchedule([]); // Ensure schedule is empty if no email
      return;
    }
    const fetchAvailability = async () => {
      try {
        const response = await axios.get(
          `${serverConfig.serverAddress}${serverConfig.Users}/checkAvailability/${email}`
        );
        // Ensure response.data.sessions is an array, default to [] if not
        setSchedule(
          Array.isArray(response.data.sessions) ? response.data.sessions : []
        );
      } catch (error) {
        console.error("Error fetching availability:", error);
        setSchedule([]); // Reset schedule on error
      }
    };
    fetchAvailability();
  }, [email]); // Add email as dependency - refetch if email changes
  console.log("Schedule after fetching:", schedule); // Keep for debugging if needed
  // --- Handlers only relevant when editable is true ---

  const handleDateSelect = (selectInfo) => {
    // This handler is only called if selectable={true} (i.e., editable={true})
    const { start, end } = selectInfo;
    const now = new Date();
    if (start < now) {
      alert("You cannot select past dates.");
      return;
    }
    const newSlot = { start: start.toISOString(), end: end.toISOString() };
    // Use functional update for reliability
    setSchedule((prevSchedule) => [...prevSchedule, newSlot]);
  };

  const handleEventClick = (clickInfo) => {
    // This handler is only called if eventClick is set (i.e., editable={true})
    if (window.confirm("Are you sure you want to remove this slot?")) {
      const event = clickInfo.event;
      const removedSlotStart = event.start.toISOString(); // Store ISO strings for filtering
      const removedSlotEnd = event.end.toISOString();

      event.remove(); // Remove from calendar view

      // Use functional update for reliability
      setSchedule((prevSchedule) =>
        prevSchedule.filter(
          (slot) =>
            // Check both start and end times for a more robust match
            !(slot.start === removedSlotStart && slot.end === removedSlotEnd)
        )
      );
    }
  };

  const handleSave = async () => {
    if (!email) {
      alert("Cannot save availability: User email is missing.");
      return;
    }
    try {
      // Directly await the post request
      const response = await axios.post(
        `${serverConfig.serverAddress}${serverConfig.Users}/updateAvailability`,
        { email: email, schedule: schedule } // Send current state
      );
      alert(response.data.message || "Availability saved successfully.");
    } catch (error) {
      // Log the detailed error from the server if available
      console.error(
        "Error saving availability:",
        error.response?.data || error.message || error
      );
      alert(
        error.response?.data?.message ||
          "Error saving availability. Please try again."
      );
    }
    // Removed the redundant .then/.catch after await axios.post
  };

  // --- Prepare events for FullCalendar ---
  const events = schedule.map((slot) => ({
    id: `${slot.start}-${slot.end}`, // Simple unique ID
    start: slot.start,
    end: slot.end,
    title: "Available",
    // Optional: Style differently based on editable state
    // backgroundColor: editable ? '#3788d8' : '#a9a9a9', // Darker gray when not editable
    // borderColor: editable ? '#3788d8' : '#a9a9a9',
    // className: !editable ? 'fc-event-read-only' : '' // Add class for CSS targeting
  }));
  console.log(editable);
  return (
    <div className="calendar-container">
      {/* Conditionally render title based on editable */}
      {editable ? <h2>Set Your Availability</h2> : <h2>View Availability</h2>}

      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        slotMinTime="08:00:00"
        slotMaxTime="24:00:00"
        headerToolbar={{
          // Add header toolbar for navigation
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay", // Optional: Add day view
        }}
        events={events} // Pass the mapped events
        // --- CORE FIXES ---
        // Allow selecting new slots ONLY if component is editable
        selectable={editable}
        // Allow dragging/resizing existing slots ONLY if component is editable

        // Attach the click-to-remove handler ONLY if component is editable
        eventClick={editable ? handleEventClick : undefined}
        // --- END FIXES ---

        // Attach the select handler ONLY if component is editable
        select={editable ? handleDateSelect : undefined}
        // Disable select constraint if not selectable
        selectConstraint={
          editable ? { start: new Date(), end: "9999-01-01" } : undefined
        }
        selectMirror={false} // Keep mirror effect off during selection
        unselectAuto={true} // Click outside selection to unselect
        nowIndicator={true} // Show current time indicator
        allDaySlot={false} // Typically hide the all-day slot row
        contentHeight="auto" // Adjust height as needed
      />

      {/* Only show Save button if component is editable */}
      {editable && (
        <button
          onClick={handleSave}
          className="bg-primary text-white p-2 mt-4 rounded hover:bg-primary-dark"
        >
          Save Availability
        </button>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
