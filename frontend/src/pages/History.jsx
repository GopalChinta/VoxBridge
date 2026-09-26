import React, { useState, useEffect } from 'react';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  Trash2, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Languages, 
  FileText 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HistoryItemCard from '../components/HistoryItemCard';
import { historyAPI } from '../api/history';

const History = () => {
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await historyAPI.getHistory({
        search,
        language: languageFilter,
        limit: 50
      });
      setRecords(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load history:', err);
      setError('Unable to load history records. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchHistory();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, languageFilter]);

  const confirmDelete = async () => {
    if (!deleteModalId) return;
    try {
      await historyAPI.deleteHistory(deleteModalId);
      setDeleteModalId(null);
      setToast('Record and associated media files deleted successfully.');
      setTimeout(() => setToast(null), 3000);
      fetchHistory();
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete history record. Access denied or record already removed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070A11] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-slate-800 bg-[#0B0F1A]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-semibold tracking-wider text-cyan-400">
                Data Isolation Verified
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <HistoryIcon className="w-7 h-7 text-indigo-400" />
              <span>Speech History Vault</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Review and manage your previous transcriptions, neural translations, audio files, and PDF reports.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              {total} Total Sessions
            </span>
            <button
              onClick={fetchHistory}
              title="Refresh"
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Toast / Error */}
        {toast && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn shadow-glow-cyan">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toast}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-[#0B0F1A]/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transcriptions, translations, filenames..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#070A12] border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Language Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 whitespace-nowrap">Filter Language:</span>
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="bg-[#070A12] text-xs text-slate-200 py-2 px-3 rounded-xl border border-slate-700/80 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Languages</option>
              <option value="English">English</option>
              <option value="Telugu">Telugu (తెలుగు)</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
            </select>
          </div>
        </div>

        {/* History List Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-7 h-7 text-indigo-400 animate-spin" />
            <span className="text-xs text-slate-400">Loading history records...</span>
          </div>
        ) : records.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((rec) => (
              <HistoryItemCard
                key={rec.id}
                record={rec}
                onDelete={(id) => setDeleteModalId(id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 glass-panel rounded-3xl border border-slate-800 text-center p-8 space-y-3">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold text-white">No Speech Records Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search || languageFilter !== 'All' 
                ? 'No sessions match your search criteria. Try adjusting your query or filter.' 
                : 'You have not recorded or translated any speech yet. Visit the Dashboard to create your first session.'}
            </p>
          </div>
        )}

      </main>

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel p-6 rounded-2xl max-w-sm w-full bg-[#0A0E1A] border border-rose-500/30 space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Delete Speech Record?</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                This will permanently remove the transcription, translation, synthesized audio, and PDF report from your account. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteModalId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-md shadow-rose-900/40 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default History;
