import { Component } from '@angular/core';
import { StateDotComponent } from '../../atoms/state-dot/state-dot.component';

const LEGEND_ITEMS = [
  { label: 'New', state: 'new' },
  { label: 'Active', state: 'active' },
  { label: 'Resolved', state: 'resolved' },
  { label: 'Closed', state: 'closed' },
] as const;

/**
 * Calendar state legend row.
 * Displays one state dot + label for each task state. Presentational only.
 */
@Component({
  selector: 'app-calendar-legend',
  standalone: true,
  imports: [StateDotComponent],
  templateUrl: './calendar-legend.component.html',
})
export class CalendarLegendComponent {
  readonly items = LEGEND_ITEMS;
}
