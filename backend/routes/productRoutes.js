const express = require("express");
const crypto = require("crypto");
const db = require("../firebase");

const router = express.Router();

// Move this to an environment variable before sharing server source publicly.
const ADMIN_PASSWORD = "Sonal1234";
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

const createToken = () => {
  const payload = Buffer.from(
    JSON.stringify({ expiresAt: Date.now() + TOKEN_TTL_MS })
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", ADMIN_PASSWORD)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
};

const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Admin login required" });
  }

  const [payload, signature] = token.split(".");
  const expectedSignature = crypto
    .createHmac("sha256", ADMIN_PASSWORD)
    .update(payload)
    .digest("base64url");

  try {
    const validSignature = crypto.timingSafeEqual(
      Buffer.from(signature || ""),
      Buffer.from(expectedSignature)
    );
    const { expiresAt } = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    if (!validSignature || Date.now() > expiresAt) {
      throw new Error("Invalid token");
    }

    next();
  } catch {
    return res.status(401).json({ message: "Your admin session has expired" });
  }
};

const normaliseProduct = (body) => ({
  id: String(body.id || "").trim(),
  category: String(body.category || "").trim().toLowerCase(),
  title: String(body.title || "").trim(),
  price: Number(body.price),
  image: String(body.image || "").trim(),
  description: String(body.description || "").trim(),
  features: Array.isArray(body.features)
    ? body.features.map((feature) => String(feature).trim()).filter(Boolean)
    : [],
  bestSeller: Boolean(body.bestSeller),
  updatedAt: new Date().toISOString(),
});

const validateProduct = (product) => {
  const categories = [
    "bookmarks",
    "planners",
    "journals",
    "notepad",
    "paintings",
    "posters",
  ];

  if (!/^[a-z0-9-]+$/.test(product.id)) {
    return "ID may contain only lowercase letters, numbers, and hyphens";
  }
  if (!categories.includes(product.category)) return "Choose a valid category";
  if (!product.title || !product.description || !product.image) {
    return "Title, image, and description are required";
  }
  if (!Number.isFinite(product.price) || product.price < 0) {
    return "Price must be zero or greater";
  }
  return null;
};

router.post("/admin/login", (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  res.json({ token: createToken(), expiresIn: TOKEN_TTL_MS });
});

router.get("/products", async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ message: "Could not fetch products" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const doc = await db.collection("products").doc(req.params.id).get();
    if (!doc.exists || doc.data().deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Fetch product error:", error);
    res.status(500).json({ message: "Could not fetch product" });
  }
});

router.post("/products", requireAdmin, async (req, res) => {
  try {
    const product = normaliseProduct(req.body);
    const error = validateProduct(product);
    if (error) return res.status(400).json({ message: error });

    const reference = db.collection("products").doc(product.id);
    if ((await reference.get()).exists) {
      return res.status(409).json({ message: "This product ID already exists" });
    }

    await reference.set({ ...product, createdAt: product.updatedAt });
    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Could not create product" });
  }
});

router.post("/products/import", requireAdmin, async (req, res) => {
  try {
    if (!Array.isArray(req.body.products)) {
      return res.status(400).json({ message: "Products array is required" });
    }

    const batch = db.batch();
    let imported = 0;

    req.body.products.forEach((item) => {
      const product = normaliseProduct(item);
      if (validateProduct(product)) return;
      batch.set(
        db.collection("products").doc(product.id),
        { ...product, createdAt: item.createdAt || product.updatedAt },
        { merge: true }
      );
      imported += 1;
    });

    await batch.commit();
    res.json({ success: true, imported });
  } catch (error) {
    console.error("Import products error:", error);
    res.status(500).json({ message: "Could not import products" });
  }
});

router.put("/products/:id", requireAdmin, async (req, res) => {
  try {
    const product = normaliseProduct({ ...req.body, id: req.params.id });
    const error = validateProduct(product);
    if (error) return res.status(400).json({ message: error });

    const reference = db.collection("products").doc(req.params.id);
    if (!(await reference.get()).exists) {
      return res.status(404).json({ message: "Product not found" });
    }

    await reference.update(product);
    res.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Could not update product" });
  }
});

router.delete("/products/:id", requireAdmin, async (req, res) => {
  try {
    await db.collection("products").doc(req.params.id).set(
      { deleted: true, updatedAt: new Date().toISOString() },
      { merge: true }
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Could not delete product" });
  }
});

module.exports = router;
