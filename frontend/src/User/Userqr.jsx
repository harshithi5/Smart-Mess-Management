// src/components/UserQR.jsx
import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../context/AuthContext";

function UserQR() {
  const { user } = useAuth();

  if (!user) return null;

  const qrData = JSON.stringify({
    uid: user.uid,
    name: user.displayName,
    email: user.email,
  });

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-2xl shadow-md w-fit mx-auto mt-10">
      <h2 className="text-xl font-semibold text-gray-700">Your Mess QR Code</h2>

      <QRCodeSVG
        value={qrData}
        size={220}
        bgColor="#ffffff"
        fgColor="#1a1a2e"
        level="H"
        includeMargin={true}
      />

      <div className="text-center">
        <p className="text-gray-800 font-medium">{user.displayName}</p>
        <p className="text-gray-500 text-sm">{user.email}</p>
      </div>

      <p className="text-xs text-gray-400 text-center max-w-xs">
        Show this QR code at the mess counter to verify your identity.
      </p>
    </div>
  );
}

export default UserQR;