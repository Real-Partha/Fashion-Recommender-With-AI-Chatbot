import { useState, useEffect } from "react";
import "./Orders.css";
import ProductCard from "../components/ProductCard";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const orderresponse = await fetch("http://127.0.0.1:8000/orders/user/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const orderdata = await orderresponse.json();
      setOrders(orderdata);
      console.log(orderdata);
    } catch (error) {}
  };

  return (
    <div>
      {orders.length !== 0 ? (
        orders.map((order, index) => (
          <div key={index} className="Order-Card" onClick={(e)=>{window.open(`/order/${order.orderid}/`,"_blank")}} style={{cursor:"pointer"}}>
            <div>Order ID : {order.orderid}</div>
            <div>Order Status : {order.status}</div>
            <div>
              Products :
              <div>
                <ProductCard product={order.product} />
              </div>
            </div>
            <div>Total Amount : {order.total}</div>
            <div>Date of Order : {order.date}</div>
            <div>Time of Order : {order.time}</div>
          </div>
        ))
      ) : (
        <div>You currently dont have any orders</div>
      )}
    </div>
  );
};

export default Orders;
