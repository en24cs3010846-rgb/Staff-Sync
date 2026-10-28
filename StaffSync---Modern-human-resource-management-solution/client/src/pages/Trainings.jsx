import { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { useFetch, act, fmt } from '../utils/hooks';
import { State, Badge } from '../components/ui';
export default function Trainings() {
  const { user } = useSelector((s) => s.auth); const manage = user.role !== 'EMPLOYEE'; const [form, setForm] = useState(null);
  const { data, loading, error, reload } = useFetch('/trainings', { limit: 30 });
  const mine = (t) => user.role === 'HR' || t.createdBy?._id === user._id || t.createdBy === user._id;
  const save = async (e) => { e.preventDefault(); const { _id, title, description, instructor, startDate, endDate, location, capacity, department } = form; const b = { title, description, instructor, startDate, endDate, location, capacity: Number(capacity), ...(user.role === 'HR' && department && { department }) }; if (await act(_id ? api.put(`/trainings/${_id}`, b) : api.post('/trainings', b), 'Training saved', reload)) setForm(null); };
  const f = (k, p = {}) => <input className="form-control" required={k !== 'location' && k !== 'department'} placeholder={k} {...p} value={form[k] ?? ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />;
  return (<><div className="d-flex justify-content-between mb-3"><h4>{manage ? 'Training Management' : 'Training Programs'}</h4>{manage && <button className="btn btn-primary" onClick={() => setForm({ capacity: 20 })}>New training</button>}</div>
    {form && <form className="card card-body mb-3" onSubmit={save}><div className="row g-2"><div className="col-md-6">{f('title')}</div><div className="col-md-6">{f('instructor')}</div><div className="col-12"><textarea required className="form-control" placeholder="description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
      <div className="col-md-3">{f('startDate', { type: 'datetime-local' })}</div><div className="col-md-3">{f('endDate', { type: 'datetime-local' })}</div><div className="col-md-3">{f('location')}</div><div className="col-md-3">{f('capacity', { type: 'number', min: 1 })}</div>{user.role === 'HR' && <div className="col-md-4">{f('department')}</div>}</div>
      <div className="mt-2"><button className="btn btn-primary me-2">Save</button><button type="button" className="btn btn-light" onClick={() => setForm(null)}>Cancel</button></div></form>}
    <State loading={loading} error={error} empty={data && !data.items.length}><div className="row g-3">{data?.items.map((t) => <div className="col-md-6" key={t._id}><div className="card h-100"><div className="card-body"><div className="d-flex justify-content-between"><h6>{t.title}</h6><Badge v={t.status} /></div><p className="small text-muted mb-1">{t.instructor} · {fmt(t.startDate)} · {t.location || 'TBA'}</p><p className="small">{t.description}</p>
      <div className="small mb-2">Seats: <b>{t.enrolledCount}/{t.capacity}</b> {t.department && <span className="badge text-bg-light border">{t.department}</span>}</div>
      {user.role !== 'HR' && (t.isEnrolled ? <button className="btn btn-sm btn-outline-danger" onClick={() => act(api.delete(`/trainings/${t._id}/enroll`), 'Enrollment cancelled', reload)}>Cancel enrollment</button> : <button className="btn btn-sm btn-primary" disabled={t.status !== 'Scheduled' || t.enrolledCount >= t.capacity} onClick={() => act(api.post(`/trainings/${t._id}/enroll`), 'Enrolled', reload)}>{t.enrolledCount >= t.capacity ? 'Full' : 'Enroll'}</button>)}
      {manage && mine(t) && <div className="btn-group btn-group-sm ms-2"><button className="btn btn-outline-secondary" onClick={() => setForm({ ...t, startDate: t.startDate?.slice(0, 16), endDate: t.endDate?.slice(0, 16) })}>Edit</button>{['Closed', 'Cancelled', 'Completed'].map((s) => <button key={s} className="btn btn-outline-secondary" onClick={() => window.confirm(`Mark as ${s}?`) && act(api.patch(`/trainings/${t._id}/status`, { status: s }), 'Status updated', reload)}>{s}</button>)}</div>}
      {manage && Array.isArray(t.enrolled) && <div className="small text-muted mt-2">Participants: {t.enrolledCount}</div>}</div></div></div>)}</div></State></>);
}
