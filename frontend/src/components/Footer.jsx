import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-slate-300 relative mt-auto">
      {/* Colorful Top Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left Text */}
          <p className="text-xs sm:text-sm font-semibold text-slate-300">
            Your voice can create change.
          </p>

          {/* Right Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-400">
            <Link to="/petitions" className="hover:text-[#F97316] transition-colors duration-150">
              Explore Petitions
            </Link>
            <Link to="/petitions/create" className="hover:text-[#F97316] transition-colors duration-150">
              Create Petition
            </Link>
            <span className="hover:text-[#F97316] cursor-pointer transition-colors duration-150">
              About
            </span>
            <span className="hover:text-[#F97316] cursor-pointer transition-colors duration-150">
              Contact
            </span>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-4 text-center sm:text-left text-[11px] text-slate-500">
          © {new Date().getFullYear()} Petitions Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
