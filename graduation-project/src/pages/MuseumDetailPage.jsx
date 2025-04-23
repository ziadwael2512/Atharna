import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/MuseumDetailPage.css';

function MuseumDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [museum, setMuseum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const MUSEUM_DETAIL_API_URL = `http://localhost:5000/museum/${id}`;

  useEffect(() => {
    const fetchMuseumDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const response = await axios.get(MUSEUM_DETAIL_API_URL, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        if (!response.data?.id) {
          throw new Error('Invalid museum data');
        }

        setMuseum(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMuseumDetails();
  }, [id, navigate, MUSEUM_DETAIL_API_URL]);

  const formatDisplayText = (text) => {
    return text?.replace(/_/g, ' ') || 'Not specified';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading museum details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Museum</h2>
        <p>{error}</p>
        <div className="error-buttons">
          <button onClick={() => navigate(-1)}>Go Back</button>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!museum) {
    return (
      <div className="not-found">
        <h2>Museum not found</h2>
        <button onClick={() => navigate('/museums')}>Browse All Museums</button>
      </div>
    );
  }

  return (
    <div className="museum-detail">
      <div className="museum-header">
        <h1>{museum.name}</h1>
        <div className="museum-meta">
          <span className={`museum-type ${museum.type?.toLowerCase()}`}>
            {formatDisplayText(museum.type)}
          </span>
          <span className="museum-location">
            {formatDisplayText(museum.location)}
          </span>
          {museum.ticketPrice && (
            <span className="museum-price">
              Ticket: ${museum.ticketPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
      
      <div className="museum-content">
        <div className="museum-info">
          <p>{museum.info || museum.details || 'No description available.'}</p>
        </div>
        
  
      </div>
      
      <div className="museum-footer">
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; Back to Museums
        </button>
      </div>
    </div>
  );
}

export default MuseumDetailPage;