import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage.jsx';

function App() {

  return (
    <Routes>
      <Route path="/" element={<MainPage/>} />
    </Routes>
  );
}

export default App;
