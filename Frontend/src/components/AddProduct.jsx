import React, { useState,useRef } from "react";
import "./AddProduct.css";

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    ogPrice: "",
    discount: "",
    image: null,
  });
  const [productCreated, setProductCreated] = useState(false);
  const [CreatedProduct, setCreatedProduct] = useState(null);
  const [ogpriceentered, setOgPriceEntered] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let updatedData = { ...productData };

    if (name === "image") {
      updatedData.image = files[0]; // Update image with the selected file
    } else {
      updatedData[name] = value;

      if (name === "ogPrice") {
        if (typeof value === "string" && isNaN(value)) return;
        updatedData.ogPrice = value;
        if (value !== "") setOgPriceEntered(true);
        if (Number(value) < 0) {
          updatedData.ogPrice = "0"; // Reset price if it's less than 0
        }
        if (value == "") {
          setOgPriceEntered(false);
          updatedData.price = ""; // Reset price if original price is empty
          updatedData.discount = ""; // Reset discount if original price is empty
        }
        if (
          updatedData.price !== "" &&
          Number(updatedData.price) > Number(value)
        ) {
          updatedData.price = value; // Reset price if it's greater than original price
          updatedData.discount = "0"; // Reset discount if price is greater than original price
        }
      } else if (name === "price") {
        if (typeof value === "string" && isNaN(value)) return;
        updatedData.price = value;
        if (Number(value) > Number(updatedData.ogPrice)) {
          updatedData.price = updatedData.ogPrice; // Reset price if it's greater than original price
        }
        //update discount if price is changed
        if (updatedData.ogPrice !== "" && Number(value) < Number(updatedData.ogPrice)) {
          updatedData.discount = (
            ((Number(updatedData.ogPrice) - Number(value)) /
              Number(updatedData.ogPrice)) *
            100
          ).toFixed(2);
        }
        if (updatedData.ogPrice !== "" && Number(value) > Number(updatedData.ogPrice)) {
          updatedData.discount = (
            Number(0)
          ).toFixed(2);
        }
        if (updatedData.ogPrice !== "" && value == "") {
          updatedData.discount = ""; // Reset discount if price is empty
        }

      } else if (name === "discount") {
        if (typeof value === "string" && isNaN(value)) return;
        updatedData.discount = value;
        if (Number(value) > 100) {
          updatedData.discount = "100"; // Cap discount to maximum 100%
        }
        if (Number(value) < 0) {
          updatedData.discount = "0"; // Cap discount to minimum 0%
        }
        if (updatedData.ogPrice !== "" && value <= 100 && value >= 0) {
          // Calculate price based on original price and discount
          updatedData.price = (
            Number(updatedData.ogPrice) *
            (1 - Number(value) / 100)
          ).toFixed(2);
        }
        if (updatedData.ogPrice !== "" && value > 100) {
          // Calculate price based on original price and discount
          updatedData.price = Number(0).toFixed(2);
        }
      }
    }
    setProductData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", productData.name);
    form.append("price", productData.price);
    form.append("ogPrice", productData.ogPrice);
    form.append("discount", productData.discount);
    form.append("image", productData.image);

    const response = await fetch("http://127.0.0.1:8000/product/add/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: form,
    });
    const data = await response.json();
    if (response.ok) {
      setCreatedProduct(data);
      setProductCreated(true);
    } else {
      console.log("Error Adding Product");
    }

    // Reset form after submission
    console.log("Product Data:", productData);
    setProductData({
      name: "",
      price: "",
      ogPrice: "",
      discount: "",
      image: null,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input value
    }

  };

  return (
    <div id="add-product-form" className="add-product-container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} className="add-product-form-data">
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Original Price:</label>
          <input
            type="text"
            name="ogPrice"
            value={productData.ogPrice}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="text"
            name="price"
            value={productData.price}
            onChange={handleChange}
            required
            disabled={!ogpriceentered}
            title={!ogpriceentered ? "Please enter Original Price first" : ""}
          />
        </div>
        <div>
          <label>Discount:</label>
          <input
            type="text"
            name="discount"
            value={productData.discount}
            onChange={handleChange}
            required
            disabled={!ogpriceentered}
            title={!ogpriceentered ? "Please enter Original Price first" : ""}
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            name="image"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleChange}
            ref={fileInputRef}
            required
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
      {productCreated && (
        <h2>
          Product Created Successfully with Product ID : {CreatedProduct.pid}
        </h2>
      )}
    </div>
  );
};

export default AddProduct;
