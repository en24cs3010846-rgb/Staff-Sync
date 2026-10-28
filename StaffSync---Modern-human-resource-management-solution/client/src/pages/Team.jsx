import { useState } from 'react';
import { useFetch } from '../utils/hooks';
import { State, Table, Badge } from '../components/ui';
export default function Team() {
  const { data, loading, error } = useFetch('/employees/team'); const [q, setQ] = useState('');
  const rows = data?.items.filter((u) => `${u.name} ${u.employeeId}`.toLowerCase().includes(q.toLowerCase())) || [];
  return (<><h4 className="mb-3">My Team</h4><input className="form-control mb-3" style={{ maxWidth: 320 }} placeholder="Search name or ID" value={q} onChange={(e) => setQ(e.target.value)} />
    <div className="card"><State loading={loading} error={error} empty={!rows.length}><Table rows={rows} cols={[{ h: 'ID', r: (u) => u.employeeId }, { h: 'Name', r: (u) => u.name }, { h: 'Department', r: (u) => u.department }, { h: 'Designation', r: (u) => u.designation }, { h: 'Phone', r: (u) => u.phone || '—' }, { h: 'Status', r: (u) => <Badge v={u.accountStatus} /> }]} /></State></div></>);
}
