import { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import Chatbot from "./components/Chatbot";

function App() {
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

export default App;
