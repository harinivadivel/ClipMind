import React, { useEffect, useState } from 'react';
import { FiSave, FiRefreshCw, FiCheck } from 'react-icons/fi';
import adminService from '../../services/adminService.js';

const AdminSettings = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const data = await adminService.getPlatformSettings();
      setItems(data.items || []);
    } catch (e) { setError('Unable to load platform settings.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const setValue = (key, value) => {
    setItems((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true); setError(''); setSaved(false);
    try {
      const payload = {};
      items.forEach((s) => { payload[s.key] = String(s.value); });
      await adminService.updatePlatformSettings(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { setError(e.response?.data?.detail || 'Could not save settings.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-6 max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Platform settings</h2>
          <p className="text-sm text-slate-500">Configuration applied platform-wide (administrator only).</p>
        </div>
        <button onClick={load} className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-slate-50" title="Refresh"><FiRefreshCw /></button>
      </div>

      {error && <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-400">Loading settings…</p>
      ) : (
        <div className="space-y-3">
          {items.map((s) => {
            const input = s.value_type === 'boolean' ? (
              <select value={s.value} onChange={(e) => setValue(s.key, e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary-500">
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            ) : s.value_type === 'number' ? (
              <input type="number" value={s.value} onChange={(e) => setValue(s.key, e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-500" />
            ) : (
              <input value={s.value} onChange={(e) => setValue(s.key, e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary-500" />
            );
            return (
              <div key={s.key} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{s.key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                  <p className="text-xs text-slate-500">{s.description}</p>
                </div>
                <div className="w-40">{input}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
          <FiSave />{saving ? 'Saving…' : 'Save settings'}
        </button>
        {saved && <span className="inline-flex items-center gap-1 text-sm text-emerald-700"><FiCheck />Settings saved</span>}
      </div>
    </div>
  );
};

export default AdminSettings;