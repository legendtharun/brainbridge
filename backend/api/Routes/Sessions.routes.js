import * as Sessions from "../controllers/sessions.controller.js";
import express from "express";
export default (app) => {
  let router = express.Router();
  router.post("/", Sessions.postSession);
  router.get("/:email", Sessions.getSessions);
  router.put("/", Sessions.updateSession);
  router.get("/session/:sessionId", Sessions.getSessionByMeet);
  router.get("/sessionbyId/:sessionId", Sessions.getSessionById);
  app.use("/api/sessions", router);
};
