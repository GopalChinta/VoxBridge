import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  LogOut, 
  Mic2, 
  Languages, 
  Volume2, 
  FileText,
  KeyRound
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { historyAPI } from '../api/history';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, audioCount: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await historyAPI.getHistory({ limit: 100 });
        const items = data.items || [];
        const audioCount = items.filter(i => i.generated_audio_url || i.generated_audio_path).length;
        setStats({ total: data.total || 0, audioCount });
      } catch (err) {
        console.error('Failed to load profile stats:', err);
      }
    };
    loadStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'September 2026';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070A11] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Profile Header Card */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-800 bg-[#0B0F1A] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[2px] shadow-glow-brand flex-shrink-0">
              <div className="w-full h-full bg-[#0A0D18] rounded-[14px] flex items-center justify-center text-3xl font-bold text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">{user?.name}</h1>
                  <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{user?.email}</span>
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600/15 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                  <Calendar className="w-3 h-3 text-indigo-400" />
                  Member since {formatDate(user?.created_at)}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">
                  <ShieldCheck className="w-3 h-3" />
                  JWT Authenticated & Isolated
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Processing Activity Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-[#0B0F1A] space-y-2 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto sm:mx-0">
              <Mic2 className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-slate-400">Total Speech Sessions</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-[#0B0F1A] space-y-2 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto sm:mx-0">
              <Languages className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-white">3</div>
            <div className="text-xs text-slate-400">Languages Enabled (EN, TE, HI)</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-[#0B0F1A] space-y-2 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto sm:mx-0">
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.audioCount}</div>
            <div className="text-xs text-slate-400">Synthesized Audio Files</div>
          </div>

        </div>

        {/* Security & Account Settings Info */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-[#0B0F1A] space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <KeyRound className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Account Security & Storage Rules</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#070A12] border border-slate-800">
              <div>
                <p className="font-semibold text-white">Cryptographic Password Protection</p>
                <p className="text-slate-400 text-[11px]">Passwords hashed with salted bcrypt. Plain-text is never stored.</p>
              </div>
              <span className="text-emerald-400 font-medium">Active</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#070A12] border border-slate-800">
              <div>
                <p className="font-semibold text-white">User Record Isolation</p>
                <p className="text-slate-400 text-[11px]">Database records are strictly partitioned by authenticated user ID.</p>
              </div>
              <span className="text-emerald-400 font-medium">Enforced</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#070A12] border border-slate-800">
              <div>
                <p className="font-semibold text-white">Audio & Document Retention</p>
                <p className="text-slate-400 text-[11px]">Deleting a history item immediately removes all associated files from storage.</p>
              </div>
              <span className="text-cyan-400 font-medium">Zero Residual</span>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Profile;
