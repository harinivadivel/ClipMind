import React, { useEffect, useState } from 'react';
import { FiActivity, FiUserCheck, FiUpload, FiShield, FiRefreshCw } from 'react-icons/fi';
import adminService from '../../services/adminService.js';

const Stat = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <p className="text-xs font-medium text-slate-500">{label}</p>
    <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const timeAgo = (date) => {
  if (!date) return '—';
  const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(date));
};

const AdminActivity = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState(null);
  const [action, setAction] = useState('');
  const [limit, setLimit] = useState(50);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [list, s] = await Promise.all([
        adminService.getActivity({ limit, action: action || undefined }),
        adminService.getActivityStats(),
      ]);
      setItems(list.items || []);
      setTotal(list.total ?? 0);
      setStats(s);
    } catch (e) { setItems([]); setTotal(0); setStats(null); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [action, limit]);

  return (
    <div className="p-6 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total events" value={stats?.total_events ?? 0} />
        <Stat label="Logins" value={stats?.logins ?? 0} />
        <Stat label="Video uploads" value={stats?.video_uploads ?? 0} />
        <Stat label="Admin actions" value={stats?.admin_actions ?? 0} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select value={action} onChange={(e) => setAction(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500">
          <option value="">All actions</option>
          <option value="login">Login</option>
          <option value="register">Register</option>
          <option value="video.upload">Video upload</option>
          <option value="video.delete">Video delete</option>
          <option value="admin.settings.update">Settings change</option>
        </select>
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500">
          <option value={25}>25</option><option value={50}>50</option><option value={100}>100</option><option value={200}>200</option>
        </select>
        <button onClick={load} className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-slate-50" title="Refresh"><FiRefreshCw /></button>
        <span className="ml-auto text-sm text-slate-500">{total} shown (up to {limit})</span>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">Time</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">User</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">Action</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">Resource</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">Description</th>
              <th className="px-4 py-2.5 text-right font-medium text-slate-600">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-slate-400">Loading activity…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-slate-400">No activity recorded yet.</td></tr>
            ) : (
              items.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">{timeAgo(a.created_at)}</td>
                  <td className="px-4 py-3 text-slate-700">{a.user_name || a.user_email || 'System'}</td>
                  <td className="px-4 py-3"><code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">{a.action}</code></td>
                  <td className="px-4 py-3 text-slate-600">{a.resource_type ? `${a.resource_type}${a.resource_id ? ` #${a.resource_id}` : ''}` : '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{a.description || '—'}</td>
                  <td className="px-4 py-3 text-right text-slate-400">{a.ip_address || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminActivity;