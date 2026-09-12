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

const normaliseProduct = (body) => {
  const image = String(body.image || "").trim();
  const images = Array.isArray(body.images)
    ? body.images.map((item) => String(item).trim()).filter(Boolean)
    : [];
  const productImages = [...new Set([image, ...images].filter(Boolean))];

  return {
    id: String(body.id || "").trim(),
    category: String(body.category || "").trim().toLowerCase(),
    title: String(body.title || "").trim(),
    price: Number(body.price),
    image: productImages[0] || "",
    images: productImages,
    description: String(body.description || "").trim(),
    features: Array.isArray(body.features)
      ? body.features.map((feature) => String(feature).trim()).filter(Boolean)
      : [],
    bestSeller: Boolean(body.bestSeller),
    updatedAt: new Date().toISOString(),
  };
};

const validateProduct = (product) => {
  const categories = [
    "bookmarks",
    "prints",
    "journals",
    "notepad",
    "paintings",
    "posters",
    "postcards",
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

const normaliseCoupon = (body) => ({
  code: String(body.code || "").trim().toUpperCase(),
  discountPercent: Number(body.discountPercent),
  productId: String(body.productId || "").trim(),
  active: body.active !== false,
  updatedAt: new Date().toISOString(),
});

const validateCoupon = (coupon) => {
  if (!/^[A-Z0-9-]{3,30}$/.test(coupon.code)) {
    return "Coupon code must be 3–30 letters, numbers, or hyphens";
  }
  if (!Number.isFinite(coupon.discountPercent) || coupon.discountPercent <= 0 || coupon.discountPercent > 90) {
    return "Discount must be between 1% and 90%";
  }
  return null;
};

router.post("/admin/login", (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  res.json({ token: createToken(), expiresIn: TOKEN_TTL_MS });
});

router.get("/admin/coupons", requireAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection("coupons").get();
    res.json(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    console.error("Fetch coupons error:", error);
    res.status(500).json({ message: "Could not fetch coupons" });
  }
});

router.get("/coupons", async (req, res) => {
  try {
    const snapshot = await db.collection("coupons").get();
    res.json(snapshot.docs.map((doc) => ({ code: doc.id, ...doc.data() })).filter((coupon) => coupon.active !== false));
  } catch (error) {
    console.error("Fetch public coupons error:", error);
    res.status(500).json({ message: "Could not fetch coupons" });
  }
});

router.post("/admin/coupons", requireAdmin, async (req, res) => {
  try {
    const coupon = normaliseCoupon(req.body);
    const error = validateCoupon(coupon);
    if (error) return res.status(400).json({ message: error });

    await db.collection("coupons").doc(coupon.code).set(coupon, { merge: true });
    res.status(201).json(coupon);
  } catch (error) {
    console.error("Create coupon error:", error);
    res.status(500).json({ message: "Could not save coupon" });
  }
});

router.delete("/admin/coupons/:code", requireAdmin, async (req, res) => {
  try {
    await db.collection("coupons").doc(String(req.params.code).toUpperCase()).delete();
    res.json({ success: true });
  } catch (error) {
    console.error("Delete coupon error:", error);
    res.status(500).json({ message: "Could not delete coupon" });
  }
});

router.post("/coupons/validate", async (req, res) => {
  try {
    const code = String(req.body.code || "").trim().toUpperCase();
    const subtotal = Number(req.body.subtotal);
    const productIds = Array.isArray(req.body.productIds) ? req.body.productIds.map(String) : [];
    if (!code || !Number.isFinite(subtotal) || subtotal <= 0) {
      return res.status(400).json({ message: "Enter a valid coupon code" });
    }

    const couponDoc = await db.collection("coupons").doc(code).get();
    if (!couponDoc.exists || couponDoc.data().active === false) {
      return res.status(404).json({ message: "This coupon is not valid" });
    }

    const coupon = couponDoc.data();
    if (coupon.productId && !productIds.includes(coupon.productId)) {
      return res.status(400).json({ message: "This coupon applies to a different product" });
    }
    const discountPercent = Number(coupon.discountPercent);
    if (!Number.isFinite(discountPercent) || discountPercent <= 0 || discountPercent > 90) {
      return res.status(400).json({ message: "This coupon has an invalid discount" });
    }
    const discountAmount = Math.round((subtotal * discountPercent) * 100) / 100;
    res.json({ code, discountPercent, discountAmount, total: subtotal - discountAmount });
  } catch (error) {
    console.error("Validate coupon error:", error);
    res.status(500).json({ message: "Could not validate coupon" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();
    const products = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((product) => !product.deleted);
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
