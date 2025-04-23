import {React , useState} from 'react';
import { Link , useNavigate} from 'react-router-dom'; 
import '../../styles/User.css';
import UserTable from './UserTable';


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };
  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <Link to="/users">Users </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/monuments">Monuments</Link>
          </li>
          <li className="sidebar-item">
            <Link to="/approvals">Approvals</Link>
          </li>
          <li className="sidebar-item">
            <Link to="/stories">Stories</Link>
          </li>
          <li className="sidebar-item">
            <Link to="/adminmuseums">Museums</Link>
          </li>
          <li className="sidebar-item">
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>

      <div className="main-content">
        <UserTable />
      </div>
    </div>
  );
};

export default Dashboard