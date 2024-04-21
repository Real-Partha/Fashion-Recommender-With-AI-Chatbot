import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Product.css";

const ProductRating = ({ rating, setRating }) => {

  const handleStarClick = (index) => {
    // Set the rating to the index of the clicked star + 1
    setRating(index + 1);
  };

  return (
    <div className="product-rating">
      Rating:
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={`star ${index < rating ? "filled" : ""}`}
          onClick={() => handleStarClick(index)}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
};

const handleStarClick = () => {
  alert("Product added to cart!");
  navigator.clipboard.writeText("Product added to cart!");
};

const handlebuyClick = () => {
  alert("Product bought successfully!");
};

const Product = () => {
  const [productData, setProductData] = useState({});
  const [rating, setRating] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M"); // State to track the selected size
  const params = useParams();
  const productid = parseInt(params.productid);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        console.log("Type of productid:", typeof productid);
        const response = await fetch(`http://127.0.0.1:8000/product/${productid}/`);

        const data = await response.json();
        setTimeout(() => {
          setProductData(data);
        }, 200);
        console.log(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, []);

  // Function to handle size selection
  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  return (
    <div className="product-container">
      <img src={productData.imglink} alt="" className="product-img" />
      <div className="product-details-scrollable">
        <div className="product-details">
          <div className="product-name responsive-text">{productData.name}</div>
          <div className="product-pid">{productData.pid}</div>
          <div className="product-ofprice">
            Original Price: ${productData.ofprice}
          </div>
          <div className="product-discount">{productData.discount}% Off</div>
          <div className="product-price">${productData.price}</div>

          <div className="product-size">
            <span className="size">Sizes: </span>
            <div className="selectSize">
              {["XS", "S", "M", "L", "XL", "2XL", "3XL"].map((size, index) => (
                <div
                  key={index}
                  className={`eachSize ${
                    selectedSize === size ? "activeSize" : ""
                  }`}
                  onClick={() => handleSizeSelection(size)}
                >
                  <span>{size}</span>
                </div>
              ))}
            </div>
          </div>

          <ProductRating rating={rating} setRating={setRating} />

          <div className="product-buttons">
            <button className="add-to-cart-btn" onClick={handleStarClick}>
              Add to Cart
            </button>
            <button className="buy-now-btn" onClick={handlebuyClick}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
