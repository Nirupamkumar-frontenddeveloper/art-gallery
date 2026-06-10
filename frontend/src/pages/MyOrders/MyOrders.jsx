import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./MyOrders.css";

function MyOrders() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchOrders = async () => {
    if (!phone) {
      alert("Please enter phone number");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(
        `https://artionary-backend.onrender.com/api/orders-by-phone/${phone}`
      );

      const sortedOrders = [...data].sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

      setOrders(sortedOrders);

      if (sortedOrders.length === 0) {
        alert("No Orders Found");
      }
    } catch (error) {
      console.log(error);
      alert("No Orders Found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-orders-page">
      <div className="orders-header">
        <span>TRACK ORDERS</span>

        <h1>My Orders</h1>

        <p className="orders-subtitle">
          Track your artwork purchases and
          view live order status
        </p>
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

        <button
          onClick={searchOrders}
          className="art-btn"
          disabled={loading}
        >
          {loading
            ? "Searching..."
            : "Find Orders"}
        </button>
      </div>

      {orders.length > 0 && (
        <div className="orders-count">
          {orders.length} Order
          {orders.length > 1 ? "s" : ""} Found
        </div>
      )}

      <div className="orders-grid">
        {orders.map((order) => (
          <div
            className="order-card"
            key={order._id}
          >
            <div className="order-card-header">
              <div>
                <h3>{order.orderId}</h3>

                <p className="order-date">
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>

              <span className="status-badge">
                {order.orderStatus}
              </span>
            </div>

            <div className="order-info">
              <div className="info-item">
                <span>Amount</span>

                <h4>
                  ₹{order.totalAmount}
                </h4>
              </div>

              <div className="info-item">
                <span>Payment</span>

                <h4>
                  {order.paymentStatus}
                </h4>
              </div>
            </div>

            <Link
              to={`/order/${order._id}`}
              className="view-order-btn"
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