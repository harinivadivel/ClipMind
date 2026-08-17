import React, { useEffect, useState } from 'react';
import {
  FiUsers, FiActivity, FiUserCheck, FiUserX, FiShield, FiVideo,
  FiFileText, FiHardDrive, FiClock, FiPlay, FiAlertCircle,
} from 'react-icons/fi';
import adminService from '../../services/adminService.js';

const StatCard = ({ label, value, icon: Icon, tone, detail }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        {detail && <p className="mt-2 text-xs font-medium text-slate-400">{detail}</p>}
      </div>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}><Icon className="text-xl" /></div>
    </div>
  </div>
);

const formatStorage = (bytes) => {
  if (!bytes) return '0 B';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
  return `${mb.toFixed(1)} MB`;
};

const AdminOverview = () => {
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [activityStats, setActivityStats] = useState(null);
  const [jobStats, setJobStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [dash, ana, act, jobs] = await Promise.all([
          adminService.getDashboard().catch(() => null),
          adminService.getSystemAnalytics().catch(() => null),
          adminService.getActivityStats().catch(() => null),
          adminService.getJobStats().catch(() => null),
        ]);
        setDashboard(dash);
        setAnalytics(ana);
        setActivityStats(act);
        setJobStats(jobs);
      } catch (err) {
        setError('Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (<div key={i} className="h-32 rounded-2xl bg-slate-100" />))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-sm text-rose-600">{error}</div>;
  }

    const totalVideos = dashboard?.total_videos ?? analytics?.total_videos ?? 0;
  const friendlyDate = (d) => d ? new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d)) : '—';

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Administrator Overview</h1>
          <p className="mt-1 text-sm text-slate-500">
            Platform snapshots — last updated {friendlyDate(new Date().toISOString())}
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={dashboard?.total_users ?? 0} icon={FiUsers} tone="bg-violet-50 text-violet-700" />
        <StatCard label="Active users" value={dashboard?.active_users ?? 0} icon={FiUserCheck} tone="bg-emerald-50 text-emerald-700" />
        <StatCard label="Blocked users" value={dashboard?.blocked_users ?? 0} icon={FiUserX} tone="bg-rose-50 text-rose-700" />
        <StatCard label="Administrators" value={dashboard?.admin_users ?? 0} icon={FiShield} tone="bg-amber-50 text-amber-700" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total videos" value={totalVideos} icon={FiVideo} tone="bg-sky-50 text-sky-700" />
        <StatCard label="Transcripts" value={dashboard?.total_transcripts ?? analytics?.total_transcripts ?? 0} icon={FiFileText} tone="bg-indigo-50 text-indigo-700" />
        <StatCard label="Summaries" value={dashboard?.total_summaries ?? analytics?.total_summaries ?? 0} icon={FiFileText} tone="bg-cyan-50 text-cyan-700" />
        <StatCard label="Storage used" value={formatStorage(dashboard?.total_storage ?? analytics?.total_storage_bytes ?? 0)} detail="across all uploads" icon={FiHardDrive} tone="bg-slate-100 text-slate-700" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total views" value={analytics?.total_views ?? 0} icon={FiActivity} tone="bg-fuchsia-50 text-fuchsia-700" />
        <StatCard label="Unique viewers" value={analytics?.total_unique_viewers ?? 0} icon={FiUsers} tone="bg-emerald-50 text-emerald-700" />
        <StatCard label="Watch time" value={`${analytics?.total_watch_time_hours ?? 0} h`} icon={FiClock} tone="bg-sky-50 text-sky-700" />
        <StatCard label="Avg views/video" value={analytics?.avg_views_per_video ?? 0} detail="platform average" icon={FiPlay} tone="bg-amber-50 text-amber-700" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Activity events" value={activityStats?.total_events ?? 0} icon={FiActivity} tone="bg-fuchsia-50 text-fuchsia-700" />
        <StatCard label="Logins" value={activityStats?.logins ?? 0} icon={FiUserCheck} tone="bg-cyan-50 text-cyan-700" />
        <StatCard label="Processing jobs" value={jobStats?.total ?? 0} icon={FiClock} tone="bg-indigo-50 text-indigo-700" />
        <StatCard label="Failed jobs" value={jobStats?.failed ?? 0} icon={FiAlertCircle} tone="bg-rose-50 text-rose-700" />
      </div>

      {(activityStats?.top_actions?.length > 0) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-slate-500">Top activity actions</h2>
          <ul className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {activityStats.top_actions.map(({ action, count }) => (
              <li key={action} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <span className="text-slate-600">{action}</span>
                <span className="font-bold text-slate-900">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default AdminOverview;
