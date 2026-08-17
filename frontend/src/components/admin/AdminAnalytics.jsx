import React, { useEffect, useState } from 'react';
import { FiEye, FiUsers, FiClock, FiPlay, FiFileText, FiZap, FiHardDrive, FiRefreshCw } from 'react-icons/fi';
import adminService from '../../services/adminService.js';
import { formatBytes } from './adminUtils.jsx';

const Card = ({ label, value, icon: Icon, tone }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <div className="flex items-center justify-between">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}><Icon /></span>
    </div>
    <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setData(await adminService.getSystemAnalytics()); } catch (e) { setData(null); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  if (loading) return <div className="p-6 text-sm text-slate-400">Loading analytics…</div>;
  const d = data || {};

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Platform analytics</h2>
        <button onClick={load} className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-slate-50" title="Refresh"><FiRefreshCw /></button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Total videos" value={d.total_videos ?? 0} icon={FiPlay} tone="bg-sky-50 text-sky-700" />
        <Card label="Total views" value={d.total_views ?? 0} icon={FiEye} tone="bg-emerald-50 text-emerald-700" />
        <Card label="Unique viewers" value={d.total_unique_viewers ?? 0} icon={FiUsers} tone="bg-violet-50 text-violet-700" />
        <Card label="Watch time (h)" value={d.total_watch_time_hours ?? 0} icon={FiClock} tone="bg-amber-50 text-amber-700" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Avg views / video" value={d.avg_views_per_video ?? 0} icon={FiPlay} tone="bg-fuchsia-50 text-fuchsia-700" />
        <Card label="Transcripts" value={d.total_transcripts ?? 0} icon={FiFileText} tone="bg-indigo-50 text-indigo-700" />
        <Card label="Summaries" value={d.total_summaries ?? 0} icon={FiZap} tone="bg-cyan-50 text-cyan-700" />
        <Card label="Key moments" value={d.total_key_moments ?? 0} icon={FiZap} tone="bg-rose-50 text-rose-700" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Users with content" value={d.total_users_with_videos ?? 0} icon={FiUsers} tone="bg-emerald-50 text-emerald-700" />
        <Card label="Total storage" value={formatBytes(d.total_storage_bytes)} icon={FiHardDrive} tone="bg-slate-100 text-slate-700" />
      </div>
    </div>
  );
};

export default AdminAnalytics;