import { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { useFetch, act, fmt, fmtT } from '../utils/hooks';
import { State, Table, Pager, Badge } from '../components/ui';
function Mine() {
  const [page, setPage] = useState(1); const { data, loading, error, reload } = useFetch('/attendance/me', { page, limit: 7 }); const t = data?.today;
  const total = data?.items.reduce((s, x) => s + x.workingHours, 0) || 0;
  return (<><div className="card card-body mb-3 d-flex flex-row justify-content-between align-items-center"><div><div className="fw-semibold">Today: {t ? (t.checkOut ? 'Completed' : `Checked in at ${fmtT(t.checkIn)}`) : 'Not checked in'}</div><small className="text-muted">Time is recorded by the server.</small></div>
    {!t ? <button className="btn btn-primary" onClick={() => act(api.post('/attendance/check-in'), 'Checked in', reload)}>Check in</button> : !t.checkOut ? <button className="btn btn-primary" onClick={() => act(api.post('/attendance/check-out'), 'Checked out', reload)}>Check out</button> : <Badge v={t.status} />}</div>
    <div className="card"><State loading={loading} error={error} empty={data && !data.items.length}>{data && <><Table rows={data.items} cols={[{ h: 'Date', r: (x) => x.date }, { h: 'In', r: (x) => fmtT(x.checkIn) }, { h: 'Out', r: (x) => fmtT(x.checkOut) }, { h: 'Hours', r: (x) => x.workingHours }, { h: 'Status', r: (x) => <Badge v={x.status} /> }]} /><div className="px-3 pb-3"><small className="text-muted">Hours on this page: {total.toFixed(2)}</small><Pager page={page} total={data.total} limit={7} set={setPage} /></div></>}</State></div></>);
}
function Staff({ hr }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)), [status, setStatus] = useState(''), [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch(hr ? '/attendance' : '/attendance/team', { date, status, page, limit: 10 });
  const fix = (r) => { const reason = window.prompt('Reason for correction (required):'); if (reason?.trim()) { const status = window.prompt('New status (Present, Late, Half Day, Absent):', r.status); act(api.patch(`/attendance/${r._id}/correct`, { reason, status }), 'Record corrected', reload); } };
  return (<><div className="row g-2 mb-3"><div className="col-md-3"><input type="date" className="form-control" value={date} onChange={(e) => { setDate(e.target.value); setPage(1); }} /></div><div className="col-md-3"><select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Any status</option><option>Present</option><option>Late</option><option>Half Day</option><option>Absent</option></select></div></div>
    <div className="card mb-3"><State loading={loading} error={error} empty={data && !data.items.length}>{data && <><Table rows={data.items} cols={[{ h: 'Employee', r: (x) => <>{x.employee?.name}<div className="small text-muted">{x.employee?.employeeId}</div></> }, { h: 'Dept', r: (x) => x.employee?.department }, { h: 'In', r: (x) => fmtT(x.checkIn) }, { h: 'Out', r: (x) => fmtT(x.checkOut) }, { h: 'Hours', r: (x) => x.workingHours }, { h: 'Status', r: (x) => <Badge v={x.status} /> }, ...(hr ? [{ h: '', r: (x) => <button className="btn btn-sm btn-outline-secondary" onClick={() => fix(x)}>Correct</button> }] : [])]} /><div className="px-3 pb-3"><Pager page={page} total={data.total} limit={10} set={setPage} /></div></>}</State></div>
    {data?.notMarked?.length > 0 && <div className="card card-body"><h6>Not marked on {date}</h6>{data.notMarked.map((u) => <span key={u._id} className="badge text-bg-light border me-1 mb-1">{u.name}</span>)}</div>}</>);
}
export default function Attendance() { const { user } = useSelector((s) => s.auth); return <><h4 className="mb-3">Attendance</h4>{user.role === 'EMPLOYEE' ? <Mine /> : <Staff hr={user.role === 'HR'} />}</>; }
