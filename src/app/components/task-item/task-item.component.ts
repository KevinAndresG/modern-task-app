import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, STATE_COLORS } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';

export { STATE_COLORS };

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
})
export class TaskItemComponent {
  readonly task         = input.required<Task>();
  readonly stateChanged = output<{ taskId: string; newState: string }>();
  readonly deleted      = output<string>();

  private readonly taskService  = inject(TaskService);
  private readonly toastService = inject(ToastService);

  readonly expanded  = signal<boolean>(false);
  readonly editing   = signal<boolean>(false);

  readonly editTitle   = signal<string>('');
  readonly editDesc    = signal<string>('');
  readonly editDueDate = signal<string>('');
  readonly editNotes   = signal<string[]>([]);

  toggleExpand(): void { this.expanded.update(v => !v); }

  startEdit(): void {
    const t = this.task();
    this.editTitle.set(t.title);
    this.editDesc.set(t.description);
    this.editDueDate.set(t.dueDate);
    this.editNotes.set([...(t.notes ?? [])]);
    this.editing.set(true);
    this.expanded.set(false);
  }

  saveEdit(): void {
    const title = this.editTitle().trim();
    const desc  = this.editDesc().trim();
    const due   = this.editDueDate().trim();
    const notes = this.editNotes().filter(n => n.trim() !== '');
    if (!title || !desc || !due) return;

    this.taskService.updateTask(this.task().id, { title, description: desc, dueDate: due, notes });
    this.toastService.success('Task updated');
    this.editing.set(false);
  }

  cancelEdit(): void { this.editing.set(false); }

  updateNote(index: number, value: string): void {
    this.editNotes.update(notes => notes.map((n, i) => i === index ? value : n));
  }

  addNote(): void {
    this.editNotes.update(notes => [...notes, '']);
  }

  removeNote(index: number): void {
    this.editNotes.update(notes => notes.filter((_, i) => i !== index));
  }

  onStateChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.stateChanged.emit({ taskId: this.task().id, newState: select.value });
  }

  onDelete(): void { this.deleted.emit(this.task().id); }

  getNotesCount(): number { return this.task().notes?.length ?? 0; }

  getCurrentState(): string {
    const h = this.task().stateHistory;
    return h.length > 0 ? h[h.length - 1].state : 'new';
  }

  isOverdue(): boolean {
    const state = this.getCurrentState();
    if (state === 'resolved' || state === 'closed') return false;
    const due = new Date(this.task().dueDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  }

  getStateLabel(state: string): string {
    return state.charAt(0).toUpperCase() + state.slice(1);
  }

  protected readonly STATE_COLORS = STATE_COLORS;
}
