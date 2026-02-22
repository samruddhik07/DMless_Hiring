import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Users, UserX, UserCheck, Copy, Briefcase } from 'lucide-react';

export default function Dashboard() {
    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState({ total: 0, knocked: 0, shortlisted: 0 });

    useEffect(() => {
        const fetchAll = async () => {
            const jSnap = await getDocs(collection(db, "jobs"));
            setJobs(jSnap.docs.map(d => ({ id: d.id, ...d.data() })));

            const aSnap = await getDocs(collection(db, "applications"));
            const apps = aSnap.docs.map(d => d.data());
            setStats({
                total: apps.length,
                knocked: apps.filter(a => a.status === 'knocked').length,
                shortlisted: apps.filter(a => a.status === 'shortlisted').length
            });
        };
        fetchAll();
    }, []);

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold dark:text-white">Dashboard</h1>
                <Link to="/create-job" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">Post New Job</Link>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700 shadow-sm">
                    <Users className="text-blue-500 mb-2" />
                    <p className="text-gray-500 text-sm">Total Applied</p>
                    <h2 className="text-2xl font-bold dark:text-white">{stats.total}</h2>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700 shadow-sm">
                    <UserX className="text-red-500 mb-2" />
                    <p className="text-gray-500 text-sm">Knocked Out</p>
                    <h2 className="text-2xl font-bold dark:text-white">{stats.knocked}</h2>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700 shadow-sm">
                    <UserCheck className="text-green-500 mb-2" />
                    <p className="text-gray-500 text-sm">Shortlisted</p>
                    <h2 className="text-2xl font-bold dark:text-white">{stats.shortlisted}</h2>
                </div>
            </div>

            {/* JOB LIST */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                    <Briefcase size={20}/> Active Hiring Links
                </h2>
                {jobs.map(job => (
                    <div key={job.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border dark:border-slate-700 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg dark:text-white">{job.title}</h3>
                            <p className="text-gray-400 text-sm">{job.company}</p>
                        </div>
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/#/apply/${job.id}`);
                                alert("Link Copied!");
                            }}
                            className="flex items-center gap-2 text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg"
                        >
                            <Copy size={16} /> Copy Candidate Link
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}