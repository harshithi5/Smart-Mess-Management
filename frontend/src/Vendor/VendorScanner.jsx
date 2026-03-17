// src/Vendor/VendorScanner.jsx
import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useVendorAuth } from "../context/VendorAuthContext";
import { checkInDiner, cleanExpiredDiners, subscribeToDinerCount } from "../services/dinerService";
import { MESSES } from "../services/messService";

function VendorScanner() {
  const { vendorMess } = useVendorAuth();
  const [scannedUser, setScannedUser] = useState(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [dinerCount, setDinerCount] = useState(0);
  const html5QrRef = useRef(null);

  const messId = vendorMess?.messId;
  const messCapacity = MESSES.find(m => m.id === messId)?.capacity ?? 100;

  // Clean expired + subscribe to live count
  useEffect(() => {
    if (!messId || messId === "admin") return;
    cleanExpiredDiners(messId);
    const unsub = subscribeToDinerCount(messId, setDinerCount);
    return () => unsub();
  }, [messId]);

  const startScanner = async () => {
    setError(null);
    setScannedUser(null);
    setCheckedIn(false);
    const html5Qr = new Html5Qrcode("qr-reader");
    html5QrRef.current = html5Qr;
    try {
      await html5Qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            if (data.uid && data.name && data.email) {
              setScannedUser(data);
              await stopScanner();
            } else {
              setError("Not a valid Mess Diary QR code.");
            }
          } catch {
            setError("Invalid QR code.");
          }
        },
        () => {}
      );
      setScanning(true);
    } catch {
      setError("Camera access denied or unavailable.");
    }
  };

  const stopScanner = async () => {
    if (html5QrRef.current) {
      try {
        await html5QrRef.current.stop();
        html5QrRef.current.clear();
      } catch {}
    }
    setScanning(false);
  };

  const handleCheckIn = async () => {
    if (!scannedUser || !messId) return;
    setCheckingIn(true);
    setError(null);
    try {
      await checkInDiner(messId, scannedUser.uid, scannedUser.name);
      setCheckedIn(true);
    } catch (e) {
      setError("Check-in failed: " + e.message);
    }
    setCheckingIn(false);
  };

  const handleScanNext = () => {
    setScannedUser(null);
    setCheckedIn(false);
    setError(null);
    startScanner();
  };

  useEffect(() => {
    return () => { stopScanner(); };
  }, []);

  const percent = Math.round((dinerCount / messCapacity) * 100);

  return (
    <div className="p-6 flex flex-col gap-6 max-w-lg mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Vendor Scanner</h1>
        <p className="text-gray-500 text-sm mt-1">
          {vendorMess?.messName} · Scan student QR to check in
        </p>
      </div>

      {/* Live diner count */}
      <div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Current Diners</span>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>
        <div className="text-4xl font-bold text-[#5352ed]">
          {dinerCount}
          <span className="text-gray-400 text-xl font-normal"> / {messCapacity}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-700 ${
              percent >= 90 ? "bg-red-500" :
              percent >= 60 ? "bg-orange-400" : "bg-green-400"
            }`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">{percent}% capacity</p>
      </div>

      {/* Scanner box */}
      <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center gap-4">
        <div id="qr-reader" className="w-full rounded-xl overflow-hidden" />

        {!scanning && !scannedUser && (
          <button
            onClick={startScanner}
            className="bg-[#5352ed] text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-600 transition w-full"
          >
            Start Scanning
          </button>
        )}

        {scanning && (
          <button
            onClick={stopScanner}
            className="border border-gray-300 text-gray-600 px-6 py-2 rounded-xl hover:bg-gray-50 transition w-full"
          >
            Stop
          </button>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 w-full text-center">
            {error}
          </div>
        )}

        {/* Scanned result */}
        {scannedUser && !checkedIn && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 w-full flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-blue-700 font-semibold text-sm">Student Verified</span>
            </div>
            <p className="text-gray-800 font-semibold text-lg">{scannedUser.name}</p>
            <p className="text-gray-500 text-sm">{scannedUser.email}</p>

            <button
              onClick={handleCheckIn}
              disabled={checkingIn}
              className="mt-1 bg-green-500 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-600 transition disabled:opacity-50 w-full"
            >
              {checkingIn ? "Checking in..." : "✓ Confirm Check In"}
            </button>

            <button
              onClick={handleScanNext}
              className="text-gray-400 text-sm text-center hover:text-gray-600"
            >
              Cancel & Scan Next
            </button>
          </div>
        )}

        {/* Success */}
        {checkedIn && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 w-full flex flex-col items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-700 font-semibold">{scannedUser?.name} checked in!</p>
            <p className="text-gray-400 text-xs">30 min dining window started</p>
            <button
              onClick={handleScanNext}
              className="bg-[#5352ed] text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-indigo-600 transition w-full"
            >
              Scan Next Student
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VendorScanner;