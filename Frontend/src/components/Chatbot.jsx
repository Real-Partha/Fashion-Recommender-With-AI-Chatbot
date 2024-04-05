import React, { useState, useEffect, useRef  } from "react";
import "./Chatbot.css";

const Chatbot = ({ userId }) => {
  const [chats, setChats] = useState({});
  const [message, setMessage] = useState("");
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
      setMessage("");
      const message_time = getCurrentTime();
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
      const currentDate = getCurrentDate();
      setChats((prevChats) => ({
        ...prevChats,
        [userId]: {
          ...prevChats[userId],
          [currentDate]: [
            ...(prevChats[userId]?.[currentDate] || []),
            { [message_time]: message },
            { [getCurrentTime()]: data },
          ],
        },
      }));
    } catch (error) {
      console.error(error.message);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to the last message
  };

  const renderChat = () => {
    if (!chats[userId]) return null;

    return Object.entries(chats[userId]).map(([date, messages], index) => (
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
                maxWidth: "70%", // Limit chat width to 70%
              }}
            >
              {Object.entries(msg).map(([time, content], index) => (
                <div key={index} className="msg-container">
                  {/* <span>{`${time}: ${content}`}</span> */}
                  <div className="msg">{`${content}`}</div>
                  <div className="time">{`${time}`}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="chatbot-container">
      {renderChat()}
      <div ref={messagesEndRef} />
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="submit-button" onClick={sendMessage} disabled={message.length<1}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
