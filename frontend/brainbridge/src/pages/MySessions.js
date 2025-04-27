// src/components/MySessions.jsx
import React, { useEffect, useState } from "react";
import DashNav from "../components/DashNav";
import { CiCamera } from "react-icons/ci";
import { IoChatbubblesOutline } from "react-icons/io5";
import { CiStar } from "react-icons/ci";
import { LuClock } from "react-icons/lu";
import { GiCancel } from "react-icons/gi";
import axios from "axios";
import serverConfig from "../server.config.js";
import { useUser } from "../components/UserContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

// --- Icon Mapping (Replace text with actual icons) ---
const Icon = ({ type }) => {
  // In a real app, you'd use an icon library (e.g., Heroicons, FontAwesome)
  switch (type) {
    case "video":
      return (
        <span className="text-gray-500">
          <CiCamera />
        </span>
      );
    case "chat":
      return (
        <span className="text-gray-500">
          <IoChatbubblesOutline />
        </span>
      );
    case "star":
      return (
        <span className="text-gray-500">
          <CiStar />
        </span>
      );
    case "clock":
      return (
        <span className="text-gray-500">
          <LuClock />
        </span>
      );
    case "cancelled":
      return (
        <span className="text-gray-500">
          <GiCancel />
        </span>
      );
    default:
      return null;
  }
};
const handleJoinSession = ({ sessionId, navigate }) => {
  const response = axios
    .get(
      `${serverConfig.serverAddress}${serverConfig.Sessions}/sessionbyId/${sessionId}`
    )
    .then((response) => {
      if (response.status === 200) {
        const session = response.data;
        console.log("Session fetched:", session);
        navigate(`/meeting/${session.meetingId}`, {
          state: {
            durationMinutes: 30,
            meetingId: session.meetingId,
          },
        });
      } else {
        alert("Error fetching session details.");
      }
    })
    .catch((error) => {
      console.error("Error fetching session details:", error);
      alert("Error fetching session details.");
    });
};
const handleCancel = ({ sessionId, navigate, fetchSessions }) => {
  axios
    .put(`${serverConfig.serverAddress}${serverConfig.Sessions}/`, {
      sessionId: sessionId,
      status: "Cancelled",
    })
    .then((response) => {
      if (response.data.length === 1) {
        console.log("Session cancelled:", response.data);
        fetchSessions(); // Navigate to MySessions after cancellation
      } else {
        alert("Error cancelling session.");
      }
    })
    .catch((error) => {
      console.error("Error cancelling session:", error);
      alert("Error cancelling session.");
    });
};
// --- Session Item Component ---
const SessionItem = ({ session, user, navigate, fetchSessions, activeTab }) => {
  const { slot, bookerEmail, providerEmail } = session;
  const otherEmail = providerEmail === user.email ? bookerEmail : providerEmail;

  // parse the ISO strings
  const startDate = new Date(slot.start);
  const endDate = new Date(slot.end);

  // format to IST
  const fmtOpts = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  };
  const startLocal = startDate.toLocaleTimeString("en-IN", fmtOpts);
  const endLocal = endDate.toLocaleTimeString("en-IN", fmtOpts);

  // compute duration
  const diffMs = endDate - startDate;
  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;
  const duration = `${hours > 0 ? hours + "h " : ""}${minutes}m`;

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center w-full">
        <img
          src={session.avatar}
          alt={session.instructor}
          className="w-10 h-10 rounded-full mr-4"
        />
        <div>
          <h3 className="font-semibold text-gray-800">{session.title}</h3>
          <p className="text-sm text-gray-500">
            with {otherEmail} • {startLocal} – {endLocal} ({duration})
          </p>
        </div>
        <div
          className="flex p-4 ml-auto items-center gap-3 
        "
        >
          {" "}
          {/* Adjust positioning as needed */}
          <Icon type="video" />
          <Icon type="chat" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {/* Render Actions */}
        {session.status === "Cancelled" ||
        new Date(session.slot.start) <= new Date() ? (
          <button
            className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700
          disabled:opacity-50 cursor-not-allowed"
            disabled={true}
          >
            Watch Recording
          </button>
        ) : session.providerEmail === user.email &&
          session.status !== "Cancelled" &&
          new Date(session.slot.start) > new Date() ? (
          <>
            <button
              className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() =>
                handleCreateSession({
                  sessionId: session.id,
                  navigate: navigate,
                  prefixLength: 8,
                  bookerEmail: session.bookerEmail,
                  providerEmail: session.providerEmail,
                })
              } // Pass session ID to create session
            >
              Create Session
            </button>
            <button
              className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() =>
                handleCancel({
                  sessionId: session.id,
                  navigate: navigate,
                  prefixLength: 8,
                  fetchSessions: fetchSessions,
                })
              } // Pass session ID to create session
            >
              Cancel Session
            </button>
          </>
        ) : (
          activeTab === "Upcoming" &&
          new Date(session.slot.start) > new Date() &&
          session.providerEmail !== user.email && (
            <button
              className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() =>
                handleJoinSession({
                  sessionId: session.id,
                  navigate: navigate,
                })
              }
            >
              Join Session
            </button>
          )
        )}
      </div>
    </div>
  );
};
const handleCreateSession = ({
  sessionId,
  navigate,
  prefixLength,
  bookerEmail,
  providerEmail,
}) => {
  console.log("Creating session with ID:", sessionId); // Debugging line
  // Logic to create a session (e.g., API call)
  /**
   * Creates a session ID string with a random prefix like "abc-cdf-sk".
   *
   * @param {string} sessionId - The session identifier to append.
   * @param {number} [prefixLength=8] - The length of the random prefix.
   * @returns {string} The combined session ID string.
   */
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let randomPrefix = "";
  for (let i = 0; i < prefixLength; i++) {
    randomPrefix += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  // Insert hyphens
  const parts = [];
  for (let i = 0; i < randomPrefix.length; i += 3) {
    parts.push(randomPrefix.substring(i, Math.min(i + 3, randomPrefix.length)));
  }
  const formattedPrefix = parts.join("-");
  console.log(`${formattedPrefix}${sessionId}`);
  axios
    .put(`${serverConfig.serverAddress}${serverConfig.Sessions}/`, {
      sessionId: sessionId,
      meetingId: `${formattedPrefix}-${sessionId}`,
      status: "completed",
    })
    .then((response) => {
      navigate(`/meeting/${formattedPrefix}-${sessionId}`, {
        state: {
          durationMinutes: 30,
          meetingId: `${formattedPrefix}-${sessionId}`,
          mentor: providerEmail,
          mentee: bookerEmail,
          sessionId: sessionId,
        }, // Pass the meeting
      }); // Navigate to the meeting page with the session ID
    })
    .catch((err) => console.log(err)); // Debugging line
};

// Example usage: // Output: "abc-cdf-sk-user123"
// --- Main Component ---
const MySessions = () => {
  const [activeTab, setActiveTab] = useState("Upcoming"); // Default tab
  const [sessions, setSessions] = useState([]);
  const [dates, setDates] = useState([]);
  const { user } = useUser(); // Assuming you have a UserContext to get user info
  const tabs = ["Upcoming", "Past", "Cancelled"];
  const navigate = useNavigate(); // Initialize useNavigate

  // Filter sessions based on active tab (simple example)
  const filteredSessions = sessions.filter((session) => {
    const sessionStartDate = new Date(session.slot.start);
    if (
      activeTab === "Upcoming" &&
      (session.status === "Pending" || sessionStartDate > new Date())
    )
      return true; // Assume items without status are upcoming
    if (
      activeTab === "Past" &&
      (session.status === "Completed" || sessionStartDate <= new Date())
    )
      return true;
    if (activeTab === "Cancelled" && session.status === "Cancelled")
      return true;
    return false;
  });
  const fetchSessions = async () => {
    const response = await axios
      .get(
        `${serverConfig.serverAddress}${serverConfig.Sessions}/${user.email}`
      )
      .then((response) => {
        setSessions(response.data);
        console.log("Sessions fetched:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
      });
  };
  useEffect(() => {
    fetchSessions();
  }, []);
  // Determine section title based on tab
  const sectionTitle = `${activeTab} Sessions`;
  // helpers/date.js
  // —————————————————————————
  // 1. ordinal suffix helper
  function getOrdinal(day) {
    const rem100 = day % 100;
    if (rem100 >= 11 && rem100 <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  // 2. format ISO → "17th July 2025"
  function formatIndianDateWithOrdinal(isoString) {
    // parse your ISO timestamp
    const d = new Date(isoString);

    // pull out the day number, month name, year
    // using en-IN and Asia/Kolkata so it’s always in IST
    const day = d.toLocaleString("en-IN", {
      day: "numeric",
      timeZone: "Asia/Kolkata",
    });
    const monthYear = d.toLocaleString("en-IN", {
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });

    // tack on the suffix to the day
    const suf = getOrdinal(Number(day));
    return `${day}${suf} ${monthYear}`;
  }

  return (
    <>
      <DashNav />
      <div className="p-8 bg-white max-w-7xl mx-auto font-sans">
        {" "}
        {/* Using generic sans-serif */}
        <h1 className="text-3xl font-bold mb-6 text-gray-900">My Sessions</h1>
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-black text-black" // Active tab style
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" // Inactive tab style
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        {/* Session List Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            {sectionTitle}
          </h2>
          <div className="space-y-2 divide-y divide-gray-100">
            {filteredSessions.length > 0 ? (
              (() => {
                // 1) Clone + sort newest-first
                const sorted = [...filteredSessions].sort(
                  (a, b) => new Date(b.slot.start) - new Date(a.slot.start)
                );

                // 2) track the last date header emitted
                let lastDate = "";

                return sorted.map((session) => {
                  const dayKey = session.slot.start.split("T")[0];
                  const showHeader = dayKey !== lastDate;
                  if (showHeader) lastDate = dayKey;

                  return (
                    <div key={session.id} className="relative py-4">
                      {showHeader && (
                        <h1 className="text-2xl font-bold mb-2">
                          {formatIndianDateWithOrdinal(session.slot.start)}
                        </h1>
                      )}
                      <SessionItem
                        session={session}
                        user={user}
                        navigate={navigate}
                        fetchSessions={fetchSessions}
                        activeTab={activeTab}
                      />
                    </div>
                  );
                });
              })()
            ) : (
              <p className="text-gray-500 py-4">
                No {activeTab.toLowerCase()} sessions found.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MySessions;
