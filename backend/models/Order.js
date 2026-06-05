const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: String,

    customerName: String,

    phone: String,

    address: String,

    pincode: String,

    items: [
      {
        productId: String,
        title: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],

    totalAmount: Number,

    razorpayOrderId: String,

    razorpayPaymentId: String,

    paymentStatus: {
      type: String,
      default: "Paid",
    },

    orderStatus: {
      type: String,
      default: "Order Placed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);