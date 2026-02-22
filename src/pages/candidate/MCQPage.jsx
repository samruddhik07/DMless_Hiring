import React, { useState, useEffect } from 'react'; // Ensure useState is imported
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';

export default function MCQPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load questions from Firestore
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const jobDoc = await getDoc(doc(db, "jobs", jobId));
        if (jobDoc.exists()) {
          setQuestions(jobDoc.data().questions || []);
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [jobId]);

  const handleAnswer = async (selectedIdx) => {
    const candidateName = localStorage.getItem('candidateName') || "Anonymous";

    // Requirement: Knockout logic (Wrong answer = end test)
    if (selectedIdx !== questions[current].a) {
      await addDoc(collection(db, "applications"), {
        candidateName,
        jobId,
        status: "knocked",
        timestamp: new Date()
      });
      alert("Assessment ended. You did not meet the requirements.");
      navigate('/auth');
      return;
    }

    // Requirement: All correct = Resume Upload
    if (current === questions.length - 1) {
      navigate('/upload');
    } else {
      setCurrent(current + 1);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center dark:text-white">Loading Assessment...</div>;
  if (questions.length === 0) return <div className="h-screen flex items-center justify-center dark:text-white">No questions found for this job.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-20 p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border dark:border-slate-700">
      <div className="flex justify-between items-center mb-8">
        <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs">Technical Screening</span>
        <span className="text-gray-400 text-sm font-bold">Question {current + 1} / {questions.length}</span>
      </div>
      
      <h2 className="text-2xl font-bold mb-10 dark:text-white">{questions[current].q}</h2>
      
      <div className="grid gap-4">
        {questions[current].o.map((option, idx) => (
          <button 
            key={idx}
            onClick={() => handleAnswer(idx)}
            className="w-full text-left p-5 border-2 border-slate-100 dark:border-slate-700 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all dark:text-white group"
          >
            <span className="inline-block w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-center leading-8 mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              {String.fromCharCode(65 + idx)}
            </span>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
