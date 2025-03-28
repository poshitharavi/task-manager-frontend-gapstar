/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api";

interface Task {
  id: number;
  title: string;
  status: "NOT_DONE" | "DONE";
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  recurrence: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";
  nextRecurrence: string | null;
  active: boolean;
  dependencies: Array<{
    id: number;
    dependentId: number;
    prerequisiteId: number;
  }>;
}

interface TasksResponse {
  statusCode: number;
  message: string;
  body: {
    tasks: Task[];
    counts: {
      active: number;
      completed: number;
    };
  };
}

export const TasksService = {
  getMyTasks: async (sortBy: string): Promise<TasksResponse> => {
    try {
      const response = await api.get(`/task/my?sort=${sortBy}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Failed to fetch tasks" };
    }
  },
};
