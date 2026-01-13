
import React, { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../utils/api";

const WorkloadRadar = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/analytics/workload").then(res => {
      const formatted = res.data.map(item => ({
        name: item._id || "Unassigned",
        hours: item.totalHours,
      }));
      setData(formatted);
    });
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg text-white w-full h-[350px]">
      <h3 className="bg-blue/8 text-lg font-semibold mb-3">Team Workload Radar</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis />
          <Tooltip />
          <Radar
            name="Workload (hrs)"
            dataKey="hours"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WorkloadRadar;
