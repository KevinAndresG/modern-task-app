import { Component, input, computed } from '@angular/core';

export type DotSize = 'xs' | 'sm' | 'md';

const SIZE_MAP: Record<DotSize, string> = {
  xs: '5px',
  sm: '6px',
  md: '7px',
};

/**
 * Small filled circle representing task state.
 * Color and glow computed from state CSS variables.
 */
@Component({
  selector: 'app-state-dot',
  standalone: true,
  templateUrl: './state-dot.component.html',
})
export class StateDotComponent {
  /** Task state key: 'new' | 'active' | 'resolved' | 'closed' */
  readonly state = input.required<string>();

  /** Visual size: xs=5px, sm=6px, md=7px. Default: 'sm' */
  readonly size = input<DotSize>('sm');

  readonly dimension = computed(() => SIZE_MAP[this.size()]);

  readonly color = computed(() => {
    const map: Record<string, string> = {
      new: '#7C6DFA',
      active: '#FBBF24',
      resolved: '#34D399',
      closed: '#94A3B8',
    };
    return map[this.state()] ?? map['new'];
  });

  readonly glow = computed(() => `0 0 6px ${this.color()}80`);
}
