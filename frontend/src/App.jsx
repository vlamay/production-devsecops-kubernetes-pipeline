import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import './index.css';

// ─── Configuration ───────────────────────────────────────────────
// ─── Configuration ───────────────────────────────────────────────
// Use the same host as the window to avoid CORS/PNA issues where possible
const detectedHost = window.location.hostname === 'localhost' ? 'localhost' : '127.0.0.1';
const API_BASE = "/api";
const HEALTH_POLL_INTERVAL = 30_000;

console.log(`[Sentinel-Auth] App Origin: ${window.location.origin}`);
console.log(`[Sentinel-Auth] Target API: ${API_BASE}`);

const api = axios.create({ baseURL: API_BASE, timeout: 5000 });

/* ═══════════════════════════════════════════════════════════════
   ICONS (inline SVGs)
   ═══════════════════════════════════════════════════════════════ */
const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#a78bfa" /></linearGradient></defs>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const RefreshIcon = ({ spinning }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={spinning ? 'spin-animation' : ''}>
    <path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);

const ServerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);

const ActivityIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   TAB BUTTON
   ═══════════════════════════════════════════════════════════════ */
function TabButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-semibold tracking-widest uppercase transition-all duration-300 cursor-pointer relative
        ${active
          ? 'text-indigo-400'
          : 'text-slate-500 hover:text-slate-300'
        }`}
    >
      {icon}
      {label}
      {active && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REGISTER FORM
   ═══════════════════════════════════════════════════════════════ */
function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/register', { username, password });
      toast.success('Account Created Successfully!', { icon: '🛡️' });
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error('[Sentinel-Auth] Registration Error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        config: err.config
      });

      if (err.response?.status === 400) {
        toast.error('Username already taken', { icon: '❌' });
      } else if (err.response?.status === 422) {
        toast.error('Invalid input — check requirements', { icon: '⚠️' });
      } else if (err.code === 'ERR_NETWORK') {
        toast.error('Network Error: Check if Backend is running at 127.0.0.1:8000', { icon: '📡' });
      } else {
        toast.error(`Backend error: ${err.message}`, { icon: '📡' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-5 animate-fade-up">
      {/* Username */}
      <div className="space-y-1.5">
        <label htmlFor="reg-username" className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
          <UserIcon /> Username
        </label>
        <input
          id="reg-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. sentinel_admin"
          required
          minLength={3}
          className="input-glow w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-slate-100
                     placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50
                     transition-all duration-200 font-medium"
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="reg-password" className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
          <LockIcon /> Password
        </label>
        <input
          id="reg-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          required
          minLength={8}
          className="input-glow w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-slate-100
                     placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50
                     transition-all duration-200 font-medium"
        />
        <p className="text-[10px] text-slate-600 mt-1">Must be at least 8 characters long</p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide
                   bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500
                   active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 cursor-pointer
                   shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="spin-animation h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Creating Account…
          </span>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SYSTEM STATUS PANEL
   ═══════════════════════════════════════════════════════════════ */
function SystemStatus() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);

  const fetchHealth = useCallback(async () => {
    setRefreshing(true);
    try {
      const { data } = await api.get('/health');
      setHealth(data);
      setError(false);
      setLastCheck(new Date());
    } catch {
      setHealth(null);
      setError(true);
      setLastCheck(new Date());
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, HEALTH_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  const isOnline = !error && health?.status === 'ok';

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Status Banner */}
      <div className={`relative overflow-hidden rounded-xl border p-5 transition-all duration-500
        ${isOnline
          ? 'bg-emerald-500/[0.06] border-emerald-500/20'
          : 'bg-red-500/[0.06] border-red-500/20'
        }`}>
        {/* Subtle gradient background */}
        <div className={`absolute inset-0 opacity-30
          ${isOnline
            ? 'bg-gradient-to-br from-emerald-500/10 to-transparent'
            : 'bg-gradient-to-br from-red-500/10 to-transparent'
          }`} />

        <div className="relative flex items-center gap-4">
          {isOnline ? <div className="pulse-dot" /> : <div className="pulse-dot-red" />}
          <div>
            <p className={`text-sm font-bold ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
              {isOnline ? 'All Systems Operational' : 'Service Unreachable'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {lastCheck
                ? `Checked at ${lastCheck.toLocaleTimeString()}`
                : 'Checking…'}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={<ServerIcon />}
          label="API Status"
          value={health?.status?.toUpperCase() ?? '—'}
          valueColor={isOnline ? 'text-emerald-400' : 'text-red-400'}
        />
        <MetricCard
          icon={<ActivityIcon />}
          label="Endpoint"
          value={API_BASE.replace('http://', '')}
          valueColor="text-slate-300"
          mono
        />
      </div>

      {/* Timestamp */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1.5">Server Timestamp</p>
        <p className="font-mono text-xs text-slate-300">
          {health?.timestamp
            ? new Date(health.timestamp).toLocaleString()
            : '—'}
        </p>
      </div>

      {/* Refresh Button */}
      <button
        onClick={fetchHealth}
        disabled={refreshing}
        className="w-full py-3 rounded-xl font-semibold text-xs tracking-wider uppercase
                   bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.12]
                   active:scale-[0.98] disabled:opacity-50
                   transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
      >
        <RefreshIcon spinning={refreshing} />
        {refreshing ? 'Checking…' : 'Manual Refresh'}
      </button>

      {/* Auto-poll notice */}
      <p className="text-center text-[10px] text-slate-600">
        Auto-refreshes every 30 seconds
      </p>
    </div>
  );
}

/* ─── Metric card ──────────────────────────────────────────── */
function MetricCard({ icon, label, value, valueColor, mono }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors duration-200">
      <div className="flex items-center gap-1.5 mb-2">
        {icon}
        <p className="text-[10px] uppercase tracking-widest text-slate-500">{label}</p>
      </div>
      <p className={`text-sm font-bold ${mono ? 'font-mono text-xs' : ''} ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TOAST THEME
   ═══════════════════════════════════════════════════════════════ */
const toastOptions = {
  style: {
    background: '#1e293b',
    color: '#f1f5f9',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '500',
    padding: '12px 16px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
  },
  success: {
    style: { borderLeft: '3px solid #22c55e' },
  },
  error: {
    style: { borderLeft: '3px solid #ef4444' },
  },
};

/* ═══════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [tab, setTab] = useState('register');

  return (
    <>
      <Toaster position="top-right" toastOptions={toastOptions} />

      {/* Animated background */}
      <div className="bg-glow" />
      <div className="grid-pattern" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md mx-auto px-5 py-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <ShieldIcon />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Sentinel</span>
            <span className="text-slate-400 font-light">-Auth</span>
          </h1>
          <p className="text-slate-600 text-xs mt-2 tracking-wide">Secure Registration Service</p>
        </div>

        {/* Card */}
        <div className="card-shine rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl shadow-2xl shadow-black/40">
          {/* Tabs */}
          <div className="flex border-b border-white/[0.06]">
            <TabButton icon={<UserIcon />} label="Register" active={tab === 'register'} onClick={() => setTab('register')} />
            <TabButton icon={<ServerIcon />} label="Status" active={tab === 'status'} onClick={() => setTab('status')} />
          </div>

          {/* Tab Content */}
          <div className="p-6" key={tab}>
            {tab === 'register' ? <RegisterForm /> : <SystemStatus />}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-700 text-[10px] mt-6 tracking-wider">
          &copy; {new Date().getFullYear()} SENTINEL-AUTH &middot; SECURE BY DESIGN
        </p>
      </div>
    </>
  );
}
