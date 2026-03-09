// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import Dashboard from './User/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
