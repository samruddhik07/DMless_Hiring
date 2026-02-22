import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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

  // SENIOR FIX: Apply dark mode to the HTML tag and the Body tag
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold tracking-widest animate-pulse">DMLESS</p>
      </div>
    );
  }

  return (
    <HashRouter> {/* Change this to HashRouter */}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
        
        {user && <Navbar user={user} setDarkMode={setDarkMode} darkMode={darkMode} />}
        
        <div className={`${user ? 'max-w-7xl mx-auto p-4 md:p-8' : 'w-full'}`}>
  
          <Routes>
            {/* Public Candidate Routes */}
            <Route path="/apply/:jobId" element={<ApplyPage />} />
            <Route path="/assessment/:jobId" element={<MCQPage />} />
            <Route path="/upload" element={<ResumeUpload />} />

            {/* Auth Route */}
            <Route 
              path="/auth" 
              element={!user ? <AuthPage /> : <Navigate to="/dashboard" />} 
            />

            {/* Protected Recruiter Routes */}
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/create-job" 
              element={user ? <CreateJob /> : <Navigate to="/auth" />} 
            />

            {/* Default Redirection */}
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/auth"} />} />
            
            {/* Catch-all for 404 - Redirects to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        {/* Floating Theme Toggle for candidates (when no navbar is present) */}
        {!user && (
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="fixed bottom-6 right-6 p-4 rounded-full bg-white dark:bg-slate-800 shadow-2xl border dark:border-slate-700 text-slate-600 dark:text-yellow-400 z-50 hover:scale-110 transition-transform"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        )}
      </div>
    </HashRouter>
  );
}