import React from "react";
import { json, useParams,useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const OrderSummary = () => {
  const params = useParams();
  const orderId = params.orderid;
  const [orderData, setOrderData] = useState({});
  const [orderFound, setOrderFound] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Order Summary | Pearl Fashion";
    if (localStorage.getItem("token") === null) {
      alert("Please login to view this page");
    } else {
      if (localStorage.getItem("tokentype") === "user") {
        (async () => {
          const orderresponse = await fetch(
            `http://127.0.0.1:8000/orders/${orderId}/`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const orderdata = await orderresponse.json();
          if (orderresponse.ok) {
            setOrderData(orderdata);
            setOrderFound(true);
          } else {
            setError(orderdata.detail);
          }
        })();
      } else {
        alert("Please use the admin panel for viewing order details")
        navigate("/admin")
      }
    }
  }, [orderId]);

  return (
    <div>
      {error && <div>{error}</div>}
      {!error && orderFound && (
        <div key={orderData.orderid} className="pending-product-card">
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
      )}
    </div>
  );
};

export default OrderSummary;
