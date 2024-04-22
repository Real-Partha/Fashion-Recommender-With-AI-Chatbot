import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Admin.css";
import AddProduct from "../components/AddProduct";

const Admin = () => {
  const [admin, setAdmin] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // Check if the user is already logged in{
      document.title = "Admin Panel | Pearl Fashion";
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

  const handleAddProductClick = () => {
    setShowForm(!showForm);
  };

  return (
    <div>
      <Navbar />
      <div className="admin-body-comtainer">
        <button className="add-product-button" onClick={handleAddProductClick}>
          Add Product
        </button>
        {showForm && (
          <div className={showForm ? "slide-down" : "slide-up"}>
            {<AddProduct />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
