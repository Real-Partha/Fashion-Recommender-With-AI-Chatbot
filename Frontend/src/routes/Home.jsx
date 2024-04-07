import { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Chatbot from "../components/Chatbot";
import Auth from "../components/Auth";

function Home() {
  return (
    <>
      <Auth />
      <Chatbot />
    </>
  );
}

export default Home;
