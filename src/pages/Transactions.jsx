
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await api.get("/transactions");
        setTransactions(data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Transactions</h1>
      <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{tx.description}</td>
                  <td
                    className={`py-2 px-4 font-semibold ${
                      tx.type === "credit" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"}${tx.amount}
                  </td>
                  <td className="py-2 px-4 capitalize">{tx.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
