import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '../store';
import { Logo } from '../components/ui';
export default function Login() {
  const d = useDispatch(); const { user, loading, error } = useSelector((s) => s.auth);
  const [f, setF] = useState({ email: '', password: '' }), [show, setShow] = useState(false), [err, setErr] = useState({});
  if (user) return <Navigate to="/app" replace />;
  const submit = (e) => { e.preventDefault(); const x = {}; if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = 'Enter a valid email'; if (!f.password) x.password = 'Password is required'; setErr(x); if (!Object.keys(x).length) d(login(f)); };
  return (<div className="container py-5"><div className="row justify-content-center"><div className="col-md-5 col-lg-4"><div className="text-center mb-4"><Logo size={30} /><p className="text-muted mt-2">Modern human resource management for your whole organization.</p></div>
    <form className="card card-body" onSubmit={submit} noValidate><h5 className="mb-3">Sign in</h5>{error && <div className="alert alert-danger py-2">{error}</div>}
      <label className="form-label small fw-semibold">Email</label><input className={`form-control mb-1 ${err.email ? 'is-invalid' : ''}`} type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /><div className="text-danger small mb-2">{err.email}</div>
      <label className="form-label small fw-semibold">Password</label><div className="input-group mb-1"><input className={`form-control ${err.password ? 'is-invalid' : ''}`} type={show ? 'text' : 'password'} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /><button type="button" className="btn btn-outline-secondary" onClick={() => setShow(!show)}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button></div><div className="text-danger small mb-3">{err.password}</div>
      <button className="btn btn-primary" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      <div className="mt-4 pt-3 border-top">
        <div className="text-muted small fw-semibold mb-2">⚡ Quick Demo Login:</div>
        <div className="d-flex flex-column gap-2">
          <button type="button" className="btn btn-sm btn-outline-primary text-start d-flex justify-content-between align-items-center" onClick={() => setF({ email: 'hr@staffsync.demo', password: 'Demo@12345' })}>
            <span><strong>HR Admin</strong> (Anita Sharma)</span>
            <span className="badge bg-primary">Auto-fill</span>
          </button>
          <button type="button" className="btn btn-sm btn-outline-secondary text-start d-flex justify-content-between align-items-center" onClick={() => setF({ email: 'manager1@staffsync.demo', password: 'Demo@12345' })}>
            <span><strong>Manager</strong> (Rahul Verma)</span>
            <span className="badge bg-secondary">Auto-fill</span>
          </button>
          <button type="button" className="btn btn-sm btn-outline-success text-start d-flex justify-content-between align-items-center" onClick={() => setF({ email: 'employee1@staffsync.demo', password: 'Demo@12345' })}>
            <span><strong>Employee</strong> (Aman Gupta)</span>
            <span className="badge bg-success">Auto-fill</span>
          </button>
        </div>
      </div>
    </form></div></div></div>);
}
