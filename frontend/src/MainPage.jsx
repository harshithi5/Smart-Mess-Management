// src/MainPage.jsx
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './assets/logo.svg';
import Food2 from './assets/food2.svg';
import { useAuth } from './context/AuthContext';
import { useVendorAuth } from './context/VendorAuthContext';
import { useAdminAuth } from './context/AdminAuthContext';
import Navbar01 from './Navbar01';

// ── Hero / Welcome ──────────────────────────────────────────────────────────
function Hero({ onLoginClick }) {
  const navigate  = useNavigate();
  const { user, userType }    = useAuth();
  const { vendor } = useVendorAuth();
  const { admin }  = useAdminAuth();

  const handleDashboard = () => {
    if (admin)       { navigate('/admin/dashboard');  return; }
    if (vendor)      { navigate('/vendor/dashboard'); return; }
    if (user)        { navigate('/dashboard');         return; }
    // Not logged in — open login modal
    if (onLoginClick?.current) onLoginClick.current();
  };

  const isLoggedIn = !!(user || vendor || admin);

  return (
    <section id="hero" className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-orange-50 flex items-center pt-18 overflow-hidden relative">

      {/* Decorative blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 w-full flex flex-col md:flex-row items-center gap-12">

        {/* Text */}
        <div className="flex-1 flex flex-col gap-6 z-10">
          <div className="inline-flex items-center gap-2 bg-white border border-indigo-100 rounded-full px-4 py-1.5 w-fit shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-gray-600">IIT Mandi · Smart Mess Management</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
            Welcome to<br />
            <span className="text-[#5352ed]">Mess Diary</span>
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed max-w-md">
            Everything about your mess — in one place. Track menus, rate meals,
            get queue alerts, and manage allocations effortlessly.
          </p>

          <ul className="flex flex-col gap-2">
            {[
              "📋 View today's menu & weekly schedule",
              "⭐ Rate your meals and drive the leaderboard",
              "🔔 Get mess updates and delay alerts",
              "🪑 Apply for mess allocation every month",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 flex-wrap mt-2">
            <button onClick={handleDashboard}
              className="bg-[#ff7f56] hover:bg-orange-500 text-white px-8 py-3.5 rounded-2xl font-bold text-base shadow-lg shadow-orange-100 transition active:scale-95">
              {isLoggedIn ? "Go to Dashboard →" : "Get Started →"}
            </button>
            <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm text-gray-500 font-semibold hover:text-gray-800 transition flex items-center gap-1">
              Learn more ↓
            </button>
          </div>

          <p className="text-xs text-gray-400">
            For issues: <a href="mailto:b23133@students.iitmandi.ac.in" className="text-[#5352ed] hover:underline">b23133@students.iitmandi.ac.in</a>
          </p>
        </div>

        {/* Illustration */}
        <div className="flex-1 flex justify-center items-end relative h-80 md:h-[500px]">
          <img src={Food2} className="h-full object-contain drop-shadow-2xl" alt="food illustration" />
        </div>
      </div>
    </section>
  );
}

// ── About ──────────────────────────────────────────────────────────────────
function About() {
  const TEAM = [
    { name: "Harshit Singh",        role: "Lead Developer",    roll: "B23133" },
    { name: "Kumari Bhumika Meena", role: "UI/UX & Frontend",  roll: "B23144" },
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">

        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5352ed] bg-indigo-50 px-3 py-1 rounded-full">About</span>
          <h2 className="text-4xl font-black text-gray-900 mt-4">Built for IIT Mandi</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Mess Diary is a student-built platform designed to bring transparency,
            efficiency, and convenience to mess management at IIT Mandi.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: "🎓", title: "Student-Built", desc: "Created by students who eat at the mess every day — we know exactly what's needed." },
            { icon: "⚡", title: "Real-Time", desc: "Live seat counts, instant notifications, and real-time menu updates as they happen." },
            { icon: "🔒", title: "Privacy First", desc: "Student complaints are anonymous. Your identity is never shared with vendors." },
          ].map((c) => (
            <div key={c.title} className="bg-gray-50 rounded-3xl p-6 flex flex-col gap-3 hover:shadow-md transition">
              <span className="text-3xl">{c.icon}</span>
              <h3 className="font-black text-gray-800">{c.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Vision ──────────────────────────────────────────────────────────────────
function Vision() {
  return (
    <section id="vision" className="py-24 bg-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500 rounded-full blur-3xl opacity-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-900/50 px-3 py-1 rounded-full">Vision</span>
          <h2 className="text-4xl font-black mt-4">Where We're Headed</h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto">
            Our goal is to make campus dining smarter, fairer, and more sustainable
            through technology and student feedback.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: "🤖", title: "AI-Powered Menus",     desc: "Automatically suggest weekly menus based on nutrition balance, student ratings, and wastage data." },
            { icon: "📊", title: "Zero Wastage Target",   desc: "Use real-time data to predict demand and reduce food wastage to near-zero across all messes." },
            { icon: "🌍", title: "Campus-Wide Rollout",   desc: "Expand beyond Alder to serve all 6 messes and eventually other IITs and NITs." },
            { icon: "📱", title: "Native Mobile App",      desc: "A full iOS and Android app with push notifications, QR scan entry, and offline support." },
            { icon: "🏆", title: "Mess Leaderboard",       desc: "Monthly rankings based on student satisfaction, hygiene scores, and wastage — making quality competitive." },
            { icon: "🔗", title: "Institute Integration",  desc: "Direct integration with IIT Mandi's ERP for seamless mess fee management and allocation." },
          ].map((v) => (
            <div key={v.title} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex gap-4 hover:bg-white/10 transition">
              <span className="text-3xl shrink-0">{v.icon}</span>
              <div>
                <h3 className="font-black text-white mb-1">{v.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-indigo-50 to-orange-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5352ed] bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">Contact</span>
          <h2 className="text-4xl font-black text-gray-900 mt-4">Get in Touch</h2>
          <p className="text-gray-500 mt-3">
            Found a bug? Have a suggestion? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {[
            { icon: "📧", label: "Developer Email",  value: "b23133@students.iitmandi.ac.in", href: "mailto:b23133@students.iitmandi.ac.in" },
            { icon: "🏫", label: "Institution",      value: "IIT Mandi, Himachal Pradesh",    href: "https://iitmandi.ac.in" },
            { icon: "💻", label: "GitHub",           value: "github.com/harshithi5/Smart-Mess-Management", href: "https://github.com/harshithi5/Smart-Mess-Management" },
            { icon: "🐛", label: "Report a Bug",     value: "Open a GitHub issue",            href: "https://github.com/harshithi5/Smart-Mess-Management/issues" },
          ].map((c) => (
            <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-2xl p-5 flex items-center gap-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition group">
              <span className="text-2xl">{c.icon}</span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{c.label}</p>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-[#5352ed] transition truncate">{c.value}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center border-t border-gray-200 pt-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src={Logo} className="h-7" alt="logo" />
            <span className="font-black text-gray-800">Mess Diary</span>
          </div>
          <p className="text-xs text-gray-400">
            Built with ❤️ by students of IIT Mandi · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
function MainPage() {
  const loginRef = useRef(null);

  return (
    <div className="font-sans">
      <Navbar01 onLoginClick={loginRef} />
      <Hero      onLoginClick={loginRef} />
      <About />
      <Vision />
      <Contact />
    </div>
  );
}

export default MainPage;