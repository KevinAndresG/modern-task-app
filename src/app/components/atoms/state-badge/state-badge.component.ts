import { Component, input, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { STATE_COLORS } from '../../../models/task.model';

/**
 * Task state badge pill.
 * Applies global badge CSS class based on state.
 */
@Component({
  selector: 'app-state-badge',
  standalone: true,
  imports: [NgClass],
  templateUrl: './state-badge.component.html',
})
export class StateBadgeComponent {
  /** Task state key: 'new' | 'active' | 'resolved' | 'closed' */
  readonly state = input.required<string>();

  /** Resolved CSS badge class, e.g. 'badge-active' */
  readonly badgeClass = computed(() => STATE_COLORS[this.state()] ?? 'badge-new');

  /** Display label — capitalized state string */
  readonly label = computed(
    () => this.state().charAt(0).toUpperCase() + this.state().slice(1)
  );
}
