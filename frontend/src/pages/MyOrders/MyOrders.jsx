import { useEffect, useState } from "react";
import axios from "axios";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        "https://artionary-backend.onrender.com/api/orders"
      );

      const sortedOrders = [...data].sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

      setOrders(sortedOrders);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (
    orderId,
    status
  ) => {
    try {
      await axios.put(
        `https://artionary-backend.onrender.com/api/orders/${orderId}/status`,
        {
          orderStatus: status,
        }
      );

      fetchOrders();
    } catch (error) {
      console.log(error);
      alert("Status Update Failed");
    }
  };

  return (
    <div className="my-orders-page">

      <div className="orders-header">
        <span>ADMIN PANEL</span>
        <h1>All Orders</h1>
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
              <strong>
                Customer:
              </strong>{" "}
              {order.customerName}
            </p>

            <p>
              <strong>
                Phone:
              </strong>{" "}
              {order.phone}
            </p>

            <p>
              <strong>
                Amount:
              </strong>{" "}
              ₹{order.totalAmount}
            </p>

            <p>
              <strong>
                Payment:
              </strong>{" "}
              {order.paymentStatus}
            </p>

            <p>
              <strong>
                Date:
              </strong>{" "}
              {new Date(
                order.createdAt
              ).toLocaleString()}
            </p>

            <div className="status-buttons">

              <button
                onClick={() =>
                  updateStatus(
                    order._id,
                    "Order Placed"
                  )
                }
              >
                Order Placed
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    order._id,
                    "In Packing"
                  )
                }
              >
                In Packing
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    order._id,
                    "Shipped"
                  )
                }
              >
                Shipped
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    order._id,
                    "Out For Delivery"
                  )
                }
              >
                Out For Delivery
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    order._id,
                    "Delivered"
                  )
                }
              >
                Delivered
              </button>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}

export default MyOrders;