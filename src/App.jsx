import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

// Pages
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/recruiter/Dashboard';
import CreateJob from './pages/recruiter/CreateJob';
import MCQPage from './pages/candidate/MCQPage';
import ApplyPage from './pages/candidate/ApplyPage';
import ResumeUpload from './pages/candidate/ResumeUpload';
import Navbar from './components/Navbar';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Fix Dark Mode globally
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center dark:bg-slate-900 dark:text-white">Loading dmless...</div>;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        {user && <Navbar user={user} setDarkMode={setDarkMode} darkMode={darkMode} />}
        
        <Routes>
          {/* Public Routes - Anyone can access */}
          <Route path="/apply/:jobId" element={<ApplyPage />} />
          <Route path="/assessment/:jobId" element={<MCQPage />} />
          <Route path="/upload" element={<ResumeUpload />} />
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/dashboard" />} />

          {/* Protected Recruiter Routes */}
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
          <Route path="/create-job" element={user ? <CreateJob /> : <Navigate to="/auth" />} />

          {/* Default */}
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/auth"} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}