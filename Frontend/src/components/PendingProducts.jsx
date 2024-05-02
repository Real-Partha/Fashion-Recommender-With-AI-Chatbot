import React from "react";
import "./PendingProducts.css";
import { useState, useEffect } from "react";
import PendingProductCard from "./PendingProductCard";


const PendingProducts = () => {
  const [pendingOrders, setPendingOrders] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/orders/admin/pending/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPendingOrders(data);
      } else {
        console.log("Error Fetching Products");
      }
    })();
  }, []);

  return (
    <div>
      {pendingOrders &&
        pendingOrders.map((order) => {
          return <PendingProductCard key={order.orderid} order={order} />;
        })}
      {pendingOrders && pendingOrders.length === 0 && (
        <h2>No Pending Orders</h2>
      )}
    </div>
  );
};

export default PendingProducts;
