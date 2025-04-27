import db from "../models/index.js";
const Sessions = db.sessions;
export const getSessions = async (req, res) => {
  const { email } = req.params; // Get the email parameter from the request
  try {
    // Use Promise.all to fetch sessions for both provider and booker in parallel
    const [providerSessions, bookerSessions] = await Promise.all([
      Sessions.findAll({
        where: { providerEmail: email },
      }),
      Sessions.findAll({
        where: { bookerEmail: email },
      }),
    ]);

    // Concatenate the results to get all sessions for the user
    const sessions = providerSessions.concat(bookerSessions);

    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};
export const postSession = async (req, res) => {
  const { providerEmail, bookerEmail, slot, status, sessionTiming } = req.body;
  try {
    const newSession = await Sessions.create({
      providerEmail,
      bookerEmail,
      slot,
      status,
      sessionTiming,
    });
    res.status(200).json(newSession);
  } catch (error) {
    console.error("Error posting session:", error);
    res.status(500).json({ error: "Failed to post session" });
  }
};
export const updateSession = async (req, res) => {
  const { sessionId } = req.body;
  const { meetingId } = req.body;
  const { status } = req.body;
  try {
    const updatedSession = await Sessions.update(
      { meetingId, status },
      { where: { id: sessionId } }
    );
    res.status(200).json(updatedSession);
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).json({ error: "Failed to update session" });
  }
};
export const getSessionByMeet = async (req, res) => {
  const { sessionId } = req.params; // Get the sessionId parameter from the request
  try {
    const session = await Sessions.findOne({
      where: { meetingId: sessionId },
    });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.status(200).json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ error: "Failed to fetch session" });
  }
};
export const getSessionById = async (req, res) => {
  const { sessionId } = req.params; // Get the sessionId parameter from the request
  try {
    const session = await Sessions.findOne({
      where: { id: sessionId },
    });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.status(200).json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ error: "Failed to fetch session" });
  }
};
