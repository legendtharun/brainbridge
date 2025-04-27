import * as Message from "../controllers/messages.controller.js";
import express from "express";
export default (app) => {
  let router = express.Router();
  router.post("/", Message.postMessage);
  router.get("/receivedmsgs/:email", Message.getReceivedMessages);
  router.get("/sentmsgs/:email", Message.getSentMessages);
  router.put("/:id", Message.updateMessageStatus);
  app.use("/api/messages", router);
};
