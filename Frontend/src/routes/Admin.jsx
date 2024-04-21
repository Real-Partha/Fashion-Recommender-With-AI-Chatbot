import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {

  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

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
            const data = await response.json();
            setAdmin(data);
          }
        }
      } else {
        navigate("/");
      }
    })();
  }, []);

  return <div>{admin?`You are logged in as Admin (${admin.name})`:"Not logged in"}</div>;
};

export default Admin;
