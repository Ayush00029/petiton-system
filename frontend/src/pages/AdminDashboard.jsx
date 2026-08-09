import { useEffect, useState } from 'react';
import { getAllPetitionsAdmin, updatePetitionStatusAdmin, deletePetitionAdmin } from '../services/petitionService';
import PetitionStatusBadge from '../components/PetitionStatusBadge';
import { ShieldCheck, Building2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [petitions, setPetitions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await getAllPetitionsAdmin(filterStatus);
      if (res.success) {
        setPetitions(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin petitions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [filterStatus]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await updatePetitionStatusAdmin(id, status);
      if (res.success) fetchAll();
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this petition?')) return;
    try {
      const res = await deletePetitionAdmin(id);
      if (res.success) fetchAll();
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            <span>Admin Portal & Government Oversight</span>
          </h1>
          <p className="text-xs text-[#64748B]">Review submitted petitions, approve/reject, or push directly to Government Department</p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-bold text-[#0F172A]">Status Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 bg-white border border-slate-300 rounded-xl font-semibold text-[#0F172A] focus:ring-2 focus:ring-[#2563EB]"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="submitted_to_government">Submitted to Gov</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#64748B] text-xs">Loading petitions queue...</div>
      ) : petitions.length > 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-[#E2E8F0] text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Creator</th>
                  <th className="p-3.5">Signatures</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {petitions.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-[#0F172A] max-w-xs truncate">
                      <Link to={`/petitions/${p._id}`} className="hover:text-[#2563EB]">
                        {p.title}
                      </Link>
                    </td>
                    <td className="p-3.5 text-slate-600 font-semibold">{p.category}</td>
                    <td className="p-3.5 text-slate-600">{p.location}</td>
                    <td className="p-3.5 text-slate-600">{p.createdBy?.name || 'Citizen'}</td>
                    <td className="p-3.5 font-bold text-[#0F172A]">
                      {p.signatureCount} / {p.targetSignatures}
                    </td>
                    <td className="p-3.5">
                      <PetitionStatusBadge status={p.status} />
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      {p.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(p._id, 'approved')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition text-[11px]"
                        >
                          Approve
                        </button>
                      )}

                      {/* Admin Push to Government Action Button */}
                      {p.status === 'approved' && (
                        <button
                          onClick={() => handleStatusUpdate(p._id, 'submitted_to_government')}
                          className="px-2.5 py-1 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg transition text-[11px] inline-flex items-center space-x-1"
                          title="Push directly to Government Department"
                        >
                          <Building2 className="w-3 h-3" />
                          <span>Push to Gov</span>
                        </button>
                      )}

                      {p.status !== 'rejected' && p.status !== 'submitted_to_government' && (
                        <button
                          onClick={() => handleStatusUpdate(p._id, 'rejected')}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition text-[11px]"
                        >
                          Reject
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(p._id)}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition text-[11px]"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#E2E8F0] text-[#64748B] text-xs">
          No petitions found.
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
