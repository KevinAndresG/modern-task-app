import { Component, inject, computed, signal, output, input } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { CalendarCellComponent, CalendarDay } from '../molecules/calendar-cell/calendar-cell.component';
import { CalendarHeaderComponent } from '../molecules/calendar-header/calendar-header.component';
import { CalendarNavComponent } from '../molecules/calendar-nav/calendar-nav.component';
import { CalendarLegendComponent } from '../molecules/calendar-legend/calendar-legend.component';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

@Component({
  selector: 'app-task-calendar',
  standalone: true,
  imports: [CalendarHeaderComponent, CalendarNavComponent, CalendarCellComponent, CalendarLegendComponent],
  templateUrl: './task-calendar.component.html',
  styleUrl: './task-calendar.component.scss',
})
export class TaskCalendarComponent {
  private readonly taskService = inject(TaskService);

  readonly today = new Date();
  readonly collapsed = signal<boolean>(false);

  readonly selectedMonth = signal<number>(this.today.getMonth());
  readonly selectedYear  = signal<number>(this.today.getFullYear());

  readonly activeDate   = input<string | null>(null);

  readonly weekdays = WEEKDAYS;

  readonly dateSelected = output<{ date: string; rect: DOMRect }>();

  readonly viewDate = computed(() =>
    new Date(this.selectedYear(), this.selectedMonth(), 1)
  );

  readonly years = computed(() => {
    const current = this.today.getFullYear();
    const result: number[] = [];
    for (let y = current - 5; y <= current + 5; y++) result.push(y);
    return result;
  });

  readonly monthLabel = computed(() =>
    `${MONTHS[this.selectedMonth()]} ${this.selectedYear()}`
  );

  readonly calendarDays = computed((): CalendarDay[] => {
    const year = this.selectedYear();
    const month = this.selectedMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0);
    const startPad = firstDay.getDay();
    const days: CalendarDay[] = [];

    for (let i = startPad - 1; i >= 0; i--) {
      days.push(this.makeDay(new Date(year, month, -i), false));
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(this.makeDay(new Date(year, month, d), true));
    }
    let next = 1;
    while (days.length < 42) {
      days.push(this.makeDay(new Date(year, month + 1, next++), false));
    }
    return days;
  });

  private makeDay(date: Date, isCurrentMonth: boolean): CalendarDay {
    const tasks = this.taskService.tasks().filter(task => {
      if (!task.dueDate) return false;
      const due = new Date(task.dueDate + 'T00:00:00');
      return due.getFullYear() === date.getFullYear()
          && due.getMonth()    === date.getMonth()
          && due.getDate()     === date.getDate();
    });
    const t = this.today;
    const isToday = date.getFullYear() === t.getFullYear()
                 && date.getMonth()    === t.getMonth()
                 && date.getDate()     === t.getDate();
    return { date, isCurrentMonth, isToday, tasks };
  }

  prevMonth(): void {
    if (this.selectedMonth() === 0) {
      this.selectedMonth.set(11);
      this.selectedYear.update(y => y - 1);
    } else {
      this.selectedMonth.update(m => m - 1);
    }
  }

  nextMonth(): void {
    if (this.selectedMonth() === 11) {
      this.selectedMonth.set(0);
      this.selectedYear.update(y => y + 1);
    } else {
      this.selectedMonth.update(m => m + 1);
    }
  }

  goToday(): void {
    this.selectedMonth.set(this.today.getMonth());
    this.selectedYear.set(this.today.getFullYear());
  }

  onMonthChange(value: number): void { this.selectedMonth.set(value); }
  onYearChange(value: number): void { this.selectedYear.set(value); }
  toggleCollapse(): void { this.collapsed.update(v => !v); }

  dateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}
