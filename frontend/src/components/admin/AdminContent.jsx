import React, { useEffect, useState } from 'react';
import { FiSearch, FiTrash2, FiRefreshCw, FiPlay } from 'react-icons/fi';
import adminService from '../../services/adminService.js';
import { friendlyDate, formatBytes } from './adminUtils.jsx';

const AdminContent = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');

  const load = async (q) => {
    setLoading(true); setNotice('');
    try {
      const data = await adminService.getAllContent({ limit: 200, search: q || undefined });
      setItems(data.items || []);
      setTotal(data.total ?? 0);
    } catch (e) {
      setItems([]); setTotal(0);
    } finally { setLoading(false); }
  };
  useEffect(() => {
    const t = setTimeout(() => load(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const del = async (v) => {
    if (!window.confirm(`Delete "${v.title}"? This removes the video and all associated AI content.`)) return;
    try {
      await adminService.deleteContent(v.id);
      setNotice(`Deleted "${v.title}".`);
      load(search);
    } catch (err) { setNotice(err.response?.data?.detail || 'Delete failed.'); }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title or owner email..." className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2 text-sm outline-none focus:border-primary-500" />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          {total} total videos
          <button onClick={() => load(search)} className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50" title="Refresh"><FiRefreshCw /></button>
        </div>
      </div>
      {notice && <p className="mb-3 text-sm text-emerald-700">{notice}</p>}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">Video</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">Owner</th>
              <th className="px-4 py-2.5 text-center font-medium text-slate-600">Status</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">AI content</th>
              <th className="px-4 py-2.5 text-right font-medium text-slate-600">Size</th>
              <th className="px-4 py-2.5 text-right font-medium text-slate-600">Uploaded</th>
              <th className="px-4 py-2.5 text-center font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan={7} className="py-8 text-center text-slate-400">Loading content…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} className="py-8 text-center text-slate-400">No uploaded content found.</td></tr>
            ) : (
              items.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {v.thumbnail_url ? (
                        <img src={v.thumbnail_url} alt="" className="h-10 w-16 rounded-lg object-cover" />
                      ) : (
                        <span className="flex h-10 w-16 items-center justify-center rounded-lg bg-slate-100 text-slate-400"><FiPlay /></span>
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{v.title}</p>
                        <p className="text-xs text-slate-400">ID {v.id} · {(v.duration || 0).toFixed(1)}s</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{v.owner_email || `User #${v.user_id}`}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${v.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{v.is_published ? 'Published' : 'Unpublished'}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{v.counts?.transcripts ?? 0} T · {v.counts?.summaries ?? 0} S · {v.counts?.key_moments ?? 0} KM</td>
                  <td className="px-4 py-3 text-right text-slate-600">{formatBytes(v.file_size)}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{friendlyDate(v.created_at)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-1.5">
                      <button onClick={() => del(v)} className="rounded-lg p-1 text-slate-500 hover:text-rose-700" title="Delete video"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminContent;