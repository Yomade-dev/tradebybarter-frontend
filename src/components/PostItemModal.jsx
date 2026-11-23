import { useState, useEffect } from "react";
import { authHeaders } from "../utils/auth";
import "../css/PostItem.css";

// const res = await fetch(`${API}/api/listings`, { method: "POST", headers: authHeaders(), body: data });
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const categories = ["Phones & gadgets", "Fashion", "Home & kitchen", "Books & study", "Games & consoles", "Sports & bikes", "Other"];
const conditions = ["New", "Like new", "Good", "Fair"];

export default function PostItemModal({ onClose, onPosted }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({ title: "", category: "Other", condition: "Good", wants: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // free the preview URL when it changes or the modal closes
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  // close with the Escape key
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const picked = e.target.files[0];
    if (!picked) return;
    if (!picked.type.startsWith("image/")) return setError("Please choose an image file.");
    if (picked.size > 5 * 1024 * 1024) return setError("Image must be 5MB or smaller.");
    setError("");
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please add a photo of your item.");
    if (!form.title.trim()) return setError("Please enter a title.");

    setLoading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("image", file);
      Object.entries(form).forEach(([key, value]) => data.append(key, value));

      // do NOT set Content-Type yourself; the browser sets it for FormData
      const res = await fetch(`${API}/api/listings`, { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Upload failed");

      onPosted?.(json);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pi-overlay" onClick={onClose}>
      <div className="pi-sheet" role="dialog" aria-modal="true" aria-label="Post an item" onClick={(e) => e.stopPropagation()}>
        <div className="pi-header">
          <h2>Post an item</h2>
          <button type="button" className="pi-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="pi-photo">
            {preview ? (
              <img src={preview} alt="Preview of your item" />
            ) : (
              <span>📷 Tap to add a photo</span>
            )}
            <input type="file" accept="image/*" onChange={handleFile} className="pi-sr" />
          </label>

          <label className="pi-field">
            Title
            <input name="title" value={form.title} onChange={handleChange} maxLength={80} placeholder="e.g. iPhone 12, 64GB" />
          </label>

          <div className="pi-row">
            <label className="pi-field">
              Category
              <select name="category" value={form.category} onChange={handleChange}>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="pi-field">
              Condition
              <select name="condition" value={form.condition} onChange={handleChange}>
                {conditions.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>

          <label className="pi-field">
            What do you want in return?
            <input name="wants" value={form.wants} onChange={handleChange} placeholder="e.g. A laptop" />
          </label>

          <label className="pi-field">
            Description
            <textarea name="description" rows="3" value={form.description} onChange={handleChange} maxLength={500} placeholder="Tell people about the item" />
          </label>

          {error && <p className="pi-error" role="alert">{error}</p>}

          <button type="submit" className="pi-submit" disabled={loading}>
            {loading ? "Posting..." : "Post item"}
          </button>
        </form>
      </div>
    </div>
  );
}