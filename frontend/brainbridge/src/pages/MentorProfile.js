import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashNav from "../components/DashNav";
import serverConfig from "../server.config";
import axios from "axios";
import skillsDetails from "../utils/skillsDetails";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import BookingCalendar from "../components/BookingCalendar";
import { useUser } from "../components/UserContext"; // Adjust the import based on your user context
// Navigation Bar Component
const NavigationBar = () => {
  return (
    <nav className="flex flex-wrap items-center space-x-4 p-4 bg-white">
      <a href="#" className="text-gray-800 hover:text-[#634AFF]">
        {" Discover Mentors >"}
      </a>

      <a href="#" className="text-gray-800 font-semibold">
        Alex Johnson
      </a>
    </nav>
  );
};

// Profile Image Component
const ProfileImage = ({ data }) => {
  return (
    <div className="relative w-full rounded-lg shadow-md object-cover h-[100vh] overflow-hidden">
      <div className="absolute inset-0 top-0">
        <img src={data.bannerImage} />
      </div>
    </div>
  );
};

// Profile Details Component
const ProfileDetails = ({ data, navigate, mentor, user }) => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <div className="flex items-center">
        <img
          src={data.profilePic}
          className="w-12 h-12 rounded-full"
          alt="Avatar"
        />
        <div className="ml-4">
          <h2 className="text-2xl font-semibold text-gray-800">{data.name}</h2>
          <p className="text-gray-600">Senior Software Engineer</p>
        </div>
      </div>
      <p className="text-gray-700 mt-4">{data.bio}</p>
      {data && (
        <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          {data.email !== user.email ? (
            <button
              className="bg-[#634AFF] text-white px-4 py-2 rounded-md hover:bg-[#634AFF]/80"
              onClick={() => navigate(`/bookingsession/${data.email}`)}
            >
              Book a Session
            </button>
          ) : (
            <button
              className="bg-[#634AFF] text-white px-4 py-2 rounded-md hover:bg-[#634AFF]/80"
              onClick={() => navigate(`/Your Profile/${data.email}`)}
            >
              Edit Profile
            </button>
          )}
          <button
            className="border border-[#634AFF] text-[#634AFF] px-4 py-2 rounded-md hover:bg-purple-50"
            onClick={() =>
              navigate(`/chats/`, {
                state: { email: data.email, name: data.name },
              })
            }
          >
            Message
          </button>
        </div>
      )}
    </div>
  );
};

// About Me Component
const AboutMe = ({ data }) => {
  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold text-gray-800">About Me</h3>
      <p className="text-gray-700 mt-2">{data.AboutMe}</p>
    </div>
  );
};

// Skill Card Component
const SkillCard = ({ icon, title, subtext }) => {
  return (
    <div className="bg-[#634AFF] bg-opacity-10 p-4 rounded-lg">
      <div className="text-[#634AFF] text-2xl">{icon}</div>
      <h4 className="text-lg font-semibold text-gray-800 mt-2">{title}</h4>
      <p className="text-gray-600 mt-1">{subtext}</p>
    </div>
  );
};

// Trust Badge Component
const TrustBadge = ({ icon, title, subtext }) => {
  return (
    <div className="bg-[#634AFF] bg-opacity-10 p-4 rounded-lg flex items-center space-x-2">
      <div className="text-[#634AFF] text-xl">{icon}</div>
      <div>
        <h5 className="text-lg font-semibold text-gray-800">{title}</h5>
        <p className="text-md text-gray-600">{subtext}</p>
      </div>
    </div>
  );
};

// Rating Chart Component
const RatingChart = () => {
  return (
    <div className="flex flex-wrap justify-around items-end h-32 mt-4">
      <div className="flex flex-col items-center">
        <div className="bg-[#634AFF] w-8" style={{ height: "75%" }}></div>
        <p className="text-sm text-gray-600 mt-2">5 Stars</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-[#634AFF] w-8" style={{ height: "25%" }}></div>
        <p className="text-sm text-gray-600 mt-2">4 Stars</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-[#634AFF] w-8" style={{ height: "5%" }}></div>
        <p className="text-sm text-gray-600 mt-2">3 Stars</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-[#634AFF] w-8" style={{ height: "2%" }}></div>
        <p className="text-sm text-gray-600 mt-2">2 Stars</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-[#634AFF] w-8" style={{ height: "1%" }}></div>
        <p className="text-sm text-gray-600 mt-2">1 Star</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-[#634AFF] w-8" style={{ height: "100%" }}></div>
        <p className="text-sm text-gray-600 mt-2">Overall</p>
      </div>
    </div>
  );
};

// Review Card Component
const ReviewCard = ({ avatar, name, comment }) => {
  return (
    <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
      <img src={avatar} className="w-10 h-10 rounded-full" alt={name} />
      <div>
        <h5 className="text-sm font-semibold text-gray-800">{name}</h5>
        <p className="text-gray-600 mt-1">{comment}</p>
        <div className="text-yellow-500 mt-1">★★★★★</div>
      </div>
    </div>
  );
};

// Reviews and Ratings Component
const ReviewsAndRatings = ({ navigate, data }) => {
  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold text-gray-800 text-center">
        Reviews & Ratings
      </h3>
      <RatingChart />
      <div className="mt-4 space-y-4">
        <ReviewCard
          avatar="https://via.placeholder.com/40"
          name="Sarah M"
          comment="The sessions with Alex transformed my coding skills. Highly recommend!"
        />
        <ReviewCard
          avatar="https://via.placeholder.com/40"
          name="Michael P"
          comment="Clear explanations and patient guidance. Alex is an excellent mentor."
        />
        <ReviewCard
          avatar="https://via.placeholder.com/40"
          name="Jamie L"
          comment="Helped me prepare for technical interviews. Worth every penny!"
        />
      </div>
      <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <button
          className="text-[#634AFF] border border-[#634AFF] px-4 py-2 rounded-md hover:bg-purple-50"
          onClick={() => navigate("/reviews/mentor")}
        >
          View All Reviews
        </button>
        <button
          className="bg-[#634AFF] text-white px-4 py-2 rounded-md hover:bg-[#634AFF]/80 w-full sm:w-auto"
          onClick={() => navigate(`/bookingsession/${data.email}`)}
        >
          Book a Session Now
        </button>
      </div>
    </div>
  );
};

// Main Mentor Profile Component
const MentorProfile = () => {
  const [mentor, setMentor] = useState();
  const navigate = useNavigate();
  const { user } = useUser();

  // Assuming you have a user context or hook to get the logged-in user
  useEffect(() => {
    const path = window.location.pathname;
    const pathArray = path.split("/");
    const mentoremail = pathArray[pathArray.length - 1];
    const fetchMentor = axios
      .get(`${serverConfig.serverAddress}${serverConfig.Users}/${mentoremail}`)
      .then((response) => {
        setMentor(response.data);
      })
      .catch((error) => {
        console.error("Error fetching mentor data:", error);
      });
  }, []);
  const handleSlotSelect = (slot) => {
    // Handle the selected slot (e.g., show confirmation dialog)
    console.log("Selected slot:", slot);
  };

  return (
    <>
      <DashNav />
      <div className="max-w-7xl mx-auto bg-white font-sans">
        <NavigationBar />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <div className="md:col-span-2">
            {mentor && <ProfileImage data={mentor.user} />}
          </div>
          <div>
            {mentor && (
              <ProfileDetails
                data={mentor.user}
                navigate={navigate}
                user={user}
              />
            )}
          </div>
        </div>
        {mentor && <AboutMe data={mentor.user} />}
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Skills & Expertise
          </h3>
          {mentor && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {mentor.user.expertise.map((skill) => {
                const skillDetails = skillsDetails.find(
                  (s) => s.name === skill
                );
                return (
                  <SkillCard
                    key={skillDetails.name}
                    icon={skillDetails.icon}
                    title={skillDetails.name}
                    subtext={"Verifed by platform"}
                  />
                );
              })}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">Trust Signals</h3>
          {mentor && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <TrustBadge
                icon="🛡️"
                title="Verified Skills"
                subtext="All skills verified by platform."
              />
              <TrustBadge
                icon="📅"
                title={`${
                  mentor.user.sessionsCompleted
                    ? mentor.user.sessionsCompleted
                    : 0
                } Sessions`}
                subtext="Completed successfully."
              />
              <TrustBadge
                icon="⭐"
                title={`${mentor.user.ratings} /5.0`}
                subtext="From 98 reviews."
              />
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Availability Calendar
          </h3>
          {mentor && (
            <AvailabilityCalendar
              email={mentor.user.email}
              onSlotSelect={handleSlotSelect}
              editable={mentor.user.email === user.email}
            />
          )}
        </div>
        {mentor && <ReviewsAndRatings data={mentor.user} navigate={navigate} />}
      </div>
    </>
  );
};

export default MentorProfile;
