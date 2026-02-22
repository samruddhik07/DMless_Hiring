import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Send, Sparkles } from 'lucide-react';

export default function CreateJob() {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [questions, setQuestions] = useState([{ q: '', o: ['', ''], a: 0 }]); // Starts with 1, dynamic
  const navigate = useNavigate();

  const addQuestion = () => setQuestions([...questions, { q: '', o: ['', ''], a: 0 }]);
  const removeQuestion = (index) => setQuestions(questions.filter((_, i) => i !== index));

  const handlePublish = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "jobs"), { title, company, questions, createdAt: new Date() });
    navigate('/dashboard');
  };

  return (
    <div className="p-4 md:p-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <form onSubmit={handlePublish} className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800">
          <h1 className="text-3xl font-black mb-6 dark:text-white">Create Opening</h1>
          <div className="grid md:grid-cols-2 gap-4">
            <input placeholder="Job Title" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 ring-indigo-500" onChange={e => setTitle(e.target.value)} required />
            <input placeholder="Company" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 ring-indigo-500" onChange={e => setCompany(e.target.value)} required />
          </div>
        </div>

        {questions.map((q, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 relative group">
            <button type="button" onClick={() => removeQuestion(i)} className="absolute top-6 right-6 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition">
              <Trash2 size={20} />
            </button>
            <p className="text-xs font-bold text-indigo-500 mb-4 uppercase tracking-widest">Question {i + 1}</p>
            <input value={q.q} placeholder="Question Text" className="w-full p-3 mb-4 border-b-2 border-slate-100 dark:border-slate-800 bg-transparent dark:text-white outline-none focus:border-indigo-500" onChange={e => {
                const n = [...questions]; n[i].q = e.target.value; setQuestions(n);
            }} required />
            <div className="grid grid-cols-2 gap-4">
              {q.o.map((opt, oi) => (
                <input key={oi} value={opt} placeholder={`Option ${oi}`} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl dark:text-white outline-none focus:ring-1 ring-indigo-500 text-sm" onChange={e => {
                    const n = [...questions]; n[i].o[oi] = e.target.value; setQuestions(n);
                }} required />
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <button type="button" onClick={addQuestion} className="flex-1 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 p-4 rounded-2xl font-bold text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition flex items-center justify-center gap-2">
            <Plus size={20} /> Add Another Question
          </button>
          <button type="submit" className="flex-1 bg-indigo-600 text-white p-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 flex items-center justify-center gap-2">
            <Send size={2