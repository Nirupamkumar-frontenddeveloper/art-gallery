import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./MyOrders.css";

function MyOrders() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);

  const searchOrders = async () => {
    try {
      const { data } = await axios.get(
        `https://artionary-backend.onrender.com/api/orders-by-phone/${phone}`
      );

      setOrders(data);

      if (data.length === 0) {
        alert("No Orders Found");
      }
    } catch (error) {
      console.log(error);
      alert("No Orders Found");
    }
  };

  return (
    <div className="my-orders-page">

      <div className="orders-header">
        <span>TRACK ORDERS</span>
        <h1>My Orders</h1>
      </div>

      <div className="search-box">

        <input
          type="text"
          placeholder="Enter Phone Number"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
        />

        <button onClick={searchOrders}>
          Find Orders
        </button>

      </div>

      <div className="orders-grid">

        {orders.map((order) => (
          <div
            className="order-card"
            key={order._id}
          >

            <div className="order-top">

              <h3>
                {order.orderId}
              </h3>

              <span className="order-status">
                {order.orderStatus}
              </span>

            </div>

            <p>
              Amount : ₹{order.totalAmount}
            </p>

            <p>
              Payment : {order.paymentStatus}
            </p>

            <p>
              Date :
              {" "}
              {new Date(
                order.createdAt
              ).toLocaleDateString()}
            </p>

            <Link
              to={`/order/${order._id}`}
              className="art-btn"
            >
              View Order
            </Link>

          </div>
        ))}

      </div>

    </div>
  );
}

export default MyOrders;