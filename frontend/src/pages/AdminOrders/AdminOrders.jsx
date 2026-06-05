import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/orders"
      );

      setOrders(data);
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
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          orderStatus: status,
        }
      );

      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

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

            <h3>{order.orderId}</h3>

            <p>
              Customer :
              {" "}
              {order.customerName}
            </p>

            <p>
              Phone :
              {" "}
              {order.phone}
            </p>

            <p>
              Amount :
              ₹{order.totalAmount}
            </p>

            <p>
              Status :
              {" "}
              <strong>
                {order.orderStatus}
              </strong>
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