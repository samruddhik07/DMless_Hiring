import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Pages
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/recruiter/Dashboard';
import CreateJob from './pages/recruiter/CreateJob';
import MCQPage from './pages/candidate/MCQPage';
import ResumeUpload from './pages/candidate/ResumeUpload';

// Components
import Navbar from './components/Navbar';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading dmless...</div>;

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
        <BrowserRouter>
          {user && <Navbar user={user} setDarkMode={setDarkMode} darkMode={darkMode} />}
          
          <Routes>
            {/* If NOT logged in, only show Auth Page */}
            {!user ? (
              <>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<Navigate to="/auth" />} />
              </>
            ) : (
              /* If logged in, show all features */
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-job" element={<CreateJob />} />
                <Route path="/assessment" element={<MCQPage />} />
                <Route path="/upload" element={<ResumeUpload />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}                                         