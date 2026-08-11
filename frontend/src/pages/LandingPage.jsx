import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

const LandingPage = () => {
  const [petitions, setPetitions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApprovedPetitions()
      .then((res) => {
        if (res.success) setPetitions(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
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
    <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen space-y-12 pb-16">
      {/* 1. COMPACT MODERN HERO SECTION WITH AMBIENT COLOR MESH */}
      <section className="bg-gradient-to-b from-blue-50/70 via-orange-50/30 to-[#F8FAFC] border-b border-[#E2E8F0] pt-12 pb-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-center">
        {/* Soft Ambient Radial Background Blobs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-5 relative z-10">
          {/* Badge */}
          <span className="inline-block bg-white text-[#2563EB] border border-blue-200 text-[11px] font-extrabold tracking-widest uppercase px-4 py-1 rounded-full shadow-xs">
            COMMUNITY • VOICE • CHANGE
          </span>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-snug">
            Make Your Voice Heard
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#64748B] max-w-xl mx-auto leading-relaxed font-normal">
            Raise issues in your locality, gather support from your community, and bring important problems to the attention of decision makers.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              to="/petitions/create"
              className="bg-[#F97316] hover:bg-[#ea580c] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-150"
            >
              Create a Petition
            </Link>
            <Link
              to="/petitions"
              className="bg-white hover:bg-slate-50 text-[#2563EB] border border-[#2563EB] font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-xs transition-all duration-150"
            >
              Explore Petitions
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PETITIONS SECTION WITH SEARCH, SORT & CATEGORY FILTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
            Petitions That Need Your Support
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Discover local issues and support causes that matter to your community.
          </p>
        </div>

        {/* Search & Sort Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-xs max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search petitions by keyword or location..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <ArrowUpDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="most_voted">Sort: Most Voted</option>
              <option value="closest_goal">Sort: Closest to Goal</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
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

        {/* Petition Grid */}
        {loading ? (
          <div className="text-center py-16 text-[#64748B] text-xs">Loading petitions...</div>
        ) : processedPetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedPetitions.map((p) => (
              <PetitionCard key={p._id} petition={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-[14px] border border-[#E2E8F0] text-[#64748B] text-xs">
            No petitions found. Try clearing your search term or selecting a different category.
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
