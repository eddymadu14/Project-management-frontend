
export default function ProjectCard({ project }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 hover:shadow-lg transition">
      <h2 className="text-lg font-semibold mb-2 text-blue-600">{project.name}</h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{project.description}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>{project.tasks?.length || 0} Tasks</span>
        <span>Due: {project.deadline || "N/A"}</span>
      </div>
    </div>
  );
}
