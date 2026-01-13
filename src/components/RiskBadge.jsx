
import React from "react";

const RiskBadge = ({ riskScore }) => {
  let color = "bg-green-500";
  let label = "Low";

  if (riskScore >= 0.25 && riskScore < 0.6) {
    color = "bg-yellow-500";
    label = "Medium";
  } else if (riskScore >= 0.6) {
    color = "bg-red-500";
    label = "High";
  }

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${color}`}
      title={`Risk Score: ${(riskScore * 100).toFixed(0)}%`}
    >
      {label}
    </span>
  );
};

export default RiskBadge;
