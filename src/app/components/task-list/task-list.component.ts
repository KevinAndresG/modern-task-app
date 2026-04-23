import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';

const ITEMS_PER_PAGE = 5;

const FILTER_CHIPS = [
  { value: 'all',      label: 'All'      },
  { value: 'new',      label: 'New'      },
  { value: 'active',   label: 'Active'   },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed',   label: 'Closed'   },
];

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  private readonly taskService  = inject(TaskService);
  private readonly toastService = inject(ToastService);

  readonly tasks   = this.taskService.tasks;
  readonly loading = this.taskService.loading;
  readonly error   = this.taskService.error;

  readonly filterState = signal<string>('all');
  readonly searchQuery = signal<string>('');
  readonly currentPage = signal<number>(1);

  readonly filterChips = FILTER_CHIPS;

  readonly filteredTasks = computed(() => {
    let list = this.tasks();

    const filter = this.filterState();
    if (filter !== 'all') {
      list = list.filter(t => {
        const h = t.stateHistory;
        const s = h.length > 0 ? h[h.length - 1].state : 'new';
        return s === filter;
      });
    }

    const q = this.searchQuery().trim().toLowerCase();
    if (q) {
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }

    return list;
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredTasks().length / ITEMS_PER_PAGE))
  );

  readonly paginatedTasks = computed(() => {
    const start = (this.currentPage() - 1) * ITEMS_PER_PAGE;
    return this.filteredTasks().slice(start, start + ITEMS_PER_PAGE);
  });

  readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  setFilter(value: string): void {
    this.filterState.set(value);
    this.currentPage.set(1);
  }

  setSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  onStateChange(event: { taskId: string; newState: string }): void {
    this.taskService.updateTaskState(event.taskId, event.newState);
    const label = event.newState.charAt(0).toUpperCase() + event.newState.slice(1);
    this.toastService.info(`State changed to ${label}`);
  }

  onDelete(taskId: string): void {
    this.taskService.deleteTask(taskId);
    this.toastService.warning('Task deleted');
  }

  refresh(): void { this.taskService.loadTasks(); }

  goToPage(page: number): void      { this.currentPage.set(page); }
  nextPage(): void                   { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1); }
  previousPage(): void               { if (this.currentPage() > 1) this.currentPage.update(p => p - 1); }
}
