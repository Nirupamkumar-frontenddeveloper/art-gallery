import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaUser,
  FaPhoneAlt,
  FaCreditCard,
  FaLock,
} from "react-icons/fa";
import "./Checkout.css";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const checkoutData = location.state;

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    address: "",
  });

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [status, setStatus] =
    useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (!checkoutData) {
    return (
      <div className="checkout-empty">
        <div>
          <h2>No Product Selected</h2>

          <button
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const totalAmount =
    checkoutData.type === "single"
      ? checkoutData.product.price
      : checkoutData.total;

  const handlePayment = async () => {
    const requiredFields = [
      "fullName",
      "phone",
      "pincode",
      "city",
      "state",
      "address",
    ];

    const isFormValid =
      requiredFields.every(
        (field) => formData[field].trim()
      );

    if (!isFormValid) {
      setStatus(
        "Please fill all required delivery details"
      );
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setStatus(
        "Please enter a valid 10 digit phone number"
      );
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      setStatus(
        "Please enter a valid 6 digit pincode"
      );
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
          name: formData.fullName,
          contact: formData.phone,
        },

        theme: {
          color: "#b08d57",
        },

        handler: async (response) => {
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

                  address: {
                    fullAddress:
                      formData.address,

                    city:
                      formData.city,

                    state:
                      formData.state,

                    pincode:
                      formData.pincode,
                  },

                  items:
                    checkoutData.type === "single"
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
                          (item) => ({
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
              setStatus(
                "Payment Successful"
              );

              navigate("/my-orders");
            } else {
              setStatus(
                "Payment Verification Failed"
              );

              setIsProcessing(false);
            }
          } catch (error) {
            console.log(error);

            setStatus(
              "Payment Verification Failed"
            );

            setIsProcessing(false);
          }
        },

        modal: {
          ondismiss: () => {
            setStatus(
              "Payment Cancelled"
            );

            setIsProcessing(false);
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        () => {
          setStatus(
            "Payment Failed"
          );

          setIsProcessing(false);
        }
      );

      razorpay.open();

    } catch (error) {
      console.log(error);

      setStatus(
        "Unable to initiate payment. Please try again."
      );

      setIsProcessing(false);
    }
  };

  return (
    <section className="checkout-page">

      <div className="checkout-wrapper">

        {/* HEADER */}

        <div className="checkout-header">

          <button
            className="checkout-back-btn"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
            Back
          </button>

          <div>
            <span>
              SECURE CHECKOUT
            </span>

            <h1>
              Complete Your Order
            </h1>
          </div>

        </div>


        {/* MAIN CHECKOUT */}

        <div className="checkout-container">


          {/* ORDER SUMMARY */}

          <div className="checkout-left">

            <div className="checkout-section-title">

              <div className="title-icon">
                <FaCreditCard />
              </div>

              <div>
                <span>
                  YOUR ORDER
                </span>

                <h2>
                  Order Summary
                </h2>
              </div>

            </div>


            <div className="checkout-products">

              {checkoutData.type ===
              "single" ? (

                <div className="checkout-product">

                  <img
                    src={
                      checkoutData
                        .product.image
                    }
                    alt={
                      checkoutData
                        .product.title
                    }
                  />

                  <div className="checkout-product-info">

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

                    <div className="product-meta">

                      <span>
                        Qty: 1
                      </span>

                      <h4>
                        ₹
                        {
                          checkoutData
                            .product.price
                        }
                      </h4>

                    </div>

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
                        alt={item.title}
                      />

                      <div className="checkout-product-info">

                        <h3>
                          {item.title}
                        </h3>

                        <div className="product-meta">

                          <span>
                            Qty: {item.quantity}
                          </span>

                          <h4>
                            ₹
                            {
                              item.price *
                              item.quantity
                            }
                          </h4>

                        </div>

                      </div>

                    </div>

                  )
                )

              )}

            </div>


            {/* PRICE SUMMARY */}

            <div className="checkout-price-summary">

              <div>
                <span>
                  Subtotal
                </span>

                <strong>
                  ₹{totalAmount}
                </strong>
              </div>

              <div>
                <span>
                  Shipping
                </span>

                <strong className="free-shipping">
                  FREE
                </strong>
              </div>

              <div className="total-row">

                <span>
                  Total Amount
                </span>

                <strong>
                  ₹{totalAmount}
                </strong>

              </div>

            </div>

          </div>


          {/* DELIVERY DETAILS */}

          <div className="checkout-right">

            <div className="checkout-section-title">

              <div className="title-icon">
                <FaMapMarkerAlt />
              </div>

              <div>
                <span>
                  DELIVERY ADDRESS
                </span>

                <h2>
                  Delivery Details
                </h2>
              </div>

            </div>


            <div className="checkout-form">


              {/* NAME + PHONE */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Full Name *
                  </label>

                  <div className="input-wrapper">

                    <FaUser />

                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                    />

                  </div>

                </div>


                <div className="form-group">

                  <label>
                    Phone Number *
                  </label>

                  <div className="input-wrapper">

                    <FaPhoneAlt />

                    <input
                      type="tel"
                      name="phone"
                      placeholder="10 digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength="10"
                    />

                  </div>

                </div>

              </div>


              {/* PINCODE + CITY */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Pincode *
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    placeholder="6 digit pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength="6"
                  />

                </div>


                <div className="form-group">

                  <label>
                    City *
                  </label>

                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* STATE */}

              <div className="form-group">

                <label>
                  State *
                </label>

                <input
                  type="text"
                  name="state"
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={handleChange}
                />

              </div>


              {/* COMPLETE ADDRESS */}

              <div className="form-group">

                <label>
                  Complete Address *
                </label>

                <textarea
                  name="address"
                  placeholder="House / Flat No., Building, Street, Area"
                  value={formData.address}
                  onChange={handleChange}
                />

              </div>


              {/* STATUS */}

              {status && (
                <div className="checkout-status">
                  {status}
                </div>
              )}


              {/* PAYMENT BUTTON */}

              <button
                className="checkout-btn"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing
                  ? "Processing Payment..."
                  : `Pay Securely ₹${totalAmount}`
                }
              </button>


              {/* SECURITY */}

              <div className="secure-payment">

                <FaLock />

                <span>
                  Secure payment powered by Razorpay
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Checkout;