import { Component, input, output, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Task } from '../../../models/task.model';
import { StateDotComponent } from '../../atoms/state-dot/state-dot.component';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

@Component({
  selector: 'app-calendar-cell',
  standalone: true,
  imports: [DatePipe, StateDotComponent],
  templateUrl: './calendar-cell.component.html',
  styleUrl: './calendar-cell.component.scss',
})
export class CalendarCellComponent {
  readonly cell = input.required<CalendarDay>();

  readonly activeDate = input<string | null>(null);

  readonly cellClicked = output<{ date: string; rect: DOMRect }>();

  readonly isHovered = signal<boolean>(false);

  readonly dateKey = computed(() => {
    const d = this.cell().date;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  readonly isActive = computed(
    () => this.activeDate() === this.dateKey() && this.cell().isCurrentMonth
  );

  readonly cellBackground = computed(() => {
    const cell = this.cell();
    const isActive = this.isActive();
    if (isActive || cell.isToday) return 'var(--clay-accent-soft)';
    if (cell.tasks.length > 0 && cell.isCurrentMonth) return 'var(--clay-surface)';
    return 'transparent';
  });

  readonly cellBorder = computed(() => {
    const cell = this.cell();
    const isActive = this.isActive();
    if (isActive || cell.isToday) return '2px solid var(--clay-accent)';
    if (cell.tasks.length > 0 && cell.isCurrentMonth) return '2px solid var(--clay-border)';
    if (cell.isCurrentMonth) return '2px solid transparent';
    return '2px solid transparent';
  });

  readonly cellBoxShadow = computed(() => {
    const cell = this.cell();
    const isActive = this.isActive();
    if (isActive || cell.isToday) {
      return '5px 5px 16px var(--clay-accent-glow), -2px -2px 8px var(--clay-shadow-b), inset 0 1px 0 var(--clay-inner-top)';
    }
    if (cell.tasks.length > 0 && cell.isCurrentMonth) {
      return '3px 4px 10px var(--clay-shadow-a), -1px -1px 5px var(--clay-shadow-b), inset 0 1px 0 var(--clay-inner-top)';
    }
    return 'none';
  });

  private dateToISO(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  getStateColor(task: Task): string {
    const history = task.stateHistory;
    const state = history.length > 0 ? history[history.length - 1].state : 'new';
    const map: Record<string, string> = {
      new: '#818cf8',
      active: '#fbbf24',
      resolved: '#34d399',
      closed: '#94a3b8',
    };
    return map[state] ?? '#818cf8';
  }

  getStateGlow(task: Task): string {
    return `0 0 6px ${this.getStateColor(task)}80`;
  }

  onClick(event: MouseEvent): void {
    const cell = this.cell();
    if (!cell.isCurrentMonth) return;
    event.stopPropagation();
    const iso = this.dateToISO(cell.date);
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.cellClicked.emit({ date: iso, rect });
  }
}
