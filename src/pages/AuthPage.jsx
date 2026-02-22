import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isForgot) {
        await sendPasswordResetEmail(auth, email);
        alert("Reset link sent to your email!");
        setIsForgot(false);
      } else if (isLogin) {
        await signInWithEmailAndPassword(auth, email, pass);
      } else {
        await createUserWithEmailAndPassword(auth, email, pass);
      }
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="flex h-screen items-center justify-center p-6">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-slate-700">
        <h1 className="text-3xl font-bold mb-2 text-indigo-600">
          {isForgot ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-gray-500 mb-8">{isForgot ? 'Enter your email to recover' : 'dmless recruitment platform'}</p>

        <form onSubmit={handleAuth} className="space-y-4">
          <input 
            type="email" placeholder="Email Address" required
            className="w-full p-4 rounded-xl bg-gray-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          {!isForgot && (
            <input 
              type="password" placeholder="Password" required
              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setPass(e.target.value)}
            />
          )}
          
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl font-bold transition shadow-lg shadow-indigo-200 dark:shadow-none">
            {isForgot ? 'Send Link' : isLogin ? 'Sign In' : 'Register Now'}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-2 text-sm text-center text-gray-500">
          {!isForgot && (
            <button onClick={() => setIsLogin(!isLogin)} className="hover:text-indigo-600">
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          )}
          <button onClick={() => {setIsForgot(!isForgot); setIsLogin(true)}} className="hover:text-indigo-600">
            {isForgot ? "Back to Login" : "Forgot Password?"}
          </button>
        </div>
      </div>
    </div>
  );
}