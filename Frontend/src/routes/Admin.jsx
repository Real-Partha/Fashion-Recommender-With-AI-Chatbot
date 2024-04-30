import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Admin.css";
import AddProduct from "../components/AddProduct";
import ShowAdminProducts from "../components/ShowAdminProducts";

const Admin = () => {
  const [showAddProductForm, setShowForm] = useState(false);
  const [showAdminProducts, setShowAdminProducts] = useState(false);
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
    setShowForm(!showAddProductForm);
    setShowAdminProducts(false);
  };

  const handleAdminProductsClick = () => {
    setShowAdminProducts(!showAdminProducts);
    setShowForm(false);
  };

  return (
    <div>
      <Navbar />
      <div className="admin-body-container">
        <div className="admin-body-container-menu">
          <button
            className="add-product-button"
            onClick={handleAddProductClick}
          >
            Add Product
          </button>
          <button
            className="show-admin-product-button"
            onClick={handleAdminProductsClick}
          >
            Show Products
          </button>
        </div>
        {showAddProductForm && (
          <div className={showAddProductForm ? "slide-down" : "slide-up"}>
            {<AddProduct />}
          </div>
        )}
        {showAdminProducts && (
          <div className={showAdminProducts ? "slide-down" : "slide-up"}>
            {<ShowAdminProducts />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
