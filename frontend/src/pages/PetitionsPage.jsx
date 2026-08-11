import { useEffect, useState } from 'react';
import { getApprovedPetitions } from '../services/petitionService';
import PetitionCard from '../components/PetitionCard';
import { Search, ArrowUpDown } from 'lucide-react';

const CATEGORIES = [
  { name: 'All', activeColor: 'bg-[#F97316] text-white shadow-xs' },
  { name: 'Water', activeColor: 'bg-blue-600 text-white shadow-xs' },
  { name: 'Roads', activeColor: 'bg-orange-500 text-white shadow-xs' },
  { name: 'Street Lights', activeColor: 'bg-amber-600 text-white shadow-xs' },
  { name: 'Cleanliness', activeColor: 'bg-emerald-600 text-white shadow-xs' },
  { name: 'Other', activeColor: 'bg-purple-600 text-white shadow-xs' }
];

const PetitionsPage = () => {
  const [petitions, setPetitions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'most_signed', 'closest_goal'
  const [loading, setLoading] = useState(true);

  const fetchApproved = async () => {
    setLoading(true);
    try {
      const res = await getApprovedPetitions();
      if (res.success) {
        setPetitions(res.data);
      }
    } catch (err) {
      console.error('Failed to load petitions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApproved();
  }, []);

  // Filter & Sort Pipeline
  const processedPetitions = petitions
    .filter((p) => {
      // Category filter
      if (selectedCategory !== 'All') {
        const catMatch =
          selectedCategory === 'Cleanliness'
            ? p.category === 'Garbage'
            : p.category.toLowerCase() === selectedCategory.toLowerCase();
        if (!catMatch) return false;
      }
      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesLoc = p.location.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesLoc) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'most_voted') {
        const countA = a.voteCount ?? a.signatureCount ?? 0;
        const countB = b.voteCount ?? b.signatureCount ?? 0;
        return countB - countA;
      }
      if (sortBy === 'closest_goal') {
        const countA = a.voteCount ?? a.signatureCount ?? 0;
        const targetA = a.targetVotes ?? a.targetSignatures ?? 1;
        const countB = b.voteCount ?? b.signatureCount ?? 0;
        const targetB = b.targetVotes ?? b.targetSignatures ?? 1;
        return countB / targetB - countA / targetA;
      }
      // Default: newest
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">Explore Approved Petitions</h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Browse civic petitions in your area, search by keywords, and upvote to create change.
          </p>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, description, or location (e.g. Sector 4)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <ArrowUpDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="most_voted">Sort: Most Voted</option>
              <option value="closest_goal">Sort: Closest to Goal</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-150 ${
                  isSelected
                    ? cat.activeColor
                    : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Grid Results */}
        {loading ? (
          <div className="text-center py-16 text-[#64748B] text-xs">Loading petitions...</div>
        ) : processedPetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedPetitions.map((p) => (
              <PetitionCard key={p._id} petition={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-[14px] border border-[#E2E8F0] text-[#64748B] text-xs space-y-2">
            <p className="font-semibold text-slate-700 text-sm">No petitions match your criteria.</p>
            <p>Try clearing your search term or switching the category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetitionsPage;
