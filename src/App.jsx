import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

// Imports
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/recruiter/Dashboard';
import CreateJob from './pages/recruiter/CreateJob';
import ApplyPage from './pages/candidate/ApplyPage';
import MCQPage from './pages/candidate/MCQPage';
import ResumeUpload from './pages/candidate/ResumeUpload';
import Navbar from './components/Navbar';

export default function App() {
    const [user, setUser] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
        // Global Dark Mode
        if (darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [darkMode]);

    if (loading) return null;

    return (
        <Router>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
                {user && <Navbar user={user} setDarkMode={setDarkMode} darkMode={darkMode} />}
                
                <Routes>
                    {/* Public Candidate Flow */}
                    <Route path="/apply/:jobId" element={<ApplyPage />} />
                    <Route path="/assessment/:jobId" element={<MCQPage />} />
                    <Route path="/upload" element={<ResumeUpload />} />
                    
                    {/* Recruiter Flow */}
                    <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
                    <Route path="/create-job" element={user ? <CreateJob /> : <Navigate to="/auth" />} />
                    
                    <Route path="/" element={<Navigate to={user ? "/dashboard" : "/auth"} />} />
                </Routes>

                {!user && (
                    <button onClick={() => setDarkMode(!darkMode)} className="fixed bottom-6 right-6 p-4 bg-white dark:bg-slate-800 rounded-full shadow-xl">
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                )}
            </div>
        </Router>
    );
}