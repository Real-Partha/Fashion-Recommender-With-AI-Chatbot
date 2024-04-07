import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [userId, setUserId] = useState(1234); // User ID to fetch chat data [Default: 1007
  const [chats, setChats] = useState({});
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false); // To prevent multiple requests
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch initial chat data from backend
    fetchChatData();
  }, []);

  useEffect(() => {
    scrollToBottom(); // Scroll to the bottom when chats are updated
  }, [chats]);

  const fetchChatData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/chats/${userId}/`);
      if (!response.ok) {
        throw new Error("Failed to fetch chat data");
      }
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const sendMessage = async () => {
    try {
      setProcessing(true);
      setMessage("");
      const message_time = getCurrentTime();
      const currentDate = getCurrentDate();
      setChats((prevChats) => {
        const existingChats = prevChats["exists"]
          ? { ...prevChats }
          : { exists: true };
        return {
          ...existingChats,
          [currentDate]: [
            ...(existingChats[currentDate] || []),
            { [message_time]: message },
          ],
        };
      });
      const response = await fetch(`http://127.0.0.1:8000/chats/${userId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit message");
      }
      const { data } = await response.json();
      setChats((prevChats) => {
        const existingChats = prevChats["exists"] ? { ...prevChats } : {};
        return {
          ...existingChats,
          [currentDate]: [
            ...(existingChats[currentDate] || []),
            { [getCurrentTime()]: data },
          ],
        };
      });
      setProcessing(false);
    } catch (error) {
      console.error(error.message);
      setProcessing(false);
    }
  };

  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getCurrentTime = () => {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && processing === false) {
      sendMessage(); // Call sendMessage when Enter key is pressed
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to the last message
  };

  const renderChat = () => {
    if (!chats.exists) return null;

    return Object.entries(chats).map(([date, messages], index) => {
      if (date === "exists") return null;

      return (
        <div key={index}>
          <div className="date">Date: {date}</div>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: i % 2 === 1 ? "flex-start" : "flex-end",
                margin: "5px 0",
              }}
            >
              <div
                style={{
                  backgroundColor: i % 2 === 1 ? "red" : "blue",
                  padding: "10px",
                  borderRadius: "7px",
                  maxWidth: "70%",
                }}
              >
                {Object.entries(msg).map(([time, content], index) => (
                  <div key={index} className="msg-container">
                    <div className="msg">{`${content}`}</div>
                    <div className="time">{`${time}`}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    });
  };

  return (
    <div>
      <div className="userid">
        <div>User ID:</div>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID..."
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              fetchChatData(); // Call fetchChatData when Enter key is pressed
            }
          }}
        />
        <button
          className="userid-submit-button"
          onClick={fetchChatData}
        >
          Send
        </button>
      </div>
      <div className="chatbot-container">
        {renderChat()}
        <div ref={messagesEndRef} />
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your message..."
          />
          <button
            className="submit-button"
            onClick={sendMessage}
            disabled={message.length < 1 || processing}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
