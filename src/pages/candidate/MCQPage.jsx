import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { saveCandidateApplication } from '../../services/db';
import { useNavigate } from 'react-router-dom';

export default function MCQPage() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      const snap = await getDocs(collection(db, "jobs"));
      if (!snap.empty) setQuestions(snap.docs[0].data().questions);
    };
    fetchJob();
  }, []);

  const handleAnswer = async (choiceIdx) => {
    // REQUIREMENT: If incorrect, stop test and mark as knocked
    if (choiceIdx !== questions[current].a) {
      await saveCandidateApplication({
        candidateName: "Candidate_" + Math.random().toString(36).substr(2, 5),
        status: "knocked",
        score: current
      });
      alert("Application stopped. You did not meet the minimum requirements.");
      navigate('/login');
      return;
    }

    // REQUIREMENT: If all correct, navigate to resume upload
    if (current === 4) {
      navigate('/upload');
    } else {
      setCurrent(current + 1);
    }
  };

  if (questions.length === 0) return <div className="p-20 text-center text-xl">Loading Assessment...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-20 p-10 bg-white rounded-3xl shadow-xl border">
      <h3 className="text-indigo-600 font-bold mb-4 uppercase tracking-widest text-sm">Step 1: Technical Screening</h3>
      <h2 className="text-2xl font-bold mb-8">{questions[current].q}</h2>
      <div className="grid gap-4">
        {questions[current].o.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(i)} className="p-4 border-2 rounded-2xl text-left hover:bg-indigo-50 hover:border-indigo-500 transition">
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}