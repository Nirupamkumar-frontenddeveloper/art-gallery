const express = require("express");
const db = require("../firebase");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("reviews").get();

    const reviews = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    reviews.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Fetch reviews error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("Review request received:", req.body);

    const { name, rating, comment } = req.body;

    if (
      !name ||
      !rating ||
      !comment
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, rating and comment are required",
      });
    }

    const reviewData = {
      name: name.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await db
      .collection("reviews")
      .add(reviewData);

    console.log(
      "Review saved successfully:",
      docRef.id
    );

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review: {
        id: docRef.id,
        ...reviewData,
      },
    });
  } catch (error) {
    console.error(
      "Create review error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit review",
    });
  }
});

module.exports = router;