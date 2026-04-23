import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

/**
 * Calendar navigation bar: month/year selects, prev/next buttons, Today button.
 */
@Component({
  selector: 'app-calendar-nav',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './calendar-nav.component.html',
})
export class CalendarNavComponent {
  /** Zero-based month index (0–11) */
  readonly selectedMonth = input.required<number>();

  /** Four-digit year */
  readonly selectedYear = input.required<number>();

  /** Array of years for the year select, typically ±5 from today */
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
