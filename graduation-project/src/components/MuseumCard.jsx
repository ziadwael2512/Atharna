import { useNavigate } from 'react-router-dom';
import '../styles/MuseumsPage.css';

function MuseumCard({ museum }) {
  const navigate = useNavigate();

  return (
    <div 
      className="sphinx-card"
      onClick={() => navigate(`/museum/${museum.id}`)}
    >
      <div className="obverse-side">
       
        <div className="museum-info">
          <h3>{museum.name}</h3>
          <div className="museum-meta">
            <span className="museum-type">{museum.type}</span>
            <span className="museum-location">{museum.governorate}</span>
          </div>
        </div>
      </div>
      
      <div className="reverse-side">
        <p className="museum-description">
          {museum.details || museum.info || 'No description available'}
        </p>
        <div className="museum-footer">
          <span className="museum-price">
            ${museum.ticketPrice?.toFixed(2) || '0.00'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MuseumCard;