import React, { useState, useEffect } from "react";
import "./Signup.css"; // Import the CSS file for styling
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  //   const [email, setEmail] = useState("");
  //   const [username, setUsername] = useState("");
  //   const [password, setPassword] = useState("");
  //   const [name, setName] = useState("");
  //   const [age, setAge] = useState("");
  //   const [mobile, setMobile] = useState("");
  const [user, setUser] = useState({});
  const [created, setCreated] = useState(false); // To check if the user is created
  const [error, setError] = useState(false); // To display error message
  const [errormsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // Check if the user is already logged in{
      const token = localStorage.getItem("usertoken");
      if (token !== null) {
        const response = await fetch("http://127.0.0.1:8000/users/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
          },
        });
        if (response.ok) {
            navigate("/");
        }
      }
    })();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent the default form submission
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
        console.log(data)
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="signup-container">
      <h2 style={{ margin: "10px 0" }}>Sign Up</h2>
      <form onSubmit={handleSignup}>
        {error && <div className="error">{errormsg}</div>}
        <div className="signup-div">
          <div className="signup-credentials">Email:</div>
          <input
            type="email"
            value={user["email"]}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </div>
        <div className="signup-div">
          <div className="signup-credentials">Username:</div>
          <input
            type="text"
            value={user["username"]}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            required
          />
        </div>
        <div className="signup-div">
          <div className="signup-credentials">Password:</div>
          <input
            type="password"
            value={user["password"]}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />
        </div>
        <div className="signup-div">
          <div className="signup-credentials">Name:</div>
          <input
            type="text"
            value={user["name"]}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
        </div>
        <div className="signup-div">
          <div className="signup-credentials">Age:</div>
          <input
            type="number"
            value={user["age"]}
            onChange={(e) => setUser({ ...user, age: e.target.value })}
            required
          />
        </div>
        <div className="signup-div">
          <div className="signup-credentials">Mobile:</div>
          <input
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
      ></div>
    </div>
  );
};

export default SignupPage;
