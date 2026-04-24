import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

@Component({
  selector: 'app-calendar-nav',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './calendar-nav.component.html',
})
export class CalendarNavComponent {
  readonly selectedMonth = input.required<number>();

  readonly selectedYear = input.required<number>();

  readonly years = input.required<number[]>();

  readonly prevMonth = output<void>();
  readonly nextMonth = output<void>();
  readonly goToday = output<void>();
  readonly monthChanged = output<number>();
  readonly yearChanged = output<number>();

  readonly months = MONTHS;

  onMonthSelect(value: string): void {
    this.monthChanged.emit(+value);
  }

  onYearSelect(value: string): void {
    this.yearChanged.emit(+value);
  }
}
