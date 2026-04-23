import { Component, input, output } from '@angular/core';

/**
 * Calendar header row: branded icon, title, current month/year, and collapse toggle.
 */
@Component({
  selector: 'app-calendar-header',
  standalone: true,
  templateUrl: './calendar-header.component.html',
})
export class CalendarHeaderComponent {
  /** Month and year label, e.g. "April 2026" */
  readonly monthLabel = input.required<string>();

  /** Whether calendar body is collapsed */
  readonly collapsed = input.required<boolean>();

  /** Fires when user clicks Show/Hide toggle */
  readonly toggleCollapse = output<void>();
}
