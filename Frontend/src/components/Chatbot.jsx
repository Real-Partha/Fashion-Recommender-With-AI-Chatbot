import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [user, setUser] = useState("");
  const [chats, setChats] = useState({});
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false); // To prevent multiple requests
  const [authenticated, setAuthenticated] = useState(false); // To check if the user is authenticated
  const [details, setDetails] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    (async () => {
      // Check if the user is already logged in
      const token = localStorage.getItem("usertoken");
      if (token === null) {
        setAuthenticated(false);
        setDetails("You are not logged in...Please login to continue...");
      } else {
        fetchChatData();
      }
    })();
  }, []);

  useEffect(() => {
    scrollToBottom(); // Scroll to the bottom when chats are updated
  }, [chats]);

  const fetchChatData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/chats/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setAuthenticated(true);
        setUser(data["user"]);
        setChats(data["data"]);
      } else if (
        data["detail"] === "Token has Expired" ||
        data["detail"] === "Not Authenticated"
      ) {
        setAuthenticated(false);
        setDetails(
          "Your Session has expired...Please login again to continue..."
        );
      } else {
        localStorage.removeItem("usertoken");
        setAuthenticated(false);
        setDetails(data["detail"]);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // const sendMessage = async () => {
  //   try {
  //     setProcessing(true);
  //     setMessage("");
  //     const message_time = getCurrentTime();
  //     const currentDate = getCurrentDate();
  //     setChats((prevChats) => {
  //       const existingChats = prevChats["exists"]
  //         ? { ...prevChats }
  //         : { exists: true };
  //       return {
  //         ...existingChats,
  //         [currentDate]: [
  //           ...(existingChats[currentDate] || []),
  //           { [message_time]: message },
  //         ],
  //       };
  //     });
  //     const response = await fetch("http://127.0.0.1:8000/chats/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
  //       },
  //       body: JSON.stringify({ message }),
  //     });
  //     if (!response.ok) {
  //       throw new Error("Failed to submit message");
  //     }
  //     const { data } = await response.json();
  //     setChats((prevChats) => {
  //       const existingChats = prevChats["exists"] ? { ...prevChats } : {};
  //       return {
  //         ...existingChats,
  //         [currentDate]: [
  //           ...(existingChats[currentDate] || []),
  //           { [getCurrentTime()]: data },
  //         ],
  //       };
  //     });
  //     setProcessing(false);
  //   } catch (error) {
  //     console.error(error.message);
  //     setProcessing(false);
  //   }
  // };

  const sendMessage = async () => {
    try {
      setProcessing(true);
      setMessage("");

      const message_time = getCurrentTime();
      const currentDate = getCurrentDate();

      // Prepare the message object
      const newMessage = {
        time: message_time,
        type: "text",
        message: message,
        role: "user",
      };

      // Update the chats state
      setChats((prevChats) => {
        const existingChats = prevChats.exists
          ? { ...prevChats }
          : { exists: true };
        return {
          ...existingChats,
          [currentDate]: [...(existingChats[currentDate] || []), newMessage],
        };
      });

      // Send the message to the backend
      const response = await fetch("http://127.0.0.1:8000/chats/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit message");
      }

      // Receive the response from the backend
      const { data } = await response.json();

      // Update the chats state with the response
      setChats((prevChats) => {
        const existingChats = prevChats.exists
          ? { ...prevChats }
          : { exists: true };
        return {
          ...existingChats,
          [currentDate]: [
            ...(existingChats[currentDate] || []),
            {
              time: getCurrentTime(),
              type: "text",
              message: data,
              role: "chatbot",
            },
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

  // const renderChat = () => {
  //   if (!chats.exists) return null;

  //   return Object.entries(chats).map(([date, messages], index) => {
  //     if (date === "exists") return null;

  //     return (
  //       <div key={index}>
  //         <div className="date">Date: {date}</div>
  //         {messages.map((msg, i) => (
  //           <div
  //             key={i}
  //             style={{
  //               display: "flex",
  //               justifyContent: i % 2 === 1 ? "flex-start" : "flex-end",
  //               margin: "5px 0",
  //             }}
  //           >
  //             <div
  //               style={{
  //                 backgroundColor: i % 2 === 1 ? "red" : "blue",
  //                 padding: "10px",
  //                 borderRadius: "7px",
  //                 maxWidth: "70%",
  //               }}
  //             >
  //               {Object.entries(msg).map(([time, content], index) => (
  //                 <div key={index} className="msg-container">
  //                   <div className="msg">{`${content}`}</div>
  //                   <div className="time">{`${time}`}</div>
  //                 </div>
  //               ))}
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     );
  //   });
  // };

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
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start", // Adjust based on the role
                margin: "5px 0",
              }}
            >
              <div
                style={{
                  backgroundColor: msg.role === "user" ? "blue" : "red", // Adjust based on the role
                  padding: "10px",
                  borderRadius: "7px",
                  maxWidth: "70%",
                }}
              >
                <div className="msg-container">
                  <div className="msg">{msg.message}</div>
                  <div className="time">{msg.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    });
  };

  return (
    <div>
      <div
        className="user"
        style={authenticated ? { display: "block" } : { display: "none" }}
      >
        <div>{"Welcome, " + user["name"]}</div>
      </div>
      <div className="chatbot-container">
        {renderChat()}
        <div ref={messagesEndRef} />
        <div
          className="chatbot-error"
          style={authenticated ? { display: "none" } : { display: "block" }}
        >
          {details}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!authenticated}
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
