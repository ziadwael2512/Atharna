import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/feed.css";

function Feed({ onClose }) {
  const [postData, setPostData] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setPostData({ ...postData, image: files[0] });
    } else {
      setPostData({ ...postData, [name]: value });
    }
  };
  

  useEffect(() => {
    window.scrollTo({ top: window.scrollY, behavior: "instant" });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    // if (!user || !user.id) {
    //   setError("مفيش مستخدم مسجل");
    //   setLoading(false);
    //   return;
    // }

    const formData = new FormData();
    formData.append("title", postData.name);
    formData.append("content", postData.description);
    formData.append("userId", user.id)
    if (postData.image) formData.append("image", postData.image);
    try {
      await axios.post("http://localhost:5000/posts", formData);
      onClose();
    } catch (err) {
      console.error(err);
      setError("error in loading");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-modal">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Create New Post</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label className="form-label">
              Name:
              <input
                type="text"
                name="name"
                value={postData.name}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </label>

            <label className="form-label">
              Description:
              <textarea
                name="description"
                value={postData.description}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </label>

            <label className="form-label">
              Image (optional link):
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
              />

            </label>
            {postData.image && (
              <img
                src={URL.createObjectURL(postData.image)}
                alt="preview"
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  marginBottom: "10px",
                }}
              />
            )}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </button>
            <button type="button" className="close-button" onClick={onClose}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Feed;
