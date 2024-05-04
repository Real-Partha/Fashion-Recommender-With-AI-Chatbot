import React, { useState, useEffect } from "react";
import "./Signup.css"; // Import the CSS file for styling
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [user, setUser] = useState({});
  const [created, setCreated] = useState(false); // To check if the user is created
  const [error, setError] = useState(false); // To display error message
  const [errormsg, setErrorMsg] = useState("");
  const [choice, setChoice] = useState("user");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // Check if the user is already logged in{
      document.title = "SignUp | Pearl Fashion";
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
            navigate("/");
          }
        } else {
          const response = await fetch("http://127.0.0.1:8000/admin/", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (response.ok) {
            navigate("/admin");
          }
        }
      }
    })();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (choice === "user") {
      try {
        const email = user["email"];
        const username = user["username"];
        const password = user["password"];
        const name = user["name"];
        const age = user["age"];
        const mobile = user["mobile"];

        const response = await fetch("http://127.0.0.1:8000/users/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            username,
            password,
            name,
            age,
            mobile,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setError(false);
          setCreated(true);
          setTimeout(() => {
            navigate("/login");
          }, 4000); // Redirect to login page upon successful signup
        } else {
          if (data["detail"] === "Email Exists") {
            setErrorMsg("Email already exists");
          }
          if (data["detail"] === "Invalid Email") {
            setErrorMsg("Enter a valid email address");
          }
          if (data["detail"] === "Username Exists") {
            setErrorMsg("Username already exists");
          }
          if (data["detail"] === "Password Wrong") {
            setErrorMsg("Password must be at least 4 characters long");
          }
          setError(true);
          console.log(data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      try {
        const email = user["email"];
        const username = user["username"];
        const password = user["password"];
        const name = user["name"];
        const age = user["age"];
        const mobile = user["mobile"];

        const response = await fetch("http://127.0.0.1:8000/admin/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            username,
            password,
            name,
            age,
            mobile,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setError(false);
          setCreated(true);
          setTimeout(() => {
            navigate("/login");
          }, 4000); // Redirect to login page upon successful signup
        } else {
          if (data["detail"] === "Email Exists") {
            setErrorMsg("Email already exists");
          }
          if (data["detail"] === "Invalid Email") {
            setErrorMsg("Enter a valid email address");
          }
          if (data["detail"] === "Username Exists") {
            setErrorMsg("Username already exists");
          }
          if (data["detail"] === "Password Wrong") {
            setErrorMsg("Password must be at least 4 characters long");
          }
          setError(true);
          console.log(data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleRoleChoice = (role) => {
    setChoice(role);
  };

  return (
    <div className="signup-body">
      <div className="signup-background"></div>
      <div className="signup-container">
        <h2 style={{ margin: "10px 0" }}>Sign Up</h2>
        <div className="role-choice">
            <div
              className="user-login"
              style={
                choice === "user"
                  ? {

                    color: "white",
                    background: "#cd6d00",
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
                  ? {
                    color: "white",
                  }
                  : {
                    filter: "drop-shadow(0 0 0.5rem #cabdbdaa)",
                    background: "#cd6d00",
                    color: "white",
                  }
              }
              onClick={() => handleRoleChoice("admin")}
            >
              Admin
            </div>
          </div>

        <form onSubmit={handleSignup}>
          {error && <div className="error">{errormsg}</div>}
          <div className="signup-div">
            <div className="signup-credentials"></div>
            <input
              placeholder="Email Address"
              type="email"
              value={user["email"]}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </div>
          <div className="signup-div">
            <div className="signup-credentials"></div>
            <input
              placeholder="Username"
              type="text"
              value={user["username"]}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              required
            />
          </div>
          <div className="signup-div">
            <div className="signup-credentials"></div>
            <input
              placeholder="Password"
              type="password"
              value={user["password"]}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
          </div>
          <div className="signup-div">
            <div className="signup-credentials"></div>
            <input
              placeholder="Name"
              type="text"
              value={user["name"]}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              required
            />
          </div>
          <div className="signup-div">
            <div className="signup-credentials"></div>
            <input
              placeholder="Age"
              type="number"
              value={user["age"]}
              onChange={(e) => setUser({ ...user, age: e.target.value })}
              required
            />
          </div>
          <div className="signup-div">
            <div className="signup-credentials"></div>
            <input
              placeholder="Phone no."
              type="tel"
              value={user["mobile"]}
              onChange={(e) => setUser({ ...user, mobile: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>

        <div
          className="redirect-timer"
          style={created ? { display: "block" } : { display: "none" }}
        >
          {choice === "user" ? "User" : "Admin"} registered ... Redirecting in
          to login....
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
