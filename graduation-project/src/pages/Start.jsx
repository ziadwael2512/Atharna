// import React from 'react';
// import '../styles/start.css'; // Create a CSS file for styling this page
// import { useNavigate } from 'react-router-dom';
// function Start() {
//   const x = useNavigate()
//   return (
//     <div className="start-page">
//     <div className="auth-container">
//         <h1>Sign In or Sign Up</h1>
//         <div className="auth-cards">
//         <div className="card">
//             <h2>Sign In</h2>
//             <p>Access your account and start your journey!</p>
//             <button className="cta-button" onClick={() => x("/signin")}>Sign In</button>
//         </div>
//         <div className="card">
//             <h2>Sign Up</h2>
//             <p>Create a new account and explore our content!</p>
//             <button className="cta-button" onClick={() => x("/signup")}>Sign Up</button>
//         </div>
//         </div>
//     </div>
//     </div>
//   );
// }

// export default Start;



import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/start.css';
import Atharna from "../Assets/Atharna.png";
import SignIn from './Signin';
import SignUp from './Signup';

function Start() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(location.pathname === "/signup" ? 1 : 0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Update activeTab when the URL changes
    setActiveTab(location.pathname === "/signup" ? 1 : 0);
  }, [location.pathname]);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
    navigate(tabIndex === 0 ? '/signin' : '/signup', { replace: true }); // Update URL without full reload
  };

  return (
    <div className="start-container">
      <header className="start-header">
      <img className="start-logo" src= {Atharna} alt="Atharna"  onClick={() => navigate("/")}/>
        <h1 className="start-title">Welcome to Atharna</h1>
      </header>

      <div className="start-tabs">
        <menu className="tab-menu">
          <button
            className={`tab-button ${activeTab === 0 ? 'tab-active' : ''}`}
             onClick={() => handleTabClick(0)}
          >
            Sign In
            
          </button>
          <button
            className={`tab-button ${activeTab === 1 ? 'tab-active' : ''}`}
            onClick={() => handleTabClick(1)}
          >
            Sign Up
          </button>
        </menu>

        <div className="tab-content">
          {activeTab === 0 ? <SignIn setUser={setUser}/> : <SignUp />}
        </div>
      </div>
    </div>
  );
}

export default Start;