import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPetitionById } from '../services/petitionService';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  Copy,
  Check,
  Share2,
  Lock,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Mail,
  QrCode,
  Globe
} from 'lucide-react';

const PetitionSuccessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [petition, setPetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const petitionUrl = `${window.location.origin}/petitions/${id}`;

  useEffect(() => {
    getPetitionById(id)
      .then((res) => {
        if (res.success) setPetition(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(petitionUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = `Please sign my petition: "${petition?.title}"`;

  if (loading) {
    return <div className="text-center py-16 text-slate-500 text-sm font-medium">Loading petition live preview...</div>;
  }

  if (!petition) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold">Petition Not Found</h2>
        <Link to="/petitions" className="text-blue-600 font-semibold underline">
          Go to Petitions
        </Link>
      </div>
    );
  }

  const targetGoal = petition.targetSignatures || 5;
  const currentSigs = petition.signatureCount || 0;
  const percentage = Math.min(100, Math.round((currentSigs / targetGoal) * 100));

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Live Banner & Share Options */}
        <div className="lg:col-span-7 space-y-8">
          {/* Status Badge */}
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              PUBLISHED
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
              {user?.name ? user.name.split(' ')[0] : 'Citizen'}, your petition is live!
            </h1>
            <p className="text-lg font-bold text-slate-800">
              Share it now to get your first <span className="font-extrabold text-slate-900">{targetGoal} signatures</span>.
            </p>
            <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
              Get {targetGoal} signatures to make your petition eligible for site-wide search. You can keep editing it until then.
            </p>
          </div>

          {/* Your Petition Link Box */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Your petition link</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full p-1.5 shadow-inner">
              <div className="pl-3.5 pr-2 text-slate-400">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="text"
                readOnly
                value={petitionUrl}
                className="w-full bg-transparent text-xs text-slate-700 font-medium focus:outline-none truncate"
              />
              <button
                onClick={handleCopyLink}
                className={`px-5 py-2 rounded-full text-xs font-bold transition flex items-center space-x-1 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-orange-100 hover:bg-orange-200 text-orange-800'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <span>Copy</span>
                )}
              </button>
            </div>
          </div>

          {/* Share Directly Row */}
          <div className="space-y-3 pt-2">
            <div className="text-center text-xs text-slate-400 font-semibold relative before:content-[''] before:absolute before:left-0 before:top-1/2 before:w-1/3 before:h-px before:bg-slate-200 after:content-[''] after:absolute after:right-0 after:top-1/2 after:w-1/3 after:h-px after:bg-slate-200">
              Share directly
            </div>

            <div className="flex items-center justify-between gap-2 max-w-md mx-auto pt-2">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${petitionUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center space-y-1.5 group"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition">
                  <MessageCircle className="w-6 h-6 fill-white" />
                </div>
                <span className="text-[11px] font-medium text-slate-600">WhatsApp</span>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(petitionUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center space-y-1.5 group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition">
                  <span className="font-black text-xl font-serif">f</span>
                </div>
                <span className="text-[11px] font-medium text-slate-600">Facebook</span>
              </a>

              {/* X / Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(petitionUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center space-y-1.5 group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition">
                  <span className="font-black text-lg">𝕏</span>
                </div>
                <span className="text-[11px] font-medium text-slate-600">X</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:?subject=${encodeURIComponent(petition.title)}&body=${encodeURIComponent(`${shareText}\n\n${petitionUrl}`)}`}
                className="flex flex-col items-center space-y-1.5 group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-700 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-slate-600">Email</span>
              </a>

              {/* Messages */}
              <a
                href={`sms:?body=${encodeURIComponent(`${shareText} ${petitionUrl}`)}`}
                className="flex flex-col items-center space-y-1.5 group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-slate-600">Messages</span>
              </a>

              {/* QR Code */}
              <button
                onClick={() => setShowQRModal(true)}
                className="flex flex-col items-center space-y-1.5 group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition">
                  <QrCode className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-slate-600">QR code</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-6 pt-4">
            <Link
              to="/my-petitions"
              className="px-6 py-2.5 rounded-full border border-teal-600 text-teal-700 hover:bg-teal-50 font-bold text-xs transition"
            >
              Manage petition
            </Link>

            <Link
              to={`/petitions/${id}`}
              className="text-xs font-bold text-slate-800 hover:text-orange-600 flex items-center space-x-1"
            >
              <span>View public petition</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Right Column: YOUR PETITION PREVIEW Card */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            YOUR PETITION PREVIEW
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Mesh Gradient Banner Box */}
            <div className="h-52 bg-gradient-to-tr from-amber-400 via-orange-300 to-rose-300 w-full" />

            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 leading-snug">{petition.title}</h2>

              {/* Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs text-slate-700">
                  <span className="font-bold">
                    {currentSigs} of {targetGoal} signatures
                  </span>
                  <span className="font-extrabold text-slate-900">{percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                  <div
                    className="bg-blue-600 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Lock callout */}
              <div className="flex items-center space-x-2 text-xs font-medium text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Lock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>Get {targetGoal} signatures to unlock site-wide search.</span>
              </div>

              {/* Snippet Description */}
              <div className="text-xs text-slate-600 leading-relaxed">
                <p className={showMore ? '' : 'line-clamp-2'}>{petition.description}</p>
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="mt-2 font-bold text-teal-700 hover:underline flex items-center text-xs"
                >
                  <span>{showMore ? 'Show less' : 'Show more'}</span>
                  {showMore ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Scan QR Code to Sign</h3>
            <div className="p-4 bg-slate-50 border rounded-xl inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(petitionUrl)}`}
                alt="Petition QR Code"
                className="w-44 h-44 mx-auto"
              />
            </div>
            <p className="text-xs text-slate-500">Scan with camera to open petition directly on mobile.</p>
            <button
              onClick={() => setShowQRModal(false)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetitionSuccessPage;
