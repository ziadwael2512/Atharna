import React, { useState, useEffect } from 'react';
import '../../styles/AdminMuseums.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminMuseums = () => {
  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [editingInfoId, setEditingInfoId] = useState(null);
  const [priceInput, setPriceInput] = useState('');
  const [infoInput, setInfoInput] = useState({
    name: '',
    governorate: '',
    details: ''
  });
  const navigate = useNavigate();

  const MUSEUMS_API_URL = 'http://localhost:5000/museum/all';
  
  useEffect(() => {
    fetchMuseums();
  }, []);

  const fetchMuseums = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(MUSEUMS_API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const validatedData = response.data.map(museum => ({
        id: museum.id || '',
        name: museum.name || '',
        governorate: museum.location || '',
        details: museum.info || '',
        ticketPrice: museum.ticketPrice || 0
      }));

      setData(validatedData);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        setError('Session expired. Please log in again.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch museums data');
      }
    } finally {
      setLoading(false);
    }
  };

  const startPriceEditing = (museum) => {
    setEditingPriceId(museum.id);
    setPriceInput(museum.ticketPrice.toString());
  };

  const startInfoEditing = (museum) => {
    setEditingInfoId(museum.id);
    setInfoInput({
      name: museum.name,
      governorate: museum.governorate,
      details: museum.details
    });
  };

  const handlePriceChange = (e) => {
    setPriceInput(e.target.value);
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInfoInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const savePriceUpdate = async (museumId) => {
    if (!priceInput || isNaN(priceInput)) {
      setError('Please enter a valid price');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/museum/updateTicketPrice/${museumId}`,
        { ticketPrice: Number(priceInput) },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setEditingPriceId(null);
      fetchMuseums();
    } catch (err) {
      console.error('Price update error:', err);
      setError(err.response?.data?.message || 'Failed to update ticket price');
    }
  };

  const saveInfoUpdate = async (museumId) => {
    if (!infoInput.name || !infoInput.governorate || !infoInput.details) {
      setError('Please fill all fields');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/museum/updateMuseumInfo/${museumId}`,
        {
          name: infoInput.name,
          location: infoInput.governorate,
          info: infoInput.details
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setEditingInfoId(null);
      fetchMuseums();
    } catch (err) {
      console.error('Info update error:', err);
      setError(err.response?.data?.message || 'Failed to update museum info');
    }
  };

  const cancelEditing = () => {
    setEditingPriceId(null);
    setEditingInfoId(null);
  };

  const handleDelete = async (museumId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/museum/deleteMuseumById/${museumId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      fetchMuseums();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Failed to delete museum');
    }
  };

  const handleSortByGovernorate = () => {
    const sortedData = [...data].sort((a, b) => {
      const govA = a.governorate || '';
      const govB = b.governorate || '';
      return sortOrder === 'asc' 
        ? govA.localeCompare(govB) 
        : govB.localeCompare(govA);
    });
    setData(sortedData);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return <div className="admin-museums-container">Loading museums data...</div>;
  }

  if (error) {
    return (
      <div className="admin-museums-container">
        <h1>Admin Museums</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-museums-container">
      <h1>Admin Museums</h1>
      {data.length > 0 ? (
        <table className="admin-museums-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th onClick={handleSortByGovernorate} style={{ cursor: 'pointer' }}>
                Governorate {sortOrder === 'asc' ? '▲' : '▼'}
              </th>
              <th>Details</th>
              <th>Price (EGP)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((museum) => (
              <tr key={museum.id} className="admin-museums-row">
                <td>{museum.id}</td>
                
                <td>
                  {editingInfoId === museum.id ? (
                    <input
                      type="text"
                      name="name"
                      value={infoInput.name}
                      onChange={handleInfoChange}
                      className="edit-input"
                    />
                  ) : (
                    museum.name
                  )}
                </td>
                
                <td>
                  {editingInfoId === museum.id ? (
                    <input
                      type="text"
                      name="governorate"
                      value={infoInput.governorate}
                      onChange={handleInfoChange}
                      className="edit-input"
                    />
                  ) : (
                    museum.governorate
                  )}
                </td>
                
                <td>
                  {editingInfoId === museum.id ? (
                    <textarea
                      name="details"
                      value={infoInput.details}
                      onChange={handleInfoChange}
                      className="edit-textarea"
                    />
                  ) : (
                    museum.details
                  )}
                </td>
                
                <td>
                  {editingPriceId === museum.id ? (
                    <div className="price-edit-container">
                      <input
                        type="number"
                        value={priceInput}
                        onChange={handlePriceChange}
                        className="price-input"
                        min="0"
                        step="1"
                      />
                      <button 
                        onClick={() => savePriceUpdate(museum.id)}
                        className="btn-save-small"
                      >
                        ✓
                      </button>
                      <button 
                        onClick={cancelEditing}
                        className="btn-cancel-small"
                      >
                        ✗
                      </button>
                    </div>
                  ) : (
                    museum.ticketPrice.toLocaleString() + ' EGP'
                  )}
                </td>
                
                <td className="action-buttons">
                  {editingInfoId === museum.id ? (
                    <>
                      <button 
                        className="btn-save"
                        onClick={() => saveInfoUpdate(museum.id)}
                      >
                        Save
                      </button>
                      <button 
                        className="btn-cancel"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="btn-update-info"
                        onClick={() => startInfoEditing(museum)}
                      >
                        Update Info
                      </button>
                      <button 
                        className="btn-update-price"
                        onClick={() => startPriceEditing(museum)}
                      >
                        Update Price
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(museum.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-data-message">No museums data available</div>
      )}
    </div>
  );
};

export default AdminMuseums;