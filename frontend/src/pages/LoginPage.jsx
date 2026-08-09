import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const res = await login(formData);
      if (res.success) {
        if (res.requiresVerification) {
          navigate('/verify-otp', { state: { email: res.email, otpDev: res.otpDev } });
        } else if (res.data?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/petitions');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white p-8 border border-slate-200 rounded-2xl shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-center text-[#0F172A]">Log In to Your Account</h2>

        {error && <div className="p-3.5 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-200">{error}</div>}

        {/* Demo buttons */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
          <div className="font-bold text-slate-700">Quick Demo Accounts:</div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setFormData({ email: 'citizen@civicvoice.org', password: 'password123' })}
              className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-blue-600 font-bold"
            >
              Citizen
            </button>
            <button
              type="button"
              onClick={() => setFormData({ email: 'admin@civicvoice.org', password: 'password123' })}
              className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-purple-600 font-bold"
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">Email Address</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
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
            {loading ? 'Sending verification code...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-[#64748B]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#2563EB] font-bold hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
