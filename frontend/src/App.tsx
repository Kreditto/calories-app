import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Recipes from './pages/Recipes';
import Login from './pages/Login';
import Register from './pages/Register';
import Premium from './pages/Premium'; 
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
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/Profile" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/recipes" 
          element={
            <PrivateRoute>
              <Recipes />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/premium" 
          element={
            <PrivateRoute>
              <Premium />
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