import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/MuseumsPage.css';
import Navbar from '../components/Navbar';
import { CgArrowsExpandDownRight } from 'react-icons/cg';
import { FaArrowsToCircle } from 'react-icons/fa6';
import MuseumCard from "../components/MuseumCard";

// Governorate enum for filtering
const Governorate = {
  ALEXANDRIA: "Alexandria",
  ASWAN: "Aswan",
  ASYUT: "Asyut",
  BEHIRA: "Behira",
  BENI_SUEF: "Beni Suef",
  CAIRO: "Cairo",
  DAKAHLIA: "Dakahlia",
  DUMYETTA: "Dumyetta",
  FAYOUM: "Fayoum",
  GHARBIA: "Gharbia",
  GIZA: "Giza",
  ISMAILIA: "Ismailia",
  KAFR_ELSHEIKH: "Kafr ElSheikh",
  LUXOR: "Luxor",
  MATRUH: "Matruh",
  MINYA: "Minya",
  MONOFIA: "Monofia",
  NEW_VALLEY: "New Valley",
  NORTH_SINAI: "North Sinai",
  PORTSAID: "Portsaid",
  QALYUBIA: "Qalyubia",
  QENNA: "Qenna",
  RED_SEA: "Red Sea",
  SHARQIA: "Sharqia",
  SOUTH_SINAI: "South Sinai",
  SUEZ: "Suez",
  SUHAG: "Suhag"
};

function MuseumsPage() {
  const [selectedGovernorate, setSelectedGovernorate] = useState(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const MUSEUMS_API_URL = 'http://localhost:5000/museum/all';

  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(MUSEUMS_API_URL, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        
        setMuseums(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMuseums();
  }, [navigate]);

  const formatGovernorateName = (enumValue) => {
    if (!enumValue) return '';
    return enumValue
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getUniqueGovernorates = () => {
    const govs = new Set(museums.map(museum => museum.location));
    return Array.from(govs).map(gov => ({
      enumValue: gov,
      displayName: formatGovernorateName(gov)
    }));
  };

  const filteredMuseums = selectedGovernorate
    ? museums.filter(museum => museum.location === selectedGovernorate)
    : museums;

  if (loading) {
    return (
      <div className="ancient-sands">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading museums...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ancient-sands">
        <Navbar />
        <div className="error-container">
          <p>Error loading data: {error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ancient-sands">
      <Navbar />
      <div className="pharaohs-treasure">
        <div className="golden-scroll">
          <div className="hieroglyph-filters">
            <button
              className="filter-toggle"
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            >
              {isFilterExpanded ? (
                <FaArrowsToCircle className="filter-icon" />
              ) : (
                <CgArrowsExpandDownRight className="filter-icon" />
              )}
              
            </button>
            {isFilterExpanded && (
              <ul>
                {getUniqueGovernorates().map((gov, index) => (
                  <li 
                    key={index} 
                    onClick={() => setSelectedGovernorate(gov.enumValue)}
                    className={selectedGovernorate === gov.enumValue ? 'active' : ''}
                  >
                    {gov.displayName}
                  </li>
                ))}
                <li 
                  onClick={() => setSelectedGovernorate(null)}
                  className={!selectedGovernorate ? 'active' : ''}
                >
                  All Governorates
                </li>
              </ul>
            )}
          </div>
        </div>
        <div className="pyramid-gallery">
          {filteredMuseums.length > 0 ? (
            filteredMuseums.map(museum => (
              <MuseumCard 
                key={museum.id} 
                museum={{
                  ...museum,
                  governorate: formatGovernorateName(museum.location),
                  type: museum.type.replace(/_/g, ' ')
                }} 
              />
            ))
          ) : (
            <div className="no-results">
              <p>No museums found in the selected governorate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MuseumsPage;