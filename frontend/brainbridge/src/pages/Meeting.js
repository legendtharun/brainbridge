import DashNav from "../components/DashNav";
import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import serverConfig from "../server.config";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import StarRatingFeedback from "../components/StarRatingFeedback";
export default function Meeting() {
  const location = useLocation();

  const { user } = useUser();
  const durationMinutes = location.state.durationMinutes;
  const [session, setSession] = useState();
  const [mentor, setMentor] = useState();
  const meetingId = location.state.meetingId;
  const mentorEmail = location.state.mentor;
  const [feedbacks, setFeedbacks] = useState([]); // State to hold feedbacks
  console.log("Feedbacks:", feedbacks); // Log feedbacks to console

  const pricePerMinute = 10; // Price per minute for the session
  const jwt = location.state.jwt; // Get JWT from location state
  let Url = `https://meet.jit.si/`;
  let Title = `Jitsi Meeting - `;
  const navigate = useNavigate();

  useEffect(() => {
    const response = axios
      .get(
        `${serverConfig.serverAddress}${serverConfig.Sessions}/session/${meetingId}`
      )
      .then((response) => {
        if (response.status === 200) {
          const session = response.data;
          setSession(session);

          document.title = Title;
        } else {
          alert("Error fetching session details.");
        }
      })
      .catch((error) => {
        console.error("Error fetching session details:", error);
        alert("Error fetching session details.");
      });
  }, []);
  useEffect(() => {
    if (session && session.meetingId !== null) {
      let finalMeetingId = session.meetingId;
      if (!finalMeetingId && meetingId) {
        finalMeetingId = meetingId;
      }

      if (finalMeetingId) {
        window.open(Url + `${finalMeetingId}`, "_blank", "noopener,noreferrer");
      }
    }
  }, [session, meetingId, Url]);
  useEffect(() => {
    if (mentorEmail) {
      axios
        .get(
          `${serverConfig.serverAddress}${serverConfig.Users}/${mentorEmail}`
        )
        .then((response) => {
          if (response.status === 200) {
            const mentor = response.data;
            setMentor(mentor);
          } else {
            alert("Error fetching mentor details.");
          }
        });
    }
  }, [mentorEmail]);
  console.log("Mentor", mentor);
  useEffect(() => {
    axios
      .get(
        `${serverConfig.serverAddress}${serverConfig.Users}/getFeedback/${mentorEmail}`
      )
      .then((response) => {
        if (response.status === 200) {
          const feedbacks = response.data;
          setFeedbacks(feedbacks);
        } else {
          alert("Error fetching feedbacks.");
        }
      });
  }, [mentorEmail]);
  return (
    <>
      <DashNav />
      {session && (
        <div className="flex flex-col align-middle justify-center h-[85vh] w-full font-sans xl:p-38 lg:p-32 md:p-16 sm:p-8 p-4 ">
          <p className="text-3xl font-bold w-full text-center mb-4">
            Jitsi meet is opened, if not here is the link:
          </p>
          <a
            href={
              session.meetingId
                ? Url + `${session.meetingId}`
                : Url + `${meetingId}`
            }
            className="text-3xl font-bold text-blue-500 underline w-full text-center mb-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            {session.meetingId
              ? Url + `${session.meetingId}`
              : Url + `${meetingId}`}
          </a>
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-7xl p-4">
              {mentor && (
                <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center">
                  <h2 className="text-xl font-bold mb-2">Pay the Mentor</h2>
                  <p className="text-lg text-gray-500">{mentor.user.name}</p>
                  <p className="text-lg text-black font-bold">
                    ₹
                    {mentor.user.ratings >= 1
                      ? mentor.user.ratings * pricePerMinute * durationMinutes
                      : pricePerMinute * durationMinutes}
                  </p>
                  {mentor.user.gpayId && (
                    <button
                      className="flex gap-2 bg-white text-black px-4 py-2 rounded-lg mt-2 hover:scale-105 transition-all duration-300 ease-in-out 
                    shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
                    >
                      <FcGoogle className="text-3xl text-gray-500 mb-2" />
                      <p className="text-lg">Pay Now</p>
                    </button>
                  )}
                </div>
              )}
              <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold mb-2">Duration</h2>
                <p className="text-lg">{durationMinutes} minutes</p>
              </div>
              {mentor && (
                <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center">
                  <h2 className="text-xl font-bold mb-2">Feedback</h2>
                  <div className="text-lg w-full">
                    <StarRatingFeedback
                      mentorEmail={mentor.user.email}
                      feedbacks={feedbacks}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
