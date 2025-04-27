import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import serverConfig from "../server.config"; // Adjust to your setup
import "./calendar.css"; // Import custom CSS
import { format, parseISO } from "date-fns";
import {
  CalendarDaysIcon,
  ClockIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const BookingCalendar = ({
  providerEmail,
  bookerEmail,
  availableSlots,
  fetchAvailability,
  loading,
  error,
  selectedSlots,
  setSelectedSlots,
  isBooking,
  setIsBooking,
}) => {
  console.log("Provider Email in BookingCalendar:", providerEmail);
  console.log("Booker Email in BookingCalendar:", bookerEmail);
  console.log("Currently selected slots:", selectedSlots); // Debugging line
  // --- Modified Event Rendering ---
  // Maps available slots and applies conditional styling for selected ones
  const events = availableSlots.map((slot) => {
    const slotId = `${slot.start}-${slot.end}`;
    const isSelected = selectedSlots.some((selected) => selected.id === slotId);
    const isInPast = new Date(slot.start) < new Date();

    return {
      id: slotId,
      start: slot.start,
      end: slot.end,
      title: isSelected ? "Selected" : "Available",
      backgroundColor: isSelected
        ? "#28a745"
        : isInPast
        ? "#cccccc"
        : "#3788d8", // Green if selected, Gray if past, Blue if available
      borderColor: isSelected ? "#28a745" : isInPast ? "#cccccc" : "#3788d8",
      textColor: isSelected ? "white" : isInPast ? "#666666" : "white",
      editable: false, // Ensure individual events aren't editable
      // Disable clicking on past events directly if needed (though handleSlotClick already checks)
      // eventStartEditable: !isInPast, // Not directly preventing click, but visual cue
      // eventDurationEditable: !isInPast, // Not directly preventing click, but visual cue
      classNames: isInPast
        ? ["fc-event-past cursor-pointer"]
        : ["cursor-pointer"], // Add class for potential CSS styling of past events
    };
  });

  if (!providerEmail) {
    return (
      <div className="calendar-container error">
        Error: Provider email not provided.
      </div>
    );
  }

  if (loading && !availableSlots.length) {
    // Show loading only initially
    return (
      <div className="calendar-container loading">Loading availability...</div>
    );
  }

  if (error) {
    return <div className="calendar-container error">Error: {error}</div>;
  }
  // useImperativeHandle hook exposes specific functions to the parent via the ref
  // useImperativeHandle(ref, () => ({
  //   // The key here ('invokeInternalFunction') is how the parent will call it
  //   invokeInternalFunction: handleConfirmBooking,
  //   // You can expose other functions or values too if needed
  //   // someOtherFunction: () => { ... }
  // }));
  // --- Modified Click Handler ---
  // Toggles selection of a slot
  const handleSlotClick = (clickInfo) => {
    const { event } = clickInfo;
    const clickedSlotId = event.id; // Use the unique ID
    const clickedSlotStart = event.start;
    const clickedSlotEnd = event.end;

    // Prevent selecting past slots
    if (clickedSlotStart < new Date()) {
      alert("This time slot is in the past and cannot be selected.");
      return;
    }

    // Check if the slot is already selected
    const isAlreadySelected = selectedSlots.some(
      (slot) => slot.id === clickedSlotId
    );

    if (isAlreadySelected) {
      // Deselect: Remove from selectedSlots
      setSelectedSlots((prevSelected) =>
        prevSelected.filter((slot) => slot.id !== clickedSlotId)
      );
    } else {
      // Select: Add to selectedSlots
      setSelectedSlots((prevSelected) => [
        ...prevSelected,
        {
          id: clickedSlotId,
          start: clickedSlotStart.toISOString(), // Store ISO string for backend
          end: clickedSlotEnd.toISOString(),
        },
      ]);
    }
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        events={events}
        eventClick={handleSlotClick} // Use the modified click handler
        selectable={false} // Keep range selection disabled
        editable={false} // Keep event modification disabled
        slotMinTime="08:00:00"
        slotMaxTime="24:00:00"
        allDaySlot={false}
        contentHeight="auto"
        eventTextColor="white" // Default text color (overridden by event mapping)
        nowIndicator={true} // Show the current time
      />
      {/* --- Confirmation Button --- */}
      <div className="booking-confirmation mt-4 text-center">
        {selectedSlots.length > 0 && (
          <p>You have selected {selectedSlots.length} slot(s).</p>
        )}
        {/* <button
              onClick={handleConfirmBooking}
              disabled={selectedSlots.length === 0 || isBooking || loading} // Disable if no selection, booking in progress, or loading availability
              className={`bg-primary text-white p-3 mt-2 rounded font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed ${
                isBooking ? "animate-pulse" : ""
              }`} // Added styling for disabled/loading state
            >
              {isBooking
                ? "Booking..."
                : `Confirm Booking for ${selectedSlots.length} Slot(s)`}
            </button> */}
        {availableSlots.length === 0 && !loading && (
          <p className="mt-4">No available slots found for this provider.</p>
        )}
        <div className="text-gray-500 text-sm m-5 text-right text-wrap">
          *Click on available slots to select them. Selected slots will turn
          green.
        </div>
      </div>
      {/* Session Details Section - Renders if slots are selected */}
      <div className="mb-8 mt-10">
        {" "}
        {/* Container outside map, added margin top */}
        {/* Heading outside the map */}
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Session Details
        </h2>
        {selectedSlots.length > 0 ? (
          // Use space-y-4 to add vertical space between multiple selected slot details
          <div className="space-y-4">
            {selectedSlots.map((slot) => {
              // --- Formatting Logic for EACH slot ---
              let displaySlotDate = "Invalid Date";
              let displaySlotTimeRange = "Invalid Time";

              try {
                // Parse the UTC ISO strings into Date objects
                const startDate = parseISO(slot.start);
                const endDate = parseISO(slot.end);

                // Format the date (e.g., "April 16, 2025")
                // format() uses the browser's local timezone (IST for you)
                displaySlotDate = format(startDate, "MMMM d, yyyy");

                // Format the time range (e.g., "9:00 AM - 9:30 AM")
                // Uses local timezone (IST). UTC 03:30 becomes 09:00 IST, UTC 04:00 becomes 09:30 IST
                displaySlotTimeRange = `${format(
                  startDate,
                  "h:mm a"
                )} - ${format(endDate, "h:mm a")}`;
              } catch (e) {
                console.error("Error formatting date/time for slot:", slot, e);
                // displaySlotDate and displaySlotTimeRange will remain 'Invalid Date/Time'
              }
              // --- End Formatting Logic ---

              return (
                // Keyed container for each slot's details - Apply styling here
                <div
                  key={slot.id || slot.start} // Use a unique key for each item
                  className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 p-4 bg-violet-50 rounded-lg border border-violet-100"
                >
                  {/* Display Formatted Date */}
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 bg-violet-100 p-2 rounded-full">
                      <CalendarDaysIcon className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Selected Date</p>
                      <p className="text-sm font-medium text-gray-800">
                        {displaySlotDate} {/* Use the formatted date */}
                      </p>
                    </div>
                  </div>

                  {/* Display Formatted Time Range */}
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 bg-violet-100 p-2 rounded-full">
                      <ClockIcon className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Selected Time</p>
                      <p className="text-sm font-medium text-gray-800">
                        {displaySlotTimeRange}{" "}
                        {/* Use the formatted time range */}
                      </p>
                    </div>
                  </div>
                </div> // End container for single slot details
              );
            })}
          </div> // End space-y-4 container
        ) : (
          // Message shown if no slots are selected
          <p className="text-gray-500 text-sm">
            Please select one or more available time slots from the calendar.
          </p>
        )}
      </div>{" "}
      {/* // End Session Details outer container */}
    </div>
  );
};

export default BookingCalendar;
