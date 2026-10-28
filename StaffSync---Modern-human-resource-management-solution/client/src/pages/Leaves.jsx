import { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { useFetch, act, fmt } from '../utils/hooks';
import { State, Table, Pager, Badge, Field } from '../components/ui';
function Mine() {
  const { data, loading, error, reload } = useFetch('/leaves/me');
  const [f, setF] = useState({ leaveType: 'Casual', startDate: '', endDate: '', reason: '' });
  const days = (() => { if (!f.startDate || !f.endDate) return 0; let n = 0; const d = new Date(f.startDate), e = new Date(f.endDate); while (d <= e) { if (![0, 6].includes(d.getUTCDay())) n++; d.setUTCDate(d.getUTCDate() + 1); } return n; })();
  const submit = async (e) => { e.preventDefault(); if (await act(api.post('/leaves', f), 'Leave request submitted', reload)) setF({ ...f, startDate: '', endDate: '', reason: '' }); };
  return (<div className="row g-3"><div className="col-lg-4"><form className="card card-body" onSubmit={submit}><h6>Apply for leave</h6>
    <Field label="Type"><select className="form-select" value={f.leaveType} onChange={(e) => setF({ ...f, leaveType: e.target.value })}>{['Casual', 'Sick', 'Earned', 'Unpaid'].map((t) => <option key={t}>{t}</option>)}</select></Field>
    <Field label="Start"><input required type="date" className="form-control" value={f.startDate} onChange={(e) => setF({ ...f, startDate: e.target.value })} /></Field><Field label="End"><input required type="date" min={f.startDate} className="form-control" value={f.endDate} onChange={(e) => setF({ ...f, endDate: e.target.value })} /></Field>
    <Field label="Reason"><textarea required maxLength={500} className="form-control" value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} /></Field><p className="small text-muted">Working days (Mon–Fri): <b>{days}</b></p><button className="btn btn-primary">Submit</button>
    {data && <div className="mt-3 small"><b>Balances</b> (default policy){Object.entries(data.balances).map(([k, v]) => <div key={k} className="d-flex justify-content-between"><span>{k}</span><span>{v.remaining}/{v.entitled}</span></div>)}</div>}</form></div>
    <div className="col-lg-8"><div className="card"><State loading={loading} error={error} empty={data && !data.items.length}>{data && <Table rows={data.items} cols={[{ h: 'Type', r: (x) => x.leaveType }, { h: 'Dates', r: (x) => `${fmt(x.startDate)} – ${fmt(x.endDate)}` }, { h: 'Days', r: (x) => x.days }, { h: 'Status', r: (x) => <Badge v={x.status} /> }, { h: 'Remarks', r: (x) => x.reviewRemarks || '—' }, { h: '', r: (x) => x.status === 'Pending' && <button className="btn btn-sm btn-outline-danger" onClick={() => window.confirm('Cancel this request?') && act(api.patch(`/leaves/${x._id}/cancel`), 'Cancelled', reload)}>Cancel</button> }]} />}</State></div></div></div>);
}
function Review({ hr }) {
  const [status, setStatus] = useState('Pending'), [page, setPage] = useState(1); const { data, loading, error, reload } = useFetch(hr ? '/leaves' : '/leaves/team', { status, page, limit: 10 });
  const decide = (x, decision) => { const remarks = window.prompt(`${decision} — optional remarks:`); if (remarks !== null) act(api.patch(`/leaves/${x._id}/review`, { decision, remarks }), `Request ${decision.toLowerCase()}`, reload); };
  return (<><select className="form-select mb-3" style={{ maxWidth: 220 }} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}><option value="">All</option>{['Pending', 'Approved', 'Rejected', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}</select>
    <div className="card"><State loading={loading} error={error} empty={data && !data.items.length}>{data && <><Table rows={data.items} cols={[{ h: 'Employee', r: (x) => <>{x.employee?.name}<div className="small text-muted">{x.employee?.department}</div></> }, { h: 'Type', r: (x) => x.leaveType }, { h: 'Dates', r: (x) => `${fmt(x.startDate)} – ${fmt(x.endDate)} (${x.days}d)` }, { h: 'Reason', r: (x) => x.reason }, { h: 'Status', r: (x) => <><Badge v={x.status} />{x.reviewer && <div className="small text-muted">by {x.reviewer.name}</div>}</> }, { h: '', r: (x) => x.status === 'Pending' && <div className="btn-group btn-group-sm"><button className="btn btn-success" onClick={() => decide(x, 'Approved')}>Approve</button><button className="btn btn-outline-danger" onClick={() => decide(x, 'Rejected')}>Reject</button></div> }]} /><div className="px-3 pb-3"><Pager page={page} total={data.total} limit={10} set={setPage} /></div></>}</State></div></>);
}
export default function Leaves() { const { user } = useSelector((s) => s.auth); return <><h4 className="mb-3">{user.role === 'EMPLOYEE' ? 'Leaves' : 'Leave Management'}</h4>{user.role === 'EMPLOYEE' ? <Mine /> : <Review hr={user.role === 'HR'} />}</>; }
