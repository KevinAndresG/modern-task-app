import { Component, input, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { STATE_COLORS } from '../../../models/task.model';

@Component({
  selector: 'app-state-badge',
  standalone: true,
  imports: [NgClass],
  templateUrl: './state-badge.component.html',
})
export class StateBadgeComponent {
  readonly state = input.required<string>();

  readonly badgeClass = computed(() => STATE_COLORS[this.state()] ?? 'badge-new');

  readonly label = computed(
    () => this.state().charAt(0).toUpperCase() + this.state().slice(1)
  );
}
