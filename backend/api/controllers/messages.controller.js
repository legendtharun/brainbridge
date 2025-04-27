import db from "../models/index.js";
const Message = db.messages;
export const postMessage = async (req, res) => {
  const {
    providerEmail,
    bookerEmail,
    header,
    message,
    slots,
    bookerName,
    providerName,
    bookerProfile,
    status,
  } = req.body;

  try {
    let CurrMessage;
    if (header === "Booking") {
      CurrMessage = await Message.create({
        providerEmail,
        providerName,
        bookerName,
        bookerEmail,
        bookerProfile: bookerProfile ? bookerProfile : null,
        slots,
        message,
        header,
        status: status ? status : null,
      });
    } else {
      CurrMessage = await Message.create({
        providerEmail,
        bookerEmail,
        message,
        header,
        bookerName,
        providerName,
        bookerProfile: bookerProfile ? bookerProfile : null,
        status: status ? status : null,
      });
    }

    res.status(201).json(CurrMessage);
  } catch (error) {
    console.error("Error posting message:", error);
    res.status(500).json({ error: "Failed to post message" });
  }
};
export const getMessages = async (req, res) => {
  const { email } = req.params; // Get the email parameter from the request
  try {
    const messages = await Message.findAll({
      where: { providerEmail: email },
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
export const getReceivedMessages = async (req, res) => {
  const { email } = req.params; // Get the email parameter from the request
  try {
    const messages = await Message.findAll({
      where: { providerEmail: email },
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
export const getSentMessages = async (req, res) => {
  const { email } = req.params; // Get the email parameter from the request
  try {
    const messages = await Message.findAll({
      where: { bookerEmail: email },
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
export const updateMessageStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    const updateMessage = await Message.update(
      { status: status },
      { where: { id: id } }
    );
    if (updateMessage[0] === 1) {
      res.status(200).json({ message: "Status updated successfully" });
    } else {
      res.status(404).json({ message: "Message not found" });
    }
  } catch (error) {
    console.error("Error updating message status:", error);
    res.status(500).json({ error: "Failed to update message status" });
  }
};
