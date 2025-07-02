import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoutes from './components/ProtectedRoutes';
import Submit from './pages/Submit';
import Profile from './pages/Profile';
import Problems from './pages/Problems';
import CreateProblem from './pages/CreateProblem';
import UpdateProblem from './pages/UpdateProblem';
import ProblemPage from './pages/ProblemPage';
import UserPublicProfile from './pages/UserPublicProfile';
import FriendsPage from './pages/FriendsPage';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
        <Route path='/submit' element={
          <ProtectedRoutes><Submit /></ProtectedRoutes>
        } />
        <Route path='/profile' element={
          <ProtectedRoutes><Profile /></ProtectedRoutes>
        } />
        <Route path='/create-problem' element={
          <ProtectedRoutes><CreateProblem /></ProtectedRoutes>
        } />
        <Route path='/edit-problem/:id' element={
          <ProtectedRoutes><UpdateProblem /></ProtectedRoutes>
        } />
        <Route path='/problems/:id' element={<ProblemPage/>}/>

        <Route path="/profile/:userId" element={<UserPublicProfile />} />
        <Route path="/friends" element={<FriendsPage />} />

      </Routes>
    </Router>


  );
}

export default App;
