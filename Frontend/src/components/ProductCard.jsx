// ProductCard.js
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img className="product-image" src={product.imglink} alt={product.name} />
      <div className="product-details">
        <div className="product-name" title={product.name}>
          {product.name}
        </div>
        <div className="price-container">
          <div className="product-price">₹ {product.price}</div>
          <div className="product-discount">{product.discount}% off</div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
