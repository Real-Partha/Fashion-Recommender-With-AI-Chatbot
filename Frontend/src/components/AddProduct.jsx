import React, { useState } from "react";
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

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setProductData({ ...productData, image: e.target.files[0] });
    } else {
      const { name, value } = e.target;
      setProductData({ ...productData, [name]: value });
    }
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
  };

  return (
    <div id="add-product-form" className="add-product-container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
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
          <label>Price:</label>
          <input
            type="text"
            name="price"
            value={productData.price}
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
          <label>Discount:</label>
          <input
            type="text"
            name="discount"
            value={productData.discount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
      {productCreated && <h2>Product Created Successfully with Product ID : {CreatedProduct.pid}</h2>}
    </div>
  );
};

export default AddProduct;
