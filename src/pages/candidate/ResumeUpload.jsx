import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Link as LinkIcon, Send, ArrowLeft } from 'lucide-react';

export default function ResumeUpload() {
  const [resumeLink, setResumeLink] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic URL validation
    if (!resumeLink.startsWith("http")) {
      alert("Please enter a valid URL (starting with http:// or https://)");
      return;
    }

    setLoading(true);
    try {
      // 1. Retrieve Candidate info from localStorage (saved in ApplyPage/MCQPage)
      const name = localStorage.getItem('candidateName') || "Anonymous Candidate";
      const email = localStorage.getItem('candidateEmail') || "Not Provided";
      const jobTitle = localStorage.getItem('tempAppJobTitle') || "General Opening";

      // 2. Save the final "Shortlisted" application to Firestore
      await addDoc(collection(db, "applications"), {
        candidateName: name,
        candidateEmail: email,
        jobTitle: jobTitle,
        status: "shortlisted",
        resumeUrl: resumeLink,
        timestamp: new Date()
      });

      // 3. Clear localStorage to prevent duplicate submissions
      localStorage.removeItem('candidateName');
      localStorage.removeItem('candidateEmail');
      localStorage.removeItem('tempAppJobTitle');

      alert("Success! Your application has been submitted to the recruiter.");
      navigate('/auth');
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Error saving application: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 text-center transition-all">
        
        {/* Success Header */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-3xl flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle size={48} />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-full border-4 border-white dark:border-slate-900">
             <LinkIcon size={16} />
          </div>
        </div>

        <h2 className="text-3xl font-black mb-2 dark:text-white">Assessment Passed!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-10 text-sm leading-relaxed">
          Excellent work. You have met our technical criteria. Please share your <b>Resume Link</b> (Google Drive, Dropbox, or LinkedIn) to finish the process.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <input 
              type="url" 
              placeholder="Paste your Resume URL here" 
              className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
              required
              onChange={(e) => setResumeLink(e.target.value)}
            />
            <LinkIcon className="absolute left-4 top-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-indigo-100 dark:shadow-none disabled:bg-slate-300 dark:disabled:bg-slate-700"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>Complete Application <Send size={18} /></>
            )}
          </button>
        </form>

        <button 
          onClick={() => navigate('/auth')}
          className="mt-8 text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={14} /> Exit Assessment
        </button>