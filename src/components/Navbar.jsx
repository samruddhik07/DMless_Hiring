import React from 'react';
import { auth } from '../firebase/config';
import { Moon, Sun, LogOut, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, setDarkMode, darkMode }) {
  return (
    <nav className="p-4 border-b dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-50">
      <Link to="/dashboard" className="flex items-center gap-2 font-bold text-2xl text-indigo-600">
        <Briefcase /> dmless
      </Link>

      <div className="flex items-center gap-6">
        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-yellow-400"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <span className="text-sm hidden md:block text-gray-500">{user.email}</span>

        <button 
          onClick={() => auth.signOut()}
          className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-2 rounded-lg font-medium"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );
}