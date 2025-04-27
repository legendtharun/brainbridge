import axios from "axios";
import { useRef } from "react";
import { useState } from "react";
import { useUser } from "../components/UserContext";
import serverConfig from "../server.config";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
const Signup = () => {
  const { setUser } = useUser(); // Assuming you have a UserContext for user data
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [role, setRole] = useState();
  const [responseMessage, setResponseMessage] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedskills, setSkills] = useState([]);
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const skills = [
    "Data Science",
    "Web Development",
    "Machine Learning",
    "AI",
    "Blockchain",
    "Cyber Security",
    "Cloud Computing",
    "Mobile Development",
    "Game Development",
    "UI/UX Design",
    "Digital Marketing",
    "Content Writing",
    "Graphic Design",
    "Video Editing",
    "Photography",
    "Music Production",
    "Animation",
    "3D Modeling",
    "Virtual Reality",
    "Augmented Reality",
  ];
  function getStyles(skill, skills, theme) {
    return {
      fontWeight: skills.includes(skill)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
  }
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSkills(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (nameRef.current.value === "") {
      setResponseMessage("Please enter your name");
      return;
    }
    if (emailRef.current.value === "") {
      setResponseMessage("Please enter your email");

      return;
    }
    if (passwordRef.current.value === "") {
      setResponseMessage("Please enter your password");

      return;
    }
    if (confirmPasswordRef.current.value === "") {
      setResponseMessage("Please confirm your password");

      return;
    }
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      setResponseMessage("Passwords do not match");

      return;
    }
    if (role === undefined) {
      setResponseMessage("Please select a role");
      return;
    }
    if (selectedskills.length === 0) {
      setResponseMessage("Please select at least one skill");
      return;
    }
    const newUser = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      authenticated: false,
      role: role,
      expertise: selectedskills,
      profilePic: null, // Placeholder for profile picture URL
      bio: null, // Placeholder for bio
    };

    // Make POST request to send data
    axios
      .post(`${serverConfig.serverAddress}${serverConfig.Users}/`, newUser)
      .then((response) => {
        setResponseMessage("User created successfully!");
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        navigate("/dashboard"); // Assuming the response contains user data
      })
      .catch((err) => {
        setResponseMessage(`Error creating User Error:${err}`);
      });
  };
  const desiredFocusColor = "#634AFF"; // Your purple color
  const desiredHoverColor = "#8A7DFF"; // Optional: Define a hover color
  const defaultBorderColor = "rgba(0, 0, 0, 0.23)";
  return (
    <div
      className="flex flex-col gap-3 items-center justify-center font-sans p-10 md:p-16 lg:p-24 xl:p-28"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSubmit(e);
        }
      }}
    >
      <div className="flex flex-col gap-5 items-center justify-center p-5">
        <h1 className="text-4xl font-semibold">Join Brain Bridge</h1>
        <p className="text-gray-500">
          Connect with mentors and learners to <br />
          <p className="w-full text-center">share skills and knowledge</p>
        </p>
        <div className="bg-[#634AFF] bg-opacity-5 rounded-md p-6">
          <h3 className="text-xl font-semibold ">Create your account</h3>
          <p className="text-gray-500">Fill in your details to get started</p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <label className="font-semibold text-md">Full Name</label>
          <input
            type="text"
            className="border-2 border-gray-100 bg-[#F8F8F7] rounded-lg p-2
            focus:outline-none focus:border-[#634AFF] focus:ring-1 focus:ring-[#634AFF]"
            placeholder="Enter your full name"
            ref={nameRef}
            required
          />
          <label className="font-semibold text-md">Email</label>
          <input
            type="email"
            className="border-2 border-gray-100 bg-[#F8F8F7] rounded-lg p-2
            focus:outline-none focus:border-[#634AFF] focus:ring-1 focus:ring-[#634AFF]"
            placeholder="Enter your Email"
            ref={emailRef}
            required
          />
          <label className="font-semibold text-md">Password</label>
          <input
            type="password"
            className="border-2 border-gray-100 bg-[#F8F8F7] rounded-lg p-2
            focus:outline-none focus:border-[#634AFF] focus:ring-1 focus:ring-[#634AFF]"
            placeholder="*********"
            ref={passwordRef}
            required
          />
          <label className="font-semibold text-md">Confirm Password</label>
          <input
            type="password"
            className="border-2 border-gray-100 bg-[#F8F8F7] rounded-lg p-2
            focus:outline-none focus:border-[#634AFF] focus:ring-1 focus:ring-[#634AFF]"
            placeholder="*********"
            ref={confirmPasswordRef}
            required
          />
          <label className="font-semibold text-md">
            I'm joining primarily as
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              className={`bg-[#634AFF] rounded-lg hover:scale-105 hover:bg-opacity-10 hover:border-2
                hover:border-[#634AFF] transition-all duration-300 ease-in-out ${
                  role === "learner"
                    ? "border-2 border-[#634AFF] bg-opacity-10"
                    : "border-0  bg-opacity-5"
                }`}
              onClick={() => setRole("learner")}
            >
              <p className="  font-semibold p-4 text-xl">Learner</p>
              <p className="p-2 text-gray-500 text-wrap">
                I want to learn new skills
              </p>
            </button>
            <button
              className={`bg-[#634AFF] rounded-lg hover:scale-105 hover:bg-opacity-10 hover:border-2
             hover:border-[#634AFF] transition-all duration-300 ease-in-out ${
               role === "mentor"
                 ? "border-2 border-[#634AFF] bg-opacity-10"
                 : "border-0  bg-opacity-5"
             }`}
              onClick={() => setRole("mentor")}
            >
              <p className="  font-semibold p-4 py-4 text-xl">Mentor</p>
              <p className="p-2 text-gray-500 text-wrap">
                I want to share my expertise{" "}
              </p>
            </button>
          </div>
          <label className="font-semibold text-md">
            {role === "mentor"
              ? "Select your Expertise"
              : "Select your interest:"}
          </label>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Skills</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={selectedskills}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              required
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
              sx={{
                // --- Border Styling ---
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: defaultBorderColor,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: desiredHoverColor,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: desiredFocusColor, // Focus border color
                },

                // --- Focused Label Styling (Add this) ---
                // Target the InputLabel sibling when the Select/Input is focused.
                // The label itself also gets the .Mui-focused class.
                // Use '~' or '+' depending on exact DOM structure, or target label directly
                // This targets the label based on its own focused state class:
                ".MuiInputLabel-root.Mui-focused": {
                  color: desiredFocusColor, // Set label color when focused!
                },
                // --- End of Added Label Styling ---
              }}
            >
              {skills.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, selectedskills, theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <p
            className={`${responseMessage ? "block" : "hidden"} 
          ${
            responseMessage === "User created successfully!"
              ? "text-green-500"
              : "text-red-500"
          } p-3 w-full`}
          >
            {responseMessage}
          </p>
          <button
            className="bg-[#634AFF] m-3 text-white rounded-lg p-4 hover:scale-105 hover:bg-opacity-90 
          transition-all duration-300 ease-in-out"
            onClick={handleSubmit}
          >
            <p className="font-semibold text-xl">Create Account</p>
          </button>
          <p className="text-gray-500">
            By signing up, you agree to our Terms of Service and{" "}
          </p>
          <p className="text-gray-500 text-center">Privacy Policy</p>
          <p className="text-gray-500 text-center">
            Already have an account?{" "}
            <button
              className="text-blue-500 p-2"
              onClick={() => {
                navigate("/login");
              }}
            >
              {" "}
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
