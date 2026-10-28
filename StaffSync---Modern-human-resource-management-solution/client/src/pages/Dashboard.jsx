import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, UserCheck, UserX, FileText, GraduationCap, Clock } from 'lucide-react';
import { useFetch, fmtT } from '../utils/hooks';
import { State, Stat, Badge } from '../components/ui';
const COL = ['#0f766e', '#2563eb', '#d97706', '#9333ea', '#dc2626', '#64748b'];
const Charts = ({ d }) => (<div className="row g-3 mt-1">
  <div className="col-lg-6"><div className="card"><div className="card-body"><h6>Attendance — last 7 days</h6><div style={{ height: 240 }}><ResponsiveContainer><BarChart data={d.attendanceTrend}><XAxis dataKey="date" tickFormatter={(x) => x.slice(5)} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="present" fill="#0f766e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></div></div></div>
  {[['Department distribution', d.departments], ['Leave requests by status', d.leaveStatus]].map(([t, data]) => <div className="col-lg-3" key={t}><div className="card"><div className="card-body"><h6>{t}</h6><div style={{ height: 240 }}><ResponsiveContainer><PieChart><Pie data={data} dataKey="value" nameKey="label" outerRadius={70}>{data.map((_, i) => <Cell key={i} fill={COL[i % COL.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div></div></div></div>)}</div>);
function Staff({ url, manager }) {
  const { data, loading, error } = useFetch(url);
  return <State loading={loading} error={error}>{data && <><div className="row g-3">
    <Stat label={manager ? 'Team members' : 'Total employees'} value={data.totals.total} icon={Users} /><Stat label="Present today" value={data.totals.presentToday} icon={UserCheck} />
    <Stat label="Absent today" value={data.totals.absentToday} icon={UserX} /><Stat label="Pending leaves" value={data.totals.pendingLeaves} icon={FileText} />
    {!manager && <><Stat label="Active employees" value={data.totals.active} icon={Users} /><Stat label="Managers" value={data.totals.managers} icon={Users} /></>}<Stat label="Late today" value={data.totals.lateToday} icon={Clock} /><Stat label="Upcoming trainings" value={data.totals.upcomingTrainings} icon={GraduationCap} /></div>
    <Charts d={data} />{manager && <div className="card mt-3"><div className="card-body"><h6>Team performance indicators</h6><p className="mb-1">Average working hours (30 days): <b>{data.performance.avgWorkingHours30d}</b> · Attendance records: <b>{data.performance.attendanceRecords30d}</b></p><small className="text-muted">{data.performance.note}</small></div></div>}</>}</State>;
}
function Employee() {
  const a = useFetch('/attendance/me', { limit: 1 }), l = useFetch('/leaves/me'), n = useFetch('/announcements', { limit: 3 }), t = useFetch('/trainings', { status: 'Scheduled', limit: 3 });
  const today = a.data?.today, pend = l.data?.items.filter((x) => x.status === 'Pending').length;
  return <State loading={a.loading || l.loading} error={a.error || l.error}><div className="row g-3">
    <Stat label="Today" value={today ? (today.checkOut ? 'Checked out' : today.status) : 'Not checked in'} icon={UserCheck} /><Stat label="Check-in" value={fmtT(today?.checkIn)} icon={Clock} /><Stat label="Check-out" value={fmtT(today?.checkOut)} icon={Clock} /><Stat label="Pending leaves" value={pend} icon={FileText} /></div>
    <div className="row g-3 mt-1"><div className="col-lg-4"><div className="card h-100"><div className="card-body"><h6>Leave balance <small className="text-muted">(default policy, illustrative)</small></h6>{l.data && Object.entries(l.data.balances).map(([k, v]) => <div key={k} className="d-flex justify-content-between"><span>{k}</span><b>{v.remaining} / {v.entitled}</b></div>)}</div></div></div>
      <div className="col-lg-4"><div className="card h-100"><div className="card-body"><h6>Recent announcements</h6>{n.data?.items.map((x) => <div key={x._id} className="small mb-2"><b>{x.title}</b><div className="text-muted">{x.category}</div></div>)}{!n.data?.items.length && <small className="text-muted">None</small>}</div></div></div>
      <div className="col-lg-4"><div className="card h-100"><div className="card-body"><h6>Upcoming training</h6>{t.data?.items.map((x) => <div key={x._id} className="small mb-2"><b>{x.title}</b> <Badge v={x.isEnrolled ? 'Approved' : 'Scheduled'} /></div>)}{!t.data?.items.length && <small className="text-muted">None</small>}</div></div></div></div></State>;
}
export default function Dashboard() { const { user } = useSelector((s) => s.auth); return <><h4 className="mb-3">Welcome, {user.name.split(' ')[0]}</h4>{user.role === 'HR' ? <Staff url="/analytics/hr" /> : user.role === 'MANAGER' ? <Staff url="/analytics/manager" manager /> : <Employee />}</>; }
