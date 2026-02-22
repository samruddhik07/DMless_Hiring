import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserCheck, ArrowRight } from 'lucide-react';

export default function ApplyPage() {
  const [name, setName] = useState('');
  const { jobId } = useParams();
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    localStorage.setItem('candidateName', name);
    navigate(`/assessment/${jobId}`);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-200 dark:shadow-none border border-slate-100 dark:border-slate-800">
        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mb-8 mx-auto">
          <UserCheck size={40} />
        </div>
        
        <h1 className="text-3xl font-black text-center mb-2 dark:text-white">Candidate Application</h1>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-10">Please enter your name to start the technical assessment.</p>

        <form onSubmit={handleStart} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 ml-1 uppercase tracking-widest">Full Name</label>
            <input 
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-indigo-500 outline-none transition-all"
              placeholder="e.g. John Doe"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95">
            Begin Assessment <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}