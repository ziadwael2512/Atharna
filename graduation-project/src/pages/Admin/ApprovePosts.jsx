import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../styles/ApprovePosts.css"
import Sidebar from '../../components/Sidebar'

function ApprovePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/admin/posts', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        // تصفية المشاركات التي تكون حالتها 'pending'
        const pendingPosts = data.posts.filter(post => post.status === 'PENDING');
        setPosts(pendingPosts);
      } catch (err) {
        setError('error in fetching');
      } finally {
        setLoading(false);
      }
    };
  
    fetchPosts();
  }, []);
  

  const approvePost = async (postId) => {
  
        try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/posts/${postId}/approve`, {}, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      setError('error in approve');
    }
  };

// In your ApprovePosts.js
if (loading) return <p className="loading">Loading posts...</p>;
if (error) return <p className="error">{error}</p>;

// ... and for the empty state:
<p className="empty-state">No pending posts found</p>

  return (
  <div>
    <Sidebar />
    <div className="approve-posts-container">
      <h2>posts</h2>
      {posts.length === 0 ? (
        <p>not found</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              {post.imageurl && <img src={post.imageurl} alt="post preview" />}
              <button onClick={() => approvePost(post.id)}>approve</button>
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
}

export default ApprovePosts;
