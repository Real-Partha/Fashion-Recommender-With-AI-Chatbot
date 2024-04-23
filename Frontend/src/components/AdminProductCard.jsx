import React from "react";
import "./AdminProductCard.css";

const AdminProductCard = ({ product }) => {
  return (
    <div className="admin-product-card">
      <img
        className="admin-product-image"
        src={product.imglink}
        alt={product.name}
      />
      <div className="admin-product-details">
        <div className="admin-product-card-id">Product ID : {product.pid}</div>
        <div className="admin-product-name">Product Name : {product.name}</div>
        <div className="admin-price-container">
          <div className="admin-product-price">Price :₹ {product.price}</div>
          <div className="admin-product-price">
            Original Price :₹ {product.ofprice}
          </div>
          <div className="admin-product-discount">
            Discount : {product.discount}% off
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;
