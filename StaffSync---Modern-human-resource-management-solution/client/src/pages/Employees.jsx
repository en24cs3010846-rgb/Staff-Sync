import { useState } from 'react';
import api from '../services/api';
import { useFetch, act } from '../utils/hooks';
import { State, Table, Pager, Badge, Field } from '../components/ui';
const blank = { name: '', email: '', password: '', role: 'EMPLOYEE', employeeId: '', department: '', designation: '', managerId: '' };
export default function Employees({ title, role }) {
  const [q, setQ] = useState(''), [department, setDep] = useState(''), [status, setSt] = useState(''), [page, setPage] = useState(1), [form, setForm] = useState(null);
  const { data, loading, error, reload } = useFetch('/employees', { q, department, status, role, page, limit: 8 });
  const mgrs = useFetch('/employees', { role: 'MANAGER', limit: 100 });
  const save = async (e) => {
    e.preventDefault(); const { _id, password, ...rest } = form; const body = { ...rest, role: role || form.role }; if (!body.managerId) delete body.managerId;
    const ok = _id ? await act(api.put(`/employees/${_id}`, { ...body, role: undefined }), 'Updated', reload) : await act(api.post('/employees', { ...body, password }), 'Account created', reload);
    if (ok) setForm(null);
  };
  const toggle = (u) => window.confirm(`${u.accountStatus === 'ACTIVE' ? 'Deactivate' : 'Activate'} ${u.name}?`) && act(api.patch(`/employees/${u._id}/status`, { status: u.accountStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }), 'Status changed', reload);
  const s = (k) => ({ value: form[k] ?? '', onChange: (e) => setForm({ ...form, [k]: e.target.value }) });
  return (<><div className="d-flex justify-content-between mb-3"><h4>{title}</h4><button className="btn btn-primary" onClick={() => setForm({ ...blank, role: role || 'EMPLOYEE' })}>Add {role ? 'manager' : 'employee'}</button></div>
    {form && <form className="card card-body mb-3" onSubmit={save}><div className="row"><div className="col-md-4"><Field label="Name"><input required className="form-control" {...s('name')} /></Field></div><div className="col-md-4"><Field label="Email"><input required type="email" className="form-control" {...s('email')} /></Field></div>
      {!form._id && <div className="col-md-4"><Field label="Initial password (min 8)"><input required minLength={8} className="form-control" {...s('password')} /></Field></div>}
      {!form._id && !role && <div className="col-md-4"><Field label="Role"><select className="form-select" {...s('role')}><option value="EMPLOYEE">Employee</option><option value="MANAGER">Manager</option></select></Field></div>}
      <div className="col-md-4"><Field label="Employee ID"><input className="form-control" {...s('employeeId')} /></Field></div><div className="col-md-4"><Field label="Department"><input className="form-control" {...s('department')} /></Field></div><div className="col-md-4"><Field label="Designation"><input className="form-control" {...s('designation')} /></Field></div>
      <div className="col-md-4"><Field label="Reporting manager"><select className="form-select" {...s('managerId')}><option value="">None</option>{mgrs.data?.items.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}</select></Field></div></div>
      <div><button className="btn btn-primary me-2">Save</button><button type="button" className="btn btn-light" onClick={() => setForm(null)}>Cancel</button></div></form>}
    <div className="row g-2 mb-3"><div className="col-md-4"><input className="form-control" placeholder="Search name or ID" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} /></div><div className="col-md-3"><input className="form-control" placeholder="Department" value={department} onChange={(e) => { setDep(e.target.value); setPage(1); }} /></div><div className="col-md-3"><select className="form-select" value={status} onChange={(e) => { setSt(e.target.value); setPage(1); }}><option value="">Any status</option><option>ACTIVE</option><option>INACTIVE</option></select></div></div>
    <div className="card"><State loading={loading} error={error} empty={data && !data.items.length}>{data && <><Table rows={data.items} cols={[{ h: 'ID', r: (u) => u.employeeId }, { h: 'Name', r: (u) => <><b>{u.name}</b><div className="small text-muted">{u.email}</div></> }, { h: 'Role', r: (u) => u.role }, { h: 'Department', r: (u) => u.department || '—' }, { h: 'Manager', r: (u) => u.managerId?.name || '—' }, { h: 'Status', r: (u) => <Badge v={u.accountStatus} /> },
      { h: '', r: (u) => <div className="btn-group btn-group-sm"><button className="btn btn-outline-secondary" onClick={() => setForm({ ...u, managerId: u.managerId?._id || '' })}>Edit</button><button className="btn btn-outline-secondary" onClick={() => toggle(u)}>{u.accountStatus === 'ACTIVE' ? 'Deactivate' : 'Activate'}</button></div> }]} /><div className="px-3 pb-3"><Pager page={page} total={data.total} limit={8} set={setPage} /></div></>}</State></div></>);
}
