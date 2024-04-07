import { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Chatbot from "../components/Chatbot";

function Home() {
  return (
    <>
      <div className="login">
        <span>Click here to login</span>
        <Link to="/login"><button>Login</button></Link>
      </div>
      <Chatbot />
    </>
  );
}

export default Home;
