import React from "react";
import "./PendingProductCard.css";
import { useState, useEffect } from "react";

const PendingProductCard = ({ order }) => {
  const [orderStatus, setOrderStatus] = useState(order.status);

  const handleApproveOrder = async () => {
    let formdata = new FormData();
    formdata.append("orderid", order.orderid);
    const response = await fetch(
      "http://127.0.0.1:8000/orders/admin/approve/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formdata,
      }
    );
    if (response.ok) {
      setOrderStatus("Approved");
    }
  };

  return (
    <div className="pending-product-card" >
      <div style={orderStatus==='placed'?{display:"block"}:{display:"none"}}>
        <h2>Order ID: {order.orderid}</h2>
        <p>Recipient Name: {order.recipientName}</p>
        <p>Address: {order.address}</p>
        <p>State: {order.state}</p>
        <p>Pincode: {order.pincode}</p>
        <p>Residence Type: {order.residenceType}</p>
        <p>Mobile: {order.mobile}</p>
        <p>Payment Type: {order.paymentType}</p>
        <p>Product Name: {order.product.name}</p>
        <p>Product Price: {order.product.price}</p>
        <p>Total: {order.total}</p>
        <p>User ID: {order.userid}</p>
        <p>Status: {orderStatus}</p>
        <p>Date: {order.date}</p>
        <p>Time: {order.time}</p>
        <button
          className="pending-product-card-approve"
          onClick={handleApproveOrder}
        >
          Approve Order
        </button>
      </div>
      <div style={orderStatus==='Approved'?{display:"block",color:"#009688"}:{display:"none"}}>
        Order Approved Successfully!!
      </div>
    </div>
  );
};

export default PendingProductCard;
