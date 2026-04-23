export interface TaskState {
  name: string;
  id: string;
}

export interface TaskStateHistory {
  state: string;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  stateHistory: TaskStateHistory[];
  notes: string[];
}

export interface TaskData {
  tasks: Task[];
  states: TaskState[];
}

export const STATE_COLORS: Record<string, string> = {
  new: 'badge-new',
  active: 'badge-active',
  resolved: 'badge-resolved',
  closed: 'badge-closed',
};
