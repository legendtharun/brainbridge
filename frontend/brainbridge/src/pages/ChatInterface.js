import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
// Using Heroicons for placeholders - install @heroicons/react
import {
  UserCircleIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import DashNav from "../components/DashNav";
import axios from "axios";
import { useUser } from "../components/UserContext";
import serverConfig from "../server.config";
import ChatConversations from "../components/ChatConversations";

// Conversation Item Component
const ConversationItem = ({ conversation, isActive, onClick, Sendername }) => (
  <div
    onClick={onClick}
    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
      isActive ? "bg-violet-100" : "hover:bg-violet-100"
    }`}
  >
    {/* Avatar */}
    <div className="flex-shrink-0 mr-3">
      {conversation.avatar ? (
        <img
          className="h-10 w-10 rounded-full object-cover"
          src={conversation.avatar}
          alt={Sendername}
        />
      ) : (
        <UserCircleIcon className="h-10 w-10 text-gray-400" />
      )}
    </div>
    {/* Name and Message Preview */}
    <div className="flex-grow overflow-hidden">
      <p className="text-sm font-semibold text-gray-800 truncate">
        {Sendername}
      </p>
      <p className="text-xs text-gray-500 truncate">
        {conversation.lastMessage}
      </p>
    </div>
    {/* Action Icons (Placeholder) */}
    <div className="flex-shrink-0 ml-2">
      <EllipsisVerticalIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
    </div>
  </div>
);

// Main Chat Interface Component
const ChatInterface = () => {
  const isFirstRender = useRef(true);
  const messagesEndRef = useRef(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [groupedMessages, setGroupedMessages] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useUser();
  const location = useLocation();
  let ChatDetails = { email: "", name: "" };
  if (location.state) {
    ChatDetails.email = location.state.email;
    ChatDetails.name = location.state.name;
  }

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
    console.log("Selected conversation:", id);
  };

  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const messageData = {
      bookerEmail: user.email,
      bookerName: user.name,
      providerEmail: groupedMessages[activeConversationId].email,
      providerName: groupedMessages[activeConversationId].name,
      message: newMessage,
      header: "Message",
      status: null,
      slots: [],
    };

    axios
      .post(
        `${serverConfig.serverAddress}${serverConfig.Messages}`,
        messageData
      )
      .then((response) => {
        console.log("Message sent:", response.data);
        sentMessagesfunction();
      });

    setNewMessage("");
  };

  const receivedMessagesfunction = () => {
    axios
      .get(
        `${serverConfig.serverAddress}${serverConfig.Messages}/receivedmsgs/${user.email}`
      )
      .then((response) => {
        console.log("Fetched messages:", response.data);
        setReceivedMessages(response.data);
      });
  };

  useEffect(() => {
    receivedMessagesfunction();
  }, []);

  const sentMessagesfunction = () => {
    axios
      .get(
        `${serverConfig.serverAddress}${serverConfig.Messages}/sentmsgs/${user.email}`
      )
      .then((response) => {
        console.log("Fetched messages:", response.data);
        setSentMessages(response.data);
      });
  };

  useEffect(() => {
    sentMessagesfunction();
  }, []);

  useEffect(() => {
    const groupedMessages = [];

    // 1) seed the selected conversation:
    if (ChatDetails.email && ChatDetails.name) {
      groupedMessages.push({
        email: ChatDetails.email,
        name: ChatDetails.name,
        msg: [],
      });
    }

    // 2) helper to get-or-create group
    const getGroupByEmail = (email, name) => {
      let group = groupedMessages.find((g) => g.email === email);
      if (!group) {
        group = { email, name, msg: [] };
        groupedMessages.push(group);
      }
      return group;
    };

    // 3) push received
    receivedMessages.forEach((m) => {
      const group = getGroupByEmail(m.bookerEmail, m.bookerName);
      group.msg.push({
        id: m.id,
        createdAt: m.createdAt,
        message: m.message,
        slots: m.header === "Booking" ? m.slots : [],
        detail: "received",
        status: m.status,
        header: m.header,
      });
    });

    // 4) push sent
    sentMessages.forEach((m) => {
      const group = getGroupByEmail(m.providerEmail, m.providerName);
      group.msg.push({
        id: m.id,
        createdAt: m.createdAt,
        message: m.message,
        slots: m.header === "Booking" ? m.slots : [],
        detail: "sent",
        status: m.status,
        header: m.header,
      });
    });

    // 5) sort each group's msgs oldest→newest
    groupedMessages.forEach((g) =>
      g.msg.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    );

    // 6) sort groups by last activity, *but* keep the empty ChatDetails group at index 0
    groupedMessages.sort((a, b) => {
      const isEmptyA = a.email === ChatDetails.email && a.msg.length === 0;
      const isEmptyB = b.email === ChatDetails.email && b.msg.length === 0;

      if (isEmptyA) return -1;
      if (isEmptyB) return 1;

      const lastA = a.msg.length
        ? new Date(a.msg[a.msg.length - 1].createdAt).getTime()
        : 0;
      const lastB = b.msg.length
        ? new Date(b.msg[b.msg.length - 1].createdAt).getTime()
        : 0;

      return lastB - lastA;
    });

    setGroupedMessages(groupedMessages);
  }, [receivedMessages, sentMessages]);

  function calculateSessionTiming(session) {
    if (!session || !session.start || !session.end) {
      return NaN;
    }

    const startTime = new Date(session.start);
    const endTime = new Date(session.end);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return NaN;
    }

    const sessionTiming = endTime.getTime() - startTime.getTime();
    return sessionTiming;
  }

  // Modified handleClick to process all slots in a message
  const handleClick = async (msgind, index) => {
    const message = groupedMessages[index].msg[msgind];
    const updatePromises = [];

    // Process each slot in the message
    for (let slotindex = 0; slotindex < message.slots.length; slotindex++) {
      const slot = message.slots[slotindex];
      const duration = calculateSessionTiming(slot);
      const sessionTiming = duration / (1000 * 60); // in minutes

      const sessionPromise = axios.post(
        `${serverConfig.serverAddress}${serverConfig.Sessions}/`,
        {
          bookerEmail: groupedMessages[index].email,
          providerEmail: user.email,
          slot: slot,
          status: message.status,
          sessionTiming: `${sessionTiming} minutes`,
          sessionTitle: message.message
            ? message.message
            : "Unknown title Session - BrainBridge",
        }
      );

      updatePromises.push(sessionPromise);
    }

    try {
      // Wait for all session creations to complete
      await Promise.all(updatePromises);

      // Determine the appropriate status
      let status;
      if (new Date(message.slots[0].start) < new Date()) {
        status = "Expired";
      } else {
        status = "Accepted";
      }

      // Update the message status once for all slots
      const msgResponse = await axios.put(
        `${serverConfig.serverAddress}${serverConfig.Messages}/${message.id}`,
        {
          status: status,
        }
      );

      if (msgResponse.status === 200) {
        console.log("Message status updated successfully");
        receivedMessagesfunction(); // Refresh messages after update
      } else {
        console.error("Failed to update message status");
      }
    } catch (error) {
      console.error("Error processing slots:", error);
    }
  };

  const handleReject = async (msgind, index) => {
    const msgResponse = await axios.put(
      `${serverConfig.serverAddress}${serverConfig.Messages}/${groupedMessages[index].msg[msgind].id}`,
      {
        status: "Rejected",
      }
    );

    if (msgResponse.status === 200) {
      console.log("Message status updated successfully");
      receivedMessagesfunction();
    } else {
      console.error("Failed to update message status");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversationId]);

  return (
    <>
      <DashNav />
      <div className="flex flex-col h-screen p-4 sm:p-6">
        {/* Main Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Messages
        </h1>

        {/* Main Content Area (Two Columns on Medium+ screens) */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 overflow-hidden">
          {/* Left Column: Conversations List */}
          <div className="flex flex-col bg-violet-50 rounded-xl p-4 overflow-hidden md:h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 px-2">
              Conversations
            </h2>
            {/* Conversation List - Scrollable */}
            {currentMessages && (
              <div className="flex-grow overflow-y-auto space-y-2 pr-1">
                {groupedMessages.map((conv, index) => (
                  <ConversationItem
                    key={conv.email}
                    conversation={
                      conv.msg.length > 1 ? conv.msg[conv.msg.length - 1] : []
                    }
                    isActive={index === activeConversationId}
                    onClick={() => handleSelectConversation(index)}
                    Sendername={conv.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Chat Window */}
          <div className="flex flex-col bg-violet-50 rounded-xl p-4 overflow-y-auto md:col-span-2 md:h-full">
            {/* Chat Header */}
            <div className="flex flex-col justify-between items-center mb-4 p-2 border-violet-200">
              <h2 className="text-lg font-semibold text-gray-800">Chat</h2>
              {groupedMessages && (
                <div className="flex flex-col align-bottom justify-center h-full w-full">
                  {groupedMessages.map((conv, index) => {
                    if (index === activeConversationId) {
                      return (
                        <>
                          {conv.msg.map((currMsg, msgind) => (
                            <span
                              className={`flex flex-col
                                text-md rounded-2xl p-2 font-semibold my-3
                                ${
                                  currMsg.detail === "received"
                                    ? "bg-[#634AFF] bg-opacity-100 text-white rounded-tl-none"
                                    : "bg-[#634AFF] bg-opacity-10 text-black rounded-tr-none"
                                } flex items-center ${
                                currMsg.detail === "received"
                                  ? "mr-auto"
                                  : "ml-auto"
                              }`}
                              key={msgind}
                            >
                              {currMsg.header === "Booking" ? (
                                <span className="flex flex-col items-start justify-center min-w-[300px] h-auto max-w-full">
                                  {currMsg.slots.map((slot, slotindex) => (
                                    <span
                                      key={slotindex}
                                      className={`rounded-lg p-4 border flex flex-col items-center my-1 
                                        ${
                                          currMsg.detail === "sent"
                                            ? "border-gray-500"
                                            : "border-white"
                                        }`}
                                    >
                                      <span className="flex flex-col items-start justify-center gap-2">
                                        <span>{currMsg.message}</span>
                                        <span>
                                          Slots:
                                          {new Date(slot.start).toLocaleString(
                                            "en-IN",
                                            options
                                          )}{" "}
                                          -
                                          {new Date(slot.end).toLocaleString(
                                            "en-IN",
                                            options
                                          )}
                                          {index < currMsg.slots.length - 1
                                            ? ", "
                                            : ""}
                                        </span>
                                      </span>

                                      {currMsg.detail === "sent" ||
                                      (currMsg.detail === "received" &&
                                        currMsg.status !== "Pending") ? (
                                        <span
                                          className={`text-sm italic mt-1 flex ${
                                            currMsg.status === "Pending"
                                              ? "text-yellow-500"
                                              : currMsg.status === "Accepted"
                                              ? "text-green-400"
                                              : currMsg.status === "Rejected"
                                              ? "text-red-400"
                                              : "text-red-400"
                                          }`}
                                        >
                                          {currMsg.status}
                                        </span>
                                      ) : null}
                                    </span>
                                  ))}

                                  {/* Common Accept/Reject buttons for all slots */}
                                  {currMsg.detail === "received" &&
                                    currMsg.status === "Pending" && (
                                      <div
                                        className={`flex items-center justify-center gap-2 pt-3 w-full mt-2`}
                                      >
                                        <button
                                          className={`hover:bg-opacity-90 hover:scale-105 
                                            bg-white text-gray-500 rounded-lg px-2 py-1`}
                                          onClick={() =>
                                            handleClick(msgind, index)
                                          }
                                        >
                                          Accept All Slots
                                        </button>
                                        <button
                                          className={`hover:bg-opacity-90 hover:scale-105 
                                            bg-white text-gray-500 rounded-lg px-2 py-1 mr-auto`}
                                          onClick={() =>
                                            handleReject(msgind, index)
                                          }
                                        >
                                          Reject
                                        </button>
                                      </div>
                                    )}
                                  <br />
                                </span>
                              ) : (
                                <span className="p-2">{currMsg.message}</span>
                              )}
                              <span
                                className={`text-xs w-full text-right ${
                                  currMsg.detail === "sent"
                                    ? "text-black"
                                    : "text-white"
                                }`}
                              >
                                {new Date(currMsg.createdAt).toLocaleString(
                                  "en-IN",
                                  options
                                )}
                              </span>
                            </span>
                          ))}
                        </>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
              {/* Dummy div to scroll into view */}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Area - Scrollable */}
            <div className="flex-grow overflow-y-auto space-y-4 pr-1 mb-4">
              {currentMessages &&
                currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.sender === "me"
                          ? "bg-white shadow-sm"
                          : "bg-cyan-100"
                      }`}
                    >
                      <p
                        className={`text-sm ${
                          msg.sender === "me"
                            ? "text-gray-800"
                            : "text-cyan-900"
                        }`}
                      >
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Message Input Area */}
            <form onSubmit={handleSendMessage} className="mt-auto">
              <div className="flex items-center bg-gray-100 rounded-lg p-2 border border-gray-200">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow bg-transparent border-none focus:ring-0 text-sm placeholder-gray-500 px-2
                  focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 text-gray-500 hover:text-violet-600 p-2 rounded-full transition-colors 
                  hover:scale-105"
                  aria-label="Send message"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInterface;
