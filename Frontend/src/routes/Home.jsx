import { useState, useEffect } from "react";
import "./Home.css";
import Chatbot from "../components/Chatbot";
import Navbar from "../components/Navbar";
import HomeProducts from "../components/HomeProducts";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/User/userSlice";

function Home() {
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [behaviorCount, setBehaviorCount] = useState(0);
  const [behavior, setBehavior] = useState("smooth");
  const [isRecommendedProduct, setIsRecommendedProduct] = useState(false);
  console.log("isRecommendedProduct: ", isRecommendedProduct)
  useEffect(() => {
    console.log("isRecommendedProduct changed to: ", isRecommendedProduct)
  }, [isRecommendedProduct])
  
  const dispatch = useDispatch();

  const toggleChatbot = () => {
    setChatbotVisible((prevVisible) => !prevVisible);
    setBehaviorCount(behaviorCount + 1); 
    if (behaviorCount > 1) {
      setBehavior("auto");
    }
  };

  useEffect(() => {
    (async () => {
      // Check if the user is already logged in
      document.title = 'Home | Pearl Fashion | Online Fashion Shopping'
      const token = localStorage.getItem("token");
      if (token !== null) {
        if (localStorage.getItem("tokentype") === "user") {
        try {
          const response = await fetch("http://127.0.0.1:8000/users/", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = await response.json();
          dispatch(setUser(data));
        } catch (error) {}
      }
      else{
        try {
          const response = await fetch("http://127.0.0.1:8000/admin/", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          // const data = await response.json();
          // dispatch(setUser(data));
          if (response.ok){
            window.location.href = "/admin";
          }
        } catch (error) {}
      }
    }
    })();
  }, []);

  return (
    <div className="home-page-root">
      <Navbar />
      <HomeProducts isRecommendedProduct={isRecommendedProduct} />
      <div
        className={`${
          !chatbotVisible
            ? "chat-button-container"
            : "chat-button-container-active"
        }`}
      >
        <div
          className={`chat-button ${chatbotVisible ? "active" : ""}`}
          onClick={toggleChatbot}
        >
          <div className="chat-button-background"></div>
          <svg
            className="chat-bubble"
            width="90"
            height="90"
            viewBox="-4 -4 100 100"
          >
            <g className="bubble">
              <path
                className="line line1"
                d="M 30.7873,85.113394 30.7873,46.556405 C 30.7873,41.101961
          36.826342,35.342 40.898074,35.342 H 59.113981 C 63.73287,35.342
          69.29995,40.103201 69.29995,46.784744"
              />
              <path
                className="line line2"
                d="M 13.461999,65.039335 H 58.028684 C
            63.483128,65.039335
            69.243089,59.000293 69.243089,54.928561 V 45.605853 C
            69.243089,40.986964 65.02087,35.419884 58.339327,35.419884"
              />
            </g>
            <circle
              className="circle-chat circle1"
              r="1.9"
              cy="50.7"
              cx="42.5"
            />
            <circle
              className="circle-chat circle2"
              cx="49.9"
              cy="50.7"
              r="1.9"
            />
            <circle
              className="circle-chat circle3"
              r="1.9"
              cy="50.7"
              cx="57.3"
            />
          </svg>
        </div>
      </div>
      {chatbotVisible && <Chatbot scroll_behavior={behavior} setIsRecommendedProduct={setIsRecommendedProduct} />}
    </div>
  );
}
export default Home;
