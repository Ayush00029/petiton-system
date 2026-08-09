import { useEffect, useState } from 'react';
import { getMyPetitions } from '../services/petitionService';
import PetitionCard from '../components/PetitionCard';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const MyPetitionsPage = () => {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyPetitions().then((res) => {
      if (res.success) setPetitions(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Created Petitions</h1>
          <p className="text-xs text-slate-500">View petitions created by you and track approval status</p>
        </div>
        <Link
          to="/petitions/create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-2 rounded-lg flex items-center space-x-1"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Create New</span>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 text-xs">Loading my petitions...</div>
      ) : petitions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {petitions.map((p) => (
            <PetitionCard key={p._id} petition={p} showStatus />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white border rounded-xl text-slate-500 text-xs space-y-3">
          <p>You have not created any petitions yet.</p>
          <Link to="/petitions/create" className="inline-block bg-blue-600 text-white font-bold px-4 py-2 rounded">
            Create Your First Petition
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyPetitionsPage;
