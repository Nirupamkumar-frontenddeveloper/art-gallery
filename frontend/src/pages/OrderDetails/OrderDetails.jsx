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
        `http://localhost:5000/api/orders/${id}`
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

  return (
    <div className="order-details-page">

      <div className="order-header">
        <span>ORDER DETAILS</span>

        <h1>{order.orderId}</h1>
      </div>

      <div className="order-status-card">

        <h2>Current Status</h2>

        <div className={`status-badge ${order.orderStatus}`}>
          {order.orderStatus}
        </div>

      </div>

      <div className="customer-details">

        <h2>Customer Information</h2>

        <p>
          <strong>Name:</strong>
          {" "}
          {order.customerName}
        </p>

        <p>
          <strong>Phone:</strong>
          {" "}
          {order.phone}
        </p>

        <p>
          <strong>Pincode:</strong>
          {" "}
          {order.pincode}
        </p>

        <p>
          <strong>Address:</strong>
          {" "}
          {order.address}
        </p>

      </div>

      <div className="order-products">

        <h2>Ordered Products</h2>

        {order.items?.map((item) => (
          <div
            className="order-product-card"
            key={item.productId}
          >

            <img
              src={item.image}
              alt={item.title}
            />

            <div>

              <h3>{item.title}</h3>

              <p>
                Quantity :
                {" "}
                {item.quantity}
              </p>

              <p>
                ₹{item.price}
              </p>

            </div>

          </div>
        ))}

      </div>

      <div className="payment-info">

        <h2>Payment Information</h2>

        <p>
          <strong>Payment Status:</strong>
          {" "}
          {order.paymentStatus}
        </p>

        <p>
          <strong>Total Amount:</strong>
          {" "}
          ₹{order.totalAmount}
        </p>

        <p>
          <strong>Payment ID:</strong>
          {" "}
          {order.razorpayPaymentId}
        </p>

      </div>

    </div>
  );
}

export default OrderDetails;