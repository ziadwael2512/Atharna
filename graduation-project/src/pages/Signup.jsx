// import React, { useState } from 'react';
// import '../styles/auth.css';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';  // استيراد Axios
// // Fname,Lname,email, password
// const SignUp = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [Fname, setFirstName] = useState('');
//   const [Lname, setLastName] = useState('');
//   // const [confirmPassword, setConfirmPassword] = useState('');
//   const navigate = useNavigate(); // Hook للتوجيه

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // if (password !== confirmPassword) {
//     //   alert("Passwords don't match!");
//     //   return;
//     // }

//     try {
//       // إرسال البيانات باستخدام Axios
//       const response = await axios.post('http://localhost:5000/auth/signup', {
//         Fname,
//         Lname,
//         email,
//         password
//       });

//       if (response.status === 201) {
//         // alert('Sign-up successful!');
//         navigate('/signin'); // التوجيه لصفحة تسجيل الدخول بعد النجاح
//       } else {
//         alert(response.data.message || 'Sign-up failed');
//       }
//     } catch (error) {
//       console.error('Error signing up:', error);
//       alert('An error occurred');
//     }
//   };

//   return (
//     <div className="auth-wrapper">
//       <div className="auth-box">
//         <h2 className="auth-title">Sign Up</h2>
//         <form onSubmit={handleSubmit} className="auth-form">
          
//           <div className="auth-field">
//             <label className="auth-label">First Name :</label>
//             <input
//               type="text"
//               className="auth-input"
//               value={Fname}
//               onChange={(e) => setFirstName(e.target.value)}
//               required
//             />
//           </div>
//           <div className="auth-field">
//             <label className="auth-label">Last Name : </label>
//             <input
//               type="text"
//               className="auth-input"
//               value={Lname}
//               onChange={(e) => setLastName(e.target.value)}
//               required
//             />
//           </div>
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
//           {/* <div className="auth-field">
//             <label className="auth-label">Confirm Password:</label>
//             <input
//               type="password"
//               className="auth-input"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//           </div> */}
//           <button type="submit" className="auth-button">Sign Up</button>
//         </form>
//         <p className="auth-text">
//           Already have an account? <Link to="/signin" className="auth-link">Sign In</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignUp;




import React, { useState } from 'react';
import '../styles/auth.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';  
import { IoPersonSharp } from "react-icons/io5";
import { FaUser, FaLock } from "react-icons/fa";

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Fname, setFirstName] = useState('');
  const [Lname, setLastName] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

  

    try {
      const response = await axios.post('http://localhost:5000/auth/signup', {
        Fname,
        Lname,
        email,
        password
      });

      if (response.status === 201) {
        navigate('/signin'); 
      } else {
        alert(response.data.message || 'Sign-up failed');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('An error occurred');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="auth-title">Sign Up</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          
          <div className="auth-field">
           <IoPersonSharp  className="icon" />
            <label className="auth-label">First Name :</label>
            <input
              type="text"
              className="auth-input"
              value={Fname}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
          <IoPersonSharp  className="icon" />
            <label className="auth-label">Last Name : </label>
            <input
              type="text"
              className="auth-input"
              value={Lname}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
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
          Already have an account? <Link to="/signin" className="auth-link">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;