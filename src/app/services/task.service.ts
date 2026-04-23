import { inject, Injectable, signal, computed, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, TaskData, TaskState } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/db2.json';

  private readonly tasksSignal   = signal<Task[]>([]);
  private readonly statesSignal  = signal<TaskState[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal   = signal<string | null>(null);

  readonly tasks:   Signal<Task[]>        = this.tasksSignal.asReadonly();
  readonly states:  Signal<TaskState[]>   = this.statesSignal.asReadonly();
  readonly loading: Signal<boolean>       = this.loadingSignal.asReadonly();
  readonly error:   Signal<string | null> = this.errorSignal.asReadonly();

  constructor() {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<TaskData>(this.apiUrl).subscribe({
      next: (data) => {
        this.tasksSignal.set(data.tasks);
        this.statesSignal.set(data.states);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set('Failed to load tasks. Please try again.');
        this.loadingSignal.set(false);
        console.error('Error loading tasks:', error);
      },
    });
  }

  getTaskById(id: string): Signal<Task | undefined> {
    return computed(() => this.tasksSignal().find((t) => t.id === id));
  }

  getTasksByState(stateName: string): Signal<Task[]> {
    return computed(() =>
      this.tasksSignal().filter((task) =>
        task.stateHistory.length > 0 &&
        task.stateHistory[task.stateHistory.length - 1].state === stateName
      )
    );
  }

  getCurrentState(task: Task): string {
    if (task.stateHistory.length === 0) return 'new';
    return task.stateHistory[task.stateHistory.length - 1].state;
  }

  addTask(task: Omit<Task, 'id' | 'stateHistory'>): void {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      stateHistory: [{ state: 'new', date: new Date().toISOString() }],
    };
    this.tasksSignal.update((tasks) => [...tasks, newTask]);
  }

  updateTask(taskId: string, changes: Partial<Pick<Task, 'title' | 'description' | 'dueDate' | 'notes'>>): void {
    this.tasksSignal.update((tasks) =>
      tasks.map((t) => t.id === taskId ? { ...t, ...changes } : t)
    );
  }

  updateTaskState(taskId: string, newState: string): void {
    this.tasksSignal.update((tasks) =>
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              stateHistory: [
                ...task.stateHistory,
                { state: newState, date: new Date().toISOString() },
              ],
            }
          : task
      )
    );
  }

  deleteTask(taskId: string): void {
    this.tasksSignal.update((tasks) =>
      tasks.filter((task) => task.id !== taskId)
    );
  }
}
