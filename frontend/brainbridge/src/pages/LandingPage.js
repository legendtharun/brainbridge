import React from "react";

import hero from "../assets/hero.png"; // Replace with your actual image path
import Navbar from "../components/Navbar"; // Adjust the import path as necessary

// --- How It Works Section ---
const HowItWorks = () => {
  const steps = [
    {
      icon: "🔍", // Placeholder icon
      title: "Easy Discovery",
      description:
        "Find mentors and learners based on skills, interests, and availability with our smart matching algorithm.",
      buttonText: "Learn More",
      bgColor: "bg-purple-50", // Lighter purple background for cards
      textColor: "text-purple-800",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
    {
      icon: "🤝", // Placeholder icon
      title: "Trusted Mentors",
      description:
        "Connect with verified experts who have been rated and reviewed by our community of learners.",
      buttonText: "Browse Mentors",
      bgColor: "bg-purple-50",
      textColor: "text-purple-800",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
    {
      icon: "📅", // Placeholder icon
      title: "Flexible Scheduling",
      description:
        "Book sessions that fit your calendar with our easy-to-use scheduling system and reminders.",
      buttonText: "See How",
      bgColor: "bg-purple-50",
      textColor: "text-purple-800",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white font-inter">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          How SkillShareHub Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`p-8 rounded-lg shadow-lg ${step.bgColor} flex flex-col items-center`}
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className={`text-xl font-semibold mb-3 ${step.textColor}`}>
                {step.title}
              </h3>
              <p className="text-gray-600 mb-6 text-sm">{step.description}</p>
              <button
                className={`mt-auto text-white px-6 py-2 rounded-md text-sm font-medium shadow ${step.buttonColor}`}
              >
                {step.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Success Stories Section ---
const SuccessStories = () => {
  const stories = [
    {
      icon: "💻", // Placeholder icon
      role: "SOFTWARE DEVELOPER",
      name: "Sarah J.",
      quote:
        '"I learned Python in just 8 weeks through weekly sessions with my mentor. Now I\'m building my own apps and helping others!"',
      bgColor: "bg-purple-50",
    },
    {
      icon: "📷", // Placeholder icon
      role: "PHOTOGRAPHY MENTOR",
      name: "Michael T.",
      quote:
        '"Teaching photography on SkillShareHub has connected me with amazing students and helped me refine my own techniques."',
      bgColor: "bg-purple-50",
    },
    {
      icon: "📈", // Placeholder icon
      role: "MARKETING SPECIALIST",
      name: "Elena R.",
      quote:
        '"The flexible scheduling made it possible for me to learn digital marketing while working full-time. Game changer!"',
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gray-50 font-inter">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          Success Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stories.map((story, index) => (
            <div
              key={index}
              className={`p-8 rounded-lg shadow-lg ${story.bgColor} flex flex-col`}
            >
              <div className="text-3xl mb-4 self-start">{story.icon}</div>
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1 self-start">
                {story.role}
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 self-start">
                {story.name}
              </h3>
              <p className="text-gray-600 text-sm italic text-left">
                "{story.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Join Community CTA Section ---
const CommunityCTA = () => {
  return (
    <section className="py-16 md:py-24 bg-white font-inter">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Join Our Growing Community
        </h2>
        <p className="text-gray-600 mb-8">
          Connect with over 10,000 mentors and 50,000 learners worldwide
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-md font-medium shadow-md transition duration-300">
            Sign Up Now
          </button>
          <button className="bg-transparent hover:bg-purple-100 text-purple-600 border border-purple-600 px-8 py-3 rounded-md font-medium transition duration-300">
            Become a Mentor
          </button>
        </div>
      </div>
    </section>
  );
};

// --- Popular Categories Section ---
const PopularCategories = () => {
  // Simplified data matching the visual structure
  const categories = [
    { name: "Coding", height: "h-48" }, // Tallest bar
    { name: "Design", height: "h-40" },
    { name: "Language", height: "h-36" },
    { name: "Business", height: "h-32" },
    { name: "Music", height: "h-28" },
    { name: "Cooking", height: "h-24" },
    { name: "Fitness", height: "h-20" },
    { name: "Writing", height: "h-16" }, // Shortest bar
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50 font-inter">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-md font-medium shadow-md transition duration-300 mb-16">
          Get Started
        </button>
        <div className="flex justify-center items-end space-x-2 md:space-x-4 h-64 mb-4">
          {categories.map((category, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-8 md:w-12 bg-purple-600 rounded-t-md ${category.height}`}
              ></div>
              <span className="mt-2 text-xs md:text-sm text-gray-600">
                {category.name}
              </span>
            </div>
          ))}
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mt-8">
          Most Popular Skill Categories
        </h3>
      </div>
    </section>
  );
};

// --- Footer Section ---
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12 font-inter">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>
          &copy; {new Date().getFullYear()} SkillShareHub. All rights reserved.
        </p>
        {/* Add more footer links or info here if needed */}
      </div>
    </footer>
  );
};

// --- Main Landing Page Component ---
const LandingPage = () => {
  return (
    <div className="font-inter">
      <Navbar />
      {/* Hero Section */}
      <section className="h-screen w-full relative pt-16">
        {" "}
        {/* Added pt-16 for navbar height */}
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero})` }}
        ></div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        {/* Centered Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
            style={{
              WebkitTextStroke: "1px #634AFF", // Purple outline
              textStroke: "1px #634AFF", // Standard property
              WebkitTextFillColor: "white",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)", // Optional shadow for better readability
            }}
          >
            Learn Anything, Teach Anyone.
          </h1>
          {/* Optional: Add a subtitle or button here */}
          {/* <p className="text-lg md:text-xl text-gray-200 mb-8">Your tagline here</p> */}
          {/* <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-md font-medium shadow-md transition duration-300">Get Started</button> */}
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Success Stories Section */}
      <SuccessStories />

      {/* Join Community CTA Section */}
      <CommunityCTA />

      {/* Popular Categories Section */}
      <PopularCategories />

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

// Export the main component for use in your app
export default LandingPage;

// To use this:
// 1. Make sure you have React and Tailwind CSS set up in your project.
// 2. Replace the placeholder Navbar component with your actual Navbar code/import.
// 3. Replace the placeholder hero image URL with your `import hero from '../assets/hero.png';`.
// 4. Ensure you have the 'Inter' font available (e.g., via Google Fonts or local setup).
// 5. Import and render the `LandingPage` component in your main App.js or equivalent file.
