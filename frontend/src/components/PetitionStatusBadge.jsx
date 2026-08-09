import React from 'react';

const STATUS_CONFIG = {
  pending: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-800' },
  approved: { label: 'Approved', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  rejected: { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-800' },
  submitted_to_government: { label: 'Submitted to Government', bg: 'bg-purple-100', text: 'text-purple-800' }
};

const PetitionStatusBadge = ({ status = 'pending' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default PetitionStatusBadge;
