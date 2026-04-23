import { Component, inject, signal, effect, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskModalComponent } from './components/task-modal/task-modal.component';
import { TaskPopoverComponent } from './components/task-popover/task-popover.component';
import { TaskStatsComponent } from './components/task-stats/task-stats.component';
import { TaskCalendarComponent } from './components/task-calendar/task-calendar.component';
import { ToastComponent } from './components/toast/toast.component';
import { AppHeaderComponent } from './components/organisms/app-header/app-header.component';
import { TaskService } from './services/task.service';

export interface PopoverState {
  date: string;
  seq: number;
  rect: DOMRect;
}

@Component({
  selector: 'app-root',
  imports: [AppHeaderComponent, TaskListComponent, TaskFormComponent, TaskModalComponent, TaskPopoverComponent, TaskStatsComponent, TaskCalendarComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly taskService = inject(TaskService);
  private readonly platformId  = inject(PLATFORM_ID);

  protected readonly totalTasks    = this.taskService.tasks;
  protected readonly isDark        = signal<boolean>(true);
  protected readonly popoverState  = signal<PopoverState | null>(null);
  protected readonly modalDate     = signal<{ date: string; seq: number } | null>(null);
  protected readonly activeCellDate = signal<string | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('clay-theme');
      this.isDark.set(saved !== 'light');

      effect(() => {
        const dark = this.isDark();
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        localStorage.setItem('clay-theme', dark ? 'dark' : 'light');
      });
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.activeCellDate()) {
      this.activeCellDate.set(null);
      this.popoverState.set(null);
    }
  }

  toggleTheme(): void { this.isDark.update(v => !v); }

  onDateSelected(payload: { date: string; rect: DOMRect }): void {
    this.activeCellDate.set(payload.date);
    this.popoverState.set({
      date: payload.date,
      seq: (this.popoverState()?.seq ?? 0) + 1,
      rect: payload.rect,
    });
  }

  onPopoverMoreOptions(date: string): void {
    this.popoverState.set(null);
    this.modalDate.set({ date, seq: (this.modalDate()?.seq ?? 0) + 1 });
  }

  onPopoverClose(): void {
    this.popoverState.set(null);
    this.activeCellDate.set(null);
  }

  onModalClose(): void {
    this.modalDate.set(null);
    this.activeCellDate.set(null);
  }

  onTaskCreated(): void {
    this.popoverState.set(null);
    this.modalDate.set(null);
    this.activeCellDate.set(null);
  }
}
