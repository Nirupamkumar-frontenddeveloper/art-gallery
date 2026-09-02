const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const db = require("../firebase");

const router = express.Router();

const razorpay = new Razorpay({
  key_id:
    process.env.RAZORPAY_KEY_ID,

  key_secret:
    process.env.RAZORPAY_KEY_SECRET,
});

// router.post(
//   "/create-order",
//   async (req, res) => {
//     try {
//       const { amount } = req.body;

//       if (
//         !amount ||
//         Number(amount) < 100
//       ) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Minimum amount should be ₹1",
//         });
//       }
router.post(
  "/create-order",
  async (req, res) => {
    try {
      const { amount } = req.body;

      if (
        amount === undefined ||
        amount === null ||
        Number(amount) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid amount",
        });
      }
      const order =
        await razorpay.orders.create({
          amount: Number(amount),
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        });

      res.json({
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
          .update(body)
          .digest("hex");

      if (
        expectedSignature !==
        razorpay_signature
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment verification failed",
        });
      }

      const orderData = {
        orderId:
          "ORD-" + Date.now(),

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

        createdAt:
          new Date().toISOString(),
      };

      const docRef =
        await db
          .collection("orders")
          .add(orderData);

      res.json({
        success: true,
        orderId:
          docRef.id,
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
      const snapshot =
        await db
          .collection("orders")
          .orderBy(
            "createdAt",
            "desc"
          )
          .get();

      const orders = [];

      snapshot.forEach((doc) => {
        orders.push({
          _id: doc.id,
          ...doc.data(),
        });
      });

      res.json(orders);
    } catch (error) {
      console.log(error);

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
      const doc =
        await db
          .collection("orders")
          .doc(
            req.params.id
          )
          .get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found",
        });
      }

      res.json({
        _id: doc.id,
        ...doc.data(),
      });
    } catch (error) {
      console.log(error);

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
      const snapshot =
        await db
          .collection("orders")
          .where(
            "phone",
            "==",
            req.params.phone
          )
          .get();

      const orders = [];

      snapshot.forEach((doc) => {
        orders.push({
          _id: doc.id,
          ...doc.data(),
        });
      });

      orders.sort(
        (a, b) =>
          new Date(
            b.createdAt
          ) -
          new Date(
            a.createdAt
          )
      );

      res.json(orders);
    } catch (error) {
      console.log(error);

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
      const {
        orderStatus,
      } = req.body;

      await db
        .collection("orders")
        .doc(
          req.params.id
        )
        .update({
          orderStatus,
          updatedAt:
            new Date().toISOString(),
        });

      res.json({
        success: true,
        message:
          "Status Updated",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
      });
    }
  }
);

module.exports = router;