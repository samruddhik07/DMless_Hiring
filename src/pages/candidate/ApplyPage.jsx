import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ApplyPage() {
  const [name, setName] = useState('');
  const { jobId } = useParams();
  const navigate = useNavigate();

  const startTest = (e) => {
    e.preventDefault();
    // Save name to localStorage so the MCQ page can use it
    localStorage.setItem('candidateName', name);
    navigate(`/assessment/${jobId}`);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border dark:border-slate-700 text-center">
        <h1 className="text-2xl font-bold mb-2 dark:text-white">Welcome to dmless</h1>
        <p className="text-gray-500 mb-8 italic text-sm">You are applying for a position. Please enter your full name to begin the assessment.</p>
        
        <form onSubmit={startTest}>
          <input 
            placeholder="Your Full Name" 
            className="w-full p-4 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-white border-none outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 transition">
            Start Technical Test
          </button>
        </form>
      </div>
    </div>
  );
}