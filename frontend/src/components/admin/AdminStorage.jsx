import React, { useEffect, useState } from 'react';
import { FiHardDrive, FiVideo, FiFileText, FiZap, FiRefreshCw } from 'react-icons/fi';
import adminService from '../../services/adminService.js';
import { formatBytes } from './adminUtils.jsx';

const Card = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <p className="text-xs font-medium text-slate-500">{label}</p>
    <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const AdminStorage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setData(await adminService.getStorage()); } catch (e) { setData(null); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  if (loading) return <div className="p-6 text-sm text-slate-400">Loading storage report…</div>;

  const d = data || {};
  const perUser = d.per_user || [];
  const max = perUser.length ? Math.max(...perUser.map((u) => u.storage_bytes)) : 0;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Storage & resource utilization</h2>
        <button onClick={load} className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-slate-50" title="Refresh"><FiRefreshCw /></button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Total storage" value={formatBytes(d.total_storage_bytes)} />
        <Card label="Videos" value={d.total_videos ?? 0} />
        <Card label="Transcripts" value={d.total_transcripts ?? 0} />
        <Card label="Summaries" value={d.total_summaries ?? 0} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Key moments" value={d.total_key_moments ?? 0} />
        <Card label="Analytics records" value={d.total_analytics_records ?? 0} />
        <Card label="Max upload cap" value={d.max_upload_bytes ? formatBytes(d.max_upload_bytes) : 'Uncapped'} />
        <Card label="Active storage users" value={perUser.length} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-medium text-slate-500">Storage by user (top users)</h3>
        <div className="mt-3 space-y-3">
          {perUser.length === 0 && <p className="text-sm text-slate-400">No uploads yet.</p>}
          {perUser.map((u, idx) => (
            <div key={u.user_id} className="flex items-center gap-3">
              <span className="w-6 text-xs text-slate-400">{idx + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-800">{u.name || u.email}</span>
                  <span className="text-slate-500">{formatBytes(u.storage_bytes)} · {u.videos} videos</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-primary-600" style={{ width: `${max ? (u.storage_bytes / max) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminStorage;