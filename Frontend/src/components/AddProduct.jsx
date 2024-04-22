import React, { useState } from 'react';

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    ogPrice: '',
    discount: '',
    image: null
  });

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setProductData({ ...productData, image: e.target.files[0] });
    } else {
      const { name, value } = e.target;
      setProductData({ ...productData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call handleCreateProduct with productData
    handleCreateProduct(productData);
  };

  const handleCreateProduct = (productData) => {
    // Define your logic for creating product here
    console.log('Product Data:', productData);
    // Reset form after submission
    setProductData({
      name: '',
      price: '',
      ogPrice: '',
      discount: '',
      image: null
    });
  };

  return (
    <div>
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
    </div>
  );
};

export default AddProduct;
