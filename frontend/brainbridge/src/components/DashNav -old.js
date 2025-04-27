import React from "react";
import { RiShapesLine } from "react-icons/ri";
import { GrHomeRounded } from "react-icons/gr";
import { MdOutlineMessage } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
const DashNav = ({ data }) => {
  const navigate = useNavigate();
  return (
    <nav className="font-sans flex align-middle p-4 gap-5">
      <span className="text-2xl font-bold text-[#634AFF] p-2">BrainBridge</span>
      <ul className="flex gap-4 p-4">
        <li
          className="hover:text-[#634AFF] cursor-pointer flex gap-2 align-middle"
          onClick={() => navigate("/dashboard")}
        >
          <span className="p-1">
            <GrHomeRounded />
          </span>
          <span>Dashboard</span>
        </li>
        <li
          className="hover:text-[#634AFF] cursor-pointer flex gap-2 align-middle"
          onClick={() => navigate("/DiscoverMentors")}
        >
          <span className="p-1">
            <IoMdSearch />
          </span>
          <span>Discover Mentor</span>
        </li>
        <li
          className="hover:text-[#634AFF] cursor-pointer flex gap-2 align-middle"
          onClick={() => navigate("/MySessions")}
        >
          <span className="p-1">
            <RiShapesLine />
          </span>
          <span>My Sessions</span>
        </li>
        <li
          className="hover:text-[#634AFF] cursor-pointer flex gap-2 align-middle"
          onClick={() => navigate("/chats")}
        >
          <span className="p-1">
            <MdOutlineMessage />
          </span>
          <span>Messages</span>
        </li>
      </ul>
      <div className="ml-auto flex gap-4 p-4">
        {data && data.role === "learner" ? (
          <button className="bg-[#634AFF] text-white rounded-md p-2 px-4 hover:bg-[#634AFF]/80">
            Book a Session
          </button>
        ) : (
          <button className="bg-[#634AFF] text-white rounded-md p-2 px-4 hover:bg-[#634AFF]/80">
            Become a Mentor
          </button>
        )}
        {data && <span className="text-[#634AFF] font-bold">{data.name}</span>}
        <img
          src={data && data.profilePic}
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-[#634AFF]"
        />
      </div>
    </nav>
  );
};

export default DashNav;
