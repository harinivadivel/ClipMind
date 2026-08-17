import React, { useEffect, useState } from 'react';
import { FiShield, FiDownload, FiRefreshCw, FiUsers, FiVideo, FiActivity } from 'react-icons/fi';
import adminService from '../../services/adminService.js';

const timeAgo = (date) => {
  if (!date) return '—';
  const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
};

const ReportButton = ({ icon: Icon, label, onClick }) => (
  <button onClick={onClick} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
    <Icon className="text-slate-400" />{label}<FiDownload className="text-slate-400" />
  </button>
);

const AdminAuditReports = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(100);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAuditLogs({ limit });
      setItems(data.items || []);
      setTotal(data.total ?? 0);
    } catch (e) { setItems([]); setTotal(0); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [limit]);

  const run = async (fn, msg) => {
    try { await fn(); setNotice(`${msg} downloaded.`); }
    catch (e) { setNotice('Export failed.'); }
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Audit logs & reports</h2>
          <p className="text-sm text-slate-500">Security-relevant trail and downloadable CSV reports.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ReportButton icon={FiUsers} label="Users CSV" onClick={() => run(adminService.downloadUsersReport, 'Users report')} />
          <ReportButton icon={FiVideo} label="Content CSV" onClick={() => run(adminService.downloadContentReport, 'Content report')} />
          <ReportButton icon={FiActivity} label="Activity CSV" onClick={() => run(adminService.downloadActivityReport, 'Activity report')} />
        </div>
      </div>
      {notice && <p className="text-sm text-emerald-700">{notice}</p>}

      <div className="flex items-center gap-2">
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500">
          <option value={50}>50</option><option value={100}>100</option><option value={200}>200</option>
        </select>
        <button onClick={load} className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-slate-50" title="Refresh"><FiRefreshCw /></button>
        <span className="ml-auto text-sm text-slate-500">{total} audit entries</span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">Time</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">Administrator</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">Action</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">Resource</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">Description</th>
              <th className="px-4 py-2.5 text-right font-medium text-slate-600">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-slate-400">Loading audit trail…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-slate-400">No audit entries yet.</td></tr>
            ) : (
              items.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">{timeAgo(a.created_at)}</td>
                  <td className="px-4 py-3 text-slate-700">{a.user_name || a.user_email}</td>
                  <td className="px-4 py-3"><code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-violet-700">{a.action}</code></td>
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

export default AdminAuditReports;