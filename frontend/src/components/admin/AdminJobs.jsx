import React, { useEffect, useRef, useState } from 'react';
import { FiCpu, FiFileText, FiRefreshCw } from 'react-icons/fi';
import adminService from '../../services/adminService.js';
import { friendlyDate } from './adminUtils.jsx';

const STATUS_COLORS = {
  pending: 'bg-amber-50 text-amber-700',
  processing: 'bg-sky-50 text-sky-700',
  running: 'bg-sky-50 text-sky-700',
  completed: 'bg-emerald-50 text-emerald-700',
  failed: 'bg-rose-50 text-rose-700',
  error: 'bg-rose-50 text-rose-700',
};

const TYPE_LABELS = {
  transcript: { label: 'Transcript', Icon: FiFileText },
  summary: { label: 'Summary', Icon: FiCpu },
};

const ACTIVE_STATUSES = new Set(['pending', 'processing', 'running']);

const AdminJobs = () => {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('');
  const [jobType, setJobType] = useState('');
  const [limit, setLimit] = useState(100);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  const fetchJobs = async () => {
    try {
      const [list, s] = await Promise.all([
        adminService.getJobs({ status: status || undefined, job_type: jobType || undefined, limit }),
        adminService.getJobStats(),
      ]);
      setItems(list.items || []);
      setStats(s);
    } catch (e) { setItems([]); setStats(null); }
  };

  const load = async () => {
    setLoading(true);
    await fetchJobs();
    setLoading(false);
  };
  useEffect(() => { load(); }, [status, jobType, limit]);

  // Keep the latest fetch bound to the current filters via a ref.
  const fetchRef = useRef(fetchJobs);
  fetchRef.current = fetchJobs;

  // Poll continuously while this tab is mounted so transcript / summary
  // generation activity appears and updates live, even if a job was started
  // after the component first loaded.
  useEffect(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => fetchRef.current(), 5000);
    return () => clearInterval(timerRef.current);
  }, [status, jobType, limit]);

  const byStatus = stats?.by_status || {};
  const activeCount = items.filter((j) => ACTIVE_STATUSES.has(j.status)).length;

  return (
    <div className="p-6 space-y-5">
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Object.keys(byStatus).map((key) => (
          <div key={key} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium capitalize text-slate-500">{key}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{byStatus[key]}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400">
          {activeCount > 0 ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-600" />
              </span>
              {activeCount} job{activeCount > 1 ? 's' : ''} running…
            </>
          ) : 'Idle'}
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
        <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500">
          <option value="">All types</option>
          <option value="transcript">Transcript</option>
          <option value="summary">Summary</option>
        </select>
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500">
          <option value={50}>50</option><option value={100}>100</option><option value={200}>200</option>
        </select>
        <button onClick={load} className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-slate-50" title="Refresh"><FiRefreshCw /></button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">Job</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">Type</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">Status</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">Progress</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">Owner</th>
              <th className="px-4 py-2.5 text-right font-medium text-slate-600">Created</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">Error</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan={7} className="py-8 text-center text-slate-400">Loading jobs…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} className="py-8 text-center text-slate-400">No AI processing activity found.</td></tr>
            ) : (
              items.map((j) => {
                const meta = TYPE_LABELS[j.job_type] || { label: j.job_type, Icon: FiCpu };
                const TypeIcon = meta.Icon;
                return (
                  <tr key={j.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{j.video_title || `Video #${j.video_id}`}</p>
                      <p className="text-xs text-slate-400">Job #{j.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                        <TypeIcon className="text-sm" /> {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3"><span className={`capitalize rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[j.status] || 'bg-slate-100 text-slate-600'}`}>{j.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-primary-600" style={{ width: `${j.progress || 0}%` }} /></div>
                        <span className="text-xs text-slate-500">{j.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{j.user_email}</td>
                    <td className="px-4 py-3 text-right text-slate-500">{friendlyDate(j.created_at)}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-slate-500">{j.error_message || '—'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminJobs;