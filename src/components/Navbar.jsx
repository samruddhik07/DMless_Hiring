import React from 'react';
import { auth } from '../firebase/config';
import { Moon, Sun, LogOut, Briefcase, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, setDarkMode, darkMode }) {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
             <Briefcase className="text-white" size={20} />
          </div>
          <span className="font-black text-2xl tracking-tighter dark:text-white">dmless</span>
        </Link>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:ring-2 ring-indigo-500 transition-all"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>

          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Recruiter</span>
            <span className="text-sm font-medium dark:text-slate-200">{user.email.split('@')[0]}</span>
          </div>

          <button 
            onClick={() => auth.signOut()}
            className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}