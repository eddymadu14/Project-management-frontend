
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

