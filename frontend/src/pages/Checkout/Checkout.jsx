import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaUser,
  FaPhoneAlt,
  FaShoppingBag,
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
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [status, setStatus] =
    useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ===============================
     NO CHECKOUT DATA
  =============================== */

  if (!checkoutData) {
    return (
      <div className="checkout-empty">
        <div>
          <h2>No Product Selected</h2>

          <button onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  /* ===============================
     TOTAL AMOUNT
  =============================== */

  const totalAmount =
    checkoutData.type === "single"
      ? Number(checkoutData.product.price)
      : Number(checkoutData.total);

  /* ===============================
     PAYMENT HANDLER
  =============================== */

  const handlePayment = async () => {
    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      setStatus(
        "Please fill all delivery details"
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
      /* =================================
         CREATE RAZORPAY ORDER

         Backend route:
         router.post("/create-order")

         Assuming:
         app.use("/api", router)
      ================================= */

      const { data } = await axios.post(
        "https://artionary-backend.onrender.com/api/create-order",
        {
          amount: Math.round(totalAmount * 100),
        }
      );

      if (!data.success) {
        throw new Error(
          "Order creation failed"
        );
      }

      /* =================================
         RAZORPAY OPTIONS
      ================================= */

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

        /* =================================
           PAYMENT SUCCESS
        ================================= */

        handler: async (response) => {
          try {
            /*
              Backend expects:

              customerName
              phone
              address
              pincode
              items
              totalAmount
            */

            const completeAddress = `
${formData.address},
${formData.city},
${formData.state} - ${formData.pincode}
            `.trim();

            const verifyPayload = {
              ...response,

              customerName:
                formData.fullName,

              phone:
                formData.phone,

              address:
                completeAddress,

              pincode:
                formData.pincode,

              items:
                checkoutData.type === "single"
                  ? [
                      {
                        productId:
                          checkoutData.product.id,

                        title:
                          checkoutData.product.title,

                        image:
                          checkoutData.product.image,

                        quantity: 1,

                        price:
                          checkoutData.product.price,
                      },
                    ]
                  : checkoutData.items.map(
                      (item) => ({
                        productId: item.id,

                        title: item.title,

                        image: item.image,

                        quantity: item.quantity,

                        price: item.price,
                      })
                    ),

              totalAmount:
                totalAmount,
            };

            const verify =
              await axios.post(
                "https://artionary-backend.onrender.com/api/verify-payment",
                verifyPayload
              );

            if (verify.data.success) {
              setStatus(
                "Payment Successful"
              );

              /*
                Small delay so user doesn't
                see abrupt navigation
              */

              setTimeout(() => {
                navigate("/my-orders", {
                  state: {
                    phone: formData.phone,
                  },
                });
              }, 500);

            } else {
              throw new Error(
                verify.data.message ||
                  "Payment verification failed"
              );
            }

          } catch (error) {
            console.error(
              "Verification Error:",
              error
            );

            setStatus(
              "Payment verification failed"
            );

            setIsProcessing(false);
          }
        },

        /* =================================
           RAZORPAY MODAL CLOSED
        ================================= */

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
        (response) => {
          console.error(
            "Payment Failed:",
            response
          );

          setStatus(
            "Payment Failed. Please try again."
          );

          setIsProcessing(false);
        }
      );

      razorpay.open();

    } catch (error) {
      console.error(
        "Payment Error:",
        error
      );

      setStatus(
        error.response?.data?.message ||
          "Unable to initiate payment"
      );

      setIsProcessing(false);
    }
  };

  return (
    <section className="checkout-page">

      <div className="checkout-wrapper">

        {/* ================= HEADER ================= */}

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


        {/* ================= MAIN CONTAINER ================= */}

        <div className="checkout-container">


          {/* ================= ORDER SUMMARY ================= */}

          <div className="checkout-left">

            <div className="checkout-section-title">

              <div className="title-icon">
                <FaShoppingBag />
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

              {checkoutData.type === "single" ? (

                <div className="checkout-product">

                  <img
                    src={
                      checkoutData.product.image
                    }
                    alt={
                      checkoutData.product.title
                    }
                  />

                  <div className="checkout-product-info">

                    <h3>
                      {checkoutData.product.title}
                    </h3>

                    {checkoutData.product.description && (
                      <p>
                        {
                          checkoutData.product
                            .description
                        }
                      </p>
                    )}

                    <div className="product-meta">

                      <span>
                        Qty: 1
                      </span>

                      <h4>
                        ₹
                        {
                          checkoutData.product.price
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


            {/* ================= PRICE SUMMARY ================= */}

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


          {/* ================= DELIVERY DETAILS ================= */}

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
                      placeholder="Enter full name"
                      value={
                        formData.fullName
                      }
                      onChange={
                        handleChange
                      }
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
                      value={
                        formData.phone
                      }
                      onChange={
                        handleChange
                      }
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
                    value={
                      formData.pincode
                    }
                    onChange={
                      handleChange
                    }
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
                    value={
                      formData.city
                    }
                    onChange={
                      handleChange
                    }
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
                  value={
                    formData.state
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              {/* COMPLETE ADDRESS */}

              <div className="form-group">

                <label>
                  Complete Address *
                </label>

                <textarea
                  name="address"
                  placeholder="House/Flat No., Building, Street, Area"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
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
                  ? "Processing..."
                  : `Pay Securely ₹${totalAmount}`
                }

              </button>


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