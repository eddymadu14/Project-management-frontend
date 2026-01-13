
import { useState } from "react";
import api from "../services/api";

export default function Transfer() {
  const [form, setForm] = useState({ toAccount: "", amount: "", note: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const { data } = await api.post("/transfer", form);
      setMessage(data.message || "Transfer successful!");
      setForm({ toAccount: "", amount: "", note: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Transfer failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow">
      <h1 className="text-2xl font-semibold mb-4">Fund Transfer</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600 mb-1">Recipient Account</label>
          <input
            type="text"
            name="toAccount"
            value={form.toAccount}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Note (optional)</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full"
        >
          {loading ? "Processing..." : "Send"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-blue-700">{message}</p>}
    </div>
  );
}
