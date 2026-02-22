import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Send, Trash2 } from 'lucide-react';

const QUESTION_TEMPLATES = {
  java: [
    { q: "What is the size of int in Java?", o: ["2 bytes", "4 bytes"], a: 1 },
    { q: "Which keyword is used for inheritance?", o: ["extends", "implements"], a: 0 },
    { q: "Is Java platform independent?", o: ["Yes", "No"], a: 0 },
    { q: "Default value of Boolean?", o: ["true", "false"], a: 1 },
    { q: "Which class is the superclass of all classes?", o: ["Object", "Main"], a: 0 }
  ],
  python: [
    { q: "How do you start a comment in Python?", o: ["//", "#"], a: 1 },
    { q: "Which data type is immutable?", o: ["List", "Tuple"], a: 1 },
    { q: "Correct way to create a function?", o: ["def func():", "function func():"], a: 0 },
    { q: "How to get length of list?", o: ["len(l)", "l.size()"], a: 0 },
    { q: "Python is a ___ language.", o: ["Compiled", "Interpreted"], a: 1 }
  ]
};

export default function CreateJob() {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [questions, setQuestions] = useState(Array(5).fill({ q: '', o: ['', ''], a: 0 }));
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Detect keyword for suggestions
  useEffect(() => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('java')) setSuggestion('java');
    else if (lowerTitle.includes('python')) setSuggestion('python');
    else setSuggestion(null);
  }, [title]);

  const loadTemplate = () => {
    if (suggestion) setQuestions(QUESTION_TEMPLATES[suggestion]);
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "jobs"), {
        title,
        company,
        questions,
        createdAt: new Date()
      });
      alert("Job Published Successfully!");
      navigate('/dashboard');
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto dark:bg-slate-900 min-h-screen">
      <form onSubmit={handlePublish} className="space-y-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Post New Job</h2>
          <div className="grid gap-4">
            <input 
              placeholder="Job Title (e.g. Java Developer)" 
              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-white border-none outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
            />
            <input 
              placeholder="Company Name" 
              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-white border-none outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setCompany(e.target.value)}
              value={company}
              required
            />
          </div>

          {suggestion && (
            <button 
              type="button"
              onClick={loadTemplate}
              className="mt-4 flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-full border border-indigo-100 dark:border-indigo-800 animate-pulse"
            >
              <Sparkles size={16} /> Load 5 {suggestion} MCQ Templates?
            </button>
          )}
        </div>

        {questions.map((q, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h3 className="font-bold text-gray-400 mb-4 uppercase text-xs tracking-widest">Question {i + 1}</h3>
            <input 
              placeholder="Question Text" 
              className="w-full p-3 mb-4 rounded-lg border dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              value={q.q}
              onChange={(e) => {
                const newQs = [...questions];
                newQs[i].q = e.target.value;
                setQuestions(newQs);
              }}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input 
                placeholder="Option 0" 
                className="p-3 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                value={q.o[0]}
                onChange={(e) => {
                  const newQs = [...questions];
                  newQs[i].o[0] = e.target.value;
                  setQuestions(newQs);
                }}
                required
              />
              <input 
                placeholder="Option 1" 
                className="p-3 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                value={q.o[1]}
                onChange={(e) => {
                  const newQs = [...questions];
                  newQs[i].o[1] = e.target.value;
                  setQuestions(newQs);
                }}
                required
              />
            </div>
            <select 
              className="mt-4 p-2 w-full rounded bg-gray-50 dark:bg-slate-700 dark:text-white border-none"
              value={q.a}
              onChange={(e) => {
                const newQs = [...questions];
                newQs[i].a = parseInt(e.target.value);
                setQuestions(newQs);
              }}
            >
              <option value={0}>Option 0 is Correct</option>
              <option value={1}>Option 1 is Correct</option>
            </select>
          </div>
        ))}

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 dark:shadow-none"
        >
          <Send size={20} /> {loading ? "Publishing..." : "Publish Job Opening"}
        </button>
      </form>
    </div>
  );
}