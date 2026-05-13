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


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route 
          path="/Home" 
          element={
            <PrivateRoute allowedRoles={['def', 'premium', 'admin']}>
              <Home />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/Profile" 
          element={
            <PrivateRoute allowedRoles={['def', 'premium', 'admin']}>
              <Profile />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/recipes" 
          element={
            <PrivateRoute allowedRoles={['premium', 'admin']}>
              <Recipes />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/premium" 
          element={
            <PrivateRoute allowedRoles={['def']}>
              <Premium />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/moder" 
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Moder />
            </PrivateRoute>
          } 
        />
       


        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="*" element={<Navigate to="/Home" replace />} />

        
      </Routes>
    </Router>
  );
}

export default App;