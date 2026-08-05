import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const [password, setPassword] =
    useState("");

  const [isAuthenticated, setIsAuthenticated] =
    useState(
      localStorage.getItem(
        "adminAuth"
      ) === "true"
    );

  const [adminMessage, setAdminMessage] = useState("");

  const [selectedMonth, setSelectedMonth] =
    useState("all");

  const [selectedStatus, setSelectedStatus] =
    useState("all");

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

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
  const previousOrders = orders;

  setOrders((prev) =>
    prev.map((order) =>
      order._id === orderId
        ? { ...order, orderStatus: status }
        : order
    )
  );

  try {
    await axios.put(
      `https://artionary-backend.onrender.com/api/orders/${orderId}/status`,
      {
        orderStatus: status,
      }
    );
  } catch (error) {
    console.log(error);
    setOrders(previousOrders);
    setAdminMessage("Failed to update status");
  }
};

  const exportSlip = (
    order
  ) => {
    const doc =
      new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "ARTIONARY SHIPPING SLIP",
      14,
      20
    );

    autoTable(doc, {
      startY: 35,
      body: [
        [
          "Customer",
          order.customerName,
        ],
        [
          "Phone",
          order.phone,
        ],
        [
          "Address",
          order.address,
        ],
        [
          "Pincode",
          order.pincode,
        ],
        [
          "Order ID",
          order.orderId,
        ],
        [
          "Amount",
          `₹${order.totalAmount}`,
        ],
      ],
    });

    doc.save(
      `${order.orderId}.pdf`
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="admin-login-box">
          <h1>
            Artionary Admin
          </h1>

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          <button
            onClick={() => {
              if (
                password ===
                "Sonal6341"
              ) {
                localStorage.setItem(
                  "adminAuth",
                  "true"
                );

                setIsAuthenticated(
                  true
                );
              } else {
                setAdminMessage("Wrong Password");
              }
            }}
          >
            Login
          </button>
          {adminMessage && (
            <p className="admin-message">{adminMessage}</p>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="crm-loader">
        <div className="loader-circle"></div>
        <h2>
          Loading Orders...
        </h2>
      </div>
    );
  }

  const filteredOrders = orders
    .filter((order) =>
      selectedMonth === "all"
        ? true
        : new Date(
            order.createdAt
          ).getMonth() +
            1 ===
          Number(
            selectedMonth
          )
    )
    .filter((order) =>
      selectedStatus === "all"
        ? true
        : order.orderStatus ===
          selectedStatus
    );

  const totalRevenue =
    filteredOrders.reduce(
      (sum, order) =>
        sum +
        order.totalAmount,
      0
    );

  const deliveredOrders =
    filteredOrders.filter(
      (order) =>
        order.orderStatus ===
        "Delivered"
    ).length;

  return (
    <div className="admin-orders-page">
      <div className="admin-header">

        <span>
          ADMIN PANEL
        </span>

        <h1>
          Manage Orders
        </h1>

        {adminMessage && (
          <div className="admin-message-inline">{adminMessage}</div>
        )}

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem(
              "adminAuth"
            );

            window.location.reload();
          }}
        >
          Logout
        </button>

      </div>

      <div className="crm-stats">

        <div className="stat-card">
          <h2>
            {
              filteredOrders.length
            }
          </h2>

          <span>
            Total Orders
          </span>
        </div>

        <div className="stat-card">
          <h2>
            ₹{totalRevenue}
          </h2>

          <span>
            Revenue
          </span>
        </div>

        <div className="stat-card">
          <h2>
            {
              deliveredOrders
            }
          </h2>

          <span>
            Delivered
          </span>
        </div>

        <div className="stat-card">
          <select
            value={
              selectedMonth
            }
            onChange={(e) =>
              setSelectedMonth(
                e.target.value
              )
            }
          >
            <option value="all">
              All Months
            </option>

            <option value="1">
              January
            </option>

            <option value="2">
              February
            </option>

            <option value="3">
              March
            </option>

            <option value="4">
              April
            </option>

            <option value="5">
              May
            </option>

            <option value="6">
              June
            </option>

            <option value="7">
              July
            </option>

            <option value="8">
              August
            </option>

            <option value="9">
              September
            </option>

            <option value="10">
              October
            </option>

            <option value="11">
              November
            </option>

            <option value="12">
              December
            </option>

          </select>
        </div>

        <div className="stat-card">
          <select
            value={
              selectedStatus
            }
            onChange={(e) =>
              setSelectedStatus(
                e.target.value
              )
            }
          >
            <option value="all">
              All Status
            </option>

            <option value="Order Placed">
              Order Placed
            </option>

            <option value="In Packing">
              In Packing
            </option>

            <option value="Shipped">
              Shipped
            </option>

            <option value="Out For Delivery">
              Out For Delivery
            </option>

            <option value="Delivered">
              Delivered
            </option>

          </select>
        </div>

      </div>

      <div className="admin-orders-grid">

        {filteredOrders.map(
          (order) => (
            <div
              className="admin-order-card"
              key={order._id}
            >
              <div className="admin-order-top">

                <h3>
                  {
                    order.orderId
                  }
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
                {
                  order.phone
                }
              </p>

              <p>
                <strong>
                  Address:
                </strong>{" "}
                {
                  order.address
                }
              </p>

              <p>
                <strong>
                  Pincode:
                </strong>{" "}
                {
                  order.pincode
                }
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
<select
  className="status-select"
  value={order.orderStatus}
  onChange={(e) =>
    updateStatus(order._id, e.target.value)
  }
>
  <option value="Order Placed">Order Placed</option>
  <option value="In Packing">In Packing</option>
  <option value="Shipped">Shipped</option>
  <option value="Out For Delivery">Out For Delivery</option>
  <option value="Delivered">Delivered</option>
</select>

              <button
                className="pdf-btn"
                onClick={() =>
                  exportSlip(
                    order
                  )
                }
              >
                Export PDF
              </button>

            </div>
          )
        )}

      </div>
    </div>
  );
}

export default AdminOrders;