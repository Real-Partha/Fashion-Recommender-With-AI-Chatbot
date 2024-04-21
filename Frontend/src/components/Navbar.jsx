import { useState, useEffect } from "react";
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    (async () => {
      // Check if the user is already logged in
      const token = localStorage.getItem("token");
      if (token === null) {
        setAuthenticated(false);
      } else {
        if (localStorage.getItem("tokentype") === "user") {
        const response = await fetch("http://127.0.0.1:8000/users/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setAuthenticated(true);
          setIsUser(true);
        } else if (
          data["detail"] === "Token has Expired" ||
          data["detail"] === "Not Authenticated"
        ) {
          setAuthenticated(false);
        }
      }
      else{
        const response = await fetch("http://127.0.0.1:8000/admin/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setAuthenticated(true);
          setIsAdmin(true);
        } else if (
          data["detail"] === "Token has Expired" ||
          data["detail"] === "Not Authenticated"
        ) {
          setAuthenticated(false);
        }
      }
    }
    })();
  }, []);

  const handleLogout = async () => {
    const response = await fetch("http://127.0.0.1:8000/auth/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        status: "logout",
      }),
    });
    localStorage.removeItem("token");
    localStorage.removeItem("tokentype");
    setAuthenticated(false);
    window.location.reload();
  };

  return (
    <div className="navbar-wrapper">
      <div
        className="navbar"
        style={authenticated ? { display: "none" } : { display: "flex" }}
      >
        <Link to="/signup">
          <button className="relative border hover:border-sky-600 duration-500 group cursor-pointer text-sky-50 overflow-hidden h-10 w-40 rounded-md bg-sky-800 p-1 flex justify-center items-center font-extrabold">
            <div className="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-900 delay-150 group-hover:delay-75"></div>
            <div className="absolute z-10 w-28 h-28 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-800 delay-150 group-hover:delay-100"></div>
            <div className="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-700 delay-150 group-hover:delay-150"></div>
            <div className="absolute z-10 w-20 h-20 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-600 delay-150 group-hover:delay-200"></div>
            <div className="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-500 delay-150 group-hover:delay-300"></div>
            <p className="z-10">Signup</p>
          </button>
        </Link>
        <Link to="/login">
          <button className="relative border hover:border-sky-600 duration-500 group cursor-pointer text-sky-50 overflow-hidden h-10 w-40 rounded-md bg-sky-800 p-1 flex justify-center items-center font-extrabold">
            <div className="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-900 delay-150 group-hover:delay-75"></div>
            <div className="absolute z-10 w-28 h-28 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-800 delay-150 group-hover:delay-100"></div>
            <div className="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-700 delay-150 group-hover:delay-150"></div>
            <div className="absolute z-10 w-20 h-20 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-600 delay-150 group-hover:delay-200"></div>
            <div className="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-500 delay-150 group-hover:delay-300"></div>
            <p className="z-10">Login</p>
          </button>
        </Link>
      </div>
      <div
        className="navbar"
        style={authenticated? { display: "flex" } : { display: "none" }}
      >
        <Link to="/orders">
        <button className="relative border hover:border-sky-600 duration-500 group cursor-pointer text-sky-50 overflow-hidden h-10 w-40 rounded-md bg-sky-800 p-1 flex justify-center items-center font-extrabold"
        style={isUser? {} : { display: "none" }}>
            <div className="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-900 delay-150 group-hover:delay-75"></div>
            <div className="absolute z-10 w-28 h-28 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-800 delay-150 group-hover:delay-100"></div>
            <div className="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-700 delay-150 group-hover:delay-150"></div>
            <div className="absolute z-10 w-20 h-20 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-600 delay-150 group-hover:delay-200"></div>
            <div className="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-500 delay-150 group-hover:delay-300"></div>
            <p className="z-10">My Orders</p>
          </button>
        </Link>
        <button
          className="relative border hover:border-sky-600 duration-500 group cursor-pointer text-sky-50 overflow-hidden h-10 w-40 rounded-md bg-gradient-to-r from-red-500 via-red-600 to-yellow-500 p-1 flex justify-center items-center font-extrabold"
          onClick={handleLogout}
        >
          <div className="absolute z-10 w-40 h-40 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-gradient-to-r from-red-900 via-red-800 to-yellow-900 delay-150 group-hover:delay-75"></div>
          <div className="absolute z-10 w-28 h-28 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-gradient-to-r from-red-800 via-red-700 to-yellow-800 delay-150 group-hover:delay-100"></div>
          <div className="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-gradient-to-r from-red-700 via-red-600 to-yellow-700 delay-150 group-hover:delay-150"></div>
          <div className="absolute z-10 w-20 h-20 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-gradient-to-r from-red-600 via-red-500 to-yellow-600 delay-150 group-hover:delay-200"></div>
          <div className="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-gradient-to-r from-red-500 via-red-400 to-yellow-500 delay-150 group-hover:delay-300"></div>
          <p className="z-10">Logout</p>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
