const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "10mb",
  })
);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(
      "MongoDB Connected Successfully"
    );
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/api", paymentRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "ARTIONARY Backend Running",
  });
});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server Running On Port ${PORT}`
  );
});