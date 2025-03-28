import { useState } from "react";
import Navbar from "../components/ui/Navbar";
import BodyCard from "../components/ui/BodyCard";

const Home = () => {
  const [activeTasks] = useState(0);
  const [completedTasks] = useState(0);
  const [sortBy, setSortBy] = useState("dueDate");

  // Temporary mock data
  const tasks = [
    // Add your task data here
  ];

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar />

      <div className="pt-8 flex items-center justify-center">
        <BodyCard>
          <div className="mb-6 flex justify-between items-center">
            <div className="text-gray-400">
              {activeTasks} active tasks, {completedTasks} completed
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700 text-white px-3 py-1 rounded-lg"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Task</th>
                  <th className="px-4 py-3 text-left">Priority</th>
                  <th className="px-4 py-3 text-left">Due Date</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {tasks.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      No tasks found
                    </td>
                  </tr>
                )}
                {/* Add task rows here */}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700 text-center text-sm text-gray-500">
            Powered by Poshitha
          </div>
        </BodyCard>
      </div>
    </div>
  );
};

export default Home;
