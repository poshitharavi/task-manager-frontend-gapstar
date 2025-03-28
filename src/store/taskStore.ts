/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { TasksService } from "../services/tasks.service";
// import { format } from "date-fns";

export interface Task {
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
    prerequisite: {
      id: number;
      title: string;
    };
  }>;
}

interface TaskState {
  tasks: Task[];
  counts: { active: number; completed: number };
  isLoading: boolean;
  error: string | null;
  sortBy: "dueDate" | "priority" | "status";

  fetchTasks: () => Promise<void>;
  setSortBy: (sort: "dueDate" | "priority" | "status") => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  counts: { active: 0, completed: 0 },
  isLoading: false,
  error: null,
  sortBy: "dueDate",

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await TasksService.getMyTasks(get().sortBy);
      set({
        tasks: response.body.tasks,
        counts: response.body.counts,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch tasks",
        isLoading: false,
      });
    }
  },

  setSortBy: (sort) => {
    set({ sortBy: sort });
    get().fetchTasks();
  },
}));
