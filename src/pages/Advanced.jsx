import React, { useState } from "react";
import RiskBadge from "../components/RiskBadge";
import TimelineModal from "../components/modals/TimelineModal";
import WorkloadRadar from "../components/charts/WorkloadRadar";

const Advanced = ({ tasks = [] }) => {
  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const taskElements = [];
  // Only loop if tasks is a valid array
  if (Array.isArray(tasks)) {
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      taskElements.push(
        <div
          key={task._id || i}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 flex justify-between items-center hover:bg-white/20 transition-all"
        >
          <div>
            <h4 className="font-semibold">{task.title || "Untitled Task"}</h4>
            <p className="text-sm text-gray-200">{task.description || "No description"}</p>
          </div>
          <div className="flex items-center gap-3">
            <RiskBadge riskScore={task.riskScore || 0} />
            <button
              onClick={() => {
                setSelectedTask(task._id);
                setShowTimeline(true);
              }}
              className="text-xs bg-blue-500/80 px-3 py-1 rounded-lg hover:bg-blue-500"
            >
              View Timeline
            </button>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Left column */}
      <div className="col-span-2 space-y-4">
        {taskElements.length > 0 ? (
          taskElements
        ) : (
          <p className="text-gray-400 text-center py-10">No tasks available.</p>
        )}
      </div>

      {/* Right column */}
      <div>
        <WorkloadRadar />
      </div>

      <TimelineModal
        isOpen={showTimeline}
        onClose={() => setShowTimeline(false)}
        taskId={selectedTask}
      />
    </div>
  );
};

export default Advanced;