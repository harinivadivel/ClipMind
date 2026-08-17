import { FiUserCheck, FiUserX, FiShield } from 'react-icons/fi';

export const roleStyles = {
  Administrator: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  'Content Creator': 'bg-sky-50 text-sky-700 ring-sky-600/20',
  Educator: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Learner: 'bg-amber-50 text-amber-700 ring-amber-600/20',
};

export const roleOptions = [
  'Administrator', 'Content Creator', 'Educator', 'Learner',
];

export const initials = (name = 'User') =>
  name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

export const friendlyDate = (date) =>
  date ? new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date)) : '—';

export const StatusBadge = ({ active }) =>
  active ? (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50">
      <FiUserCheck className="mr-1" /> Active
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-rose-700 bg-rose-50">
      <FiUserX className="mr-1" /> Blocked
    </span>
  );

export const RoleBadge = ({ role }) => {
  const style = roleStyles[role] || roleStyles.Learner;
  const Icon = role === 'Administrator' || role === 'Content Creator' ? FiShield : FiUserCheck;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${style}`}>
      <Icon className="mr-1" />{role}
    </span>
  );
};

export const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
  return `${mb.toFixed(1)} MB`;
};
