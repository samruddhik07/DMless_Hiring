import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, Users, CheckCircle, XCircle, 
  Briefcase, ExternalLink, Copy, Check 
} from 'lucide-react';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [stats, setStats] = useState({ total: 0, shortlisted: 0, knocked: 0 });
  const [copiedId, setCopiedId] = useState(null); // Feedback for copy button

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Jobs
        const jobsSnap = await getDocs(collection(db, "jobs"));
        setJobs(jobsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // 2. Fetch Applications
        const appsSnap = await getDocs(collection(db, "applications"));
        const appsData = appsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setApplicants(appsData);

        // 3. Stats Calculation
        setStats({
          total: appsData.length,
          shortlisted: appsData.filter(a => a.status === 'shortlisted').length,
          knocked: appsData.filter(a => a.status === 'knocked').length
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();
  }, []);

  const copyTestLink = (jobId) => {
    const url = `${window.location.origin}/apply/${jobId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(jobId);
    setTimeout(() => setCopiedId(null), 2000); // Reset icon after 2s
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen transition-colors">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Recruiter Overview</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your active openings and candidate flow.</p>
        </div>
        <Link 
          to="/create-job" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
        >
          <PlusCircle size={20} /> Create New Job
        </Link>
      </div>

      {/* --- STATS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-transform hover:scale-[1.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl"><Users /></div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Total Candidates</p>
              <h3 className="text-3xl font-bold dark:text-white">{stats.total}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-green-100 dark:border-green-900/30 transition-transform hover:scale-[1.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl"><CheckCircle /></div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Shortlisted</p>
              <h3 className="text-3xl font-bold text-green-700 dark:text-green-500">{stats.shortlisted}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 transition-transform hover:scale-[1.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl"><XCircle /></div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Knocked Out</p>
              <h3 className="text-3xl font-bold text-red-700 dark:text-red-500">{stats.knocked}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT: JOB LISTINGS */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
            <Briefcase className="text-indigo-500" /> Active Job Openings
          </h2>
          <div className="grid grid-cols-1 gap-5">
            {jobs.map(job => (
              <div key={job.id} className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{job.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{job.company}</p>
                  </div>
                  <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">
                    LIVE
                  </span>
                </div>
                
                {/* Copy Link UI */}
                <div className="flex items-center justify-between pt-4 border-t dark:border-slate-700">
                  <p className="text-xs text-gray-400 italic">Send this unique link to candidates</p>
                  <button 
                    onClick={() => copyTestLink(job.id)}
                    className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-4 py-2 rounded-lg transition-colors"
                  >
                    {copiedId === job.id ? <Check size={16} /> : <Copy size={16} />}
                    {copiedId === job.id ? "Link Copied!" : "Copy Test Link"}
                  </button>
                </div>
              </div>
            ))}
            {jobs.length === 0 && <p className="text-gray-400 text-center py-10 italic">No jobs created yet.</p>}
          </div>
        </div>

        {/* RIGHT: SHORTLISTED CANDIDATES */}
        <div>
          <h2 className="text-xl font-bold mb-6 dark:text-white">Candidate Pipeline</h2>
          <div className="space-y-4">
            {applicants.filter(a => a.status === 'shortlisted').map(app => (
              <div key={app.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white">{app.candidateName || 'Unnamed Candidate'}</p>
                    <p className="text-xs text-gray-400 uppercase font-bold mt-1 tracking-tighter">Verified Link Available</p>
                  </div>
                  <a 
                    href={app.resumeUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:scale-110 transition-transform"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            ))}
            {stats.shortlisted === 0 && (
              <div className="p-10 text-center border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl">
                 <p className="text-gray-400 italic">Awaiting technical passes...</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}