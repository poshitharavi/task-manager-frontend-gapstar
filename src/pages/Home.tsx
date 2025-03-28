/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

import { useTaskStore } from "../store/taskStore";
import { format } from "date-fns";
import Navbar from "../components/ui/Navbar";
import BodyCard from "../components/ui/BodyCard";

const Home = () => {
  const { tasks, counts, sortBy, isLoading, error, fetchTasks, setSortBy } =
    useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar />

      <div className="pt-8 flex items-center justify-center">
        <BodyCard>
          <div className="mb-6 flex justify-between items-center">
            <div className="text-gray-400">
              {counts.active} active tasks, {counts.completed} completed
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-700 text-white px-3 py-1 rounded-lg"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-4 text-gray-400">
              Loading tasks...
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
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
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td className="px-4 py-3">{task.title}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            task.priority === "HIGH"
                              ? "bg-red-500"
                              : task.priority === "MEDIUM"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {format(new Date(task.dueDate), "MMM dd, yyyy")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            task.status === "DONE"
                              ? "bg-green-500"
                              : "bg-gray-500"
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {/* Add action buttons later */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-700 text-center text-sm text-gray-500">
            Powered by Poshitha
          </div>
        </BodyCard>
      </div>
    </div>
  );
};

export default Home;
