import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../api/config';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ 
    category: '', 
    search: '', 
    page: 1 
  });
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const query = new URLSearchParams(filters).toString();

      // Uses centralized config (Ensure config.js uses port 5005)
      const response = await fetch(`${API_ENDPOINTS.EXPENSES.BASE}?${query}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        setExpenses(data.expenses || []);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchExpenses(); 
  }, [filters]);

  const totalAmount = expenses.reduce((sum, t) => sum + t.amount, 0);
  const categorySummary = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      const token = localStorage.getItem('token');
      // FIXED: Uses centralized config for single expense deletion
      const response = await fetch(API_ENDPOINTS.EXPENSES.SINGLE(id), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchExpenses();
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {loading && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-emerald-800 font-bold">Updating Records...</p>
        </div>
      )}

      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-2xl font-black text-emerald-600 tracking-tighter">XPENZA</h1>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-400 font-bold uppercase">Logged in as</p>
            <p className="text-sm font-bold text-slate-700">{user?.username}</p>
          </div>
          <button onClick={handleLogout} className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl font-bold hover:bg-rose-100 transition">
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-emerald-600 p-6 rounded-3xl shadow-lg text-white">
            <p className="text-emerald-100 text-sm font-medium">Current View Total</p>
            <h2 className="text-4xl font-black mt-1">₹{totalAmount.toLocaleString()}</h2>
            <Link to="/add-expense" className="block text-center bg-white text-emerald-600 mt-6 py-3 rounded-2xl font-bold hover:scale-[1.02] transition-transform">
              + Add Transaction
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Filters</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Search by title..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})} />
              <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                onChange={(e) => setFilters({...filters, category: e.target.value, page: 1})}>
                <option value="">All Categories</option>
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
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Category Split</h3>
            <div className="space-y-3">
              {Object.entries(categorySummary).map(([cat, val]) => (
                <div key={cat} className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">{cat}</span>
                  <span className="font-bold text-slate-800">₹{val.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="lg:col-span-8">
          <div className="space-y-4">
            {expenses.length > 0 ? expenses.map(item => (
              <div key={item._id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center group hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl">
                    {item.category[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{item.title}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">
                      {item.category} • {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-slate-900">₹{item.amount}</p>
                  <div className="flex gap-4 mt-1">
                    <button onClick={() => navigate(`/edit-expense/${item._id}`)} className="text-xs font-bold text-emerald-600 uppercase hover:underline">Edit</button>
                    <button onClick={() => handleDelete(item._id)} className="text-xs font-bold text-rose-500 uppercase hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">No transactions found.</p>
              </div>
            )}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 mt-10">
              <button 
                disabled={pagination.currentPage === 1}
                onClick={() => setFilters({...filters, page: pagination.currentPage - 1})}
                className="p-3 bg-white border rounded-2xl font-bold disabled:opacity-30 hover:bg-slate-50 transition shadow-sm"
              >
                ← Prev
              </button>
              <span className="font-bold text-slate-500">Page {pagination.currentPage} of {pagination.totalPages}</span>
              <button 
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => setFilters({...filters, page: pagination.currentPage + 1})}
                className="p-3 bg-white border rounded-2xl font-bold disabled:opacity-30 hover:bg-slate-50 transition shadow-sm"
              >
                Next →
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;