import { Component } from '@angular/core';
import { StateDotComponent } from '../../atoms/state-dot/state-dot.component';

const LEGEND_ITEMS = [
  { label: 'New', state: 'new' },
  { label: 'Active', state: 'active' },
  { label: 'Resolved', state: 'resolved' },
  { label: 'Closed', state: 'closed' },
] as const;

@Component({
  selector: 'app-calendar-legend',
  standalone: true,
  imports: [StateDotComponent],
  templateUrl: './calendar-legend.component.html',
})
export class CalendarLegendComponent {
  readonly items = LEGEND_ITEMS;
}
