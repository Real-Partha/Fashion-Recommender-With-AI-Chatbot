import React from "react";
import { useState, useEffect } from "react";
import "./AllAdminOrders.css";

const AllAdminOrders = () => {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await fetch("http://127.0.0.1:8000/orders/admin/all/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.log("Error Fetching Products");
      }
    })();
  }, []);

  return (
    <div className="all-admin-orders-containers">
      {orders &&
        orders.map((order) => {
          return (
            <div key={order.orderid} className="all-order-card" style={order.status === "placed"? { background: "rgb(255, 248, 206)"} : order.status === "approved"
            ? { background: "rgb(223, 255, 244)"}
            : { background: "rgb(253, 238, 236)" }}>
              <span
                className="all-orders-status"
                style={
                  order.status === "placed"
                    ? { background: "rgb(254, 220, 0)"}
                    : order.status === "approved"?{ background: "rgb(40, 228, 128)" }: {background: "rgb(251, 77, 77)"}
                }
                // {rgb(255, 244, 170)}
              >
                {order.status==='placed'?"PENDING":order.status.toUpperCase()}
              </span>
              <h2>Order ID: {order.orderid}</h2>
              <p>Recipient Name: {order.recipientName}</p>
              <p>Address: {order.address}</p>
              <p>State: {order.state}</p>
              <p>Pincode: {order.pincode}</p>
              <p>Residence Type: {order.residenceType}</p>
              <p>Mobile: {order.mobile}</p>
              <p>Payment Type: {order.paymentType}</p>
              <p>Product Name: {order.product.name}</p>
              <p>Total: {order.total}</p>
              <p>User ID: {order.userid}</p>
              {/* <p>Status: {order.status}</p> */}
              <p>Date: {order.date}</p>
              <p>Time: {order.time}</p>
            </div>
          );
        })}
      {orders && orders.length === 0 && <h2>No Orders Available</h2>}
    </div>
  );
};

export default AllAdminOrders;
