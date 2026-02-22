import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';

export default function MCQPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [questions, setQuestions] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load Job and Questions from Firestore
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const jobDoc = await getDoc(doc(db, "jobs", jobId));
        if (jobDoc.exists()) {
          setJobDetails(jobDoc.data());
          setQuestions(jobDoc.data().questions || []);
        }
      } catch (err) {
        console.error("Error fetching assessment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobData();
  }, [jobId]);

  const handleAnswer = async (selectedIdx) => {
    const candidateName = localStorage.getItem('candidateName') || "Anonymous Candidate";
    const candidateEmail = localStorage.getItem('candidateEmail') || "No Email Provided";

    // 1. KNOCKOUT LOGIC: If answer is incorrect
    if (selectedIdx !== questions[current].a) {
      await addDoc(collection(db, "applications"), {
        candidateName,
        candidateEmail,
        jobId,
        jobTitle: jobDetails?.title || "Unknown Job",
        status: "knocked",
        lastQuestionIndex: current,
        timestamp: new Date()
      });
      
      alert("Selection Criteria Not Met: You have been knocked out of the selection process.");
      navigate('/auth'); // Redirect to home/login
      return;
    }

    // 2. PROGRESS LOGIC: If correct, move to next or finish
    if (current === questions.length - 1) {
      // Candidate passed ALL questions - Save temporary record and move to upload
      // We don't mark as 'shortlisted' yet because they need to provide a resume link first
      localStorage.setItem('tempAppJobTitle', jobDetails?.title);
      navigate('/upload');
    } else {
      setCurrent(current + 1);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-bold">Loading Technical Assessment...</p>
    </div>
  );

  if (questions.length === 0) return (
    <div className="h-screen flex items-center justify-center dark:text-white">
      <p className="p-10 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">No assessment found for this link.</p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 transition-all">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
              Step 2: Skill Test
            </span>
            <h1 className="text-xl font-bold mt-2 dark:text-white line-clamp-1">{jobDetails?.title}</h1>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs font-bold uppercase">Progress</p>
            <p className="text-indigo-600 font-black text-xl">{current + 1} <span className="text-slate-300 dark:text-slate-700">/ {questions.length}</span></p>
          </div>
        </div>

        {/* Question Area */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-snug">
            {questions[current].q}
          </h2>
        </div>

        {/* Options Grid */}
        <div className="grid gap-4">
          {questions[current].o.map((option, idx) => (
            <button 
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="group w-full text-left p-5 rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-indigo-100 dark:hover:shadow-none transition-all flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="text-lg font-medium text-slate-700 dark:text-slate-200">{option}</span>
            </button>
          ))}
        </div>

        {/* Footer Warning */}
        <p className="mt-8 text-center text-xs text-slate-400 font-medium italic">
          Warning: Selecting an incorrect answer will immediately terminate your application.
        </p>
      </div>
    </div>
  );
}