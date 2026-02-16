import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../api/config';

const ExpenseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Food', date: '', notes: '' });

  useEffect(() => {
    if (id) {
      const fetchDetail = async () => {
        setLoading(true); // Show loader while fetching old data
        const token = localStorage.getItem('token');
        try {
          // FIXED: Uses centralized config detail endpoint
          const res = await fetch(API_ENDPOINTS.EXPENSES.DETAIL(id), {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok) setFormData({ ...data, date: data.date.split('T')[0] });
        } catch (err) {
          console.error("Error loading detail:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    const method = id ? 'PUT' : 'POST';
    
    // FIXED: Uses centralized config
    const url = id ? API_ENDPOINTS.EXPENSES.SINGLE(id) : API_ENDPOINTS.EXPENSES.BASE;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) navigate('/dashboard');
      else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to save");
      }
    } catch (err) {
      alert("Error saving transaction");
      console.log(err.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full border-t-8 border-emerald-600">
        <h2 className="text-2xl font-black text-slate-800 mb-6">{id ? 'Update' : 'Create'} Transaction</h2>
        
        {/* Loader inside form for smoother UX */}
        {loading && id && <p className="text-emerald-600 font-bold text-center mb-4">Loading original data...</p>}

        <div className="space-y-4">
          <input type="text" placeholder="Title" required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500"
            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Amount" required className="p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500"
              value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
            <select className="p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500"
              value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="Food">Food</option>
              <option value="Rent">Rent</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
              <option value="Studies">Studies</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <input type="date" required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500"
            value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          
          <input type="text" placeholder="Notes (optional)" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500"
            value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} /> 

          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition disabled:bg-emerald-300">
              {loading && !id ? 'Processing...' : (id ? 'Update Expense' : 'Add Expense')}
            </button>
            <button type="button" onClick={() => navigate('/dashboard')} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-200 transition">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;