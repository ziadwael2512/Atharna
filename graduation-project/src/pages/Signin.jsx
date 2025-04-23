// import React, { useState } from 'react';
// import '../styles/auth.css';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios'; // استيراد مكتبة Axios
// import Navbar from '../components/Navbar';  // Import your Navbar component

// // Fname,Lname,email, password
// const SignIn = ({ setUser }) => {
  
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate(); // Hook للتوجيه

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post('http://localhost:5000/auth/login', {
//         email,
//         password,
//       });

//       const data = response.data; // Get user data from backend response

//       if (response.status === 200) {
//         // Store user data in localStorage
//         localStorage.setItem('user', JSON.stringify(data.user));

//         // Optionally store token as well
//         localStorage.setItem('token', data.user.token);
//         setUser(data.user);
//         // Navigate to home or dashboard after successful login
//         navigate('/');
//       } else {
//         alert(data.message || 'Sign-in failed');
//       }
//     } catch (error) {
//       console.error('Error signing in:', error);
//       alert('An error occurred');
//     }
//   };

//   return (
//     <div className="auth-wrapper">
//       <div className="auth-box">
//         <h2 className="auth-title">Sign In</h2>
//         <form onSubmit={handleSubmit} className="auth-form">
//           <div className="auth-field">
//             <label className="auth-label">Email:</label>
//             <input
//               type="email"
//               className="auth-input"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="auth-field">
//             <label className="auth-label">Password:</label>
//             <input
//               type="password"
//               className="auth-input"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" className="auth-button">Sign In</button>
//         </form>
//         <p className="auth-text">
//           Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignIn;


import React, { useState } from 'react';
import '../styles/auth.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { FaUser, FaLock } from "react-icons/fa";

const SignIn = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password,
      });
      const data = response.data;
      const token = response.headers["authorization"].split(' ')[1] || response.headers["Authorization"].split(' ')[1];
      // if (response.status === 200) {
      //   localStorage.setItem('user', JSON.stringify(data.user));
      //   localStorage.setItem('token', data.user.token);
      //   setUser(data.user);
        

      //   console.log('User stored in localStorage:', JSON.parse(localStorage.getItem('user')));
      //   console.log('Token stored in localStorage:', localStorage.getItem('token'));
      //   console.log("Response data:", data);

      if (response.status === 200) {
        if (!token) {
          console.log("Token not found in response headers.");
          return;
        }

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", token); // Store token from header
        setUser(data.user);
  
        // console.log("Token from headers:", token);
        // console.log("User stored in localStorage:", JSON.parse(localStorage.getItem("user")));



        if (data.user.role === 'ADMIN') {
          navigate('/dashboard'); 
        } else if (data.user.role === 'USER') {
          navigate('/'); 
        } 
      } else {
        alert(data.message || 'Sign-in failed');
      }
    } catch (error) {
      console.error('Error signing in:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="auth-title">Sign In</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
          <FaUser className="icon" />
            <label className="auth-label">Email:</label>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
          <FaLock className="icon" />
            <label className="auth-label">Password:</label>
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">➝</button>
        </form>
        <p className="auth-text">
          Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;