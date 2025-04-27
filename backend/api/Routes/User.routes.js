import * as users from "../controllers/User.controller.js";
import express from "express";

export default (app) => {
  let router = express.Router();

  // Create a new Tutorial
  router.post("/", users.create);

  // Retrieve all users
  //   router.get("/", users.findAll);

  // Retrieve a single Tutorial with email
  router.post("/Login", users.findOne);

  // Update a Tutorial with email
  router.put("/:email", users.update);

  // Delete a Tutorial with email
  router.delete("/:email", users.deleteOne);

  // Delete all users
  router.delete("/", users.deleteAll);

  // Find all published users
  router.get("/findmentors", users.findAllMentors);
  router.get("/:email", users.MentorProfile);
  // router.post("/availability", users.checkAvailability);
  router.post("/updateAvailability", users.updateAvailability);
  router.get("/checkAvailability/:email", users.checkAvailability);
  router.post("/acceptBooking", users.acceptBooking);
  router.get("/getFeedback/:email", users.getAllFeedbacks);
  router.put("/feedback", users.putFeedback);

  app.use("/api/users", router);
};
