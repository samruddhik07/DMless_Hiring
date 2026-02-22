import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function ResumeUpload() {
  const [resumeLink, setResumeLink] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeLink.includes("http")) {
      alert("Please enter a valid URL (e.g., Google Drive link)");
      return;
    }

    setLoading(true);
    try {
      // We save the LINK to the database instead of the actual file
      await addDoc(collection(db, "applications"), {
        candidateName: "Candidate " + Math.floor(Math.random() * 1000),
        status: "shortlisted",
        resumeUrl: resumeLink,
        timestamp: new Date()
      });

      alert("Application Complete! Recruiter will see your link.");
      navigate('/login');
    } catch (error) {
      alert("Error saving: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-white shadow-2xl rounded-3xl text-center border border-gray-100">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
        ✓
      </div>
      <h2 className="text-2xl font-bold mb-2">Assessment Passed!</h2>
      <p className="text-gray-500 mb-8">Share your resume link to finish</p>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="url" 
          placeholder="Paste Google Drive or LinkedIn Link" 
          className="w-full p-4 border-2 rounded-xl mb-6 focus:border-indigo-500 outline-none"
          required
          onChange={(e) => setResumeLink(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
        >
          {loading ? "Processing..." : "Complete Application"}
        </button>
      </form>
    </div>
  );
}