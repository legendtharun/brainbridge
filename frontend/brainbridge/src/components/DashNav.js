import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-scroll";
import { AnimatePresence, motion } from "framer-motion";
import Hamburger from "hamburger-react";

import { RiShapesLine } from "react-icons/ri";
import { GrHomeRounded } from "react-icons/gr";
import { MdOutlineMessage } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";
const DashNav = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [menu, setmenu] = useState(false);
  const menuItems = [
    { name: "Dashboard", icon: <GrHomeRounded />, path: "/dashboard" },
    { name: "Discover Mentor", icon: <IoMdSearch />, path: "/DiscoverMentors" },
    { name: "My Sessions", icon: <RiShapesLine />, path: "/MySessions" },
    { name: "Messages", icon: <MdOutlineMessage />, path: "/chats" },
    { name: "Logout", icon: <CiLogout />, path: "/login" },
  ];

  return (
    <nav
      className="bg-white text-black
     w-full  p-5 flex justify-center items-center z-50 sticky top-0"
    >
      <button className="font-anton text-3xl font-bold tracking-wider">
        BrainBridge
      </button>
      <div className="flex space-x-4 m-auto font-atkinson text-lg gap-5">
        {menuItems.map((item, index) => (
          <Link
            className="nav-link hover:scale-105  hover:cursor-pointer
        rounded-xl p-2 z-50 hidden md:flex hover:shadow-[0_4px_10px_#513ee0]"
            key={index}
            onClick={() => navigate(item.path)}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="ml-auto flex gap-4 p-4 justify-center items-center">
        {user && user.role === "learner" ? (
          <button
            className="bg-[#634AFF] text-white rounded-md p-2 px-4 hover:bg-[#634AFF]/80"
            onClick={() => navigate("/mentorJoin")}
          >
            Become a Mentor
          </button>
        ) : (
          <button
            className="bg-[#634AFF] text-white rounded-md p-2 px-4 hover:bg-[#634AFF]/80"
            onClick={() => navigate("/mentor/stephen@gmail.com")}
          >
            My Page
          </button>
        )}
        {user && <span className="text-[#634AFF] font-bold">{user.name}</span>}
        <img
          src={user && user.profilePic}
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-[#634AFF]"
        />
      </div>

      <div className="flex h-full items-center justify-center md:hidden">
        <Hamburger toggled={menu} toggle={setmenu} />
      </div>
      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setmenu(!menu)}
            className="absolute h-screen flex items-end justify-end w-full top-0 right-0 bg-white bg-opacity-10 backdrop-blur
       dark:bg-opacity-60 overflow-hidden z-50"
          >
            <motion.div
              initial={{ right: "-100%" }}
              animate={{ right: 0 }}
              exit={{ right: "-100%" }}
              onClick={(e) => e.stopPropagation()}
              transition={{ duration: 0.4, damping: 0.5, ease: "easeInOut" }}
              className="absolute flex flex-col items-start h-full z-50   w-[50%] bg-white "
            >
              <div className="w-full h-[10vh] flex items-center px-2">
                <Hamburger toggled={menu} toggle={setmenu} />
              </div>
              <div className="mob-nav w-full items-center justify-center pt-10">
                <ul className="flex flex-col w-full items-center gap-7 m-0">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.name}
                      smooth={true}
                      duration={500}
                      offset={-100}
                      className="p-0 w-full"
                    >
                      <motion.li
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        onClick={() => {
                          setmenu(!menu);
                        }}
                        transition={{
                          duration: 0.2,
                          damping: 0.2,
                          delay: 0.2 * index,
                        }}
                        key={index}
                        className={`mx-2 w-full p-5 hover:bg-[#634AFF] cursor-pointer 
                          hover:text-white w-full ${
                            window.location.pathname === `${item.path}`
                              ? "bg-white text-[#1a3055]"
                              : ""
                          }`}
                      >
                        {item.name}
                      </motion.li>
                    </Link>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default DashNav;
