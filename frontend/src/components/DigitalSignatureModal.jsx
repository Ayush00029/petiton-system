import { useState } from 'react';
import { PenTool, X, CheckCircle2 } from 'lucide-react';

const DigitalSignatureModal = ({ isOpen, onClose, onSubmit, defaultName = '' }) => {
  const [signerName, setSignerName] = useState(defaultName || '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!signerName.trim()) return;

    onSubmit({
      signerName: signerName.trim(),
      signatureData: `TYPED:${signerName.trim()}`
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PenTool className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-base sm:text-lg">Digital Signature Verification</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Full Legal Name Field */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              placeholder="Enter your full legal name"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />
          </div>

          {/* Cursive Signature Preview Box */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Verified Digital Signature Preview:
            </label>
            <div className="p-5 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 border-2 border-slate-200 rounded-xl text-center min-h-[100px] flex items-center justify-center">
              <span className="font-serif italic text-3xl text-blue-900 font-extrabold tracking-wider">
                {signerName.trim() || 'Your Signature'}
              </span>
            </div>
          </div>

          {/* Legal Notice Callout Box */}
          <div className="text-xs text-slate-600 bg-orange-50/80 border border-orange-200 p-3.5 rounded-xl flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#F97316] flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              By clicking "Sign & Confirm Petition", I endorse this civic petition and apply my verified digital signature.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!signerName.trim()}
              className="px-6 py-2.5 bg-[#F97316] hover:bg-[#ea580c] text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50"
            >
              Sign & Confirm Petition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DigitalSignatureModal;
