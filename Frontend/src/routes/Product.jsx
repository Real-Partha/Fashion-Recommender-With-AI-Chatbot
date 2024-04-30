import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Product.css";

const ProductRating = ({ rating, setRating }) => {
  const handleStarClick = (index) => {
    // Set the rating to the index of the clicked star + 1
    setRating(index + 1);
  };

  return (
    <div className="product-page-rating">
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
  const [productFound, setProductFound] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        console.log("Type of productid:", typeof productid);
        const response = await fetch(
          `http://127.0.0.1:8000/product/${productid}/`
        );

        const data = await response.json();
        if (response.ok) {
           setProductFound(true);
          setTimeout(() => {
            setProductData(data);
          }, 10);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, []);

  useEffect(() => {
    if (productData.name) {
      document.title = `${productData.name}`;
    }
  }, [productData]);

  // Function to handle size selection
  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  return (
    <div>
      {productFound && <div className="product-page-container">
        <img src={productData.imglink} alt="" className="product-page-img" />
        <div className="product-details-scrollable">
          <div className="product-page-details">
            <div className="product-page-name">{productData.name}</div>
            <div className="product-page-ofprice">${productData.ofprice}</div>
            <div className="product-page-discount">
              {productData.discount}% Off
            </div>
            <div className="product-page-price">${productData.price}</div>

            <div className="product-page-size">
              <span className="size">Sizes: </span>
              <div className="selectSize">
                {["XS", "S", "M", "L", "XL", "2XL", "3XL"].map(
                  (size, index) => (
                    <div
                      key={index}
                      className={`eachSize ${
                        selectedSize === size ? "activeSize" : ""
                      }`}
                      onClick={() => handleSizeSelection(size)}
                    >
                      <span>{size}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <ProductRating rating={rating} setRating={setRating} />

            <div className="product-page-buttons">
              <button className="add-to-cart-btn" onClick={handleStarClick}>
                Add to Cart
              </button>
              <button className="buy-now-btn" onClick={handlebuyClick}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>}
      {!productFound && <div className="product-not-found">Product not found!</div>}
    </div> 
  );
};

export default Product;
