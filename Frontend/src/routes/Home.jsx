import { useState } from "react";
import "./Home.css";
import Chatbot from "../components/Chatbot";
import Auth from "../components/Auth";

function Home() {
  const [chatbotVisible, setChatbotVisible] = useState(false);

  const toggleChatbot = () => {
    setChatbotVisible((prevVisible) => !prevVisible);
  };

  return (
    <>
      <Auth />
      <div className="chat-button-container">
        <button className="chat-button" onClick={toggleChatbot}>
          {chatbotVisible ? "Close Chat" : "Open Chat"}
        </button>
      </div>
      {chatbotVisible && <Chatbot />}
    </>
  );
}
export default Home;
