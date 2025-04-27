import db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getPagination, getPagingData } from "../utils/getPagination.js";
const Op = db.Sequelize.Op;
const User = db.users;

// Create and Save a new User
export const create = async (req, res) => {
  // Validate request
  if (!req.body.email) {
    return res.status(400).send({ message: "Email is undefined!" });
  }

  try {
    // 1. Hash the password first
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // 2. Create a user object with hashed password
    const user = {
      name: req.body.name,
      email: req.body.email,
      authenticated: req.body.authenticated || false,
      password: hashedPassword,
      role: req.body.role,
      expertise: req.body.expertise || null,
      profilePic: req.body.profilePic || null,
      bio: req.body.bio || null,
      ratings: req.body.ratings || 0,
      sessions: req.body.sessions || null,
      sessionsCompleted: req.body.sessionsCompleted || null,
      priceRange: req.body.priceRange || null,
      AboutMe: req.body.aboutMe || null,
      bannerImage: req.body.bannerImage || null,

      // Add any other fields you want to include
    };

    // 3. Save the user in the database
    const data = await User.create(user);

    // 4. Build payload for JWT (NEVER include password in JWT!)
    const payload = {
      email: data.email,
      name: data.name,
      authenticated: data.authenticated,
      role: data.role,
      expertise: data.expertise || null,
      profilePic: data.profilePic || null,
      bio: data.bio || null,

      ratings: data.ratings || null,
      sessions: data.sessions || null,

      sessionsCompleted: data.sessionsCompleted || null,
      priceRange: data.priceRange || null,
      AboutMe: data.AboutMe || null,
      bannerImage: data.bannerImage || null,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 5. Send response (optional: remove password from response object)
    const { password, ...safeUser } = data.toJSON(); // assuming Sequelize or Mongoose
    res.send({ user: safeUser, token });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the user.",
    });
  }
};

// Retrieve all Users
// export const findAll = (req, res) => {
//   Allow a filter condition via query parameter
//   const User = req.query.email;
//   const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

//   User.findAll({ where: condition })
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving Users.",
//       });
//     });
// };

// Find a single User by email

// Assuming 'User' is your Sequelize model

export const findOne = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // Find User by primary key (email)
  User.findByPk(email)
    .then((data) => {
      if (data) {
        // Compare the plaintext password with the hashed password
        bcrypt.compare(password, data.password, (err, isMatch) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return res.status(500).send({
              message: "An error occurred while verifying credentials.",
            });
          }

          if (isMatch) {
            const payload = {
              email: data.email,
              name: data.name,
              role: data.role,
              authenticated: data.authenticated,
              expertise: data.expertise || null,
              profilePic: data.profilePic || null,
              bio: data.bio || null,
              ratings: data.ratings || null,
              sessions: data.sessions || null,
              sessionsCompleted: data.sessionsCompleted || null,
              priceRange: data.priceRange || null,
              AboutMe: data.AboutMe || null,
              bannerImage: data.bannerImage || null,

              // add additional properties as needed
            };

            // Generate a JWT token
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
              expiresIn: "1h", // e.g., "1h" for one hour
            });

            // Send response with token and user data
            res.send({ user: data, token });
          } else {
            res.status(401).send({
              message: "Invalid Email or Password, Think Once Again!",
            });
          }
        });
      } else {
        res.status(404).send({
          message: `Cannot find User with email=${email}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with email=" + email,
      });
    });
};
export const MentorProfile = (req, res) => {
  const email = req.params.email;
  // Find User by primary key (email)
  User.findByPk(email)
    .then((data) => {
      if (data) {
        res.send({ user: data });
      } else {
        res.status(401).send({
          message: "Invalid Email or Password, Think Once Again!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with email=" + email,
      });
    });
};

// Update a User by email
export const update = (req, res) => {
  const email = req.params.email;

  // Update the User with the specified email
  User.update(req.body, {
    where: { email: email },
  })
    .then((num) => {
      if (num === 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with email=${email}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with email=" + email,
      });
    });
};

// Delete a User by email
export const deleteOne = (req, res) => {
  const email = req.params.email;

  // Delete the User with the specified email
  User.destroy({
    where: { email: email },
  })
    .then((num) => {
      if (num === 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with email=${email}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with email=" + email,
      });
    });
};

// Delete all Users
export const deleteAll = (req, res) => {
  // Delete all Users
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Users.",
      });
    });
};

// Find all Mentors with Pagination
export const findAllMentors = (req, res) => {
  // 1. Get page and size from query parameters
  const { page, size } = req.query;

  // 2. Calculate limit and offset using the helper
  const { limit, offset, pageNum } = getPagination(page, size);

  // 3. Find and count all Users matching criteria with limit and offset
  User.findAndCountAll({
    where: {
      role: "mentor", // Filter by role (mentor)
    },
    attributes: { exclude: ["password"] }, // Exclude sensitive data
    limit: limit, // Apply limit for pagination
    offset: offset, // Apply offset for pagination
    order: [["name", "ASC"]], // Optional: Add ordering (e.g., by name)
  })
    .then((data) => {
      // 4. Structure the response using the helper
      const response = getPagingData(data, pageNum, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving published Mentors.",
      });
    });
};
export const updateAvailability = async (req, res) => {
  try {
    const schedule = req.body.schedule;
    const email = req.body.email;

    if (!email) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (
      !Array.isArray(schedule) ||
      schedule.some((slot) => !slot.start || !slot.end)
    ) {
      return res.status(400).json({ message: "Invalid schedule format" });
    }

    // Option 2 (Recommended for JSON fields)
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.sessions = schedule;
    await user.save();

    res.status(200).json({ message: "Availability updated successfully!" });
  } catch (error) {
    console.error("Error updating availability:", error);
    res
      .status(500)
      .json({ message: "An error occurred updating availability." });
  }
};
export const checkAvailability = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ sessions: user.sessions });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res
      .status(500)
      .json({ message: "An error occurred fetching availability." });
  }
};
export const acceptBooking = async (req, res) => {
  try {
    const { providerEmail, slots, bookerEmail } = req.body;
    if (!providerEmail || !slots || !bookerEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newObj = {
      slots: slots,
      bookerEmail: bookerEmail,
    };
    const user = await User.findOne({ where: { email: providerEmail } });
    const isSlotAlreadyBooked = (user.sessionBooked || []).some(
      (session) =>
        JSON.stringify(session.slots) === JSON.stringify(newObj.slots)
    );
    if (!isSlotAlreadyBooked) {
      user.sessionBooked = [...(user.sessionBooked || []), newObj];
    }

    await user.save();
    res.status(200).json({ message: "Booking accepted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred accepting booking." });
    console.error("Error accepting booking:", error);
  }
};
export const getAllFeedbacks = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const feedbacks = user.feedbacks || []; // Use empty array if feedbacks is null
    res.status(200).json({ feedbacks }); // Send feedbacks as response
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "An error occurred fetching feedbacks." });
  }
};
export const putFeedback = async (req, res) => {
  try {
    const schedule = req.body.feedback;
    const email = req.body.email;

    if (!email) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Option 2 (Recommended for JSON fields)
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.feedbacks = user.feedbacks || []; // Initialize feedbacks if null
    user.feedbacks.push(schedule); // Add new feedback to the array
    await user.save();

    res.status(200).json({ message: "Availability updated successfully!" });
  } catch (error) {
    console.error("Error updating availability:", error);
    res
      .status(500)
      .json({ message: "An error occurred updating availability." });
  }
};
