import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./OrderDetails.css";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(
        `https://artionary-backend.onrender.com/api/orders/${id}`
      );

      setOrder(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!order) {
    return (
      <div className="loading-order">
        Loading Order...
      </div>
    );
  }

  const statuses = [
    "Order Placed",
    "In Packing",
    "Shipped",
    "Out For Delivery",
    "Delivered",
  ];

  const currentStep = statuses.indexOf(
    order.orderStatus
  );

  return (
    <div className="order-details-page">

      <div className="order-header">
        <span>ORDER DETAILS</span>
        <h1>{order.orderId}</h1>

        <div className="order-date">
          Ordered On{" "}
          {new Date(
            order.createdAt
          ).toLocaleDateString()}
        </div>
      </div>

      <div className="order-status-card">

        <div className="status-top">
          <h2>Current Status</h2>

          <div className="status-badge">
            {order.orderStatus}
          </div>
        </div>

        <div className="tracking-line">

          {statuses.map(
            (status, index) => (
              <div
                key={status}
                className={`track-step ${
                  index <= currentStep
                    ? "active"
                    : ""
                }`}
              >
                <div className="track-dot"></div>

                <span>
                  {status}
                </span>
              </div>
            )
          )}

        </div>

      </div>

      <div className="info-grid">

        <div className="customer-details card">

          <h2>
            Customer Information
          </h2>

          <div className="info-row">
            <span>Name</span>
            <strong>
              {order.customerName}
            </strong>
          </div>

          <div className="info-row">
            <span>Phone</span>
            <strong>
              {order.phone}
            </strong>
          </div>

          <div className="info-row">
            <span>Pincode</span>
            <strong>
              {order.pincode}
            </strong>
          </div>

          <div className="info-row">
            <span>Address</span>
            <strong>
              {order.address}
            </strong>
          </div>

        </div>

        <div className="payment-info card">

          <h2>
            Payment Summary
          </h2>

          <div className="info-row">
            <span>
              Payment Status
            </span>

            <strong>
              {
                order.paymentStatus
              }
            </strong>
          </div>

          <div className="info-row">
            <span>
              Total Amount
            </span>

            <strong>
              ₹
              {
                order.totalAmount
              }
            </strong>
          </div>

          <div className="info-row">
            <span>
              Payment ID
            </span>

            <strong className="payment-id">
              {
                order.razorpayPaymentId
              }
            </strong>
          </div>

        </div>

      </div>

      <div className="order-products card">

        <div className="section-title">
          <h2>
            Ordered Products
          </h2>

          <span>
            {
              order.items?.length
            }{" "}
            Item(s)
          </span>
        </div>

        {order.items?.map(
          (item) => (
            <div
              className="order-product-card"
              key={
                item.productId
              }
            >

              <img
                src={
                  item.image
                }
                alt={
                  item.title
                }
              />

              <div className="product-content">

                <h3>
                  {item.title}
                </h3>

                <div className="product-meta">

                  <span>
                    Qty :
                    {" "}
                    {
                      item.quantity
                    }
                  </span>

                  <span>
                    Price :
                    ₹
                    {
                      item.price
                    }
                  </span>

                  <span>
                    Total :
                    ₹
                    {item.price *
                      item.quantity}
                  </span>

                </div>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}

export default OrderDetails;