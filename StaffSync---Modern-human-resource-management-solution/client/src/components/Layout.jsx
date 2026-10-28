import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutDashboard, Users, UserCog, CalendarCheck, FileText, Megaphone, GraduationCap, BarChart3, Bell, User, LogOut, Menu } from 'lucide-react';
import { logout } from '../store';
import api from '../services/api';
import { Logo } from './ui';
const NAV = {
  HR: [['', 'Overview', LayoutDashboard], ['employees', 'Employees', Users], ['managers', 'Managers', UserCog], ['attendance', 'Attendance', CalendarCheck], ['leaves', 'Leave Management', FileText], ['announcements', 'Announcements', Megaphone], ['trainings', 'Training Programs', GraduationCap], ['reports', 'Reports & Analytics', BarChart3], ['notifications', 'Notifications', Bell], ['profile', 'Settings', User]],
  MANAGER: [['', 'Overview', LayoutDashboard], ['team', 'My Team', Users], ['attendance', 'Team Attendance', CalendarCheck], ['leaves', 'Leave Approvals', FileText], ['trainings', 'Training & Development', GraduationCap], ['announcements', 'Announcements', Megaphone], ['notifications', 'Notifications', Bell], ['profile', 'Profile', User]],
  EMPLOYEE: [['', 'Overview', LayoutDashboard], ['profile', 'My Profile', User], ['attendance', 'Attendance', CalendarCheck], ['leaves', 'Leaves', FileText], ['announcements', 'Announcements', Megaphone], ['trainings', 'Training Programs', GraduationCap], ['notifications', 'Notifications', Bell]],
};
export default function Layout() {
  const { user } = useSelector((s) => s.auth); const d = useDispatch(); const nav = useNavigate();
  const [open, setOpen] = useState(false), [unread, setUnread] = useState(0);
  useEffect(() => { const f = () => api.get('/notifications', { params: { limit: 1 } }).then((r) => setUnread(r.data.unread)).catch(() => {}); f(); const t = setInterval(f, 30000); return () => clearInterval(t); }, []);
  const out = async () => { await d(logout()); nav('/login'); };
  return (<div>
    <aside className={`side ${open ? 'open' : ''}`}><div className="p-3 mb-2"><Logo /></div>
      {NAV[user.role].map(([p, l, I]) => <NavLink key={p} end={p === ''} to={`/app/${p}`} onClick={() => setOpen(false)}><I size={18} />{l}{p === 'notifications' && unread > 0 && <span className="badge text-bg-danger ms-auto">{unread}</span>}</NavLink>)}
      <a role="button" onClick={out}><LogOut size={18} />Logout</a></aside>
    <div className="main"><header className="bg-white border-bottom px-3 py-2 d-flex align-items-center gap-3">
      <button className="btn btn-light d-lg-none" onClick={() => setOpen(!open)}><Menu size={18} /></button>
      <div className="ms-auto text-end small"><div className="fw-semibold">{user.name}</div><div className="text-muted">{user.role} · {user.employeeId}</div></div></header>
      <main className="p-3 p-lg-4"><Outlet /></main></div></div>);
}
