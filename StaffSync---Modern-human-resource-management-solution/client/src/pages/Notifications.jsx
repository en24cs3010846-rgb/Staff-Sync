import api from '../services/api';
import { useFetch, act } from '../utils/hooks';
import { State } from '../components/ui';
export default function Notifications() {
  const { data, loading, error, reload } = useFetch('/notifications', { limit: 50 });
  return (<><div className="d-flex justify-content-between mb-3"><h4>Notifications {data?.unread > 0 && <span className="badge text-bg-danger">{data.unread}</span>}</h4><button className="btn btn-outline-secondary btn-sm" onClick={() => act(api.patch('/notifications/read-all'), 'All marked as read', reload)}>Mark all read</button></div>
    <State loading={loading} error={error} empty={data && !data.items.length}>{data?.items.map((n) => <div key={n._id} className={`card mb-2 ${n.read ? '' : 'border-success'}`}><div className="card-body py-2 d-flex justify-content-between"><div><b>{n.title}</b> <span className="badge text-bg-light border">{n.category}</span><div className="small">{n.message}</div><small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small></div>{!n.read && <button className="btn btn-sm btn-link align-self-start" onClick={() => act(api.patch(`/notifications/${n._id}/read`), null, reload)}>Mark read</button>}</div></div>)}</State></>);
}
