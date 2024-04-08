import React, { useState,useEffect } from "react";
import "./Signup.css"; // Import the CSS file for styling
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [authed, setAuthed] = useState(false);
  const navigate = useNavigate();

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
            navigate("/");
        } else {
          localStorage.removeItem("usertoken");
        }
      }
    })();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
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
        setError("");

        navigate("/login"); // Redirect to login page upon successful signup
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="signup-container">
      <h2 style={{ margin: "10px 0" }}>Sign Up</h2>
      <form onSubmit={handleSignup}>
        {error && <div className="error">{error}</div>}
        <div className="signup-div">
          <div className="signup-credentials">Email:</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="signup-div">
          <div className="signup-credentials">Username:</div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="signup-div">
          <div className="signup-credentials">Password:</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="signup-div">
          <div className="signup-credentials">Name:</div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="signup-div">
          <div className="signup-credentials">Age:</div>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div className="signup-div">
          <div className="signup-credentials">Mobile:</div>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
