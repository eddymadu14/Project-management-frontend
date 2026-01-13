
import { useEffect, useState } from "react";
import { adminApi } from "../../services/adminApi";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.fetchLogs({ search: query, limit: 50 });
      setLogs(data.logs || data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Activity Logs</h1>

      <div className="mb-4 flex gap-3">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search logs" className="p-2 border rounded-lg flex-1" />
        <button onClick={fetch} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Search</button>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        {loading ? <p>Loading logs...</p> : (
          <ul className="space-y-3">
            {logs.map(l => (
              <li key={l._id} className="border-b pb-2">
                <div className="text-sm text-gray-600">{new Date(l.date).toLocaleString()} — <span className="font-medium">{l.userEmail}</span></div>
                <div className="text-gray-800 mt-1">{l.action}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

