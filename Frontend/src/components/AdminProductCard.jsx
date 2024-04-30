// import React from "react";
// import "./AdminProductCard.css";

// const AdminProductCard = ({ product }) => {
//   return (
//     <div className="admin-product-card">
//       <img
//         className="admin-product-image"
//         src={product.imglink}
//         alt={product.name}
//       />
//       <div className="admin-product-details">
//         <div className="admin-product-card-id">Product ID : {product.pid}</div>
//         <div className="admin-product-name">Product Name : {product.name}</div>
//         <div className="admin-price-container">
//           <div className="admin-product-price">Price : ₹{product.price}</div>
//           <div className="admin-product-price">
//             Original Price : ₹{product.ofprice}
//           </div>
//           <div className="admin-product-discount">
//             Discount : {product.discount}% off
//           </div>
//         </div>
//       </div>
//       <div className="admin-functions">
//         <div className="update-admin-product">
//           <lord-icon
//             src="https://cdn.lordicon.com/ylvuooxd.json"
//             trigger="hover"
//         //    style="width:250px;height:250px"
//           ></lord-icon>
//         </div>
//         <div className="delete-admin-product">
//           <lord-icon
//             src="https://cdn.lordicon.com/hjbrplwk.json"
//             trigger="hover"
//             // style="width:250px;height:250px"
//           ></lord-icon>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminProductCard;

import React, { useState } from "react";
import "./AdminProductCard.css";

const AdminProductCard = ({ product }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Send updatedProduct to backend route
    fetch("http://127.0.0.1:8000/product/admin/update/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle response from backend if needed
        console.log("Updated product:", data);
        setIsEditMode(false);
      })
      .catch((error) => {
        console.error("Error updating product:", error);
      });
  };

  const handleDelete = async () => {
    const response = await fetch(
      `http://127.0.0.1:8000/product/delete/${product.pid}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.ok) {
      
    } else {
      console.error("Error deleting product");
    }
  };

  return (
    <div className="admin-product-card">
      <img
        className="admin-product-image"
        src={updatedProduct.imglink}
        alt={updatedProduct.name}
      />
      <div className="admin-product-details">
        <div className="admin-product-card-id">
          Product ID : {updatedProduct.pid}
        </div>
        {isEditMode ? (
          <>
            <input
              type="text"
              name="name"
              value={updatedProduct.name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="price"
              value={updatedProduct.price}
              onChange={handleChange}
            />
            <input
              type="text"
              name="ofprice"
              value={updatedProduct.ofprice}
              onChange={handleChange}
            />
            <input
              type="text"
              name="discount"
              value={updatedProduct.discount}
              onChange={handleChange}
            />
          </>
        ) : (
          <>
            <div className="admin-product-name">
              Product Name : {updatedProduct.name}
            </div>
            <div className="admin-price-container">
              <div className="admin-product-price">
                Price : ₹{updatedProduct.price}
              </div>
              <div className="admin-product-price">
                Original Price : ₹{updatedProduct.ofprice}
              </div>
              <div className="admin-product-discount">
                Discount : {updatedProduct.discount}% off
              </div>
            </div>
          </>
        )}
      </div>
      <div className="admin-functions">
        {isEditMode ? (
          <div className="save-admin-product" onClick={handleSave}>
            <img
              src="save-product.gif"
              alt="Error"
              style={{ height: "30px", width: "30px" }}
            />
          </div>
        ) : (
          <div className="update-admin-product" onClick={handleEdit}>
            <lord-icon
              src="https://cdn.lordicon.com/ylvuooxd.json"
              trigger="hover"
              //    style="width:250px;height:250px"
            ></lord-icon>
          </div>
        )}
        <div className="delete-admin-product" onClick={handleDelete}>
          <lord-icon
            src="https://cdn.lordicon.com/hjbrplwk.json"
            trigger="hover"
            // style="width:250px;height:250px"
          ></lord-icon>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;
