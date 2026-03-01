import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import Dashboard from './User/Dashboard';
import QRPage from "./User/QRPage";

function App() {

  return (
    <Routes>
      <Route path="/" element={<MainPage/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/my-qr" element={<QRPage />} />
    </Routes>
  );
}

export default App;
