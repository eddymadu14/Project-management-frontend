
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", balance: 400 },
  { name: "Tue", balance: 700 },
  { name: "Wed", balance: 600 },
  { name: "Thu", balance: 900 },
  { name: "Fri", balance: 500 },
  { name: "Sat", balance: 1100 },
  { name: "Sun", balance: 950 },
];

export default function ChartCard() {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Balance Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="balance" stroke="#2563eb" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

