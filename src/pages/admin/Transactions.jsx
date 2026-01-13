
import { useEffect, useState } from "react";
import { adminApi } from "../../services/adminApi";
import ConfirmModal from "../../components/ConfirmModal";

export default function AdminTransactions() {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(null);
  const [action, setAction] = useState(null); // 'approve'|'reject'
  const [modalOpen, setModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.fetchTransactions({ status: "pending" });
      setTxs(data.transactions || data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openModal = (tx, act) => { setTarget(tx); setAction(act); setModalOpen(true); };

  const handleConfirm = async () => {
    setProcessing(true);
    try {
      if (action === "approve") await adminApi.approveTransaction(target._id);
      else await adminApi.rejectTransaction(target._id, "Rejected by admin");
      // remove from list
      setTxs(txs.filter(t => t._id !== target._id));
    } catch (err) { console.error(err); }
    finally { setProcessing(false); setModalOpen(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Pending Transactions</h1>
      <div className="bg-white rounded-2xl shadow p-4">
        {loading ? <p>Loading transactions...</p> : (
          <table className="w-full">
            <thead className="text-gray-600 border-b">
              <tr>
                <th className="py-2">Date</th>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {txs.length === 0 && <tr><td colSpan="5" className="py-4 text-center text-gray-500">No pending transactions</td></tr>}
              {txs.map(tx => (
                <tr key={tx._id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{new Date(tx.date).toLocaleString()}</td>
                  <td>{tx.fromAccount}</td>
                  <td>{tx.toAccount}</td>
                  <td className="font-semibold">${tx.amount}</td>
                  <td className="flex gap-2">
                    <button onClick={() => openModal(tx, "approve")} className="px-3 py-1 rounded bg-green-100">Approve</button>
                    <button onClick={() => openModal(tx, "reject")} className="px-3 py-1 rounded bg-red-100">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        open={modalOpen}
        title={action === "approve" ? "Approve Transaction" : "Reject Transaction"}
        description={`Are you sure you want to ${action} transaction of $${target?.amount} from ${target?.fromAccount} to ${target?.toAccount}?`}
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
        loading={processing}
      />
    </div>
  );
}


