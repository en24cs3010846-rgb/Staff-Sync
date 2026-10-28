import { useState } from 'react';
import api, { errMsg } from '../services/api';
import { toast } from '../utils/toast';
const R = [['headcount', 'Employee headcount'], ['attendance', 'Attendance'], ['leaves', 'Leave'], ['trainings', 'Training enrollment']];
export default function Reports() {
  const [f, setF] = useState({ from: '', to: '', department: '' });
  const dl = async (type) => { try { const r = await api.get(`/analytics/export/${type}`, { params: f, responseType: 'blob' }); const a = document.createElement('a'); a.href = URL.createObjectURL(r.data); a.download = `${type}-report.csv`; a.click(); URL.revokeObjectURL(a.href); } catch (e) { toast(e.response ? 'Export failed' : errMsg(e), 'danger'); } };
  return (<><h4 className="mb-3">Reports & Analytics</h4><div className="card card-body mb-3"><div className="row g-2"><div className="col-md-3"><label className="small">From</label><input type="date" className="form-control" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} /></div><div className="col-md-3"><label className="small">To</label><input type="date" className="form-control" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} /></div><div className="col-md-3"><label className="small">Department</label><input className="form-control" value={f.department} onChange={(e) => setF({ ...f, department: e.target.value })} /></div></div></div>
    <div className="row g-3">{R.map(([k, l]) => <div className="col-md-3" key={k}><div className="card card-body text-center"><div className="mb-2">{l}</div><button className="btn btn-primary btn-sm" onClick={() => dl(k)}>Download CSV</button></div></div>)}</div><p className="text-muted small mt-3">Reports are generated on the server from live database records. Charts are on the Overview page.</p></>);
}
