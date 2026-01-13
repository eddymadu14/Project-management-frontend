
export default function ConfirmModal({ open, title, description, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 rounded-lg bg-red-600 text-white">
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

