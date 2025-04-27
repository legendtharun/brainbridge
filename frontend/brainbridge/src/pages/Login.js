import React, { useRef } from "react";
import serverConfig from "../server.config";
import { useUser } from "../components/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [response, setResponse] = React.useState(null);
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const response = await axios.post(
        `${serverConfig.serverAddress}${serverConfig.Users}/Login`,
        { email, password }
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        // console.log("User in Login:", response.data.user);
        // setResponse("Login successful!");
        navigate("/dashboard");
      } else if (response.status === 401) {
        setResponse("Invalid credentials. Please try again.");
      } else {
        setResponse("An error occurred. Please try again later.");
      }
    } catch (error) {
      setResponse("An error occurred. Error: " + error.message);
      if (error.response && error.response.status === 401) {
        setResponse("Invalid credentials. Please try again.");
      } else if (error.response && error.response.status === 404) {
        setResponse("User not found. Please check your email.");
      } else {
        setResponse("An error occurred. Please try again later.");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };
  return (
    <div
      className="flex flex-col gap-3 items-center justify-center font-sans p-10 md:p-16 lg:p-24 xl:p-28"
      onKeyDown={handleKeyDown}
    >
      <div className="flex flex-col gap-5 items-center justify-center p-5">
        <div className="bg-[#634AFF] flex flex-col gap-3 bg-opacity-5 rounded-md p-6">
          <h3 className="text-2xl font-semibold ">
            Welcome to <br /> BrainBridge
          </h3>
          <div>
            <p className="text-gray-500">Login to your account to continue </p>
            <p className="text-gray-500">your learning journey</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full">
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
          <p className="text-gray-500 text-right">Forgot Password?</p>
          <p
            className={`${response ? "block" : "hidden"} 
          text-red-500 p-3 w-full`}
          >
            {response}
          </p>
          <button className="bg-[#634AFF] m-3 text-white rounded-[1.5rem] p-4 hover:scale-105 hover:bg-opacity-90 transition-all duration-300 ease-in-out">
            <p
              className="font-semibold text-xl"
              onClick={(event) => {
                handleLogin(event);
              }}
            >
              Login
            </p>
          </button>
          <p className="text-gray-500 text-center">
            Dont't have an account?
            <button
              className="text-blue-500 p-2"
              onClick={() => navigate("/Signup")}
            >
              {" "}
              Create here.
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
