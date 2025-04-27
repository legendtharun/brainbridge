import React, { useState, useEffect } from "react";
// import "./ChatConversations.css"; // Optional: Import a CSS file for styling

const ChatConversations = ({ receivedMessages, sentMessages, userEmail }) => {
  const [conversations, setConversations] = useState({});
  const [selectedPartner, setSelectedPartner] = useState(null);

  // Group messages into conversations based on partner's email.
  useEffect(() => {
    const conv = {};

    // Process received messages (user is the provider, partner is the booker)
    if (receivedMessages && receivedMessages.length > 0) {
      receivedMessages.forEach((msg) => {
        const partnerEmail = msg.bookerEmail;
        if (partnerEmail) {
          if (!conv[partnerEmail]) conv[partnerEmail] = [];
          conv[partnerEmail].push({ ...msg, direction: "received" });
        }
      });
    }

    // Process sent messages (user is the booker, partner is the provider)
    if (sentMessages && sentMessages.length > 0) {
      sentMessages.forEach((msg) => {
        const partnerEmail = msg.providerEmail;
        if (partnerEmail) {
          if (!conv[partnerEmail]) conv[partnerEmail] = [];
          conv[partnerEmail].push({ ...msg, direction: "sent" });
        }
      });
    }

    // Sort the messages for each conversation by createdAt in ascending order
    Object.keys(conv).forEach((partner) => {
      conv[partner].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    });

    setConversations(conv);
  }, [receivedMessages, sentMessages, userEmail]);

  const conversationKeys = Object.keys(conversations);

  const handlePartnerSelect = (partner) => {
    setSelectedPartner(partner);
  };

  return (
    <div className="chat-app">
      {/* Sidebar for selecting a conversation */}
      <aside className="sidebar">
        <h3>Conversations</h3>
        <ul>
          {conversationKeys.length > 0 ? (
            conversationKeys.map((partner) => (
              <li
                key={partner}
                onClick={() => handlePartnerSelect(partner)}
                className={partner === selectedPartner ? "active" : ""}
              >
                {partner}
              </li>
            ))
          ) : (
            <li>No conversations available</li>
          )}
        </ul>
      </aside>

      {/* Chat window for the selected conversation */}
      <div className="chat-window">
        {selectedPartner ? (
          <>
            <h3>Conversation with {selectedPartner}</h3>
            <div className="messages">
              {conversations[selectedPartner].map((msg) => (
                <div key={msg.id} className={`message ${msg.direction}`}>
                  <span className="timestamp">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                  <p className="text">{msg.message}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>Please select a conversation from the sidebar.</p>
        )}
      </div>
    </div>
  );
};

export default ChatConversations;
