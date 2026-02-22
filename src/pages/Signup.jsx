import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ email: '', password: '', company: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setDoc(doc(db, "users", cred.user.uid), {
        role: 'recruiter',
        company: form.company
      });
      navigate('/dashboard');
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleSignup} className="p-8 bg-white shadow-xl rounded-2xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-indigo-600">Recruiter Signup</h2>
        <input className="w-full p-3 mb-4 border rounded" placeholder="Company Name" onChange={e => setForm({...form, company: e.target.value})} />
        <input className="w-full p-3 mb-4 border rounded" type="email" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
        <input className="w-full p-3 mb-6 border rounded" type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
        <button className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold">Register</button>
      </form>
    </div>
  );
}