import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Left from './Leftbar';
import Home from './Home';

function Dashboard() {
  return ( 
    <div className="flex">
      <div className="h-screen w-48 lg:w-80">
        <Left />
      </div>

      <div className="h-screen flex-1 bg-zinc-200">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
