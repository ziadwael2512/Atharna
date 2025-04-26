import {React , useState} from 'react';
import { Link , useNavigate} from 'react-router-dom'; 
import '../../styles/User.css';
import UserTable from './UserTable';
import Sidebar from '../../components/Sidebar'


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
           <Sidebar />

      <div className="main-content">
        <UserTable />
      </div>
    </div>
  );
};

export default Dashboard