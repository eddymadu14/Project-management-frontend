
import { useEffect, useState } from "react";
import { adminApi } from "../../services/adminApi";
import ConfirmModal from "../../components/ConfirmModal";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.fetchUsers({ search });
      setUsers(data.users || data); // adapt to backend shape
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleToggle = (user) => {
    setTargetUser(user);
    setConfirmOpen(true);
  };

  const confirmToggle = async () => {
    setActionLoading(true);
    try {
      await adminApi.updateUserStatus(targetUser._id, { active: !targetUser.active });
      // optimistic update
      setUsers((s) => s.map(u => (u._id === targetUser._id ? { ...u, active: !u.active } : u)));
    } catch (err) {
      console.error(err);
      // show toast in real app
    } finally {
      setActionLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>

      <div className="mb-4 flex gap-3">
        <input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-lg flex-1"
        />
        <button onClick={fetch} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Search</button>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        {loading ? <p>Loading users...</p> : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.active ? "Yes" : "No"}</td>
                  <td>
                    <button onClick={() => handleToggle(u)} className="px-3 py-1 rounded bg-gray-100">
                      {u.active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title={`Confirm ${targetUser?.active ? "Deactivation" : "Activation"}`}
        description={`Are you sure you want to ${targetUser?.active ? "deactivate" : "activate"} ${targetUser?.email}?`}
        onConfirm={confirmToggle}
        onCancel={() => setConfirmOpen(false)}
        loading={actionLoading}
      />
    </div>
  );
}
