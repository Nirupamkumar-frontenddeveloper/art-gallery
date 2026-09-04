const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use("/api", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api", productRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ARTIONARY Backend Running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
  });
});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server Running On Port ${PORT}`
  );
});
