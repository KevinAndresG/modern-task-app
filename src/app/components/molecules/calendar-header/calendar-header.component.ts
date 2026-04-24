import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-calendar-header',
  standalone: true,
  templateUrl: './calendar-header.component.html',
})
export class CalendarHeaderComponent {
  readonly monthLabel = input.required<string>();

  readonly collapsed = input.required<boolean>();

  readonly toggleCollapse = output<void>();
}
