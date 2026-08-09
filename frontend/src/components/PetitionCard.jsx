import React from 'react';
import { Link } from 'react-router-dom';
import PetitionStatusBadge from './PetitionStatusBadge';
import { MapPin, Users, ArrowRight } from 'lucide-react';

const CATEGORY_STYLES = {
  Water: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    topBar: 'border-t-blue-500'
  },
  Roads: {
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
    topBar: 'border-t-orange-500'
  },
  'Street Lights': {
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    topBar: 'border-t-amber-500'
  },
  Cleanliness: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    topBar: 'border-t-emerald-500'
  },
  Garbage: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    topBar: 'border-t-emerald-500'
  },
  Education: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    topBar: 'border-t-purple-500'
  },
  Healthcare: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    topBar: 'border-t-rose-500'
  },
  Other: {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    topBar: 'border-t-indigo-500'
  }
};

const PetitionCard = ({ petition, showStatus = false }) => {
  if (!petition) return null;

  const style = CATEGORY_STYLES[petition.category] || CATEGORY_STYLES.Other;
  const targetGoal = petition.targetSignatures || 100;
  const currentSigs = petition.signatureCount || 0;
  const percentage = Math.min(100, Math.round((currentSigs / targetGoal) * 100));

  return (
    <div
      className={`bg-white rounded-[14px] border border-[#E2E8F0] border-t-4 ${style.topBar} p-6 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between space-y-4`}
    >
      <div className="space-y-3">
        {/* Category Badge & Status Badge Header */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 border rounded-md ${style.badge}`}>
            {petition.category}
          </span>
          {showStatus && <PetitionStatusBadge status={petition.status} />}
        </div>

        {/* Petition Title */}
        <h3 className="text-base font-bold text-[#0F172A] line-clamp-2 leading-snug hover:text-[#2563EB] transition-colors duration-150">
          <Link to={`/petitions/${petition._id}`}>{petition.title}</Link>
        </h3>

        {/* Short Description */}
        <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed">
          {petition.description}
        </p>
      </div>

      {/* Location, Progress & Link */}
      <div className="border-t border-[#E2E8F0] pt-4 space-y-3">
        {/* Location & Signature Count */}
        <div className="flex items-center justify-between text-xs text-[#64748B]">
          <span className="flex items-center font-medium truncate max-w-[140px]" title={petition.location}>
            <MapPin className="w-3.5 h-3.5 mr-1 text-[#64748B] flex-shrink-0" />
            <span className="truncate">{petition.location}</span>
          </span>
          <span className="flex items-center font-bold text-[#0F172A]">
            <Users className="w-3.5 h-3.5 mr-1 text-[#2563EB] flex-shrink-0" />
            {currentSigs} / {targetGoal} signatures
          </span>
        </div>

        {/* Smooth Gradient Progress Bar */}
        <div className="w-full bg-[#EFF6FF] rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* View Details Link */}
        <div className="pt-1 flex justify-end">
          <Link
            to={`/petitions/${petition._id}`}
            className="inline-flex items-center text-xs font-bold text-[#2563EB] hover:underline transition"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PetitionCard;
