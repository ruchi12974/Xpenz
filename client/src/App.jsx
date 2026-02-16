import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Importing Pages
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 
import ExpenseForm from './pages/ExpenseForm'; 
// Import the Wrapper
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes - Only for logged-in users */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/add-expense" 
            element={
              <ProtectedRoute>
                <ExpenseForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/edit-expense/:id" 
            element={
              <ProtectedRoute>
                <ExpenseForm />
              </ProtectedRoute>
            } 
          />

          {/* 404 Page */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
              <h1 className="text-4xl font-bold text-slate-800">404 - Page Not Found</h1>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;