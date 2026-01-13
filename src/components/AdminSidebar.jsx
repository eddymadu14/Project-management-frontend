
import { NavLink } from "react-router-dom";
import { Users, FileText, ClipboardList } from "lucide-react";

const items = [
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/transactions", label: "Transactions", icon: FileText },
  { to: "/admin/logs", label: "Activity Logs", icon: ClipboardList },
];

export default function AdminSidebar() {
  return (
    <aside className="w-72 bg-white border-r">
      <div className="p-6 text-xl font-bold text-blue-600">BankApp Admin</div>
      <nav className="px-4 space-y-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}


