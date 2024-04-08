import React, { useState, useEffect } from "react";
import "./Login.css"; // Import the CSS file for styling

const LoginPage = () => {
  const [credentials, setCredentials] = useState("");
  const [password, setPassword] = useState("");
  const [emailok, setEmailok] = useState(true);
  const [passwordok, setPasswordok] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [redirectTimer, setRedirectTimer] = useState(5);

  useEffect(() => {
    if (success) {
      const timer = setInterval(() => {
        setRedirectTimer((prevTimer) => prevTimer - 1);
      }, 1000);
  
      return () => clearInterval(timer);;
    }
  }, [success]);

  useEffect(() => {
    (async () => {
      // Check if the user is already logged in{
      const token = localStorage.getItem("usertoken");
      if (token !== null) {
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
          setSuccessMessage("You are already logged in");
          setSuccess(true);
          setTimeout(() => {
            window.location.href = "/";
          }, 5000);
        } else {
          localStorage.removeItem("usertoken");
        }
      }
    })();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form
    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credentials: credentials,
          password: password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setPasswordok(true);
        setEmailok(true);
        setPassword("");
        setCredentials("");
        setSuccessMessage("You have successfully logged in");
        localStorage.setItem("usertoken", data["token"]); // Store token in local storage
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/"; // Replace "/homepage" with the actual URL of your homepage
        }, 5000);
      } else {
        if (data.detail === "Incorrect Password") {
          setPasswordok(false);
          setEmailok(true);
          setError(data.detail);
        } else {
          setEmailok(false);
          setPasswordok(true);
          setError(data.detail);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <div className="credentials">Username or Email</div>
            <input
              disabled={success}
              className="login-input"
              type="text"
              id="username"
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              required
            />
            <div
              className="error"
              style={emailok ? { display: "none" } : { display: "block" }}
            >
              {error}
            </div>
          </div>
          <div className="form-group">
            <div className="credentials">Password</div>
            <input
              disabled={success}
              className="login-input"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div
            className="error"
            style={passwordok ? { display: "none" } : { display: "block" }}
          >
            {error}
          </div>
          <button type="submit" className="login-button" disabled={success}>
            Login
          </button>
        </form>
      </div>
      <div
        className="success"
        style={success ? { display: "block" } : { display: "none" }}
      >
        <h2>Success</h2>
        <p>{successMessage}</p>
      </div>
      <div className="redirect-timer" style={success ? { display: "block" } : { display: "none" }}>
        Redirecting in {redirectTimer} seconds...
      </div>
    </>
  );
};

export default LoginPage;