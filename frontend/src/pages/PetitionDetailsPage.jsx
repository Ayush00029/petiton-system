import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getPetitionById,
  signPetition,
  revokeSignature,
  pushToGovernment,
  checkSignatureStatus
} from '../services/petitionService';
import { useAuth } from '../context/AuthContext';
import PetitionStatusBadge from '../components/PetitionStatusBadge';
import DigitalSignatureModal from '../components/DigitalSignatureModal';
import {
  MapPin,
  Users,
  Calendar,
  User,
  AlertCircle,
  PenTool,
  ShieldCheck,
  Share2,
  Building2,
  CheckCircle2,
  RotateCcw,
  Sparkles
} from 'lucide-react';

const PetitionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [petition, setPetition] = useState(null);
  const [hasSigned, setHasSigned] = useState(false);
  const [signatureInfo, setSignatureInfo] = useState(null);
  const [showSigModal, setShowSigModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await getPetitionById(id);
      if (res.success) {
        setPetition(res.data);
      }

      if (isAuthenticated) {
        const sigRes = await checkSignatureStatus(id);
        if (sigRes.success) {
          setHasSigned(sigRes.hasSigned);
          if (sigRes.signature) {
            setSignatureInfo(sigRes.signature);
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load petition');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id, isAuthenticated]);

  const handleOpenSigModal = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowSigModal(true);
  };

  const handleDigitalSignatureSubmit = async ({ signerName, signatureData }) => {
    setShowSigModal(false);
    setSigning(true);
    setError('');
    setMsg('');

    try {
      const res = await signPetition(id, { signerName, signatureData });
      if (res.success) {
        setHasSigned(true);
        setSignatureInfo(res.signature);
        setPetition((prev) => ({
          ...prev,
          signatureCount: res.signatureCount
        }));
        setMsg('Thank you! Your verified Digital Signature has been recorded.');
      }
    } catch (err) {
      setError(err.message || 'Could not record signature');
    } finally {
      setSigning(false);
    }
  };

  // Revoke Digital Signature handler
  const handleRevokeSignature = async () => {
    if (!window.confirm('Are you sure you want to withdraw your digital signature from this petition?')) return;

    setRevoking(true);
    setError('');
    setMsg('');

    try {
      const res = await revokeSignature(id);
      if (res.success) {
        setHasSigned(false);
        setSignatureInfo(null);
        setPetition((prev) => ({
          ...prev,
          signatureCount: res.signatureCount
        }));
        setMsg('Your digital signature has been successfully withdrawn/revoked.');
      }
    } catch (err) {
      setError(err.message || 'Could not revoke signature');
    } finally {
      setRevoking(false);
    }
  };

  // Push Petition to Government Department handler
  const handlePushToGovernment = async () => {
    setPushing(true);
    setError('');
    setMsg('');

    try {
      const res = await pushToGovernment(id);
      if (res.success) {
        setPetition(res.data);
        setMsg('🏛️ Petition officially pushed and submitted to the Government Department!');
      }
    } catch (err) {
      setError(err.message || 'Could not submit to government');
    } finally {
      setPushing(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-[#64748B] text-xs">Loading petition details...</div>;
  }

  if (error || !petition) {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-3">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <p className="text-xs text-slate-600">{error || 'Petition not found'}</p>
        <Link to="/petitions" className="inline-block px-4 py-2 bg-[#2563EB] text-white rounded-lg text-xs font-bold">
          Back to Petitions
        </Link>
      </div>
    );
  }

  const isGoalReached = petition.signatureCount >= petition.targetSignatures;
  const isSubmittedToGov = petition.status === 'submitted_to_government' || petition.pushedToGovernment;
  const percentage = Math.min(100, Math.round((petition.signatureCount / petition.targetSignatures) * 100));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold bg-orange-50 text-[#F97316] border border-orange-200 px-3 py-1 rounded-full uppercase tracking-wider">
            {petition.category}
          </span>
          <div className="flex items-center space-x-2">
            <PetitionStatusBadge status={petition.status} />
            <Link
              to={`/petitions/${id}/success`}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full text-xs flex items-center transition"
            >
              <Share2 className="w-3.5 h-3.5 mr-1" />
              Share
            </Link>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-snug">
          {petition.title}
        </h1>

        <div className="flex flex-wrap gap-4 text-xs text-[#64748B] border-t border-b border-[#E2E8F0] py-3">
          <span className="flex items-center">
            <User className="w-3.5 h-3.5 mr-1 text-[#64748B]" />
            Created by: {petition.createdBy?.name || 'Citizen'}
          </span>
          <span className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-[#64748B]" />
            {petition.location}
          </span>
          <span className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1 text-[#64748B]" />
            {new Date(petition.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Description */}
        <div className="text-sm text-[#0F172A] leading-relaxed whitespace-pre-line pt-1">
          {petition.description}
        </div>

        {/* Government Submitted Verified Box */}
        {isSubmittedToGov && (
          <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-5 space-y-2 text-xs text-purple-950">
            <div className="flex items-center justify-between font-bold text-purple-900">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-purple-700" />
                <span className="text-sm">🏛️ Formally Submitted to Government Department</span>
              </div>
              <span className="bg-purple-200 text-purple-900 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase">
                OFFICIAL RECORD
              </span>
            </div>
            <p className="text-purple-800 leading-relaxed pt-1">
              This petition reached its target goal and has been officially pushed and submitted to local government authorities for official review and action.
            </p>
            {petition.pushedAt && (
              <div className="text-[11px] text-purple-600 font-semibold pt-1">
                Submission Timestamp: {new Date(petition.pushedAt).toLocaleString()}
              </div>
            )}
          </div>
        )}

        {/* Goal Reached: Push to Government Callout Banner */}
        {isGoalReached && !isSubmittedToGov && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-orange-300 rounded-2xl p-6 space-y-3">
            <div className="flex items-center space-x-2 text-[#0F172A] font-extrabold text-base">
              <Sparkles className="w-5 h-5 text-[#F97316]" />
              <span>🎯 Signature Goal Reached! (100% Target Met)</span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              All required signatures have been collected and digitally verified. You can now formally submit this petition to the relevant Government Department.
            </p>
            <button
              onClick={handlePushToGovernment}
              disabled={pushing}
              className="px-6 py-3 bg-[#F97316] hover:bg-[#ea580c] text-white font-bold rounded-xl text-xs shadow-md transition flex items-center space-x-2"
            >
              <Building2 className="w-4 h-4" />
              <span>{pushing ? 'Submitting to Government...' : '🏛️ Push Petition to Government Department'}</span>
            </button>
          </div>
        )}

        {/* Signature Goal & Digital Signature Action Box */}
        <div className="bg-slate-50 p-6 border border-[#E2E8F0] rounded-2xl space-y-4 pt-4">
          <div className="flex justify-between items-center text-xs font-bold text-[#0F172A]">
            <span className="text-sm">
              {petition.signatureCount} signed of {petition.targetSignatures} goal
            </span>
            <span className="text-[#2563EB] font-extrabold text-sm">{percentage}%</span>
          </div>

          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
            <div className="bg-[#2563EB] h-full transition-all duration-500 rounded-full" style={{ width: `${percentage}%` }} />
          </div>

          {msg && <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl">{msg}</div>}

          {/* Verified Digital Signature Certificate */}
          {hasSigned ? (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 space-y-3 text-xs text-emerald-950">
              <div className="flex items-center justify-between font-bold text-emerald-900">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>✓ Verified Digital Signature Recorded</span>
                </div>
                <button
                  onClick={handleRevokeSignature}
                  disabled={revoking}
                  className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{revoking ? 'Revoking...' : 'Revoke Signature'}</span>
                </button>
              </div>

              <div className="text-slate-700">
                Signer Name: <strong>{signatureInfo?.signerName || user?.name}</strong>
              </div>

              {signatureInfo?.signatureData && (
                <div className="pt-2">
                  <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Digital Signature Stamp:</div>
                  {signatureInfo.signatureData.startsWith('TYPED:') ? (
                    <div className="font-serif italic text-2xl text-blue-900 font-bold tracking-wider py-2 px-4 bg-white rounded-lg border border-emerald-200 inline-block">
                      {signatureInfo.signatureData.replace('TYPED:', '')}
                    </div>
                  ) : (
                    <div className="bg-white p-2 border border-emerald-200 rounded-lg inline-block">
                      <img src={signatureInfo.signatureData} alt="Digital Signature" className="h-12 object-contain" />
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleOpenSigModal}
              disabled={signing || petition.status === 'rejected'}
              className="w-full py-3.5 bg-[#F97316] hover:bg-[#ea580c] text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center space-x-2"
            >
              <PenTool className="w-4 h-4" />
              <span>Sign Petition with Digital Signature</span>
            </button>
          )}
        </div>
      </div>

      {/* Digital Signature Pad Modal */}
      <DigitalSignatureModal
        isOpen={showSigModal}
        onClose={() => setShowSigModal(false)}
        onSubmit={handleDigitalSignatureSubmit}
        defaultName={user?.name || ''}
      />
    </div>
  );
};

export default PetitionDetailsPage;
