import React from "react";
import DashNav from "../components/DashNav";
import { useUser } from "../components/UserContext";
import { RiShapesLine } from "react-icons/ri";
import { FaRegBell } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
const Dashboard = () => {
  const { user } = useUser();
  console.log("User in Dashboard:", user);
  const firstOptions = [
    {
      icon: (
        <RiShapesLine className="text-[#634AFF] text-3xl bg-violet-100 rounded-full p-2 scale-150" />
      ),
      title: "Upcoming Sessions",
      description: "You have 2 sessions scheduled for this week.",
      buttonText: "View all",
      buttonAction: () => console.log("View all sessions"),
    },
    {
      icon: (
        <FaRegBell className="text-[#634AFF] text-3xl bg-violet-100 rounded-full p-2 scale-150" />
      ),
      title: "Notifications",
      description: "You have 3 unread notifications.",
      buttonText: "View all",
      buttonAction: () => console.log("View all notifications"),
    },
    {
      icon: (
        <GiProgression className="text-[#634AFF] text-3xl bg-violet-100 rounded-full p-2 scale-150" />
      ),
      title: "Progress",
      description: "You have completed 4 sessions this month.",
      buttonText: "See Details",
      buttonAction: () => console.log("View all progress"),
    },
  ];
  return (
    <>
      <DashNav />
      <div className="flex flex-col items-center font-sans justify-center p-10">
        <h1 className="text-3xl font-sans font-semibold mb-4 mr-auto">
          Welcome back, {user.name}
        </h1>
        <p className="text-lg font-sans mb-4 mr-auto text-gray-500">
          Here's what's happening with your learning journey today
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 place-items-center w-full">
          {firstOptions.map((option, index) => {
            return (
              <React.Fragment key={index}>
                <div className="bg-[#634AFF] bg-opacity-5 shadow-lg rounded-lg p-8 flex flex-col gap-2 w-[400px] md:w-[300px] lg:w-[350px]  xl:w-[400px] h-[250px]">
                  {option.icon}
                  <h2 className="text-xl font-semibold">{option.title}</h2>
                  <p className="text-gray-500">{option.description}</p>
                  <div>
                    <button
                      className="bg-[#634AFF] text-white rounded-md p-2 px-4 hover:bg-[#634AFF]/80 mt-4"
                      onClick={option.buttonAction}
                    >
                      {option.buttonText}
                    </button>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
