const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Order = require("../models/Order");

const router = express.Router();

const razorpay = new Razorpay({
  key_id:
    process.env.RAZORPAY_KEY_ID,

  key_secret:
    process.env.RAZORPAY_KEY_SECRET,
});

router.post(
  "/create-order",
  async (req, res) => {
    try {
      const { amount } = req.body;

      if (
        !amount ||
        Number(amount) < 100
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Minimum amount should be ₹1",
        });
      }

      const options = {
        amount: Number(amount),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const order =
        await razorpay.orders.create(
          options
        );

      res.status(200).json({
        success: true,
        id: order.id,
        amount: order.amount,
        currency:
          order.currency,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Order creation failed",
      });
    }
  }
);

router.post(
  "/verify-payment",
  async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,

        customerName,
        phone,
        address,
        pincode,

        items,
        totalAmount,
      } = req.body;

      const body =
        razorpay_order_id +
        "|" +
        razorpay_payment_id;

      const expectedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env
              .RAZORPAY_KEY_SECRET
          )
          .update(body.toString())
          .digest("hex");

      const verified =
        expectedSignature ===
        razorpay_signature;

      if (!verified) {
        return res.status(400).json({
          success: false,
          message:
            "Payment verification failed",
        });
      }

      const newOrder =
        await Order.create({
          orderId:
            "ORD-" +
            Date.now(),

          customerName,

          phone,

          address,

          pincode,

          items,

          totalAmount,

          razorpayOrderId:
            razorpay_order_id,

          razorpayPaymentId:
            razorpay_payment_id,

          paymentStatus: "Paid",

          orderStatus:
            "Order Placed",
        });

      res.status(200).json({
        success: true,
        order: newOrder,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Verification failed",
      });
    }
  }
);

router.get(
  "/orders",
  async (req, res) => {
    try {
      const orders =
        await Order.find().sort({
          createdAt: -1,
        });

      res.json(orders);
    } catch (error) {
      res.status(500).json({
        success: false,
      });
    }
  }
);

router.get(
  "/orders/:id",
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.id
        );

      res.json(order);
    } catch (error) {
      res.status(500).json({
        success: false,
      });
    }
  }
);

router.get(
  "/orders-by-phone/:phone",
  async (req, res) => {
    try {
      const orders =
        await Order.find({
          phone:
            req.params.phone,
        }).sort({
          createdAt: -1,
        });

      res.json(orders);
    } catch (error) {
      res.status(500).json({
        success: false,
      });
    }
  }
);

router.put(
  "/orders/:id/status",
  async (req, res) => {
    try {
      const { orderStatus } =
        req.body;

      const updatedOrder =
        await Order.findByIdAndUpdate(
          req.params.id,
          {
            orderStatus,
          },
          {
            new: true,
          }
        );

      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({
        success: false,
      });
    }
  }
);

module.exports = router;