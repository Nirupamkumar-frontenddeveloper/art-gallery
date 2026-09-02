const express = require("express");
const db = require("../firebase");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const snapshot = await db
      .collection("reviews")
      .get();

    const reviews = [];

    snapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    reviews.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    res.status(200).json(reviews);
  } catch (error) {
    console.log("Fetch reviews error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, rating, comment } = req.body;

    if (
      !name?.trim() ||
      !comment?.trim() ||
      !rating
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, rating and comment are required",
      });
    }

    const numericRating = Number(rating);

    if (
      Number.isNaN(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be between 1 and 5",
      });
    }

    const reviewData = {
      name: name.trim(),
      rating: numericRating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await db
      .collection("reviews")
      .add(reviewData);

    res.status(201).json({
      success: true,
      review: {
        id: docRef.id,
        ...reviewData,
      },
    });
  } catch (error) {
    console.log("Create review error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit review",
    });
  }
});

module.exports = router;