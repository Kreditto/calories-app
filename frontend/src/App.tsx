import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Recipes from './pages/Premium/Recipes';
import Login from './pages/Login';
import Register from './pages/Register';
import Premium from './pages/Premium';
import Moder from './pages/Admin/ModerFood'; 
import PrivateRoute from './components/PerevirkaAuth';
import AdminProfile from './pages/Admin/AdminProfile';
import Navbar from './components/Navbar';
import AdminNavbar from './components/Admin/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div id="root" className="d-flex flex-column min-vh-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route 
            path="/moder" 
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <>
                  <AdminNavbar />
                  <Moder />
                  <Footer />
                </>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/AdminProfile" 
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <>
                  <AdminNavbar />
                  <AdminProfile />
                  <Footer />
                </>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/Home" 
            element={
              <PrivateRoute allowedRoles={['def', 'premium', 'admin']}>
                <>
                  <Navbar />
                  <Home />
                  <Footer />
                </>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/Profile" 
            element={
              <PrivateRoute allowedRoles={['def', 'premium', 'admin']}>
                <>
                  <Navbar />
                  <Profile />
                  <Footer />
                </>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/recipes" 
            element={
              <PrivateRoute allowedRoles={['premium', 'admin']}>
                <>
                  <Navbar />
                  <Recipes />
                  <Footer />
                </>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/premium" 
            element={
              <PrivateRoute allowedRoles={['def']}>
                <>
                  <Navbar />
                  <Premium />
                  <Footer />
                </>
              </PrivateRoute>
            } 
          />

          <Route path="/" element={<Navigate to="/Home" replace />} />
          <Route path="*" element={<Navigate to="/Home" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
