
import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { week: "Week 1", tasks: 12 },
  { week: "Week 2", tasks: 18 },
  { week: "Week 3", tasks: 22 },
  { week: "Week 4", tasks: 30 },
];

function Analytics() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Project Analytics</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="tasks" stroke="#4f46e5" strokeWidth={2} />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Analytics;

