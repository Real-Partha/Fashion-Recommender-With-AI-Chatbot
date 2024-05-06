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
        <div className="product-discount">{product.discount}% off</div>
        <div className="price-container">
          <div className="product-price">₹ {product.price}</div>
          <del className="original-product-price">₹ {product.ofprice}</del>
        </div>
      </div>
      <button
        className="product-buy-button"
        onClick={(e) => {
          window.open(`/product/${product.pid}`, "_blank");
        }}
      >
        Buy Now
      </button>
    </div>
  );
};

export default ProductCard;
