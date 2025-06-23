import Navbar from './components/Navbar';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoutes from './components/ProtectedRoutes';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
        <Route path='/submit' element={
          <ProtectedRoutes>Submit</ProtectedRoutes>
          } />
      </Routes>
    </Router>


  );
}

export default App;
