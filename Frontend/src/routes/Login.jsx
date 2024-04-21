import React, { useState, useEffect } from "react";
import "./Login.css"; // Import the CSS file for styling

const LoginPage = () => {
  const [credentials, setCredentials] = useState("");
  const [password, setPassword] = useState("");
  const [credentialsok, setCredentialsOk] = useState(true);
  const [passwordok, setPasswordok] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [redirectTimer, setRedirectTimer] = useState(5);
  const [choice, setChoice] = useState("user");

  useEffect(() => {
    if (success) {
      const timer = setInterval(() => {
        setRedirectTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [success]);

  useEffect(() => {
    (async () => {
      // Check if the user is already logged in{
      const token = localStorage.getItem("token");
      if (token !== null) {
        if (localStorage.getItem("tokentype") === "user") {
          const response = await fetch("http://127.0.0.1:8000/users/", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (response.ok) {
            setSuccessMessage("You are already logged in...");
            setSuccess(true);
            setTimeout(() => {
              window.location.href = "/";
            }, 5000);
          }
        }
        else{
          const response = await fetch("http://127.0.0.1:8000/admin/", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (response.ok) {
            setSuccessMessage("You are already logged in as Admin...");
            setSuccess(true);
            setTimeout(() => {
              window.location.href = "/admin";
            }, 5000);
          }
        }
      }
    })();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form
    try {
      if (choice === "user") {
        const response = await fetch("http://127.0.0.1:8000/auth/login/", {
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
          setCredentialsOk(true);
          setPassword("");
          setCredentials("");
          setSuccessMessage("You have successfully logged in");
          localStorage.setItem("token", data["token"]); // Store token in local storage
          localStorage.setItem("tokentype", "user"); // Store token in local storage
          setSuccess(true);
          setTimeout(() => {
            window.location.href = "/"; // Replace "/homepage" with the actual URL of your homepage
          }, 5000);
        } else {
          if (data.detail === "Incorrect Password") {
            setPasswordok(false);
            setCredentialsOk(true);
            setError(data.detail);
          } else {
            setCredentialsOk(false);
            setPasswordok(true);
            setError(data.detail);
          }
        }
      } else {
        const response = await fetch("http://127.0.0.1:8000/auth/login/admin", {
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
          setCredentialsOk(true);
          setPassword("");
          setCredentials("");
          setSuccessMessage("You have successfully logged in as Admin");
          localStorage.setItem("token", data["token"]); // Store token in local storage
          localStorage.setItem("tokentype", "admin"); // Store token in local storage
          setSuccess(true);
          setTimeout(() => {
            window.location.href = "/admin"; // Replace "/homepage" with the actual URL of your homepage
          }, 5000);
        } else {
          if (data.detail === "Incorrect Password") {
            setPasswordok(false);
            setCredentialsOk(true);
            setError(data.detail);
          } else {
            setCredentialsOk(false);
            setPasswordok(true);
            setError(data.detail);
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRoleChoice = (role) => {
    setChoice(role);
  };

  return (
    <>
      <div className="login-container">
        <div className="role-choice">
          <div
            className="user-login"
            style={
              choice === "user"
                ? {
                    color: "green",
                    filter: "drop-shadow(0 0 0.5rem #cabdbdaa)",
                  }
                : { color: "white" }
            }
            onClick={() => handleRoleChoice("user")}
          >
            User
          </div>
          <div className="divider"></div>
          <div
            className="admin-login"
            style={
              choice === "user"
                ? { color: "white" }
                : {
                    color: "green",
                    filter: "drop-shadow(0 0 0.5rem #cabdbdaa)",
                  }
            }
            onClick={() => handleRoleChoice("admin")}
          >
            Admin
          </div>
        </div>
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
          </div>
          <div
            className="error"
            style={credentialsok ? { display: "none" } : { display: "block" }}
          >
            {error}
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
      <div
        className="redirect-timer"
        style={success ? { display: "block" } : { display: "none" }}
      >
        Redirecting in {redirectTimer} seconds...
      </div>
    </>
  );
};

export default LoginPage;
