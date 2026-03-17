// src/User/Dashboard.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Left from './Leftbar';
import Home from './Home';
import QRPage from './QRPage';
import MessForm from './MessForm';
import Notification from './Notification';
import Profile from './Profile';

const Complaint = () => <div className="p-6 text-xl">Complaint Page</div>;

function Dashboard() {
  return (
    <div className="flex">
      <div className="h-screen w-48 lg:w-80">
        <Left />
      </div>

      <div className="h-screen flex-1 bg-blue-200 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/qr" element={<QRPage />} />
          <Route path="/mess-form" element={<MessForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/complaint" element={<Complaint />} />
          <Route path="/notification" element={<Notification />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;