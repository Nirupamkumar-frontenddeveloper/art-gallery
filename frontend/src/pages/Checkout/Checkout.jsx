import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Checkout.css";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const checkoutData = location.state;

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    pincode: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!checkoutData) {
    return (
      <div className="checkout-empty">
        No Product Selected
      </div>
    );
  }

  const totalAmount =
    checkoutData.type === "single"
      ? checkoutData.product.price
      : checkoutData.total;

  const handlePayment = async () => {
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.address ||
      !formData.pincode
    ) {
      setStatus("Please fill all fields");
      return;
    }

    setStatus("");
    setIsProcessing(true);

    try {
      const { data } = await axios.post(
        "https://artionary-backend.onrender.com/api/create-order",
        {
          amount: totalAmount * 100,
        }
      );

      const options = {
        key:
          import.meta.env
            .VITE_RAZORPAY_KEY_ID,

        amount: data.amount,

        currency: data.currency,

        order_id: data.id,

        name: "ARTIONARY",

        description:
          "Artwork Purchase",

        prefill: {
          name:
            formData.fullName,

          contact:
            formData.phone,
        },

        theme: {
          color: "#b08d57",
        },

        handler: async (
          response
        ) => {
          try {
            const verify =
              await axios.post(
                "https://artionary-backend.onrender.com/api/verify-payment",
                {
                  ...response,

                  customerName:
                    formData.fullName,

                  phone:
                    formData.phone,

                  address:
                    formData.address,

                  pincode:
                    formData.pincode,

                  items:
                    checkoutData.type ===
                    "single"
                      ? [
                          {
                            productId:
                              checkoutData
                                .product.id,

                            title:
                              checkoutData
                                .product.title,

                            image:
                              checkoutData
                                .product.image,

                            quantity: 1,

                            price:
                              checkoutData
                                .product.price,
                          },
                        ]
                      : checkoutData.items.map(
                          (
                            item
                          ) => ({
                            productId:
                              item.id,

                            title:
                              item.title,

                            image:
                              item.image,

                            quantity:
                              item.quantity,

                            price:
                              item.price,
                          })
                        ),

                  totalAmount,
                }
              );

            if (verify.data.success) {
              setStatus("Payment Successful");
              navigate("/my-orders");
            }
          } catch (error) {
            console.log(error);
            setStatus("Payment Verification Failed");
            setIsProcessing(false);
          }
        },

        modal: {
          ondismiss: () => {
            setStatus("Payment Cancelled");
            setIsProcessing(false);
          },
        },
      };

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.on("payment.failed", () => {
        setStatus("Payment Failed");
        setIsProcessing(false);
      });

      razorpay.open();
    } catch (error) {
      console.log(error);
      setStatus("Payment Failed");
      setIsProcessing(false);
    }
  };

  return (
    <section className="checkout-page">

      <div className="checkout-container">

        <div className="checkout-left">

          <h2>
            Order Summary
          </h2>

          {checkoutData.type ===
          "single" ? (
            <div className="checkout-product">

              <img
                src={
                  checkoutData
                    .product.image
                }
                alt=""
              />

              <div>

                <h3>
                  {
                    checkoutData
                      .product.title
                  }
                </h3>

                <p>
                  {
                    checkoutData
                      .product.description
                  }
                </p>

                <h4>
                  ₹
                  {
                    checkoutData
                      .product.price
                  }
                </h4>

              </div>

            </div>
          ) : (
            checkoutData.items.map(
              (item) => (
                <div
                  className="checkout-product"
                  key={item.id}
                >

                  <img
                    src={item.image}
                    alt=""
                  />

                  <div>

                    <h3>
                      {item.title}
                    </h3>

                    <p>
                      Qty :
                      {
                        item.quantity
                      }
                    </p>

                    <h4>
                      ₹
                      {item.price *
                        item.quantity}
                    </h4>

                  </div>

                </div>
              )
            )
          )}

          <div className="checkout-total">
            Total :
            ₹{totalAmount}
          </div>

        </div>

        <div className="checkout-right">

          <h2>
            Delivery Details
          </h2>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={
              formData.fullName
            }
            onChange={
              handleChange
            }
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={
              formData.phone
            }
            onChange={
              handleChange
            }
          />

          <textarea
            name="address"
            placeholder="Address"
            value={
              formData.address
            }
            onChange={
              handleChange
            }
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={
              formData.pincode
            }
            onChange={
              handleChange
            }
          />

          {status && (
            <div className="checkout-status">
              {status}
            </div>
          )}

          <button
            className="checkout-btn"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? `Processing...` : `Pay ₹${totalAmount}`}
          </button>

        </div>

      </div>

    </section>
  );
}

export default Checkout;