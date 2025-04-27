import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import db from "./models/index.js";
import UserRoutes from "./Routes/User.routes.js";
import MessageRoutes from "./Routes/Message.routes.js";
import SessionsRoutes from "./Routes/Sessions.routes.js";
import verifyToken from "./utils/verifyToken.js";
import { Server } from "socket.io";
import http from "http";
const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Simple route

app.get("/protected-route", verifyToken, (req, res) => {
  res.send(req.user);
});

// Routes
UserRoutes(app);
MessageRoutes(app);
SessionsRoutes(app);
// Sync database
db.sequelize.sync().then(() => {
  console.log("Synced db.");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
