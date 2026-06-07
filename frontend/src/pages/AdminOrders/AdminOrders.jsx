import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "https://artionary-backend.onrender.com/api/orders"
      );

      setOrders(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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

      alert(
        `Order status updated to ${status}`
      );
    } catch (error) {
      console.log(error);
      alert(
        "Failed to update status"
      );
    }
  };

  if (loading) {
    return (
      <div className="loading-orders">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <div className="admin-header">
        <span>ADMIN PANEL</span>
        <h1>Manage Orders</h1>
      </div>

      <div className="admin-orders-grid">
        {orders.map((order) => (
          <div
            className="admin-order-card"
            key={order._id}
          >
            <div className="admin-order-top">
              <h3>
                {order.orderId}
              </h3>

              <span className="status-badge">
                {
                  order.orderStatus
                }
              </span>
            </div>

            <p>
              <strong>
                Customer:
              </strong>{" "}
              {
                order.customerName
              }
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
              ₹
              {
                order.totalAmount
              }
            </p>

            <p>
              <strong>
                Payment:
              </strong>{" "}
              {
                order.paymentStatus
              }
            </p>

            <p>
              <strong>
                Products:
              </strong>{" "}
              {
                order.items
                  ?.length
              }
            </p>

            <p>
              <strong>
                Date:
              </strong>{" "}
              {order.createdAt
                ? new Date(
                    order.createdAt
                  ).toLocaleString()
                : "-"}
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

export default AdminOrders;