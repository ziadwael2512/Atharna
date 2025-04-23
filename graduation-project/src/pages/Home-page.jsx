import React, { useEffect, useState } from 'react';
import '../styles/HomePage.css';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import MuseumCard from "../components/MuseumCard";
import image1 from './images/1128905.jpg';

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [visibleMuseums, setVisibleMuseums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(0);
  const images = [image1, image1, image1, image1]; // Using same image for all for now

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundImage((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    fetchMuseums();
  }, []);

  const fetchMuseums = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5000/museum/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to view museums');
        }
        throw new Error('Failed to load museums');
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }

      const formattedData = data.map(museum => ({
        id: museum.id || museum._id,
        name: museum.name || 'Unnamed Museum',
        governorate: museum.location || museum.governorate || 'Unknown',
        details: museum.info || museum.details || 'No description available',
        ticketPrice: museum.ticketPrice || 0
      }));

      shuffleMuseums(formattedData);
      
      const shuffleInterval = setInterval(() => {
        shuffleMuseums(formattedData);
      }, 10000);

      return () => clearInterval(shuffleInterval);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const shuffleMuseums = (museums) => {
    const shuffled = [...museums].sort(() => 0.5 - Math.random());
    setVisibleMuseums(shuffled.slice(0, 3));
  };

  const handleNavigation = (path) => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      navigate(path);
    } else {
      navigate("/signin");
    }
  };

  return (
    <div className="home-page">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="hero-section"
        style={{ backgroundImage: `url(${images[backgroundImage]})` }}
      >
        <div className="hero-content">
          <h1>Welcome to Ancient Egypt</h1>
          <p>Explore the wonders of the ancient world through our museum collections, games, and more!</p>
          <button 
            className="cta-button" 
            onClick={() => handleNavigation("/about")}
          >
            Start Exploring
          </button>
        </div>
      </section>

      {/* Featured Museums Section */}
      <section className="featured-museums">
        <h2>Featured Museums</h2>
        {error ? (
          <div className="error-message">
            {error}
            <button 
              className="cta-button" 
              onClick={fetchMuseums}
              style={{ marginTop: '15px' }}
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="loading-message">Loading featured museums...</div>
        ) : (
          <div className="museum-cards-container">
            {visibleMuseums.map((museum) => (
              <MuseumCard key={museum.id} museum={museum} />
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2>About Ancient Egypt</h2>
        <p>Learn about the rich history of one of the world's greatest civilizations. Ancient Egypt's influence on art, science, and culture continues to be felt today.</p>
      </section>

      {/* Featured Content Section */}
      <section className="featured-content">
        <div className="card">
          <h3>Museums</h3>
          <p>Explore collections of ancient Egyptian artifacts.</p>
          <button 
            className="cta-button"
            onClick={() => handleNavigation("/museums")}
          >
            Visit Museums
          </button>
        </div>
        <div className="card">
          <h3>Games</h3>
          <p>Test your knowledge through fun games.</p>
          <button 
            className="cta-button"
            onClick={() => handleNavigation("/games")}
          >
            Play Now
          </button>
        </div>
        <div className="card">
          <h3>Contact</h3>
          <p>Get in touch with more information.</p>
          <button 
            className="cta-button"
            onClick={() => handleNavigation("/contact")}
          >
            Chat Us
          </button>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 Ancient Egypt Exploration. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;