import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { PlusCircle, Users, CheckCircle, XCircle, Briefcase, ExternalLink } from 'lucide-react';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [stats, setStats] = useState({ total: 0, shortlisted: 0, knocked: 0 });

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Jobs
      const jobsSnap = await getDocs(collection(db, "jobs"));
      setJobs(jobsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // 2. Fetch Applications for Statistics
      const appsSnap = await getDocs(collection(db, "applications"));
      const appsData = appsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplicants(appsData);

      // 3. Calculate Stats Logic
      setStats({
        total: appsData.length,
        shortlisted: appsData.filter(a => a.status === 'shortlisted').length,
        knocked: appsData.filter(a => a.status === 'knocked').length
      });
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">Recruiter Overview</h1>
        <Link to="/create-job" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transition shadow-indigo-200">
          <PlusCircle size={20} /> Create New Job
        </Link>
      </div>

      {/* Stats Section - Requirement #4: Fetch dashboard statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Candidates</p>
              <h3 className="text-2xl font-bold">{stats.total}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><CheckCircle /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Shortlisted</p>
              <h3 className="text-2xl font-bold text-green-700">{stats.shortlisted}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg"><XCircle /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Knocked Out</p>
              <h3 className="text-2xl font-bold text-red-700">{stats.knocked}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Side: Jobs List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Briefcase className="text-gray-400" /> Active Job Openings
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {jobs.map(job => (
              <div key={job.id} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-indigo-300 transition cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
                    <p className="text-gray-500">{job.company} • {job.location || 'Remote'}</p>
                  </div>
                  <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Live
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Recent Shortlisted Candidates - Showing Resume Links */}
        <div>
          <h2 className="text-xl font-bold mb-6">Shortlisted Links</h2>
          <div className="space-y-4">
            {applicants.filter(a => a.status === 'shortlisted').map(app => (
              <div key={app.id} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="font-bold text-gray-800">{app.candidateName || 'Anonymous Candidate'}</p>
                <a 
                  href={app.resumeUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-indigo-600 text-sm flex items-center gap-1 mt-2 hover:underline"
                >
                  <ExternalLink size={14} /> Open Resume URL
                </a>
              </div>
            ))}
            {stats.shortlisted === 0 && <p className="text-gray-400 text-center py-10">No shortlisted candidates yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}