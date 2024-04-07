import { useState,useEffect } from "react";
import React from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

const auth = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      // Check if the user is already logged in
      const token = localStorage.getItem("usertoken");
      if (token === null) {
        setAuthenticated(false);
      } else {
        const response = await fetch("http://127.0.0.1:8000/login/verify/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setAuthenticated(true);
        } else {
          localStorage.removeItem("usertoken");
          setAuthenticated(false);
        }
      }
    })();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usertoken");
    setAuthenticated(false);
    window.location.reload();
  };

  return (
    <div>
      <div
        className="login-logout"
        style={authenticated ? { display: "none" } : { display: "flex" }}
      >
        <span>Click here to login</span>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
      <div
        className="login-logout"
        style={authenticated ? { display: "flex" } : { display: "none" }}
      >
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default auth;
