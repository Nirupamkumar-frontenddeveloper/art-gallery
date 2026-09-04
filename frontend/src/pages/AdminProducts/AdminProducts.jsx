import { useState } from "react";
import axios from "axios";
import { FaEdit, FaEye, FaEyeSlash, FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import { API_URL, useProducts } from "../../context/productStore";
import { products as starterProducts } from "../../data/products";
import "./AdminProducts.css";

const emptyProduct = {
  id: "",
  category: "posters",
  title: "",
  price: "",
  image: "",
  description: "",
  features: [""],
  bestSeller: false,
};

const categories = ["bookmarks", "planners", "journals", "notepad", "paintings", "posters"];

function AdminProducts() {
  const { products, refreshProducts } = useProducts();
  const [token, setToken] = useState(localStorage.getItem("productAdminToken") || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  const showError = (error, fallback) => {
    const text = error.response?.data?.message || fallback;
    if (error.response?.status === 401) {
      localStorage.removeItem("productAdminToken");
      setToken("");
    }
    setMessage(text);
  };

  const login = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/admin/login`, { password });
      localStorage.setItem("productAdminToken", data.token);
      setToken(data.token);
      setPassword("");
      setMessage("");
    } catch (error) {
      showError(error, "Could not log in");
    }
  };

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const updateFeature = (index, value) => {
    const features = [...form.features];
    features[index] = value;
    updateField("features", features);
  };

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      setMessage("Image upload needs Cloudinary configuration. Paste an image URL below, or set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.");
      return;
    }

    try {
      setUploading(true);
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", uploadPreset);
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        uploadData
      );
      updateField("image", data.secure_url);
      setMessage("Image uploaded successfully.");
    } catch {
      setMessage("Image upload failed. Please try again or paste an image URL.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const payload = { ...form, price: Number(form.price) };
      if (editingId) {
        await axios.put(`${API_URL}/products/${editingId}`, payload, authConfig);
      } else {
        await axios.post(`${API_URL}/products`, payload, authConfig);
      }
      await refreshProducts();
      setForm(emptyProduct);
      setEditingId("");
      setMessage(editingId ? "Product updated." : "Product added and is now live.");
    } catch (error) {
      showError(error, "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setForm({ ...product, price: String(product.price), features: product.features?.length ? product.features : [""] });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`, authConfig);
      await refreshProducts();
      if (editingId === id) {
        setEditingId("");
        setForm(emptyProduct);
      }
      setMessage("Product deleted.");
    } catch (error) {
      showError(error, "Could not delete product");
    }
  };

  const importCatalogue = async () => {
    try {
      setSaving(true);
      const { data } = await axios.post(`${API_URL}/products/import`, { products: starterProducts }, authConfig);
      await refreshProducts();
      setMessage(`${data.imported} existing products imported into Firestore.`);
    } catch (error) {
      showError(error, "Could not import current catalogue");
    } finally {
      setSaving(false);
    }
  };

  if (!token) {
    return (
      <div className="admin-login">
        <form className="admin-login-box" onSubmit={login}>
          <h1>Product Admin</h1>
          <div className="password-field">
            <input type={showPassword ? "text" : "password"} placeholder="Enter Password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
            <button type="button" className="password-visibility-btn" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit">Login</button>
          {message && <p className="admin-message">{message}</p>}
        </form>
      </div>
    );
  }

  return (
    <main className="admin-products-page">
      <header className="admin-products-header">
        <div>
          <span>CATALOGUE MANAGEMENT</span>
          <h1>Products</h1>
          <p>Add a product once and it appears in its category, detail page, cart, and checkout.</p>
        </div>
        <button className="logout-btn" onClick={() => { localStorage.removeItem("productAdminToken"); setToken(""); }}>Logout</button>
      </header>

      {message && <p className="product-message">{message}</p>}

      <section className="product-admin-layout">
        <form className="product-form" onSubmit={submitProduct}>
          <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
          <label>Unique ID<input value={form.id} disabled={Boolean(editingId)} placeholder="e.g. bs-poster-009" onChange={(event) => updateField("id", event.target.value.toLowerCase())} required /></label>
          <label>Category<select value={form.category} onChange={(event) => updateField("category", event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label>Title<input value={form.title} onChange={(event) => updateField("title", event.target.value)} required /></label>
          <label>Price (₹)<input type="number" min="0" step="1" value={form.price} onChange={(event) => updateField("price", event.target.value)} required /></label>
          <label>Image URL<input type="url" value={form.image} placeholder="https://..." onChange={(event) => updateField("image", event.target.value)} required /></label>
          <label className="file-picker"><FaUpload /> {uploading ? "Uploading image..." : "Upload image"}<input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} /></label>
          {form.image && <img className="product-image-preview" src={form.image} alt="Product preview" />}
          <label>Description<textarea rows="4" value={form.description} onChange={(event) => updateField("description", event.target.value)} required /></label>
          <fieldset><legend>Features</legend>{form.features.map((feature, index) => <div className="feature-input" key={index}><input value={feature} placeholder="e.g. Free shipping" onChange={(event) => updateFeature(index, event.target.value)} />{form.features.length > 1 && <button type="button" onClick={() => updateField("features", form.features.filter((_, itemIndex) => itemIndex !== index))}>×</button>}</div>)}<button className="text-button" type="button" onClick={() => updateField("features", [...form.features, ""])}>+ Add feature</button></fieldset>
          <label className="checkbox-label"><input type="checkbox" checked={form.bestSeller} onChange={(event) => updateField("bestSeller", event.target.checked)} /> Show in Best Sellers</label>
          <div className="form-actions"><button className="save-product-btn" disabled={saving} type="submit">{saving ? "Saving..." : editingId ? "Save Changes" : "Add Product"}</button>{editingId && <button className="cancel-btn" type="button" onClick={() => { setEditingId(""); setForm(emptyProduct); }}>Cancel</button>}</div>
        </form>

        <section className="product-list">
          <div className="product-list-title"><h2>All Products ({products.length})</h2><button className="import-btn" disabled={saving} onClick={importCatalogue}><FaPlus /> Import current catalogue</button></div>
          <p className="product-list-help">Use Import once to make the existing static products editable from here.</p>
          <div className="admin-product-grid">{products.map((product) => <article className="admin-product-card" key={product.id}><img src={product.image} alt="" /><div><span>{product.category}</span><h3>{product.title}</h3><p>₹{product.price}</p><small>{product.id}</small></div><div className="card-actions"><button aria-label={`Edit ${product.title}`} onClick={() => editProduct(product)}><FaEdit /></button><button aria-label={`Delete ${product.title}`} onClick={() => deleteProduct(product.id)}><FaTrash /></button></div></article>)}</div>
        </section>
      </section>
    </main>
  );
}

export default AdminProducts;
