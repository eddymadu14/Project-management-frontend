
import { useNavigate } from "react-router-dom";

export default function AdminTopbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-white">
      <div className="text-lg font-semibold">Admin Panel</div>
      <div className="flex items-center gap-4">
        <button className="px-3 py-1 rounded-md bg-gray-100" onClick={() => navigate("/")}>User View</button>
        <button className="px-3 py-1 rounded-md bg-red-600 text-white" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}
