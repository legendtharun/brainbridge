import "./App.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import MentorProfile from "./pages/MentorProfile";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import JwtProtectedRoute from "./components/JwtProtectedRoute";
import MentorFinder from "./pages/MentorFinder";
import BookingSession from "./pages/BookingSession";
import ChatInterface from "./pages/ChatInterface";
import MySessions from "./pages/MySessions";
import Meeting from "./pages/Meeting";
import ErrorPage from "./pages/ErrorPage";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mentor/:email" element={<MentorProfile />} />
          <Route
            path="/dashboard"
            element={
              <JwtProtectedRoute>
                <Dashboard />
              </JwtProtectedRoute>
            }
          />
          <Route
            path="/DiscoverMentors"
            element={
              <JwtProtectedRoute>
                <MentorFinder />
              </JwtProtectedRoute>
            }
          />
          <Route
            path="/bookingsession/:email"
            element={
              <JwtProtectedRoute>
                <BookingSession />
              </JwtProtectedRoute>
            }
          />
          <Route
            path="/Chats"
            element={
              <JwtProtectedRoute>
                <ChatInterface />
              </JwtProtectedRoute>
            }
          />
          <Route
            path="/MySessions"
            element={
              <JwtProtectedRoute>
                <MySessions />
              </JwtProtectedRoute>
            }
          />
          <Route
            path="/meeting/:roomName"
            element={
              <JwtProtectedRoute>
                <Meeting />
              </JwtProtectedRoute>
            }
          />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
