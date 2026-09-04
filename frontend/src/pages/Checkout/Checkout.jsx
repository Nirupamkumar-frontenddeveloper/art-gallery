import {
  useState,
  useEffect,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  FaBoxOpen,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaLock,
} from "react-icons/fa";

import { useCart } from "../../context/CartContext";

import "./Checkout.css";


function Checkout() {

  const location = useLocation();
  const navigate = useNavigate();

  const { clearCart } = useCart();

  const checkoutData = location.state;


  const [formData, setFormData] =
    useState({
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

  const [isLoadingPincode, setIsLoadingPincode] =
    useState(false);


  // ================= PINCODE API =================

  useEffect(() => {

    const fetchPincodeDetails =
      async () => {

        if (
          formData.pincode.length !== 6
        ) {
          return;
        }

        try {

          setIsLoadingPincode(true);

          const response =
            await axios.get(
              `https://api.postalpincode.in/pincode/${formData.pincode}`
            );

          const data =
            response.data[0];

          if (
            data.Status === "Success" &&
            data.PostOffice &&
            data.PostOffice.length > 0
          ) {

            const postOffice =
              data.PostOffice[0];

            setFormData((prev) => ({
              ...prev,

              city:
                postOffice.District ||
                "",

              state:
                postOffice.State ||
                "",
            }));

          } else {

            setStatus(
              "Invalid pincode"
            );

          }

        } catch (error) {

          console.log(
            "Pincode error:",
            error
          );

        } finally {

          setIsLoadingPincode(false);

        }

      };


    fetchPincodeDetails();

  }, [formData.pincode]);


  // ================= HANDLE INPUT =================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    if (
      name === "phone"
    ) {

      const phone =
        value.replace(/\D/g, "")
          .slice(0, 10);

      setFormData({
        ...formData,
        phone,
      });

      return;
    }


    if (
      name === "pincode"
    ) {

      const pincode =
        value.replace(/\D/g, "")
          .slice(0, 6);

      setFormData({
        ...formData,

        pincode,

        city:
          pincode.length < 6
            ? ""
            : formData.city,

        state:
          pincode.length < 6
            ? ""
            : formData.state,
      });

      return;
    }


    setFormData({
      ...formData,
      [name]: value,
    });

  };


  // ================= EMPTY CHECKOUT =================

  if (!checkoutData) {

    return (

      <div className="checkout-empty">

        <div>

          <h2>
            No Product Selected
          </h2>

          <button
            onClick={() =>
              navigate("/")
            }
          >
            Continue Shopping
          </button>

        </div>

      </div>

    );

  }


  // ================= TOTAL =================

  const totalAmount =
    checkoutData.type === "single"
      ? Number(
          checkoutData.product.price
        )
      : Number(
          checkoutData.total
        );


  // ================= VALIDATE FORM =================

  const validateForm = () => {

    if (
      !formData.fullName.trim()
    ) {

      setStatus(
        "Please enter your full name"
      );

      return false;

    }


    if (
      formData.phone.length !== 10
    ) {

      setStatus(
        "Please enter a valid 10 digit phone number"
      );

      return false;

    }


    if (
      formData.pincode.length !== 6
    ) {

      setStatus(
        "Please enter a valid 6 digit pincode"
      );

      return false;

    }


    if (
      !formData.city.trim()
    ) {

      setStatus(
        "Please enter your city"
      );

      return false;

    }


    if (
      !formData.state.trim()
    ) {

      setStatus(
        "Please enter your state"
      );

      return false;

    }


    if (
      !formData.address.trim()
    ) {

      setStatus(
        "Please enter your complete address"
      );

      return false;

    }


    return true;

  };


  // ================= PAYMENT =================

  const handlePayment =
    async () => {

      if (!validateForm()) {
        return;
      }


      setStatus("");
      setIsProcessing(true);


      try {

        // CREATE RAZORPAY ORDER

        const { data } =
          await axios.post(
            "https://artionary-backend.onrender.com/api/create-order",
            {
              amount:
                Math.round(
                  totalAmount * 100
                ),
            }
          );


        const options = {

          key:
            import.meta.env
              .VITE_RAZORPAY_KEY_ID,


          amount:
            data.amount,


          currency:
            data.currency,


          order_id:
            data.id,


          name:
            "ARTIONARY",


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


          handler:
            async (response) => {

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


                      city:
                        formData.city,


                      state:
                        formData.state,


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

                                quantity:
                                  1,

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


                if (
                  verify.data.success
                ) {

                  setStatus(
                    "Payment Successful"
                  );


                  // =========================
                  // CLEAR CART AFTER PAYMENT
                  // =========================

                  clearCart();


                  setTimeout(() => {

                    navigate(
                      "/my-orders",
                      {
                        state: {
                          phone:
                            formData.phone,
                        },
                      }
                    );

                  }, 700);

                }


              } catch (error) {

                console.log(
                  "Verification Error:",
                  error
                );

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
          new window.Razorpay(
            options
          );


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

        console.log(
          "Payment Error:",
          error
        );

        setStatus(
          error.response?.data?.message ||
          "Payment Failed"
        );

        setIsProcessing(false);

      }

    };


  return (

    <section className="checkout-page">

      <div className="checkout-wrapper">


        {/* HEADER */}

        <div className="checkout-header">

          <div>

            <span>
              SECURE CHECKOUT
            </span>

            <h1>
              Complete Your Order
            </h1>

          </div>


        </div>


        {/* MAIN CONTENT */}

        <div className="checkout-container">


          {/* ORDER SUMMARY */}

          <div className="checkout-left">

            <div className="checkout-section-title">

              <div className="title-icon">
                <FaBoxOpen />
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
              "single"

                ? (

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


                      {checkoutData
                        .product.description && (

                        <p>
                          {
                            checkoutData
                              .product.description
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
                            checkoutData
                              .product.price
                          }
                        </h4>

                      </div>

                    </div>

                  </div>

                )

                : (

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
                              Qty:
                              {" "}
                              {item.quantity}
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
                  Total
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


              {/* NAME */}

              <div className="form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={
                    formData.fullName
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              {/* PHONE */}

              <div className="form-group">

                <label>
                  Phone Number
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
                  />

                </div>

              </div>


              {/* PINCODE */}

              <div className="form-group">

                <label>
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  placeholder="Enter 6 digit pincode"
                  value={
                    formData.pincode
                  }
                  onChange={
                    handleChange
                  }
                />

                {isLoadingPincode && (
                  <small>
                    Fetching location...
                  </small>
                )}

              </div>


              {/* CITY STATE */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={
                      formData.city
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="form-group">

                  <label>
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={
                      formData.state
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

              </div>


              {/* ADDRESS */}

              <div className="form-group">

                <label>
                  Complete Address
                </label>

                <textarea
                  name="address"
                  placeholder="House No., Building, Street, Area"
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


              {/* PAYMENT */}

              <button
                className="checkout-btn"
                onClick={
                  handlePayment
                }
                disabled={
                  isProcessing
                }
              >

                {isProcessing
                  ? "Processing..."
                  : `Pay ₹${totalAmount}`}

              </button>


              <div className="secure-payment">

                <FaLock />

                Secure payment powered by Razorpay

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}


export default Checkout;
