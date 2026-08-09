import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await register(formData);
      if (res.success) {
        navigate('/verify-otp', { state: { email: res.email, otpDev: res.otpDev } });
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white p-8 border border-slate-200 rounded-2xl shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-center text-[#0F172A]">Create a New Account</h2>

        {error && <div className="p-3.5 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">Full Name</label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#F97316] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">Email Address</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#F97316] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">Password</label>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#F97316] focus:outline-none"
            />
          </div>



          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#F97316] hover:bg-[#ea580c] text-white font-bold rounded-xl text-sm transition-all duration-150 shadow-md disabled:opacity-50"
          >
            {loading ? 'Sending verification code...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center text-xs text-[#64748B]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#2563EB] font-bold hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
