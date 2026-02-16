
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../api/config';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(''); // Clear old errors

  try {
    const response = await fetch(`${API_ENDPOINTS.AUTH.REGISTER}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    
    if (!response.ok) {
      throw new Error(data.message || "Failed to Register");
    }

    // Success! Save data and move to Dashboard
    localStorage.setItem('token', data.ten);
    localStorage.setItem('user', JSON.stringify(data.user));
    navigate('/dashboard');

  } catch (err) {
    setError(err.message);
  }finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border-t-4 border-emerald-500">
        <h2 className="text-3xl font-bold text-slate-800 text-center">Join <span className="text-emerald-600">Expenza</span></h2>
        <p className="text-slate-500 text-center mt-2">Master your money today.</p>

        {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg mt-4 text-sm">{error}</p>}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input name="username" type="text" placeholder="Full Name" onChange={handleChange} required 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
          
          <input name="email" type="email" placeholder="Email (ending in .com)" onChange={handleChange} required 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
          
          <input name="password" type="password" placeholder="Password (min 6 chars)" onChange={handleChange} required 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />

          <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-md">
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;