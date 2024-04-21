import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import ProductCard from "./ProductCard";
import { useSelector, useDispatch } from "react-redux";
import { setProductList } from "../redux/ProductList/productList";

const Chatbot = () => {
  const [user, setUser] = useState("");
  const [chats, setChats] = useState({});
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false); // To prevent multiple requests
  const [authenticated, setAuthenticated] = useState(false); // To check if the user is authenticated
  const [details, setDetails] = useState("");
  const [image, setImage] = useState(null);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      // Check if the user is already logged in
      const token = localStorage.getItem("token");
      if (token === null) {
        setAuthenticated(false);
        setDetails("You are not logged in...Please login to continue...");
      } else {
        if (localStorage.getItem("tokentype") === "admin") {
          const response = await fetch("http://127.0.0.1:8000/admin/", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (response.ok) {
            setSuccessMessage("You are already logged in as Admin...");
            setSuccess(true);
            window.location.href = "/admin";
          }
        }
        setProcessing(true);
        fetchChatData();
        setProcessing(false);
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setAuthenticated(true);
        setUser(data["user"]);
        setChats(data["data"]);
        console.log(chats);
      } else if (
        data["detail"] === "Token has Expired" ||
        data["detail"] === "Not Authenticated"
      ) {
        setAuthenticated(false);
        setDetails(
          "Your Session has expired...Please login again to continue..."
        );
      }

      // console.log(chatHistory.payload)
      // setChats(chatHistory.payload.data)
      // setUser(chatHistory.payload.user)
      // console.log(chats)
      // console.log(user)
      // setAuthenticated(true)
      // console.log(chatHistory)
    } catch (error) {
      console.error(error.message);
    }
  };

  const sendMessage = async () => {
    try {
      setMessage("");

      const message_time = getCurrentTime();
      const currentDate = getCurrentDate();
      let formData = new FormData();

      // Prepare the message object
      if (message.length > 1) {
        const newTextMessage = {
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
            [currentDate]: [
              ...(existingChats[currentDate] || []),
              newTextMessage,
            ],
          };
        });

        formData.append("message", message);
      }
      if (image !== null) {
        formData.append("image", image); // Append image to FormData

        // Prepare the message object for image
        const newImageMessage = {
          time: message_time,
          type: "image",
          image: URL.createObjectURL(image), // Convert the image to a URL
          role: "user",
        };

        // console.log(newImageMessage)

        // Update the chats state with image message
        setChats((prevChats) => {
          const existingChats = prevChats.exists
            ? { ...prevChats }
            : { exists: true };
          return {
            ...existingChats,
            [currentDate]: [
              ...(existingChats[currentDate] || []),
              newImageMessage,
            ],
          };
        });

        // Clear the image state
        setImage(null);
      }
      setProcessing(true);
      // Send the message to the backend
      const response = await fetch("http://127.0.0.1:8000/chats/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // body: JSON.stringify({ message }),
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit message");
      }

      // Receive the response from the backend
      const { type, msg, prod } = await response.json();
      if (type === "product") {
        dispatch(setProductList(prod));
      }
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
              type: type,
              message: msg,
              products: prod,
              role: "chatbot",
            },
          ],
        };
      });
      // dispatch(setChatHistory({data:chats,user:user}))
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

  const handleImageUpload = (event) => {
    const uploadedImage = event.target.files[0];
    setImage(uploadedImage);
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
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start", // Adjust based on the role
                margin: "5px 0",
              }}
            >
              <div
                style={{
                  margin: "10px",
                  backgroundColor:
                    msg.role === "user"
                      ? "rgb(26, 81, 101)"
                      : msg.type === "product"
                      ? "transparent"
                      : "rgb(255, 31, 68)", // Adjust based on the role
                  padding: "10px",
                  borderRadius: "7px",
                  maxWidth: "70%",
                  boxShadow:
                    msg.role === "user"
                      ? "0 0 10px rgba(69, 197, 243, 0.538)"
                      : "0 0 10px rgb(255, 31, 68)",
                }}
              >
                {msg.type === "text" && (
                  <div className="msg-container">
                    {msg.role === "user" && (
                      <div className="msg-name">{user.name.split(" ")[0]}</div>
                    )}
                    {msg.role === "chatbot" && (
                      <div className="msg-chatname">{"Chatbot"}</div>
                    )}
                    <div className="msg">{msg.message}</div>
                    <div className="time">{msg.time}</div>
                  </div>
                )}
                {msg.type === "product" && (
                  <div
                    className="product-container"
                    style={{
                      display: "flex",
                      overflow: "auto",
                      borderRadius: "5",
                    }}
                  >
                    {msg.products.slice(0, 5).map((product, index) => (
                      <ProductCard key={index} product={product} />
                    ))}
                  </div>
                )}
                {msg.type === "image" && (
                  <div
                    className="msg-container"
                    style={{
                      display: "flex",
                      overflow: "auto",
                      borderRadius: "5",
                    }}
                  >
                    <img
                      style={{ maxHeight: "200px", maxWidth: "200px" }}
                      src={msg.image}
                      alt=""
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    });
  };

  return (
    <div>
      {/* <div
        className="user"
        style={authenticated ? { display: "block" } : { display: "none" }}
      >
        <div>{"Welcome, " + user["name"]}</div>
      </div> */}
      <div className="chatbot-container">
        {renderChat()}

        {processing && (
          <div
            className="msg-container"
            style={{
              maxWidth: "35%",
              borderRadius: "10px",
              margin: "10px",
              backgroundColor: "rgb(255, 31, 68)",
              boxShadow: "0 0 10px rgb(255, 31, 68)",
            }}
          >
            <div
              className="msg-chatname"
              style={{ paddingLeft: "10px", paddingTop: "10px" }}
            >
              {"Chatbot"}
            </div>
            <div className="wrapper" style={{ marginTop: "10px" }}>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="shadow"></div>
              <div className="shadow"></div>
              <div className="shadow"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
        <div
          className="chatbot-error"
          style={authenticated ? { display: "none" } : { display: "block" }}
        >
          {details}
        </div>
        <div className="input-container">
          <input
            type="file"
            id="upload"
            name="upload"
            style={{ display: "none" }}
            accept="image/*"
            disabled={!authenticated}
            onChange={handleImageUpload}
          />
          <label
            for="upload"
            className="upload-button"
            disabled={!authenticated}
          >
            <lord-icon
              src="https://cdn.lordicon.com/bzqvamqv.json"
              trigger="hover"
              style={
                image !== null ? { display: "none" } : { display: "block" }
              }
            ></lord-icon>
            <lord-icon
              src="https://cdn.lordicon.com/dangivhk.json"
              trigger="loop"
              delay="1000"
              style={
                image !== null ? { display: "block" } : { display: "none" }
              }
            ></lord-icon>
          </label>

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
            disabled={!(message.length > 1 || image !== null) || processing}
          >
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path
                    fill="currentColor"
                    d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                  ></path>
                </svg>
              </div>
            </div>
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
