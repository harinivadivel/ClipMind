import React, { useEffect, useMemo, useState } from 'react';
import {
  FiSearch, FiUserPlus, FiUserCheck, FiUserX, FiKey, FiTrash2,
  FiSave, FiX,
} from 'react-icons/fi';
import adminService from '../../services/adminService.js';
import { roleOptions, roleStyles, initials, friendlyDate, StatusBadge, RoleBadge } from './adminUtils.jsx';

const ROLES = ['All roles', ...roleOptions];
const STATUSES = ['All statuses', 'Active', 'Blocked'];

const AddUserModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({ full_name: '', email: '', username: '', password: '', role_name: 'Learner' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await adminService.createUser(form);
      await onCreated(form.full_name);
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not create the user.');
    } finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4" onMouseDown={onClose}>
      <form onSubmit={submit} className="w-full max-w-lg rounded-2xl bg-white shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div><h2 className="font-bold text-slate-900">Add user</h2><p className="mt-1 text-sm text-slate-500">Create an account and assign its access level.</p></div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><FiX /></button>
        </div>
        {error && <p className="px-5 pt-3 text-sm text-rose-600">{error}</p>}
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="sm:col-span-2 text-sm font-medium text-slate-700">Full name<input required name="full_name" value={form.full_name} onChange={update} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-primary-500" /></label>
          <label className="sm:col-span-2 text-sm font-medium text-slate-700">Email<input required type="email" name="email" value={form.email} onChange={update} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-primary-500" /></label>
          <label className="text-sm font-medium text-slate-700">Username<input required minLength={3} name="username" value={form.username} onChange={update} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-primary-500" /></label>
          <label className="text-sm font-medium text-slate-700">Role<select name="role_name" value={form.role_name} onChange={update} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-primary-500">{roleOptions.map((r) => <option key={r} value={r}>{r}</option>)}</select></label>
          <label className="sm:col-span-2 text-sm font-medium text-slate-700">Temporary password<input required minLength={8} type="password" name="password" value={form.password} onChange={update} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-primary-500" /></label>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 p-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"><FiSave />{saving ? 'Creating…' : 'Create user'}</button>
        </div>
      </form>
    </div>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All roles');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState('');

  const load = async () => {
    setLoading(true);
    try { setUsers(await adminService.getAllUsers()); } catch (e) { setUsers([]); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => users.filter((u) => {
    const role = u.role_name || u.role || 'Learner';
    const q = `${u.full_name} ${u.email}`.toLowerCase();
    return q.includes(query.toLowerCase())
      && (roleFilter === 'All roles' || role === roleFilter)
      && (statusFilter === 'All statuses' || (statusFilter === 'Active' ? u.is_active : !u.is_active));
  }), [users, query, roleFilter, statusFilter]);

  const act = async (fn, success) => {
    try { await fn(); setNotice(success); load(); }
    catch (err) { setNotice(err.response?.data?.detail || 'Action failed.'); }
  };
  const toggleStatus = (u) => act(() => adminService.updateUserStatus(u.id, !u.is_active), `${u.full_name} ${u.is_active ? 'blocked' : 'activated'}.`);
  const changeRole = (u, r) => act(() => adminService.updateUserRole(u.id, r), `Role updated for ${u.full_name}.`);
  const resetPw = (u) => act(() => adminService.resetUserPassword(u.id), `Password reset for ${u.full_name}.`);
  const del = (u) => {
    if (!window.confirm(`Delete ${u.full_name}? This cannot be undone.`)) return;
    act(() => adminService.deleteUser(u.id), `${u.full_name} deleted.`);
  };
  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users..." className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2 text-sm outline-none focus:border-primary-500" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500">{ROLES.map((r) => <option key={r} value={r}>{r}</option>)}</select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500">{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
          <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-primary-700"><FiUserPlus />Add user</button>
        </div>
      </div>
      {notice && <p className="mb-3 text-sm text-emerald-700">{notice}</p>}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">User</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">Role</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">Status</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-600">Content</th>
              <th className="px-4 py-2.5 text-right font-medium text-slate-600">Created</th>
              <th className="px-4 py-2.5 text-center font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-slate-400">Loading users…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-slate-400">No users match your filters.</td></tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-full font-bold ${roleStyles[u.role_name || u.role || 'Learner']}`}>{initials(u.full_name)}</span>
                      <div><p className="font-medium text-slate-900">{u.full_name}</p><p className="text-slate-500">{u.email}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select onChange={(e) => changeRole(u, e.target.value)} className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 outline-none focus:border-primary-500">
                      <option value="">{u.role_name || u.role || 'Learner'}</option>
                      {roleOptions.filter((r) => r !== (u.role_name || u.role)).map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3"><StatusBadge active={u.is_active} /></td>
                  <td className="px-4 py-3 text-slate-600">{u.stats?.videos ?? 0} videos · {u.stats?.storage ? `${u.stats.storage} B` : ''}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{friendlyDate(u.created_at)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-1.5">
                      <button onClick={() => toggleStatus(u)} className="rounded-lg p-1 text-slate-500 hover:text-emerald-700" title={u.is_active ? 'Block' : 'Activate'}>{u.is_active ? <FiUserX /> : <FiUserCheck />}</button>
                      <button onClick={() => resetPw(u)} className="rounded-lg p-1 text-slate-500 hover:text-primary-700" title="Reset password"><FiKey /></button>
                      <button onClick={() => del(u)} className="rounded-lg p-1 text-slate-500 hover:text-rose-700" title="Delete user"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {adding && <AddUserModal onClose={() => setAdding(false)} onCreated={(name) => { setNotice(`Created ${name}.`); setAdding(false); load(); }} />}
    </div>
  );
};

export default AdminUsers;
