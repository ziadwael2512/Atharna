import React, { useEffect, useState } from "react"; 
import axios from "axios";
import '../styles/testsignin.css';

function AllApprovedPosts() {
  const [posts, setPosts] = useState([]);
  const username = JSON.parse(localStorage.getItem("user"))?.Fname || "user";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/feed");
        setPosts(data);
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="feed-wrapper">
      {posts.map((post, i) => (
        <div className="styled-post-card" key={i}>
          <div className="user-info">
            <div className="user-name">{username}</div>
            <div className="post-date">
              {new Date(post.createdAt).toLocaleDateString("EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          <div className="post-title">{post.title}</div>
          <div className="post-content">{post.content}</div>
          {post.imageUrl && (
            <img src={`http://localhost:5000${post.imageUrl}`} alt="post" className="post-image" />
          )}
          {/* <div className="post-actions">
            <button className="like-button">Like</button>
            <button className="comment-button">Comment</button>
          </div> */}
        </div>
      ))}
    </div>
  );
}

export default AllApprovedPosts;
