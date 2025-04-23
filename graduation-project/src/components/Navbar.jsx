import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/nav.css";
import logo from "../components/logo.png";
import Signin from '../pages/Signin';
import { GiPharoah } from "react-icons/gi";
import Feed from "../pages/feed";


function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // للتحكم في القائمة
  const [showModal, setShowModal] = useState(false); //pop window
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  //to handle change
    useEffect(() => {
      const handleStorageChange = () => {
        setUser(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);
      };
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleNavigation = (path) => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        navigate(path);
      } else {
        navigate("/signin");
      }
    };
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };


  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  //to scroll down
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth > 768) {  // ✅ يتم التفعيل فقط على اللابتوب
        setScrolled(window.scrollY > 100);
      } else {
        setScrolled(false); // إذا كانت شاشة موبايل، لا يتم التغيير
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <header className={`navbar-container ${scrolled ? "scrolled" : ""}`}>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" onClick={() => navigate("/")} />
      </div>
      <nav className="navbar">
        {/* <Link to="/" className="nav-item">Home</Link> */}
        <Link to="/museums" className="nav-item">Museums</Link>
        <button className="nav-item" onClick={() => handleNavigation("/locate")}>Locate</button>
        <button className="nav-item" onClick={() => handleNavigation("/games")}>Games</button>
        <button className="nav-item" onClick={() => handleNavigation("/contact")}>Contact</button>
        <Link to="/about" className="nav-item">About Us</Link>

        {user ? (
           <div className="user-menu">
          <button onClick={() => setShowModal(true)} className="nav-item create open-modal-button">Create Post</button>
          {showModal && <Feed onClose={() => setShowModal(false)} />}
            
           <span className="username dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
           <GiPharoah className="user-icon" />
             {user.firstName}
             {dropdownOpen && (
             <div className="dropdown-content">
               <button onClick={handleLogout}>Log Out</button>
             </div>
           )}
           </span>
         </div>
        ) : (
          <>
            <Link to="/signin" className="nav-item auth">Sign In</Link>
            <Link to="/signup" className="nav-item auth">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
