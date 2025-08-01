import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoutes from './components/ProtectedRoutes';
import Profile from './pages/Profile';
import Problems from './pages/Problems';
import CreateProblem from './pages/CreateProblem';
import UpdateProblem from './pages/UpdateProblem';
import ProblemPage from './pages/ProblemPage';
import UserPublicProfile from './pages/UserPublicProfile';
import FriendsPage from './pages/FriendsPage';
import Solutions from './pages/Solutions';
import Description from './components/Description';
import SubmissionList from './pages/SubmissionList';
import SubmissionDetails from './pages/SubmissionDetails';
import EditProfile from './pages/EditProfile';
import MySubmissions from './pages/MySubmissions';
import About from './pages/About';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/about" element={<About/>} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
        <Route path='/profile' element={
          <ProtectedRoutes><Profile /></ProtectedRoutes>
        } />
        <Route path='/create-problem' element={
          <ProtectedRoutes><CreateProblem /></ProtectedRoutes>
        } />
        <Route path='/edit-problem/:id' element={
          <ProtectedRoutes><UpdateProblem /></ProtectedRoutes>
        } />

        <Route path="/profile/:userId" element={<UserPublicProfile />} />
        <Route path="/friends" element={<FriendsPage />} />

        <Route path="/problems/:id" element={<ProblemPage />}>
          <Route index element={<Description />} />
          <Route path="solutions" element={<Solutions />} />
          <Route path="submissions" element={<ProtectedRoutes><SubmissionList /></ProtectedRoutes>} />
          <Route path=":submissionId" element={<ProtectedRoutes><SubmissionDetails /></ProtectedRoutes>} />
        </Route>

        <Route path="/edit-profile" element={<ProtectedRoutes><EditProfile /></ProtectedRoutes>} />
        <Route path="/my-submissions" element={<MySubmissions />} />
        
      </Routes>
    </Router>


  );
}

export default App;
