import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Mail, RefreshCw, AlertCircle } from 'lucide-react';

const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUserState } = useAuth();

  const targetEmail = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(30);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');
    setMsg('');

    try {
      const res = await verifyOtp({ email: targetEmail, otp: otp.trim() });
      if (res.success && res.data) {
        setUserState(res.data);
        if (res.data.role === 'admin') navigate('/admin');
        else navigate('/petitions');
      }
    } catch (err) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;

    setResending(true);
    setError('');
    setMsg('');

    try {
      const res = await resendOtp(targetEmail);
      if (res.success) {
        setMsg('A new verification code has been dispatched to your Gmail inbox.');
        setCooldown(30);
      }
    } catch (err) {
      setError(err.message || 'Failed to resend verification code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white p-8 border border-slate-200 rounded-2xl shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-orange-100 text-[#F97316] rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Verify Your Email</h2>
          <p className="text-xs text-[#64748B]">
            We sent a 6-digit verification code to your Gmail:{' '}
            <strong className="text-slate-900 block pt-1 text-sm">{targetEmail || 'your email'}</strong>
          </p>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Gmail Speed Tip:</strong> If you don't see the code in 5-10 seconds, please check your <strong>Spam / Junk</strong> or <strong>Promotions</strong> folder, or pull down to refresh Gmail.
          </div>
        </div>

        {error && <div className="p-3.5 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-200">{error}</div>}
        {msg && <div className="p-3.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200">{msg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 text-center">
              Enter 6-Digit Code
            </label>
            <input
              type="text"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-center text-2xl font-bold tracking-widest text-[#0F172A] focus:ring-2 focus:ring-[#F97316] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#F97316] hover:bg-[#ea580c] text-white font-bold rounded-xl text-sm transition shadow-md disabled:opacity-50"
          >
            {loading ? 'Verifying Code...' : 'Verify & Continue'}
          </button>
        </form>

        <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100 text-[#64748B]">
          <span>Didn't receive the code?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="font-bold text-[#2563EB] hover:underline flex items-center space-x-1 disabled:opacity-50 disabled:no-underline"
          >
            <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
            <span>
              {resending
                ? 'Sending...'
                : cooldown > 0
                ? `Resend in ${cooldown}s`
                : 'Resend Code'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;

