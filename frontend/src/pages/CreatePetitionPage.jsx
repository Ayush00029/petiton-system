import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPetition } from '../services/petitionService';
import { suggestCategory } from '../services/aiService';
import { Sparkles } from 'lucide-react';

const CATEGORIES = [
  'Roads',
  'Water',
  'Electricity',
  'Garbage',
  'Street Lights',
  'Education',
  'Healthcare',
  'Other'
];

const CreatePetitionPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Roads',
    location: '',
    targetVotes: 100
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // ONE simple AI feature: Suggest Category
  const handleSuggestCategory = async () => {
    if (!formData.description.trim()) {
      setError('Please write a petition description first to get a category suggestion.');
      return;
    }

    setAiLoading(true);
    setError('');

    try {
      const res = await suggestCategory(formData.description);
      if (res.success && res.suggestedCategory) {
        setFormData((prev) => ({ ...prev, category: res.suggestedCategory }));
      }
    } catch (err) {
      setError('Could not suggest category automatically. You can select one manually.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(formData.targetVotes) < 5) {
      setError('Target votes must be at least 5 for a civic petition.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await createPetition(formData);
      if (res.success) {
        navigate(`/petitions/${res.data._id}/success`);
      }
    } catch (err) {
      setError(err.message || 'Failed to create petition');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b border-[#E2E8F0] pb-3">
        <h1 className="text-2xl font-bold text-[#0F172A]">Create a Petition</h1>
        <p className="text-xs text-[#64748B]">Fill details below. Petitions require Admin approval before being published.</p>
      </div>

      {error && <div className="p-3.5 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-200">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 border border-[#E2E8F0] rounded-2xl shadow-xs space-y-4 text-xs">
        <div>
          <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">Petition Title *</label>
          <input
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Repair broken main road in ABC Colony"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block font-bold uppercase tracking-wider text-slate-700">Description *</label>
            <button
              type="button"
              onClick={handleSuggestCategory}
              disabled={aiLoading}
              className="inline-flex items-center text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 mr-1 text-purple-600 ${aiLoading ? 'animate-spin' : ''}`} />
              {aiLoading ? 'Suggesting...' : 'Suggest Category'}
            </button>
          </div>
          <textarea
            name="description"
            rows={5}
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the problem, affected locality, and why action is needed..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">Target Votes *</label>
            <input
              name="targetVotes"
              type="number"
              min={5}
              required
              value={formData.targetVotes}
              onChange={handleChange}
              placeholder="e.g. 100"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
            <span className="text-[11px] text-[#64748B] mt-1 block">Minimum 5 votes required.</span>
          </div>
        </div>

        <div>
          <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">Location / Locality *</label>
          <input
            name="location"
            type="text"
            required
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Sector 4, New Delhi"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all duration-150 shadow-md disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Petition for Approval'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePetitionPage;
