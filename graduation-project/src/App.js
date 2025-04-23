import React , {useState , useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import HomePage from './pages/Home-page';
import Start from './pages/Start';
import {BrowserRouter as Router , Routes , Route, useLocation } from 'react-router-dom';
import SignIn from './pages/Signin';
import SignUp from './pages/Signup';
import './styles/App.css';
import AllApprovedPosts from './pages/testsignin';
import Test from './pages/testsignin';
import DataList from './pages/testsignin';
import UserTable from './pages//Admin/UserTable';
import MuseumsPage from './pages/MuseumsPage';
import MuseumDetailPage from './pages/MuseumDetailPage';
import Dashboard from'./pages/Admin/Dashboard';
import AdminMuseums from'./pages/Admin/AdminMuseums';
import Feed from'./pages/feed';
import Card from './pages/err';
import ScrollToTop from './components/ScrollTop';
import Monuments from './pages/Admin/Monuments';
import Stories from './pages/Admin/Stories';
import GameSelection from './pages/GameSelection';
import ApprovePosts from './pages/Admin/ApprovePosts';




function App() {
  const [user, setUser] = useState(null);
  return (
    <div>
      <Router>
      <ScrollToTop />
        <Routes>
          <Route path='/' element={<HomePage /> }/>
          <Route path='/start' element={<Start /> }/>
          <Route path='/signin' element={<Start setUser={setUser}/> }/>
          <Route path='/signup' element={<Start /> }/>
          <Route path='/museums' element={< MuseumsPage /> }/>
          <Route path="/museum/:id" element={<MuseumDetailPage />} />
          <Route path='/feed' element={< Feed /> }/>
          <Route path='*' element={< Card/>}/>
          {/* <Route path= '/test' element={<Test />} /> */}
          <Route path= '/test' element={<AllApprovedPosts />} />
          <Route path= '/dashboard' element={<Dashboard />} />
          <Route path= '/adminmuseums' element={<AdminMuseums />} />
          <Route path= '/users' element={<UserTable />} />
          <Route path="/monuments" element={<Monuments />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/games" element={<GameSelection/>} />
          <Route path= '/approvals' element={<ApprovePosts />} />
        
        </Routes>
      </Router>
    </div>
  );
}

export default App;



