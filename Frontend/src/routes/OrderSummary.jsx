import React from "react";
import { json, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./OrderSummary.css";

const OrderSummary = () => {
  const params = useParams();
  const orderId = params.orderid;
  const [orderData, setOrderData] = useState({});
  const [orderFound, setOrderFound] = useState(false);
  const [error, setError] = useState(null);
  const [productData, setProductData] = useState({});

  useEffect(() => {
    document.title = "Order Summary | Pearl Fashion";
    (async () => {
      const orderresponse = await fetch(`http://127.0.0.1:8000/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const orderdata = await orderresponse.json();
      if (orderresponse.ok) {
        setOrderData(orderdata);
        setOrderFound(true);
      }
      else {
        setError(orderdata.detail);
      }
    })()
  }, [orderId])


  // ----------------------------------------------fetching product data for image
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/product/${productid}/`
        );

        const data = await response.json();
        if (response.ok) {
          setProductFound(true);
          setTimeout(() => {
            setProductData(data);
          }, 10);
        } else {
          navigate("/404");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, []);
  //------------------------------------------------


  return (<div>
    {error && <div>{error}</div>}
    {!error && orderFound && (
      <div key={orderData.orderid} className="pending-product-card">
        <div className="order-details-container">
          <h2>Order ID: {orderData.orderid}</h2>
          <p>Recipient Name: {orderData.recipientName}</p>
          <p>Address: {orderData.address}</p>
          <p>State: {orderData.state}</p>
          <p>Pincode: {orderData.pincode}</p>
          <p>Residence Type: {orderData.residenceType}</p>
          <p>Mobile: {orderData.mobile}</p>
          <p>Payment Type: {orderData.paymentType}</p>
          <p>Product Name: {orderData.product.name}</p>
          <p>Product Price: {orderData.product.price}</p>
          <p>Total: {orderData.total}</p>
          <p>User ID: {orderData.userid}</p>
          <p>Status: {orderData.status}</p>
          <p>Date: {orderData.date}</p>
          <p>Time: {orderData.time}</p>
        </div>
        <div className="order-img-container">
          <img src={orderData.product.imglink} alt="prodImg" />
        </div>  
      </div>
    )}
  </div>);
};

export default OrderSummary;
