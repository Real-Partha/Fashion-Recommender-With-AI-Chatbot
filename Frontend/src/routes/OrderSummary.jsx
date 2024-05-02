import React from "react";
import { json, useParams } from "react-router-dom";
import { useEffect,useState } from "react";
const OrderSummary = () => {
  const params = useParams();
  const orderId = params.orderid;
  const [orderData, setOrderData] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    (async ()=>{
      const orderresponse = await fetch(`http://127.0.0.1:8000/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const orderdata = await orderresponse.json();
      if (orderresponse.ok){
        setOrderData(orderdata);
      }
      else{
        setError(orderdata.detail);
      }
    })()
  }, [orderId])
  

  return (<div>
    {error && <div>{error}</div>}
    {!error && (
      <div>
        {JSON.stringify(orderData)}
      </div>
    )}
  </div>);
};

export default OrderSummary;
